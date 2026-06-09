import InputForm from './InputForm';

interface InputBarProps {
  lectureMode: boolean;
  loading: boolean;
  isListening: boolean;
  inputText: string;
  setInputText: (text: string) => void;
  askQuestion: (question: string) => void;
  handleMicClick: () => void;
}

export default function InputBar({
  lectureMode,
  loading,
  isListening,
  inputText,
  setInputText,
  askQuestion,
  handleMicClick,
}: InputBarProps) {
  return (
    <div
      className={`flex-shrink-0 border-t border-white/[0.06] bg-black/20 px-4 py-4 transition-all duration-500 ${
        lectureMode ? 'hidden' : 'block'
      }`}
    >
      <InputForm
        loading={loading}
        isListening={isListening}
        inputText={inputText}
        setInputText={setInputText}
        askQuestion={askQuestion}
        handleMicClick={handleMicClick}
      />

      <p className="text-[11px] text-slate-600 mt-2 text-center">
        Enter to send · Shift+Enter for new line · 🎤 mic for voice · RAG-powered by College Physics 2e
      </p>
    </div>
  );
}
