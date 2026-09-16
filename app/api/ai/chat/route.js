import { cookies } from "next/headers";

// Server-side proxy: browser -> this route -> central ai-agent core.
// Never exposes AI keys or ERP auth to the client. Auth context (guid/ids)
// travels server-side only; the model reaches ERP solely via erp-mcp tools.
//
// Env (server only, never NEXT_PUBLIC_):
//   AI_CORE_BASE=http://127.0.0.1:8765   (hermes_server) or http://127.0.0.1:8642 (gateway api_server)
//   AI_CORE_MODE=hermes | openai         (hermes=/api/v1/chat/sync, openai=/v1/chat/completions)
//   AI_CORE_KEY=...                      (Bearer for openai mode / api_server)
//   AI_CORE_TIMEOUT_MS=90000
//   AI_RATE_PER_MIN=30

const buckets = new Map();

function rateOk(key) {
  const now = Date.now();
  const win = 60_000;
  const max = Number(process.env.AI_RATE_PER_MIN || 30);
  const arr = (buckets.get(key) || []).filter((t) => now - t < win);
  arr.push(now);
  buckets.set(key, arr);
  return arr.length <= max;
}

function redact(s) {
  return String(s || "").replace(/\b\d{10}\b/g, "**********");
}

export async function POST(req) {
  const cookieStore = await cookies();
  const guid = cookieStore.get("guid")?.value;
  const id = cookieStore.get("id")?.value;
  if (!guid || !id) {
    return Response.json({ error: "not_authenticated" }, { status: 401 });
  }
  if (!rateOk(`ai:${id}`)) {
    return Response.json({ error: "rate_limited" }, { status: 429 });
  }

  let body = {};
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "bad_json" }, { status: 400 });
  }
  const { message, profileId, client_id, session_id } = body;
  if (!message || typeof message !== "string" || !message.trim()) {
    return Response.json({ error: "message_required" }, { status: 400 });
  }
  if (!profileId || !client_id) {
    return Response.json({ error: "context_required_profile_session" }, { status: 400 });
  }

  const base = (process.env.AI_CORE_BASE || "http://127.0.0.1:8765").replace(/\/$/, "");
  const mode = process.env.AI_CORE_MODE || "hermes";
  const timeout = Number(process.env.AI_CORE_TIMEOUT_MS || 90000);
  const sid = session_id || `school:${client_id}:user:${id}`;

  // Envelope the ERP context so the agent always scopes tools to this school/session.
  const scopedMessage = [
    `[erp-context profileId=${profileId} client_id=${client_id} user=${id}]`,
    `Route: ${body.route || "unknown"}`,
    message.trim(),
  ].join("\n");

  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeout);
  try {
    if (mode === "openai") {
      const r = await fetch(`${base}/v1/chat/completions`, {
        method: "POST",
        signal: ctrl.signal,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.AI_CORE_KEY || ""}`,
          "X-Hermes-Session-Id": sid,
          "X-Hermes-Session-Key": `school:${client_id}`.slice(0, 256),
        },
        body: JSON.stringify({
          model: process.env.AI_CORE_MODEL || "hermes-agent",
          messages: [{ role: "user", content: scopedMessage }],
        }),
      });
      const data = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(data?.error?.message || `core_${r.status}`);
      const text = data?.choices?.[0]?.message?.content || "";
      console.log("ai-chat", redact(message).slice(0, 120), "->", sid);
      return Response.json({ session_id: sid, response: text, usage: data?.usage || null });
    }
    // hermes_server sync endpoint (localhost, no inbound auth — keep it non-public).
    const r = await fetch(`${base}/api/v1/chat/sync`, {
      method: "POST",
      signal: ctrl.signal,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: scopedMessage,
        session_id: sid,
        max_turns: 12,
        toolsets: ["erp"],
      }),
    });
    const data = await r.json().catch(() => ({}));
    if (!r.ok || data?.error) throw new Error(data?.error || `core_${r.status}`);
    console.log("ai-chat", redact(message).slice(0, 120), "->", sid);
    return Response.json({
      session_id: data.session_id || sid,
      response: data.response || "",
      usage: data.usage || null,
    });
  } catch (e) {
    const msg = e?.name === "AbortError" ? "core_timeout" : String(e?.message || e).slice(0, 200);
    return Response.json({ error: msg }, { status: 502 });
  } finally {
    clearTimeout(t);
  }
}
