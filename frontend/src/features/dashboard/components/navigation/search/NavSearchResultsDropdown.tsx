'use client';

import { memo } from 'react';
import { BookOpen, FileText, Video, Layers, SearchX } from 'lucide-react';
import { SearchResultRow } from './SearchResultRow';
import type { NavSearchResultsDropdownProps } from '../../../types/topbar.types';

export const NavSearchResultsDropdown = memo(function NavSearchResultsDropdown({
  isOpen,
  searchQuery,
  results,
  onSelectResult,
  className = '',
}: NavSearchResultsDropdownProps) {
  if (!isOpen) return null;

  const { courses, assignments, liveClasses, topics, totalCount } = results;

  return (
    <div
      className={`absolute left-0 top-full mt-2 w-full min-w-[340px] md:min-w-[420px] bg-[#0F172A]/95 backdrop-blur-xl border border-[#1E293B] shadow-2xl rounded-2xl p-3 z-50 text-[#F8FAFC] max-h-[480px] overflow-y-auto font-['Hanken_Grotesk',sans-serif] animate-in fade-in zoom-in-95 duration-150 ${className}`}
    >
      {totalCount === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 px-4 text-center space-y-2">
          <SearchX className="w-8 h-8 text-[#64748B]" aria-hidden="true" />
          <p className="text-sm font-medium text-[#94A3B8]">
            No results found for &quot;<span className="text-[#F8FAFC] font-semibold">{searchQuery}</span>&quot;
          </p>
          <p className="text-xs text-[#64748B]">
            Try searching for subject names like &quot;CS&quot;, &quot;AI&quot;, &quot;Quiz&quot;, or &quot;Linear Algebra&quot;.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Header Summary */}
          <div className="flex items-center justify-between px-2 pb-1 border-b border-[#1E293B] text-xs text-[#94A3B8]">
            <span>Search Results ({totalCount})</span>
            <span className="text-[10px] text-[#64748B]">Press ESC to close</span>
          </div>

          {/* 1. Courses */}
          {courses.length > 0 && (
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 px-2 text-[11px] font-semibold text-[#38BDF8] uppercase tracking-wider">
                <BookOpen className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Courses ({courses.length})</span>
              </div>
              {courses.map((item) => (
                <SearchResultRow key={item.id} item={item} onSelect={onSelectResult} />
              ))}
            </div>
          )}

          {/* 2. Assignments & Quizzes */}
          {assignments.length > 0 && (
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 px-2 text-[11px] font-semibold text-[#F59E0B] uppercase tracking-wider">
                <FileText className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Assignments & Quizzes ({assignments.length})</span>
              </div>
              {assignments.map((item) => (
                <SearchResultRow key={item.id} item={item} onSelect={onSelectResult} />
              ))}
            </div>
          )}

          {/* 3. Live Classes */}
          {liveClasses.length > 0 && (
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 px-2 text-[11px] font-semibold text-[#EC4899] uppercase tracking-wider">
                <Video className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Live Sessions ({liveClasses.length})</span>
              </div>
              {liveClasses.map((item) => (
                <SearchResultRow key={item.id} item={item} onSelect={onSelectResult} />
              ))}
            </div>
          )}

          {/* 4. Topics */}
          {topics.length > 0 && (
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 px-2 text-[11px] font-semibold text-[#A855F7] uppercase tracking-wider">
                <Layers className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Topics & Modules ({topics.length})</span>
              </div>
              {topics.map((item) => (
                <SearchResultRow key={item.id} item={item} onSelect={onSelectResult} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
});

NavSearchResultsDropdown.displayName = 'NavSearchResultsDropdown';
