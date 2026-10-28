'use client';

import { memo } from 'react';
import { Combobox } from '@base-ui/react/combobox';
import { ChevronDown } from 'lucide-react';
import { useNoteLanguageSelector } from '../../../hooks/useNoteLanguageSelector';
import type { NoteLanguageSelectorProps } from '../../../types/sidebar.types';

export const NoteLanguageSelector = memo(function NoteLanguageSelector({
  selectedLanguage, onPillClick, disabled = false, className = '',
}: NoteLanguageSelectorProps) {
  const { options, value, handleSelect } = useNoteLanguageSelector(selectedLanguage, onPillClick);
  return (
    <div className={className}>
      <Combobox.Root items={options} value={value} onValueChange={handleSelect} disabled={disabled}>
        <Combobox.InputGroup className="flex items-center rounded-lg border border-dashboard-border bg-dashboard-subtle focus-within:ring-2 focus-within:ring-dashboard-primary">
          <Combobox.Input aria-label="Note language" placeholder="Type or select a language"
            className="min-w-0 flex-1 bg-transparent px-3 py-2 text-xs text-dashboard-text outline-none" />
          <Combobox.Trigger type="button" aria-label="Show languages" className="p-2 text-dashboard-muted">
            <ChevronDown className="h-4 w-4" />
          </Combobox.Trigger>
        </Combobox.InputGroup>
        <Combobox.Portal>
          <Combobox.Positioner sideOffset={4} className="z-50">
            <Combobox.Popup className="w-[var(--anchor-width)] overflow-hidden rounded-lg border border-dashboard-border bg-dashboard-panel shadow-lg">
              <Combobox.Empty className="p-3 text-xs text-dashboard-muted">No languages found.</Combobox.Empty>
              <Combobox.List className="max-h-56 overflow-y-auto p-1">
                {(option) => <Combobox.Item key={option.value} value={option}
                  className="cursor-pointer rounded-md px-3 py-2 text-xs text-dashboard-text data-highlighted:bg-dashboard-selected data-selected:text-dashboard-primary">
                  {option.label}
                </Combobox.Item>}
              </Combobox.List>
            </Combobox.Popup>
          </Combobox.Positioner>
        </Combobox.Portal>
      </Combobox.Root>
    </div>
  );
});
NoteLanguageSelector.displayName = 'NoteLanguageSelector';
