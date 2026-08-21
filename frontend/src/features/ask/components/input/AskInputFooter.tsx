'use client';

import { memo } from 'react';
import { Plus } from 'lucide-react';
import { useAskInputFooter } from '../../hooks/useAskInputFooter';
import { AttachmentMenu } from './AttachmentMenu';
import { AttachmentBadge } from './AttachmentBadge';
import { VoiceMicButton } from './VoiceMicButton';
import { SendButton } from './SendButton';
import { Textarea } from '../ui';
import type { AskInputFooterProps } from '../../types/ask.types';

export const AskInputFooter = memo(function AskInputFooter({
  input,
  setInput,
  onSend,
  loading,
  isListening,
  onMicClick,
  className = '',
}: AskInputFooterProps) {
  const {
    menuOpen,
    attachedFile,
    menuRef,
    imageInputRef,
    docInputRef,
    toggleMenu,
    removeAttachment,
    handleFileChange,
    handleKeyDown,
    handleSendWithAttachment,
    triggerImageUpload,
    triggerDocUpload,
  } = useAskInputFooter({
    input,
    setInput,
    onSend,
  });

  return (
    <footer className={`absolute bottom-0 left-0 right-0 z-30 bg-[#0a0f18]/90 backdrop-blur-md px-4 py-4 flex flex-col items-center border-t border-[#1E293B] font-['Hanken_Grotesk',sans-serif] ${className}`}>
      {/* Hidden File Inputs */}
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      <input
        ref={docInputRef}
        type="file"
        accept=".pdf,.doc,.docx,.txt"
        onChange={handleFileChange}
        className="hidden"
      />

      <div className="w-full max-w-3xl relative">
        {/* Attachment Options Popup Menu */}
        <AttachmentMenu
          isOpen={menuOpen}
          menuRef={menuRef}
          onSelectImage={triggerImageUpload}
          onSelectDoc={triggerDocUpload}
        />

        {/* Input Pill Container */}
        <div className="w-full bg-[#090D16] border border-[#1E293B] hover:border-[#38BDF8]/50 focus-within:border-[#38BDF8] focus-within:shadow-[0_0_25px_rgba(56,189,248,0.25)] rounded-full p-2.5 flex items-center gap-2.5 shadow-2xl transition-all duration-300">
          {/* Plus / Attachment Menu Button */}
          <button
            type="button"
            onClick={toggleMenu}
            className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-all duration-200 cursor-pointer ${
              menuOpen
                ? 'bg-[#2563EB] text-white rotate-45'
                : 'bg-white/5 text-[#94A3B8] hover:bg-white/10 hover:text-white'
            }`}
            title="Attach photo or document"
          >
            <Plus className="w-5 h-5" />
          </button>

          {/* Attached File Preview Badge */}
          {attachedFile && (
            <AttachmentBadge
              fileName={attachedFile.name}
              onRemove={removeAttachment}
            />
          )}

          {/* Text Area */}
          <Textarea
            rows={1}
            placeholder="Ask NeuroLearn anything..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
            className="flex-1 bg-transparent border-none outline-none focus:ring-0 text-white placeholder-slate-500 font-sans text-sm resize-none py-1.5 px-3 min-h-[20px] max-h-[120px] custom-scrollbar"
          />

          {/* Voice Mic Button */}
          <VoiceMicButton
            isListening={isListening}
            onClick={onMicClick}
          />

          {/* Send Trigger */}
          <SendButton
            onClick={handleSendWithAttachment}
            disabled={loading || (!input.trim() && !attachedFile)}
          />
        </div>
      </div>
    </footer>
  );
});

AskInputFooter.displayName = 'AskInputFooter';
