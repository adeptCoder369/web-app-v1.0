"use client";

import Link from "next/link";

const FEATURES = [
  {
    n: "01",
    title: "Admission Autopilot",
    pain: "Gender, nationality, SMS number, renewal status, state / district / city — selected by hand for every student.",
    fix: "Auto-fills from existing data. Remembers your session. Flags duplicate parents automatically.",
    points: ["Gender + INDIAN auto-filled", "SMS number from parent phone", "NEW / PROMOTED / DETAINED suggested from ID"],
  },
  {
    n: "02",
    title: "Promotion in One Click",
    pain: "Optional subjects mapped in portal don't carry over. IX-A maths-optional students are mapped again in X.",
    fix: "Mappings carry forward on promotion. You only review the exceptions.",
    points: ["Portal mapping auto-applied", "38/42 carried, 4 to review", "Fee-linked renewal preview"],
  },
  {
    n: "03",
    title: "Marks Guardian",
    pain: "Rounding needs repeated clicks. Grade changes need Reset for every class. Removed subjects leave a 0 and break totals.",
    fix: "Rounding, re-grading and parent-child averages recalculate by themselves — with an explanation.",
    points: ["Auto round-off on submit", "Grade change recalculates all", "Wrong-total detective"],
  },
  {
    n: "04",
    title: "Fee Recovery",
    pain: "Concession / optional fee is confusing. Defaulter lists sit idle, letters written by hand.",
    fix: "Ask in plain words, get the list plus a ready-to-send letter in Hindi or English.",
    points: ["Defaulters > 30 days in one ask", "Draft SMS + letter", "Concession explained simply"],
  },
  {
    n: "05",
    title: "Excel Proof-Reader",
    pain: "Setup checking and working-days fixes live in Excel. Two classes with different working days = manual hunt.",
    fix: "Upload the sheet. It lists exactly what's missing or mismatched.",
    points: ["Missing phones + duplicates", "Working-days mismatch check", "Publish-ready checklist"],
  },
  {
    n: "06",
    title: "Ask ERP",
    pain: "Staff get lost in Documents and Library. Parents ask login help every single week. Too many clicks.",
    fix: "One search box. Type where you want to go or what you want to do — it takes you there.",
    points: ["Where is…? → Go button", "In-product guides", "Parent login + circular drafts"],
  },
];

export default function AiFeaturePage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]" style={{ fontFamily: "Poppins, sans-serif" }}>
      {/* Top bar */}
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-[1200px] mx-auto px-4 py-4 flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl text-white font-bold flex items-center justify-center"
            style={{ background: "linear-gradient(135deg,#1981ee,#15487d)" }}
          >
            AI
          </div>
          <div className="font-bold text-[#0f345a]">infoEIGHT ERP <span className="font-normal text-gray-400">+ AI</span></div>
          <div className="ml-auto flex gap-2">
            <a href="#features" className="text-sm font-semibold px-4 py-2 rounded-xl bg-[#e7f2fe] text-[#15487d]">
              See features
            </a>
            <Link href="/login" className="text-sm font-semibold px-4 py-2 rounded-xl text-white" style={{ background: "#007aff" }}>
              Open ERP
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="text-white" style={{ background: "linear-gradient(135deg,#1981ee 0%,#15487d 100%)" }}>
        <div className="max-w-[1200px] mx-auto px-4 py-14 md:py-20 text-center">
          <div className="inline-block text-xs font-semibold tracking-wide bg-white/20 rounded-full px-4 py-1.5 mb-4">
            LLM-ENABLED SCHOOL ERP
          </div>
          <h1 className="text-3xl md:text-5xl font-bold leading-tight max-w-3xl mx-auto">
            Less clicks. Zero Excel hunting. No wrong report cards.
          </h1>
          <p className="mt-4 text-white/85 max-w-2xl mx-auto text-sm md:text-base">
            Built from real complaints of your own staff — auto-fill, auto-carry, auto-recalculate,
            plus an assistant that answers and drafts for you.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <a href="#features" className="font-semibold text-sm bg-[#fea613] text-[#3E2723] px-6 py-3 rounded-xl">
              Explore 6 features
            </a>
            <a href="#how" className="font-semibold text-sm bg-white/15 border border-white/30 px-6 py-3 rounded-xl">
              How it works
            </a>
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-2 text-xs">
            {["No repeated dropdowns", "No manual Reset button", "No Excel proof-reading", "No training needed"].map((t) => (
              <span key={t} className="bg-white/15 rounded-full px-3 py-1.5">{t}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Pain strip */}
      <section className="max-w-[1200px] mx-auto px-4 -mt-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            ["13+", "manual selections per student today"],
            ["100s", "of Reset clicks every exam season"],
            ["2 modules", "staff can't find: Documents, Library"],
            ["Weekly", "parent login complaints"],
          ].map(([big, small]) => (
            <div key={small} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-center">
              <div className="text-2xl font-bold text-[#15487d]">{big}</div>
              <div className="text-xs text-gray-500 mt-1">{small}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-[1200px] mx-auto px-4 py-12">
        <h2 className="text-2xl md:text-3xl font-bold text-[#0f345a] text-center">What AI fixes for you</h2>
        <p className="text-center text-gray-500 text-sm mt-2">Each feature = one real pain from the field, solved.</p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
          {FEATURES.map((f) => (
            <div key={f.n} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col hover:shadow-md transition-shadow">
              <div className="text-xs font-bold text-[#1981ee]">{f.n}</div>
              <h3 className="font-bold text-[#0f345a] text-lg mt-1">{f.title}</h3>
              <div className="mt-3 text-sm">
                <div className="text-xs font-semibold text-red-500 uppercase tracking-wide">Pain today</div>
                <p className="text-gray-600 mt-1">{f.pain}</p>
              </div>
              <div className="mt-3 text-sm">
                <div className="text-xs font-semibold text-green-600 uppercase tracking-wide">With AI</div>
                <p className="text-gray-700 mt-1 font-medium">{f.fix}</p>
              </div>
              <ul className="mt-3 space-y-1.5">
                {f.points.map((p) => (
                  <li key={p} className="text-[13px] text-gray-600 flex gap-2">
                    <span className="w-5 h-5 shrink-0 rounded-full bg-[#e7f2fe] text-[#15487d] text-[11px] flex items-center justify-center font-bold">✓</span>
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Before / After */}
      <section className="bg-[#f3f9ff] border-y border-[#e2e8f0]">
        <div className="max-w-[1200px] mx-auto px-4 py-12 grid md:grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h3 className="font-bold text-gray-400 text-sm uppercase tracking-wide">Before</h3>
            <ul className="mt-3 space-y-2 text-sm text-gray-500">
              <li>— Select gender, nationality, SMS number every time</li>
              <li>— Re-map optional subjects after every promotion</li>
              <li>— Press Reset / rounding for every class</li>
              <li>— Fix working-days inside Excel</li>
              <li>— Training needed to find Documents / Library</li>
            </ul>
          </div>
          <div className="rounded-2xl p-6 text-white" style={{ background: "linear-gradient(135deg,#1981ee,#15487d)" }}>
            <h3 className="font-bold text-sm uppercase tracking-wide opacity-80">After</h3>
            <ul className="mt-3 space-y-2 text-sm font-medium">
              <li>✓ Auto-filled, just confirm</li>
              <li>✓ Carried forward, review exceptions only</li>
              <li>✓ Recalculated automatically with reason</li>
              <li>✓ Upload sheet → mistake list ready</li>
              <li>✓ Ask in words → taken to the screen</li>
            </ul>
          </div>
        </div>
      </section>

      {/* How */}
      <section id="how" className="max-w-[1200px] mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-[#0f345a] text-center">How it works</h2>
        <div className="grid md:grid-cols-3 gap-4 mt-6">
          {[
            ["1", "It watches your work", "Sees class, session, student you're on. Suggests the obvious value first."],
            ["2", "You confirm, not type", "One click to accept. Wrong? Change it — it learns the correction."],
            ["3", "It drafts, you approve", "Letters, circulars, remarks, summaries — ready text, you hit send."],
          ].map(([n, t, d]) => (
            <div key={n} className="bg-white rounded-2xl border border-gray-100 p-5 text-center">
              <div className="w-10 h-10 mx-auto rounded-full text-white font-bold flex items-center justify-center" style={{ background: "#007aff" }}>{n}</div>
              <div className="font-bold text-[#0f345a] mt-3">{t}</div>
              <div className="text-sm text-gray-500 mt-1">{d}</div>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-2xl text-center text-white p-8" style={{ background: "linear-gradient(135deg,#15487d,#1981ee)" }}>
          <h3 className="text-xl md:text-2xl font-bold">Make this the ERP schools ask for by name.</h3>
          <p className="text-white/80 text-sm mt-2">Faster admissions. Error-free results. Fees collected on time.</p>
          <div className="mt-5 flex justify-center gap-3">
            <Link href="/login" className="text-sm font-semibold bg-white text-[#15487d] px-6 py-3 rounded-xl">
              Try the ERP
            </Link>
            <a href="#features" className="text-sm font-semibold bg-white/15 border border-white/30 px-6 py-3 rounded-xl">
              Re-read features
            </a>
          </div>
        </div>
        <div className="text-center text-xs text-gray-400 mt-6">/ai-feature • Simple preview • Same ERP theme</div>
      </section>
    </div>
  );
}
