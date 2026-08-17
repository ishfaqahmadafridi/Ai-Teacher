export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  alpha: number;
  alphaDir: number;
}

export interface CategoryItem {
  id?: string;
  label: string;
  icon: string;
  gradient?: string;
}

export interface SymbolData {
  text: string;
  x: number;
  y: number;
  size: number;
  delay: number;
}

export interface StatItem {
  id: string;
  value: string;
  label: string;
  description: string;
}

export interface FeatureHighlightItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  badge: string;
  gradient: string;
  previewType: 'simulator' | 'voice' | 'blackboard' | 'analytics';
}

export interface CTAButtonProps {
  label?: string;
  onNavigate?: () => void;
  className?: string;
}

export interface CategoryPillProps {
  item: CategoryItem;
  onClick?: (item: CategoryItem) => void;
}

export interface CategoryTrackProps {
  items: CategoryItem[];
  className?: string;
  speed?: 'normal' | 'slow' | 'fast';
}

export interface LandingNavbarProps {
  onEnterApp?: () => void;
  onLogin?: () => void;
}

export interface LandingFooterProps {
  onNavigate?: (path: string) => void;
}

export interface UseIntroScreenReturn {
  activeFeature: string;
  setActiveFeature: (id: string) => void;
  handleEnterPlatform: () => void;
  handleLogin: () => void;
  isScrolled: boolean;
}

export interface UseCTAButtonReturn {
  ctaHovered: boolean;
  handleMouseEnter: () => void;
  handleMouseLeave: () => void;
  handleClick: () => void;
}

export interface UseFeatureGridReturn {
  selectedFeatureId: string;
  handleSelectFeature: (id: string) => void;
  selectedFeature: FeatureHighlightItem;
}
