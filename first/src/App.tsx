import './App.css';
import Classroom from './components/Classroom';

function App() {
  return (
    <div className="min-h-screen bg-[#060b14] text-white font-sans antialiased">

      {/* Ambient background blobs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-48 -left-48 w-[700px] h-[700px] rounded-full bg-blue-700/8 blur-[180px]" />
        <div className="absolute -bottom-48 -right-48 w-[600px] h-[600px] rounded-full bg-indigo-700/8 blur-[180px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-purple-700/5 blur-[140px]" />
      </div>

      {/* App layout */}
      <div className="relative z-10 flex flex-col h-screen max-w-7xl mx-auto px-4 py-4">

        {/* Header */}
        <header className="flex items-center justify-between mb-4 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-900/40">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-300 leading-none">
                AI Physics Teacher
              </h1>
              <p className="text-[11px] text-slate-500 mt-0.5">College Physics 2e · Gemini 2.5 Flash · RAG-powered</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="hidden sm:inline">Prof. Gemini · online</span>
          </div>
        </header>

        {/* Main classroom */}
        <main className="flex-1 min-h-0">
          <Classroom />
        </main>
      </div>
    </div>
  );
}

export default App;
