export type ProductKey = 'lxp' | 'academies' | 'skills-platform';

export interface BaseItem {
  text?: string;
  i18n?: string;
  dgat?: string;
  icon?: string;
  image?: string;
  href?: string;
  routerLink?: string;
}

export interface LayoutColors {
  background: string;
  text: string;
  highlight: string;
}

export interface LayoutLogo {
  url: string;
}

export interface LayoutBrand {
  homeUrl: string;
  mark: LayoutLogo;
  logo: LayoutLogo;
  colors: LayoutColors;
}

export interface LayoutFeature extends BaseItem {
  enabled: boolean;
}

export interface LayoutFeatures {
  search?: LayoutFeature;
  addContent?: LayoutFeature;
}

export interface LayoutNavigationItem extends BaseItem {
  featureKey?: string;
  headerTitle?: string;
  headerTitleI18n?: string;
  target?: string;
  end?: boolean;
  subItems?: LayoutNavigationItem[];
}

export interface LayoutNavigation {
  top: LayoutNavigationItem[];
  bottom?: LayoutNavigationItem[];
}

export interface LayoutSwitcherItem extends BaseItem {
  buttonText: string;
  buttonI18n?: string;
  productKey: ProductKey;
  selected?: boolean;
  subItems?: LayoutNavigationItem[];
}

export type LayoutSwitcherNavigation = {
  text: string;
  i18n?: string;
  items: LayoutSwitcherItem[];
};

/**
 * Primary interface that describes the layout configuration data schema
 */
export interface LayoutConfiguration {
  brand?: LayoutBrand;
  features?: LayoutFeatures;
  navigation?: LayoutNavigation;
  switcherNavigation?: LayoutSwitcherNavigation;
}
