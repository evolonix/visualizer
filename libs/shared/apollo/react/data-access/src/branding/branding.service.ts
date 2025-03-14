import { LayoutBrand } from '@degreed/apollo-react-cdk';

import { LxpAuthUser, LxpOrgInfo } from '../models/lxp';
import { BrandingState, LAYOUT_SCHEMA, LayoutResponse, NavigationState } from './branding.model';
import { brandingToLayout, getHexColorFromCSSVariable, layoutToBranding } from './branding.utils';

export const sameOriginRequestInit: RequestInit = {
  credentials: 'same-origin',
  method: 'GET',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
};

export const loadBranding = async (
  user: LxpAuthUser,
  orgInfo: LxpOrgInfo,
  branding: Partial<BrandingState> | null = null,
  apiEnabled = true
): Promise<Partial<BrandingState> | null> => {
  let layout = apiEnabled ? await loadLayoutBranding(orgInfo.organizationId) : null;

  layout ||= loadCustomizedBranding(orgInfo, apiEnabled);
  layout ||= branding || loadLegacyBranding(orgInfo);

  return layout;
};

/**
 * Load branding from the new Layout API
 *
 * @Todo: use semantic REST e.g.  '/orgs/{orgId}/layout/<LAYOUT_SCHEMA>'
 *        support GET, POST, and PUT with same endpoint
 */
const loadLayoutBranding = async (orgId: number): Promise<Partial<BrandingState> | null> => {
  try {
    const response = await fetch(`/api/layout/${LAYOUT_SCHEMA}?orgId=${orgId}`, sameOriginRequestInit);
    const layout = response.status === 200 ? ((await response?.json()) as LayoutResponse) : null;

    return layoutToBranding(layout);
  } catch (error) {
    // console.error('Error loading layout branding', error);
    return null;
  }
};

/**
 * Load legacy branding; from the authenticated user information
 */
function loadLegacyBranding(orgInfo: LxpOrgInfo): Partial<BrandingState | null> {
  const branding = orgInfo?.organizationBranding;

  return branding
    ? {
        navigation: {
          colors: {
            background: branding.brandColor,
            text: branding.useLightText ? '#ffffff' : getHexColorFromCSSVariable('--apollo-color-neutral-800'),
          },
          mark: {
            backgroundColor: branding.brandColor,
            altText: orgInfo.name,
            url: orgInfo.image,
            imageType: 'mark',
            progress: 0,
          },
          logo: {
            backgroundColor: branding.brandColor,
            altText: orgInfo.name,
            url: orgInfo.image,
            imageType: 'logo',
            progress: 0,
          },
        } as NavigationState,
      }
    : null;
}

/**
 * Save branding to the new Layout API
 */
const saveLayoutBranding = async (navigationBranding: Partial<BrandingState>, orgInfo: LxpOrgInfo): Promise<boolean> => {
  const orgBranding = orgInfo.organizationBranding;
  const fullBranding = {
    ...navigationBranding,
    orgInfo: {
      isDirty: false,
      orgName: orgInfo.name || '',
      useInOnboarding: orgBranding?.organizationNameInOnboarding,
    },
    endorsements: {
      isDirty: false,
      endorsement: {
        altText: 'Degreed',
        url: orgInfo.endorsedImage,
        imageType: 'endorsement',
        progress: 0,
      },
    },
  };
  try {
    await fetch(`/api/layout/${LAYOUT_SCHEMA}?orgId=${orgInfo.organizationId}`, {
      ...sameOriginRequestInit,
      method: 'POST',
      body: JSON.stringify(brandingToLayout(fullBranding)),
    });
    return true;
  } catch (error) {
    console.error('Error saving branding to Layout API', error);
    return false;
  }
};

/**
 * The branding is not yet available in the new Layout API.
 * Check if we have a v2 customized branding (eg 'wells-fargo.config.json').
 *
 * If yes
 *  - convert customization to branding
 *  - save the branding to the new Layout API
 *  - return the branding
 */
function loadCustomizedBranding(orgInfo: LxpOrgInfo, apiEnabled = false): Partial<BrandingState | null> {
  const brand = findCustomization(orgInfo.organizationId);
  const colors = brand?.colors;
  const state: Partial<BrandingState | null> =
    brand && colors
      ? {
          navigation: {
            colors: {
              background: colors.background,
              text: getHexColorFromCSSVariable(colors.text),
              highlight: colors.highlight,
              separator: getHexColorFromCSSVariable(colors.separator || colors.text),
            },
            mark: {
              backgroundColor: colors.background,
              altText: brand.mark?.altText,
              url: brand.mark?.url,
              imageType: 'mark',
              progress: 0,
            },
            logo: {
              backgroundColor: colors.background,
              altText: brand.logo?.altText,
              url: brand.logo?.url,
              imageType: 'logo',
              progress: 0,
            },
          } as NavigationState,
        }
      : null;

  if (state && apiEnabled) {
    console.info(`Wells-Fargo (orgId = ${orgInfo.organizationId}) branding upgraded to v3 (Oct, 2024) Layout API`);
    saveLayoutBranding(state, orgInfo);
  }

  return state;
}

/**
 * This is the branding customization snapshot for Wells Fargo, July 2024
 * This function is only used to auto-update those customizations to Oct 2024 Layout API
 *
 * NOTE: these settings are from the `wells-fargo.config.json` file
 */

export function findCustomization(orgId: number): Partial<LayoutBrand> | undefined {
  switch (orgId) {
    case 901724:
    case 700059:
    case 700043:
      return {
        mark: {
          url: "data:image/svg+xml,%3Csvg id='Layer_1' data-name='Layer 1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' version='1.1' viewBox='0 0 32 32'%3E%3Cdefs%3E%3Cstyle%3E .cls-1 %7B fill: %23d71e28; %7D .cls-1, .cls-2, .cls-3 %7B stroke-width: 0px; %7D .cls-4 %7B clip-path: url(%23clippath); %7D .cls-2 %7B fill: none; %7D .cls-3 %7B fill: %23fff; %7D %3C/style%3E%3CclipPath id='clippath'%3E%3Crect class='cls-2' x='.5' y='8.2' width='31' height='15.6'/%3E%3C/clipPath%3E%3C/defs%3E%3Crect class='cls-3' y='0' width='32' height='32'/%3E%3Cg class='cls-4'%3E%3Cpath class='cls-1' d='M2.7,14.4l-1.5-5.3h-.7v-.8h2.8v.8h-.8l1,3.6,1.2-4.4h1.2l1.2,4.4,1-3.7h-.8v-.8h7.3v2h-.6v-.2c-.3-.7-.4-1-1-1h-1.4v1.8h1.7c0,.1,0,.3,0,.4s0,.3,0,.4h-1.7v1.9h1.5c.6,0,.8-.2,1-1v-.3h.7v2.1h-5.2v-.8h.7v-4.5h-1.2l-1.5,5.3h-1.2l-1.2-4.4-1.3,4.4h-1.2ZM20.3,12.4h-.6v.3c-.2.8-.5,1-1.1,1h-1.2v-4.5h.8v-.8h-2.8v.8h.7v4.5h-.7v.8h4.9v-2.1ZM25.8,12.4h-.6v.3c-.2.8-.5,1-1.1,1h-1.2v-4.5h.8v-.8h-2.8v.8h.7v4.5h-.7v.8h4.9v-2.1ZM31.3,12.8c0-1-.6-1.6-1.7-1.9l-1.1-.3c-.6-.1-.9-.4-.9-.8s.4-.8,1.2-.8,1.3.3,1.4,1v.3h.7v-1.5c-.7-.4-1.4-.5-2.2-.5-1.5,0-2.4.7-2.4,1.8s.6,1.5,1.6,1.8l1.1.2c.7.2,1,.4,1,.9s-.4.9-1.3.9-1.5-.4-1.7-1.1v-.4h-.7v1.7c.8.4,1.5.6,2.6.6,1.5,0,2.4-.7,2.4-1.9h0ZM5,18.3c.6,0,.8.3,1,1v.2h.7v-2H1.5v.8h.7v4.5h-.7v.8h2.9v-.8h-.9v-1.8h1.8c0-.1,0-.3,0-.4s0-.3,0-.4h-1.8v-1.9h1.5ZM18.2,22.9c0,0,0,.2,0,.4s0,.3,0,.4c-.2,0-.4,0-.7,0-.8,0-1.2-.3-1.3-1.1v-.3c-.1-.9-.4-1.2-1.4-1.2h-.5v1.8h.8v.8h-5.4v-.8h.7l-.4-1.1h-2.2l-.4,1.1h.7v.8h-2.3v-.8h.6l2.1-5.3h1.1l2.2,5.3h1.2v-4.5h-.7v-.8h3.5c1.2,0,2,.6,2,1.6s-.8,1.5-1.6,1.5h0c.8,0,1.1.5,1.2,1.2v.3c0,.5.2.7.6.7s.1,0,.2,0h0ZM9.8,21l-.8-2.3-.8,2.3h1.7ZM16.5,19.3c0-.6-.4-1-1.2-1h-1v1.9h1c.8,0,1.2-.4,1.2-1ZM21.8,20.9c0,.2,0,.3,0,.4h1v1.5c-.3.1-.7.2-1,.2-1.2,0-1.9-.9-1.9-2.4s.6-2.4,1.8-2.4,1.2.4,1.5,1.1v.2h.7v-1.5c-.8-.4-1.5-.5-2.3-.5-1.9,0-3.2,1.3-3.2,3.2s1.2,3.2,3.2,3.2,1.6-.2,2.4-.6v-2.7h-2.3c0,.1,0,.2,0,.4h0ZM31.5,20.6c0,1.9-1.3,3.2-3.2,3.2s-3.2-1.3-3.2-3.2,1.4-3.2,3.2-3.2,3.2,1.3,3.2,3.2ZM30.1,20.6c0-1.5-.6-2.4-1.8-2.4s-1.8.9-1.8,2.4.6,2.4,1.8,2.4,1.8-.9,1.8-2.4Z'/%3E%3C/g%3E%3C/svg%3E",
          altText: 'Wells Fargo logo',
        },
        logo: {
          url: "data:image/svg+xml,%3Csvg width='152' height='32' viewBox='0 0 152 32' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='152' height='32' fill='white'/%3E%3Cpath d='M41.7015 17.8635H42.8732V21.7537H33.0912V20.3364H34.4753V11.7758H32.2315L29.3835 21.7537H27.1197L24.8095 13.4853L22.4328 21.7537H20.1691L17.3012 11.7758H16V10.3585H21.3076V11.7758H19.7774L21.6827 18.6468L23.9597 10.3585H26.3032L28.63 18.6601L30.5021 11.7758H28.9055V10.3585H42.7072V14.0529H41.5355L41.4227 13.6147C41.0642 12.2472 40.6891 11.7758 39.6004 11.7758H36.8984V15.2113H40.1713C40.3007 15.4868 40.3505 15.6827 40.3505 15.9914C40.3505 16.3167 40.3007 16.5291 40.1713 16.8046H36.8984V20.3364H39.7132C40.7721 20.3364 41.2434 19.8816 41.5687 18.4311L41.6982 17.8601L41.7015 17.8635ZM51.9881 18.4344C51.6628 19.8816 51.208 20.3397 50.1326 20.3397H47.8688V11.7758H49.4156V10.3585H44.0615V11.7758H45.4457V20.3397H44.0615V21.757H53.2925V17.8668H52.1208L51.9914 18.4377L51.9881 18.4344ZM62.2414 18.4344C61.9161 19.8816 61.4614 20.3397 60.3859 20.3397H58.1222V11.7758H59.669V10.3585H54.3149V11.7758H55.699V20.3397H54.3149V21.757H63.5459V17.8668H62.3742L62.2447 18.4377L62.2414 18.4344ZM70.8185 15.0819L68.7506 14.6105C67.5457 14.335 67.0412 13.8604 67.0412 13.0637C67.0412 12.1044 67.8046 11.5003 69.3049 11.5003C70.8053 11.5003 71.6816 12.0381 72.0235 13.306L72.1695 13.8604H73.3412V11.0423C72.0235 10.3751 70.6227 10.0332 69.2054 10.0332C66.4204 10.0332 64.6313 11.3676 64.6313 13.5152C64.6313 15.1748 65.6736 16.3963 67.6751 16.8345L69.7431 17.2892C71.0609 17.5813 71.5488 18.1025 71.5488 18.9655C71.5488 20.0243 70.7522 20.6085 69.1556 20.6085C67.3499 20.6085 66.4204 19.8916 66.0122 18.524L65.7997 17.8236H64.628V21.0135C66.1084 21.7471 67.5258 22.0724 69.4311 22.0724C72.1662 22.0724 73.9553 20.7048 73.9553 18.5738C73.9553 16.7847 72.8632 15.5466 70.8119 15.0752L70.8185 15.0819ZM86.509 11.7758C87.601 11.7758 87.9728 12.2472 88.3313 13.6147L88.4441 14.0529H89.6158V10.3585H79.8006V11.7758H81.1848V20.3397H79.8006V21.757H85.2377V20.3397H83.6112V17.017H86.9637C87.0932 16.7415 87.143 16.5291 87.143 16.2038C87.143 15.8785 87.0932 15.6993 86.9637 15.4238H83.6112V11.7758H86.509ZM111.314 20.4691C111.41 20.6484 111.46 20.8608 111.46 21.1363C111.46 21.4118 111.41 21.6243 111.314 21.8035C110.956 21.8533 110.501 21.8832 110.046 21.8832C108.466 21.8832 107.703 21.2326 107.524 19.719L107.457 19.148C107.261 17.505 106.724 16.8677 104.935 16.8677H104.038V20.3364H105.585V21.7537H95.3483V20.3364H96.6827L95.9325 18.3016H91.7004L90.9502 20.3364H92.3178V21.7537H88.0027V20.3364H89.1412L93.131 10.3585H95.2952L99.3647 20.3364H101.609V11.7758H100.224V10.3585H106.767C109.094 10.3585 110.607 11.5136 110.607 13.3691C110.607 15.2246 109.094 16.1839 107.63 16.2503V16.3001C109.11 16.4129 109.714 17.2428 109.86 18.5306L109.927 19.1314C110.023 20.0741 110.219 20.499 110.969 20.499C111.098 20.499 111.215 20.4824 111.311 20.4658L111.314 20.4691ZM95.4114 16.9208L93.8148 12.6057L92.2182 16.9208H95.4081H95.4114ZM108.158 13.6015C108.158 12.4131 107.424 11.7792 105.96 11.7792H104.038V15.4404H105.96C107.407 15.4404 108.158 14.7732 108.158 13.6015ZM117.88 16.5656C117.88 16.8909 117.93 17.1033 118.059 17.3622H119.998V20.2434C119.364 20.5023 118.726 20.6185 118.076 20.6185C115.732 20.6185 114.511 18.9422 114.511 16.0445C114.511 13.1467 115.732 11.4705 117.946 11.4705C119.427 11.4705 120.29 12.204 120.794 13.472L120.973 13.9268H122.145V11.0091C120.681 10.3087 119.36 10 117.83 10C114.249 10 111.839 12.3932 111.839 16.0544C111.839 19.7156 114.182 22.079 117.83 22.079C119.281 22.079 120.778 21.6707 122.387 20.8741V15.7955H118.056C117.926 16.0544 117.877 16.2503 117.877 16.5623L117.88 16.5656ZM136 16.0445C136 19.5928 133.477 22.0823 129.946 22.0823C126.414 22.0823 123.891 19.5928 123.891 16.0445C123.891 12.4961 126.447 10.0066 129.946 10.0066C133.444 10.0066 136 12.5127 136 16.0445ZM133.331 16.0445C133.331 13.1633 132.143 11.4871 129.946 11.4871C127.748 11.4871 126.56 13.1633 126.56 16.0445C126.56 18.9256 127.732 20.6019 129.946 20.6019C132.16 20.6019 133.331 18.9422 133.331 16.0445Z' fill='%23D71E28'/%3E%3C/svg%3E%0A",
          altText: 'Wells Fargo logo',
        },
        colors: {
          background: '#ffffff',
          text: 'var(--apollo-color-neutral-800)',
          highlight: '#3B3331',
          separator: 'var(--apollo-color-neutral-200)',
        },
      };
    default:
      return undefined;
  }
}
