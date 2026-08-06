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
  Zap,
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
      className={`hidden md:flex flex-col bg-white border-r border-[#E2E8F0] shadow-sm fixed left-0 top-0 h-full w-72 p-6 z-40 font-['Hanken_Grotesk',sans-serif] ${className}`}
    >
      {/* Brand & Student Header */}
      <div className="mb-8 mt-2">
        {/* Actual Project Brand Logo & Name: Flow State AI */}
        <div className="flex items-center gap-2.5 mb-6">
          <div className="w-9 h-9 rounded-xl bg-[#004ac6] text-white flex items-center justify-center shadow-md shadow-[#004ac6]/20">
            <Zap className="w-5 h-5 fill-current" aria-hidden="true" />
          </div>
          <h1 className="font-['Hanken_Grotesk',sans-serif] text-2xl font-extrabold text-[#004ac6] tracking-tight">
            Flow State AI
          </h1>
        </div>

        <div className="flex items-center gap-3 mb-2">
          <img
            src={studentAvatar}
            alt={studentName}
            className="w-12 h-12 rounded-full object-cover border border-[#E2E8F0] shrink-0"
          />
          <div className="min-w-0">
            <h2 className="font-['Hanken_Grotesk',sans-serif] text-base font-semibold text-[#0F172A] truncate">
              Good Morning, {studentName} 👋
            </h2>
            <p className="font-['JetBrains_Mono',monospace] text-xs text-[#737686]">
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
                  ? 'bg-[#2563eb]/10 text-[#004ac6] font-semibold border-l-4 border-[#2563eb]'
                  : 'text-[#475569] hover:bg-[#F2F4F6] hover:text-[#0F172A]'
              }`}
            >
              {IconComponent}
              <span className="font-['JetBrains_Mono',monospace] text-xs uppercase tracking-wider flex-1">
                {link.label}
              </span>
              {link.badgeCount && link.badgeCount > 0 ? (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#2563eb]/10 text-[#004ac6]">
                  {link.badgeCount}
                </span>
              ) : null}
            </Link>
          );
        })}
      </nav>

      {/* Pinned Settings Link at Bottom */}
      {settingsLink && (
        <div className="pt-4 mt-2 border-t border-[#E2E8F0]">
          <Link
            href={settingsLink.href}
            onClick={() => onSelectTab?.('settings')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
              activeTabId === 'settings'
                ? 'bg-[#2563eb]/10 text-[#004ac6] font-semibold border-l-4 border-[#2563eb]'
                : 'text-[#475569] hover:bg-[#F2F4F6] hover:text-[#0F172A]'
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
