import { InjectionToken } from '../../lib';

export interface NavigationItem {
  label: string;
  path?: string;
  icon?: string;
  image?: string;
  svg?: string;
  subItems?: NavigationSubItem[];
}

export interface NavigationSubItem {
  label: string;
  path: string;
}

export interface LayoutColors {
  background: string;
  highlight: string;
}

export interface LayoutTheme {
  colors: LayoutColors;
  text: 'light' | 'dark';
}

export interface LayoutLogos {
  small: {
    url: string;
  };
  large: {
    url: string;
  };
}

export interface LayoutFeatures {
  search?: boolean;
  add?: boolean;
}

export interface LayoutNavigation {
  top: NavigationItem[];
  bottom?: NavigationItem[];
}

export interface LayoutConfiguration {
  theme?: LayoutTheme;
  logos?: LayoutLogos;
  features?: LayoutFeatures;
  navigation?: LayoutNavigation;
}

export const LayoutConfigurationToken = new InjectionToken(
  'LayoutConfiguration',
);
