'use client';

export interface NavLink {
  label: string;
  href: string;
}

export interface DesktopNavProps {
  links: NavLink[];
}

export interface RegisterButtonProps {
  className?: string;
  onClick?: () => void;
}

export interface MobileMenuProps {
  links: NavLink[];
  onClose: () => void;
}
