import './App.css';
import Classroom from './components/classroom/Classroom';
import Header from './components/header/Header';

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
      <div className="relative z-10 flex flex-col h-screen w-full px-6 py-4">

        {/* Header */}
        <Header />

        {/* Main classroom */}
        <main className="flex-1 min-h-0">
          <Classroom />
        </main>
      </div>
    </div>
  );
}

export default App;
