import './App.css';

function App() {
  return (
    <div className="min-h-screen bg-[#060b14] text-white flex flex-col items-center justify-center font-sans antialiased">
      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg mb-4">
        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      </div>
      <h1 className="text-2xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-300">
        AI Physics Teacher
      </h1>
      <p className="text-xs text-slate-500 mt-2">Frontend Foundation Loaded</p>
    </div>
  );
}

export default App;
