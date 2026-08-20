'use client';

import { useState, useRef, useEffect, KeyboardEvent, ChangeEvent } from 'react';
import { Plus, Image as ImageIcon, FileText, X, Paperclip } from 'lucide-react';
import type { AskInputFooterProps } from '../types';
import { Button, Textarea } from './ui';

export function AskInputFooter({
  input,
  setInput,
  onSend,
  loading,
  isListening,
  onMicClick,
}: AskInputFooterProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [attachedFile, setAttachedFile] = useState<File | null>(null);

  const menuRef = useRef<HTMLDivElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const docInputRef = useRef<HTMLInputElement>(null);

  // Close menu on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen]);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendWithAttachment();
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setAttachedFile(files[0]);
      setMenuOpen(false);
    }
  };

  const handleSendWithAttachment = () => {
    if (attachedFile && !input.includes(`[Attached: ${attachedFile.name}]`)) {
      const formattedInput = `${input.trim()} [Attached: ${attachedFile.name}]`.trim();
      setInput(formattedInput);
    }
    setAttachedFile(null);
    onSend();
  };

  return (
    <footer className="absolute bottom-0 left-0 right-0 z-30 bg-[#0a0f18]/90 backdrop-blur-md px-4 py-4 flex flex-col items-center border-t border-[#1E293B] font-['Hanken_Grotesk',sans-serif]">
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
        {menuOpen && (
          <div
            ref={menuRef}
            className="absolute bottom-full left-0 mb-3 bg-[#0F172A] border border-[#1E293B] rounded-2xl shadow-2xl p-2 z-50 flex flex-col gap-1 min-w-[210px] backdrop-blur-xl animate-in fade-in slide-in-from-bottom-2 duration-200"
          >
            <button
              type="button"
              onClick={() => imageInputRef.current?.click()}
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-white hover:bg-[#1E293B] transition-colors cursor-pointer text-left"
            >
              <div className="w-8 h-8 rounded-lg bg-[#2563EB]/15 border border-[#2563EB]/30 flex items-center justify-center text-[#38BDF8] shrink-0">
                <ImageIcon className="w-4 h-4" />
              </div>
              <div>
                <div>Upload Photo / Image</div>
                <div className="text-[10px] text-[#94A3B8] font-normal">JPG, PNG, WebP</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => docInputRef.current?.click()}
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-white hover:bg-[#1E293B] transition-colors cursor-pointer text-left"
            >
              <div className="w-8 h-8 rounded-lg bg-[#8B5CF6]/15 border border-[#8B5CF6]/30 flex items-center justify-center text-[#C4B5FD] shrink-0">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <div>Upload Document / PDF</div>
                <div className="text-[10px] text-[#94A3B8] font-normal">PDF, DOCX, TXT</div>
              </div>
            </button>
          </div>
        )}

        {/* Input Pill Container */}
        <div className="w-full bg-[#090D16] border border-[#1E293B] hover:border-[#38BDF8]/50 focus-within:border-[#38BDF8] focus-within:shadow-[0_0_25px_rgba(56,189,248,0.25)] rounded-full p-2.5 flex items-center gap-2.5 shadow-2xl transition-all duration-300">
          {/* Plus / Attachment Menu Button */}
          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
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
          {attachedFile ? (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#2563EB]/20 border border-[#38BDF8]/40 text-xs font-bold text-[#38BDF8] shrink-0">
              <Paperclip className="w-3.5 h-3.5 shrink-0" />
              <span className="max-w-[140px] truncate">{attachedFile.name}</span>
              <button
                type="button"
                onClick={() => setAttachedFile(null)}
                className="hover:text-white transition-colors cursor-pointer"
                title="Remove attachment"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : null}

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
          <Button
            onClick={onMicClick}
            className={`p-2.5 rounded-full transition-all duration-200 shrink-0 border-none cursor-pointer flex items-center justify-center ${
              isListening
                ? 'bg-red-500 text-white animate-pulse'
                : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
            }`}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
              <path d="M19 10v2a7 7 0 0 1-14 0v-2H3v2a9 9 0 0 0 8 8.94V23h2v-2.06A9 9 0 0 0 21 12v-2h-2z"/>
            </svg>
          </Button>

          {/* Send Trigger */}
          <Button
            onClick={handleSendWithAttachment}
            disabled={loading || (!input.trim() && !attachedFile)}
            className="p-2.5 rounded-full bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:hover:bg-blue-600 disabled:cursor-not-allowed text-white shrink-0 border-none cursor-pointer transition-all flex items-center justify-center"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="m22 2-7 20-4-9-9-4Z"/>
              <path d="M22 2 11 13"/>
            </svg>
          </Button>
        </div>
      </div>
    </footer>
  );
}
