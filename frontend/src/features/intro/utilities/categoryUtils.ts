import type { CategoryItem } from '../types/intro.types';

export function getCategoryGradient(item: CategoryItem): string {
  return item.gradient || 'from-blue-500/20 to-cyan-500/20';
}

export function formatCategoryCount(total: number): string {
  return `${total}+ Academic Paths Available`;
}
