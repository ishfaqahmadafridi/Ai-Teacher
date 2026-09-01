'use client';

import { memo } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import type { TimetablePreferencesModalFooterProps } from '../../types/schedule.types';

export const TimetablePreferencesModalFooter = memo(
  function TimetablePreferencesModalFooter({
    onClose,
    isLoading = false,
    className = '',
  }: TimetablePreferencesModalFooterProps) {
    return (
      <div
        className={`flex items-center justify-end gap-3 pt-4 border-t border-slate-800 ${className}`}
      >
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-purple-600/30 transition-all disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Planning Schedule...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Generate AI Timetable</span>
            </>
          )}
        </button>
      </div>
    );
  }
);

TimetablePreferencesModalFooter.displayName = 'TimetablePreferencesModalFooter';
