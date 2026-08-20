'use client';

export interface ChooseUsCard {
  title: string;
  description: string;
  iconName: 'brain' | 'camera' | 'calendar' | 'checkbox' | 'chart' | 'laptop';
}

export interface FutureFeatureItem {
  title: string;
  description: string;
  iconName: 'sparkles' | 'graduation-cap';
}

export interface TailoredLevelTab {
  id: 'k12' | 'university' | 'professional';
  label: string;
  iconName: 'book' | 'graduation-cap' | 'briefcase';
}

export interface TailoredFeatureCard {
  title: string;
  description: string;
  iconName: 'sparkles' | 'book' | 'checkbox' | 'laptop';
}

export interface FutureInterfaceIconProps {
  name: FutureFeatureItem['iconName'];
  className?: string;
}

export interface TailoredLevelsIconProps {
  name: string;
  className?: string;
}

export interface WhyChooseUsIconProps {
  name: ChooseUsCard['iconName'];
  className?: string;
}
