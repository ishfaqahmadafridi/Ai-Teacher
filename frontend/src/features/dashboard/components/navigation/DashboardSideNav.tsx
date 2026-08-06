'use client';

import { memo } from 'react';
import Link from 'next/link';
import {
  LayoutDashboard,
  Calendar,
  GraduationCap,
  BookCheck,
  UserCheck,
  FileText,
  HelpCircle,
  CalendarDays,
  Award,
  FolderOpen,
  Settings,
  Brain,
} from 'lucide-react';
import { DEFAULT_DASHBOARD_NAV_LINKS } from '../../constants/dashboardConstants';
import type { DashboardSideNavProps } from '../../types/dashboard.types';

const ICON_MAP: Record<string, React.ReactNode> = {
  dashboard: <LayoutDashboard className="w-5 h-5" aria-hidden="true" />,
  calendar_today: <Calendar className="w-5 h-5" aria-hidden="true" />,
  school: <GraduationCap className="w-5 h-5" aria-hidden="true" />,
  book_check: <BookCheck className="w-5 h-5" aria-hidden="true" />,
  user_check: <UserCheck className="w-5 h-5" aria-hidden="true" />,
  assignment: <FileText className="w-5 h-5" aria-hidden="true" />,
  quiz: <HelpCircle className="w-5 h-5" aria-hidden="true" />,
  event: <CalendarDays className="w-5 h-5" aria-hidden="true" />,
  grade: <Award className="w-5 h-5" aria-hidden="true" />,
  folder_open: <FolderOpen className="w-5 h-5" aria-hidden="true" />,
  settings: <Settings className="w-5 h-5" aria-hidden="true" />,
};

export const DashboardSideNav = memo(function DashboardSideNav({
  activeTabId = 'dashboard',
  onSelectTab,
  studentName,
  dateFormatted,
  studentAvatar,
  className = '',
}: DashboardSideNavProps) {
  const mainNavLinks = DEFAULT_DASHBOARD_NAV_LINKS.filter((l) => l.id !== 'settings');
  const settingsLink = DEFAULT_DASHBOARD_NAV_LINKS.find((l) => l.id === 'settings');

  return (
    <aside
      className={`hidden md:flex flex-col bg-[#0B132B] border-r border-[#1E293B] shadow-lg fixed left-0 top-0 h-full w-72 p-6 z-40 font-['Hanken_Grotesk',sans-serif] ${className}`}
    >
      {/* Brand & Student Header */}
      <div className="mb-8 mt-2">
        {/* Actual Project Brand Logo & Name: NEUROLEARN */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#004ac6] via-[#2563eb] to-[#0ea5e9] text-white flex items-center justify-center shadow-md shadow-[#2563eb]/25 shrink-0">
            <Brain className="w-5.5 h-5.5 text-white" aria-hidden="true" />
          </div>
          <h1 className="font-['Hanken_Grotesk',sans-serif] text-2xl font-black text-white tracking-wider uppercase">
            NEUROLEARN
          </h1>
        </div>

        <div className="flex items-center gap-3 mb-2">
          <img
            src={studentAvatar}
            alt={studentName}
            className="w-12 h-12 rounded-full object-cover border border-[#1E293B] shrink-0"
          />
          <div className="min-w-0">
            <h2 className="font-['Hanken_Grotesk',sans-serif] text-base font-semibold text-white truncate">
              Good Morning, {studentName} 👋
            </h2>
            <p className="font-['JetBrains_Mono',monospace] text-xs text-[#94A3B8]">
              {dateFormatted}
            </p>
          </div>
        </div>
      </div>

      {/* Main Nav Links List */}
      <nav className="flex-1 space-y-1.5 overflow-y-auto pr-1">
        {mainNavLinks.map((link) => {
          const isActive = link.id === activeTabId;
          const IconComponent = ICON_MAP[link.iconName] ?? ICON_MAP.dashboard;

          return (
            <Link
              key={link.id}
              href={link.href}
              onClick={() => onSelectTab?.(link.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-[#2563eb]/20 text-[#38BDF8] font-semibold border-l-4 border-[#38BDF8]'
                  : 'text-[#94A3B8] hover:bg-[#1E293B] hover:text-white'
              }`}
            >
              {IconComponent}
              <span className="font-['JetBrains_Mono',monospace] text-xs uppercase tracking-wider flex-1">
                {link.label}
              </span>
              {link.badgeCount && link.badgeCount > 0 ? (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#2563eb]/30 text-[#38BDF8]">
                  {link.badgeCount}
                </span>
              ) : null}
            </Link>
          );
        })}
      </nav>

      {/* Pinned Settings Link at Bottom */}
      {settingsLink && (
        <div className="pt-4 mt-2 border-t border-[#1E293B]">
          <Link
            href={settingsLink.href}
            onClick={() => onSelectTab?.('settings')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
              activeTabId === 'settings'
                ? 'bg-[#2563eb]/20 text-[#38BDF8] font-semibold border-l-4 border-[#38BDF8]'
                : 'text-[#94A3B8] hover:bg-[#1E293B] hover:text-white'
            }`}
          >
            {ICON_MAP.settings}
            <span className="font-['JetBrains_Mono',monospace] text-xs uppercase tracking-wider flex-1">
              Settings
            </span>
          </Link>
        </div>
      )}
    </aside>
  );
});

DashboardSideNav.displayName = 'DashboardSideNav';
