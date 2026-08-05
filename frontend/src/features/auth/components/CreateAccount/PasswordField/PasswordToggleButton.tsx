'use client';

import { memo, useCallback } from 'react';
import { Button } from '../../ui/Button/Button';
import { EyeIcon, EyeOffIcon } from './PasswordEyeIcon';

interface PasswordToggleButtonProps {
  showPassword: boolean;
  onToggle: () => void;
}

/**
 * Accessible toggle button that shows/hides the password.
 * - tabIndex=-1: excluded from tab order (password field itself handles focus)
 * - aria-label changes with state so screen readers announce the action
 */
export const PasswordToggleButton = memo(function PasswordToggleButton({
  showPassword,
  onToggle,
}: PasswordToggleButtonProps) {
  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      // Prevent form submission when toggle is clicked inside a <form>
      e.preventDefault();
      onToggle();
    },
    [onToggle]
  );

  return (
    <Button
      type="button"
      onClick={handleClick}
      tabIndex={-1}
      aria-label={showPassword ? 'Hide password' : 'Show password'}
      aria-pressed={showPassword}
      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 bg-transparent border-none text-[#5c6b89] hover:text-[#e1e2eb] transition-colors h-auto shadow-none cursor-pointer"
    >
      {showPassword ? <EyeOffIcon /> : <EyeIcon />}
    </Button>
  );
});

PasswordToggleButton.displayName = 'PasswordToggleButton';
