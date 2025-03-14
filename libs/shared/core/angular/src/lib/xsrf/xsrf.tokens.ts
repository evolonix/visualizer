const xsrfTokenNames: Record<string, string> = {
  localhost: 'antiforgery-request.v4.local.degreed.com',
  'degreed.com': 'antiforgery-request.v4.degreed.com',
  'staging.degreed.com': 'antiforgery-request.v4.staging.degreed.com',
  'release.degreed.com': 'antiforgery-request.v4.release.degreed.com',
  'betatest.degreed.com': 'antiforgery-request.v4.betatest.degreed.com',
  'eu.degreed.com': 'antiforgery-request.v4.eu.degreed.com',
  'eu.betatest.degreed.com': 'antiforgery-request.v4.eu.betatest.degreed.com',
  'ca.degreed.com': 'antiforgery-request.v4.ca.degreed.com',
} as const;

function parseCookieXsrfTokenName(): string | null {
  const matches = document.cookie.match(/\bantiforgery-request\.v4\.[^=]+=/g);
  if (matches) {
    matches.sort((a, b) => b.length - a.length);
    // Our cookie names follow our domain names so the
    // longest matching cookie name we can see will be the most specific.
    // return the longest match
    return matches[0]?.slice(0, -1);
  }

  return null;
}

export function getXsrfTokenName(name: string): string {
  // return localhost token name by default to support feature sites
  const defaultKey = 'localhost';
  const tokenName = xsrfTokenNames[name] || parseCookieXsrfTokenName() || xsrfTokenNames[defaultKey];

  return tokenName;
}

export function getXsrfTokenValue(name: string): string {
  const tokenName = getXsrfTokenName(name);
  const cookie = document.cookie.match(new RegExp(`(^| )${tokenName}=([^;]+)`));
  const tokenValue = cookie ? cookie[2] : '';

  return tokenValue;
}
