/* eslint-disable @typescript-eslint/no-explicit-any */
export type PerformanceTrackingProps = {
  secondsSincePageLoad: number;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface PageContext {
  path: string;
  params: any;
  referrer: string | undefined;
  search: string;
  title: string;
  url: string;
}

export type QueryParams = Record<string, string>;

/**
 * Get performance tracking properties
 */
export function getPerformanceTrackingProps(): PerformanceTrackingProps {
  return {
    secondsSincePageLoad: (Date.now() - performance?.timeOrigin) / 1000,
  };
}

/**
 * Clean sensitive data if the query string contains a token response type or if a client id property is present
 */
export function sanitizeSensitiveQuery(currentLocation: URL, detailsContextPage: PageContext) {
  const queryStringParams = searchToParams(currentLocation.search);
  const isSensitiveQuery = queryStringParams['response_type'] === 'token' || !!queryStringParams['client_id'];

  return !isSensitiveQuery
    ? detailsContextPage
    : {
        ...detailsContextPage,
        params: {},
        referrer: currentLocation.pathname,
        search: '',
        url: currentLocation.pathname,
      };
}

// Returns query string params list as an object
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function searchToParams(queryString: string): QueryParams {
  const keyValues = queryString.replace('?', ''),
    paramsList = keyValues.split('&'),
    params: any = {}; // eslint-disable-line @typescript-eslint/no-explicit-any
  for (const paramAndValue of paramsList) {
    const param = paramAndValue.split('=');
    if (param) {
      params[param[0]] = param[1];
    }
  }
  return params;
}

// Returns the first, or only, language code set by the browser.
export function getLocale() {
  return navigator.languages && navigator.languages.length ? navigator.languages[0] : navigator.language;
}

export function getTimezone() {
  return new Date().getTimezoneOffset() * -1;
}
