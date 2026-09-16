'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { getSessionCache } from '../../utils/sessionCache';

/**
 * Embedded Ask ERP copilot. Schools use this — never the raw Hermes dashboard.
 * Sends {message, profileId, client_id} to /api/ai/chat; the server injects
 * guid/id from cookies and scopes the agent to this school/session.
 */
export default function Copilot() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [turns, setTurns] = useState([]);

  async function ask(preset) {
    const text = (preset ?? input).trim();
    if (!text || loading) return;
    setError('');
    const ctx = getSessionCache('dashboardContext') || {};
    const profileId = ctx.profileId;
    const client_id = ctx.session?.clientId || ctx.session;
    if (!profileId || !client_id) {
      setError('Open a school session first (profile-selection → dashboard).');
      return;
    }
    setLoading(true);
    setTurns((t) => [...t, { role: 'user', text }]);
    setInput('');
    try {
      const r = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, profileId, client_id, route: pathname }),
      });
      const data = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(data?.error || `request_${r.status}`);
      setTurns((t) => [...t, { role: 'assistant', text: data.response || '(empty)' }]);
    } catch (e) {
      setError(String(e?.message || e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-5 right-5 z-50 w-14 h-14 rounded-2xl text-white font-bold shadow-lg"
        style={{ background: 'linear-gradient(135deg,#1981ee,#15487d)' }}
        aria-label="Ask ERP"
      >
        AI
      </button>
      {open && (
        <div className="fixed bottom-24 right-5 z-50 w-[380px] max-w-[calc(100vw-40px)] bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden flex flex-col">
          <div className="px-4 py-3 text-white" style={{ background: 'linear-gradient(135deg,#1981ee,#15487d)' }}>
            <div className="font-bold text-sm">Ask ERP</div>
            <div className="text-xs opacity-80">Navigate, explain, draft — scoped to your school.</div>
          </div>
          <div className="flex gap-2 px-3 pt-3 flex-wrap">
            {['Where is concession fee?', 'Draft PTA circular', 'Why is total wrong?'].map((p) => (
              <button key={p} onClick={() => ask(p)} className="text-xs px-2.5 py-1.5 rounded-full bg-[#e7f2fe] text-[#15487d] font-semibold">
                {p}
              </button>
            ))}
          </div>
          <div className="flex-1 overflow-y-auto px-3 py-2 space-y-2 min-h-[180px] max-h-[320px]">
            {turns.length === 0 && (
              <div className="text-xs text-gray-400">Example: “Show defaulters above ₹5000 in X-A and draft the letter.”</div>
            )}
            {turns.map((t, i) => (
              <div key={i} className={`text-sm rounded-xl px-3 py-2 whitespace-pre-wrap ${t.role === 'user' ? 'bg-gray-100 text-gray-800' : 'bg-[#f3f9ff] text-[#0f345a]'}`}>
                {t.text}
              </div>
            ))}
            {loading && <div className="text-xs text-gray-400">Thinking…</div>}
            {error && <div className="text-xs text-red-600">{error}</div>}
          </div>
          <div className="p-3 border-t border-gray-100 flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && ask()}
              placeholder="Ask in plain words…"
              className="flex-1 text-sm rounded-xl border border-gray-200 px-3 py-2 outline-none focus:border-[#1981ee]"
            />
            <button onClick={() => ask()} disabled={loading} className="text-sm font-semibold px-4 rounded-xl text-white disabled:opacity-50" style={{ background: '#007aff' }}>
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}
