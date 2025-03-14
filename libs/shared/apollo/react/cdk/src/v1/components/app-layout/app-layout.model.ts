import { NavigationItem } from './nav.model';
import { ProductSwitcherNavigationItem } from './product-switcher';

export interface AppLayoutColors {
  background: string;
  highlight: string;
}

export interface AppLayoutTheme {
  colors: AppLayoutColors;
  text: 'light' | 'dark';
}

export interface AppLayoutLogo {
  url: string;
  size: 'small' | 'wide';
}

export interface AppLayoutFeatures {
  search?: boolean;
  addContent?: boolean;
}

export interface AppLayoutNavigation {
  top: Array<NavigationItem>;
  bottom?: Array<NavigationItem>;
}

export type AppLayoutProductSwitcherNavigation = Array<ProductSwitcherNavigationItem>;

export interface AppLayoutConfiguration {
  theme?: AppLayoutTheme;
  logos?: Array<AppLayoutLogo>;
  features?: AppLayoutFeatures;
  navigation: AppLayoutNavigation;
  productSwitcherNavigation: AppLayoutProductSwitcherNavigation;
}
