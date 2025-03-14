export interface LayoutColors {
  background: string;
  text: string;
  highlight: string;
  separator?: string;
}

export interface LayoutLogo {
  url: string;
  altText?: string;
}

export interface LayoutBrand {
  routerLink?: string;
  href?: string;
  mark: LayoutLogo;
  logo: LayoutLogo;
  colors: LayoutColors;
  dgat?: string;
  analytics?: string;

  trackEvent?: (event?: unknown) => void;
}

export interface LayoutBaseNavigation {
  text?: string;
  i18n?: string;

  titleText?: string;
  titleI18n?: string;

  dgat?: string;
  analytics?: string;

  routerLink?: string;
  href?: string;
  target?: string;
  end?: boolean;

  visible?: boolean;

  trackEvent?: (event?: unknown) => void;
}

export interface LayoutFeature extends LayoutBaseNavigation {
  enabled: boolean;
  visible?: boolean;
}

export interface LayoutFeatures {
  search?: LayoutFeature;
  addContent?: LayoutFeature;
  beta?: LayoutFeature;
  admin?: LayoutFeature;
  footerBranding?: LayoutFeature;
  sidebarBranding?: LayoutFeature;
  switcher?: LayoutFeature;
}

export interface LayoutNavigationItem extends LayoutBaseNavigation {
  headerTitle?: string;
  headerTitleI18n?: string;
  icon?: string;
  rtlMirrorIcon?: boolean;
  image?: string;
  children?: LayoutNavigationItem[];
  includeSeparator?: boolean;
  isBeta?: boolean;
}

export interface LayoutNavigation {
  top: LayoutNavigationItem[];
  bottom?: LayoutNavigationItem[];
}

export interface LayoutAspect {
  brand?: LayoutBrand;
  features?: LayoutFeatures;
  navigation?: LayoutNavigation;
}

export interface LayoutConfiguration {
  learner?: LayoutAspect;
  admin?: LayoutAspect;
}
