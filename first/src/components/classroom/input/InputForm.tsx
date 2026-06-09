import { type FormEvent, type KeyboardEvent } from 'react';
import MicButton from './MicButton';
import TextInput from './TextInput';
import SendButton from './SendButton';

interface InputFormProps {
  loading: boolean;
  isListening: boolean;
  inputText: string;
  setInputText: (text: string) => void;
  askQuestion: (question: string) => void;
  handleMicClick: () => void;
}

export default function InputForm({
  loading,
  isListening,
  inputText,
  setInputText,
  askQuestion,
  handleMicClick,
}: InputFormProps) {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (inputText.trim()) {
      askQuestion(inputText);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (inputText.trim()) {
        askQuestion(inputText);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-end gap-3">
      <MicButton
        isListening={isListening}
        onClick={handleMicClick}
      />

      <TextInput
        inputText={inputText}
        setInputText={setInputText}
        isListening={isListening}
        onKeyDown={handleKeyDown}
      />

      <SendButton
        loading={loading}
        disabled={loading || !inputText.trim()}
      />
    </form>
  );
}
