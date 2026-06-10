export default function WelcomeHeader() {
  return (
    <>
      <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-blue-500/20 to-indigo-600/20 border border-blue-500/20 flex items-center justify-center">
        <svg className="w-12 h-12 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
          />
        </svg>
      </div>
      <div>
        <h2 className="text-2xl font-black text-white mb-2">Welcome to AI Classroom</h2>
        <p className="text-slate-400 max-w-sm text-sm leading-relaxed">
          Ask Prof. Gemini any question. The board will come alive with animations, diagrams, and live
          explanations as the professor teaches.
        </p>
      </div>
    </>
  );
}
