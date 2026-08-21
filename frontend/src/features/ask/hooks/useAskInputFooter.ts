'use client';

import { useState, useRef, useEffect, useCallback, KeyboardEvent, ChangeEvent } from 'react';
import { formatInputWithAttachment } from '../utilities/askUtils';
import type { UseAskInputFooterOptions, UseAskInputFooterReturn } from '../types/ask.types';

export function useAskInputFooter({
  input,
  setInput,
  onSend,
}: UseAskInputFooterOptions): UseAskInputFooterReturn {
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

  const toggleMenu = useCallback(() => {
    setMenuOpen((prev) => !prev);
  }, []);

  const removeAttachment = useCallback(() => {
    setAttachedFile(null);
  }, []);

  const handleFileChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setAttachedFile(files[0]);
      setMenuOpen(false);
    }
  }, []);

  const handleSendWithAttachment = useCallback(() => {
    if (attachedFile) {
      const formatted = formatInputWithAttachment(input, attachedFile.name);
      setInput(formatted);
    }
    setAttachedFile(null);
    onSend();
  }, [attachedFile, input, setInput, onSend]);

  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendWithAttachment();
    }
  }, [handleSendWithAttachment]);

  const triggerImageUpload = useCallback(() => {
    imageInputRef.current?.click();
  }, []);

  const triggerDocUpload = useCallback(() => {
    docInputRef.current?.click();
  }, []);

  return {
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
  };
}
