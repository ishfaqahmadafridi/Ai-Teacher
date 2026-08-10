'use client';

import { memo } from 'react';
import Link from 'next/link';
import {
  LayoutDashboard,
  Video,
  Bot,
  LineChart,
  FileText,
  Settings,
  BookOpen,
} from 'lucide-react';
import { DEFAULT_DASHBOARD_NAV_LINKS } from '../../constants/dashboardConstants';
import type { DashboardSideNavProps } from '../../types/sidebar.types';

const ICON_MAP: Record<string, React.ReactNode> = {
  dashboard: <LayoutDashboard className="w-5 h-5 shrink-0" aria-hidden="true" />,
  registered_courses: <BookOpen className="w-5 h-5 shrink-0" aria-hidden="true" />,
  classes: <Video className="w-5 h-5 shrink-0" aria-hidden="true" />,
  ask: <Bot className="w-5 h-5 shrink-0" aria-hidden="true" />,
  analytics: <LineChart className="w-5 h-5 shrink-0" aria-hidden="true" />,
  assignments: <FileText className="w-5 h-5 shrink-0" aria-hidden="true" />,
  settings: <Settings className="w-5 h-5 shrink-0" aria-hidden="true" />,
};

export const DashboardSideNav = memo(function DashboardSideNav({
  activeTabId = 'dashboard',
  onSelectTab,
  studentName,
  dateFormatted,
  studentAvatar,
  onOpenProfile,
  className = '',
}: DashboardSideNavProps) {
  const mainNavLinks = DEFAULT_DASHBOARD_NAV_LINKS.filter((l) => l.id !== 'settings');
  const settingsLink = DEFAULT_DASHBOARD_NAV_LINKS.find((l) => l.id === 'settings');

  const firstLetter = studentName ? studentName.charAt(0).toUpperCase() : 'N';

  return (
    <aside
      className={`hidden md:flex flex-col bg-[#070C18] border-r border-[#162032] shadow-2xl fixed left-0 top-20 h-[calc(100vh-5rem)] w-72 p-6 z-40 font-['Hanken_Grotesk',sans-serif] ${className}`}
    >
      {/* Student Profile Header - Always visible below Top Navbar */}
      <div className="mb-6 mt-1">
        <button
          type="button"
          onClick={onOpenProfile}
          title="Click to view & edit profile"
          className="flex items-center gap-3.5 p-2 rounded-2xl hover:bg-[#121B2D] transition-all cursor-pointer text-left w-full border border-transparent hover:border-[#38BDF8]/20 group"
        >
          <img
            src={studentAvatar}
            alt={studentName}
            className="w-11 h-11 rounded-full object-cover border-2 border-[#1E293B] group-hover:border-[#38BDF8] shrink-0 transition-colors shadow-md"
          />
          <div className="min-w-0 flex-1">
            <h2 className="font-['Hanken_Grotesk',sans-serif] text-sm font-bold text-white truncate group-hover:text-[#38BDF8] transition-colors">
              Good Morning, {studentName}
            </h2>
            <p className="font-['JetBrains_Mono',monospace] text-[11px] text-[#94A3B8] mt-0.5">
              {dateFormatted}
            </p>
          </div>
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1.5 overflow-y-auto pr-1">
        {mainNavLinks.map((link) => {
          const isActive = link.id === activeTabId;
          const iconComponent = ICON_MAP[link.id] ?? <LayoutDashboard className="w-5 h-5 shrink-0" aria-hidden="true" />;

          return (
            <Link
              key={link.id}
              href={link.href}
              onClick={(e) => {
                if (link.href === '/dashboard') {
                  e.preventDefault();
                }
                onSelectTab?.(link.id);
              }}
              className={`relative flex items-center gap-3.5 px-4 py-3 rounded-2xl transition-all duration-200 ${
                isActive
                  ? 'bg-[#132A5E] text-[#38BDF8] font-bold shadow-lg shadow-[#132A5E]/40'
                  : 'text-[#94A3B8] hover:bg-[#121B2D] hover:text-white'
              }`}
            >
              {isActive && (
                <span className="absolute left-0 top-2 bottom-2 w-1.5 bg-[#00A3FF] rounded-r-full shadow-[0_0_10px_#00A3FF]" />
              )}
              <span className={`transition-colors ${isActive ? 'text-[#38BDF8]' : 'text-[#64748B]'}`}>
                {iconComponent}
              </span>
              <span className="font-['JetBrains_Mono',monospace] text-xs font-semibold uppercase tracking-wider flex-1 truncate">
                {link.label}
              </span>
              {link.badgeCount && link.badgeCount > 0 ? (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#00A3FF]/20 text-[#38BDF8] border border-[#00A3FF]/30">
                  {link.badgeCount}
                </span>
              ) : null}
            </Link>
          );
        })}
      </nav>

      {/* Pinned Bottom Settings */}
      <div className="pt-3 mt-2 border-t border-[#162032]">
        <Link
          href={settingsLink?.href || '/dashboard'}
          onClick={() => {
            onSelectTab?.('settings');
            onOpenProfile?.();
          }}
          className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl transition-all duration-200 ${
            activeTabId === 'settings'
              ? 'bg-[#132A5E] text-[#38BDF8] font-bold shadow-lg shadow-[#132A5E]/40'
              : 'text-[#94A3B8] hover:bg-[#121B2D] hover:text-white'
          }`}
        >
          <div className="w-7 h-7 rounded-full bg-[#0F172A] border border-[#1E293B] text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-inner">
            {firstLetter}
          </div>
          <span className="font-['JetBrains_Mono',monospace] text-xs font-semibold uppercase tracking-wider flex-1 truncate">
            SETTINGS
          </span>
        </Link>
      </div>
    </aside>
  );
});

DashboardSideNav.displayName = 'DashboardSideNav';


