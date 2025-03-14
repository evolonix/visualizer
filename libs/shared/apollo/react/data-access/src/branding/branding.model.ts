// *********************************************
// Apollo Layout Branding types
// Used to convert the raw branding data from the LXP API into a format that can be used by the Apollo Layout
// *********************************************

export type ColorType = 'background' | 'highlight' | 'text' | 'separator';
export type ImageType = 'logo' | 'mark' | 'endorsement';

export interface LoadStatus {
  isLoading?: boolean;
  progress?: number;
  showSkeleton?: boolean;
}
export interface LogoState extends LoadStatus {
  backgroundColor?: string;
  imageType?: ImageType;
  fileName?: string;
  url: string;
  altText: string;
}

export interface NavigationState {
  isDirty: boolean;
  logo: LogoState;
  mark: LogoState;
  colors: {
    background: string;
    highlight: string;
    text: string;
    separator: string;
  };
}

export interface BrandingState {
  navigation: NavigationState; // @Todo - rename `navigation` to `brand`
}

export const LAYOUT_SCHEMA = 'NavigationBranding';

/**
 * Schema for Layout API
 */
export type LayoutResponse = {
  SchemaName: string;
  Components: [
    {
      ComponentName: string;
      Parameters: {
        data: string;
      };
    },
  ];
};
