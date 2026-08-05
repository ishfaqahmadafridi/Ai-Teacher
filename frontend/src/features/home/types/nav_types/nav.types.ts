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
  href?: string;
  onClick?: () => void;
  children?: React.ReactNode;
}

export interface MobileMenuProps {
  links: NavLink[];
  onClose: () => void;
}
