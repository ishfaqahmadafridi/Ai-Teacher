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
  label: string;
  icon: string;
}

export interface SymbolData {
  text: string;
  x: number;
  y: number;
  size: number;
  delay: number;
}
