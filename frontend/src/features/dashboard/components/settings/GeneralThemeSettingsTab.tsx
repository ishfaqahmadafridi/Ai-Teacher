'use client';

import { memo } from 'react';
import { Moon, Globe, Clock } from 'lucide-react';
import type { SettingsTabProps } from '../../types/settings.types';
import { AVAILABLE_LANGUAGES, AVAILABLE_TIMEZONES } from '../../constants/settingsConstants';

export const GeneralThemeSettingsTab = memo(function GeneralThemeSettingsTab({
  settings,
  onChange,
  className = '',
}: SettingsTabProps) {
  return (
    <div className={`space-y-6 font-['Hanken_Grotesk',sans-serif] ${className}`}>
      {/* Theme System Selector */}
      <div className="p-4 rounded-2xl bg-[#090D16] border border-[#1E293B] space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#2563EB]/15 border border-[#2563EB]/30 flex items-center justify-center text-[#38BDF8] shrink-0">
            <Moon className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Visual Theme System</h4>
            <p className="text-xs text-[#94A3B8]">
              Select the appearance theme system for the application.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {(
            [
              { id: 'lumina_dark', title: 'Lumina Dark (Recommended)', desc: 'Sleek dark mode with subtle cyan ambient glows' },
              { id: 'high_contrast_dark', title: 'High Contrast Dark', desc: 'Deep black background with vivid contrast' },
            ] as const
          ).map((theme) => {
            const isSelected = settings.themeMode === theme.id;
            return (
              <button
                key={theme.id}
                type="button"
                onClick={() => onChange('themeMode', theme.id)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#2563EB]/20 border-[#38BDF8] text-white'
                    : 'bg-[#070D1A] border-[#1E293B] text-[#94A3B8] hover:text-white'
                }`}
              >
                <div className="font-bold text-xs">{theme.title}</div>
                <div className="text-[11px] opacity-80 mt-0.5">{theme.desc}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Interface Language */}
      <div className="p-4 rounded-2xl bg-[#090D16] border border-[#1E293B] space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#8B5CF6]/15 border border-[#8B5CF6]/30 flex items-center justify-center text-[#C4B5FD] shrink-0">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Interface Language</h4>
            <p className="text-xs text-[#94A3B8]">
              Choose primary language for menus, prompts, and interface controls.
            </p>
          </div>
        </div>

        <select
          value={settings.interfaceLanguage}
          onChange={(e) => onChange('interfaceLanguage', e.target.value)}
          className="w-full bg-[#070D1A] border border-[#1E293B] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#38BDF8] cursor-pointer"
        >
          {AVAILABLE_LANGUAGES.map((lang) => (
            <option key={lang} value={lang} className="bg-[#0F172A] text-white">
              {lang}
            </option>
          ))}
        </select>
      </div>

      {/* Timezone Settings */}
      <div className="p-4 rounded-2xl bg-[#090D16] border border-[#1E293B] space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#10B981]/15 border border-[#10B981]/30 flex items-center justify-center text-[#10B981] shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Local Timezone</h4>
            <p className="text-xs text-[#94A3B8]">
              Used to schedule class reminders and assignment deadline countdowns.
            </p>
          </div>
        </div>

        <select
          value={settings.timezone}
          onChange={(e) => onChange('timezone', e.target.value)}
          className="w-full bg-[#070D1A] border border-[#1E293B] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#38BDF8] cursor-pointer"
        >
          {AVAILABLE_TIMEZONES.map((tz) => (
            <option key={tz} value={tz} className="bg-[#0F172A] text-white">
              {tz}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
});

GeneralThemeSettingsTab.displayName = 'GeneralThemeSettingsTab';
