import { LayoutAspect } from '@degreed/apollo-react-cdk';

import { LxpOrgInfo } from '../models';
import { BrandingState, LAYOUT_SCHEMA, LayoutResponse, NavigationState } from './branding.model';

// **********************************************************
// Local Storage Utils
// **********************************************************

/**
 * Save branding to local storage
 */
export function localToStateBranding(data: string): Partial<BrandingState | null> {
  return data ? JSON.parse(data) : null;
}

// **********************************************************
// Layout API Utils
// **********************************************************

/**
 * Convert Layout API response to BrandingState
 */
export function layoutToBranding(response: LayoutResponse | null): Partial<BrandingState> | null {
  const branding = response ? JSON.parse(response.Components[0]?.Parameters?.data) : (null as Partial<BrandingState | null>);

  // Force reset dirty flags
  if (branding) {
    branding.navigation.isDirty = false;
    branding.endorsements.isDirty = false;
    branding.orgInfo.isDirty = false;
  }

  return branding;
}

/**
 * Convert BrandingState to Layout API schema
 */
export function brandingToLayout({ navigation }: Partial<BrandingState>): LayoutResponse {
  return {
    SchemaName: LAYOUT_SCHEMA,
    Components: [
      {
        ComponentName: 'branding-v3',
        Parameters: {
          data: JSON.stringify({ navigation }),
        },
      },
    ],
  };
}

/**
 * Update target LayoutAspect with Navigation state
 */
export function navigationToAspect(state: NavigationState, aspect: LayoutAspect): LayoutAspect {
  const { colors, logo, mark } = state;

  return {
    ...aspect,
    brand: {
      ...aspect.brand,
      colors,
      logo: {
        ...aspect.brand?.logo,
        url: logo?.url || aspect.brand?.logo.url || '',
        altText: logo?.altText,
      },
      mark: {
        ...aspect.brand?.mark,
        url: mark?.url || aspect.brand?.mark.url || '',
        altText: mark?.altText,
      },
    },
  };
}

// **********************************************************
// Legacy OrganizationBranding Utils
// **********************************************************

/**
 * Convert Authenticate user's OrganziationBranding to BrandingState
 */
export function orgBrandingToState(orgInfo: LxpOrgInfo): Partial<BrandingState> | null {
  const branding = orgInfo?.organizationBranding;
  const neutralColor = getHexColorFromCSSVariable('--apollo-color-neutral-800');

  return orgInfo && branding
    ? {
        navigation: {
          colors: {
            background: branding.brandColor,
            text: branding.useLightText ? '#ffffff' : neutralColor,
          },
          mark: {
            backgroundColor: branding.brandColor,
            imageType: 'mark',
            altText: orgInfo.name,
            url: orgInfo.image,
            progress: 0,
          },
          logo: {
            backgroundColor: branding.brandColor,
            imageType: 'logo',
            altText: orgInfo.name,
            url: orgInfo.image,
            progress: 0,
          },
        } as NavigationState,
      }
    : null;
}

export function getHexColorFromCSSVariable(variableName: string) {
  if (!variableName || (!variableName.startsWith('var(') && !variableName.startsWith('--'))) return variableName;

  variableName = variableName.replace(/var\((--[\w-]+)\)/, '$1');

  const computedStyle = getComputedStyle(document.documentElement);
  const colorValue = computedStyle.getPropertyValue(variableName);

  // Check if the color is already in hex format
  if (colorValue.startsWith('#')) {
    return colorValue;
  }

  // Convert RGB/RGBA to hex
  const rgbMatch = colorValue.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)/);
  if (rgbMatch) {
    const r = parseInt(rgbMatch[1]).toString(16).padStart(2, '0');
    const g = parseInt(rgbMatch[2]).toString(16).padStart(2, '0');
    const b = parseInt(rgbMatch[3]).toString(16).padStart(2, '0');

    return `#${r}${g}${b}`;
  }

  // Return the color value as it is not in a recognized format
  return colorValue;
}
