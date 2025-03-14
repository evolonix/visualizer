import MOCK_i18N_REGISTRY from './__mocks__/index.json';
import { buildUrl, i18nCDN, i18nFetchParams, initParams } from './i18nCDN';

// ****************************************************
// Mock the `fetch()` to return i18n CDN registry
// ****************************************************

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve(MOCK_i18N_REGISTRY),
  })
) as jest.Mock;

// ****************************************************
// Internal Utility functions
// ****************************************************

export type Scenario = { requested: Partial<i18nFetchParams>; resolved: { lang: string; bundle: string; version: string } };

const requestWith = (locale?: string, bundleName = 'web-app', root = '') => ({ requested: { locale, bundleName, root } });
const resolvesWith = (lang: string, version: string, bundle = 'bundles/web-app') => ({ resolved: { lang, bundle, version } });

const SCENARIOS: Array<Scenario> = [
  { ...requestWith(), ...resolvesWith('default', 'v_2F5733082A3F564F183EE0F26E131F5A') },
  { ...requestWith('it-it'), ...resolvesWith('it', 'v_2F5733082A3F564F183EE0F26E131F5A') },
  { ...requestWith('it'), ...resolvesWith('it', 'v_2F5733082A3F564F183EE0F26E131F5A') },
  { ...requestWith('de-bad'), ...resolvesWith('de', 'v_2F5733082A3F564F183EE0F26E131F5A') },
  { ...requestWith('en'), ...resolvesWith('en', 'v_2F5733082A3F564F183EE0F26E131F5A') },
  { ...requestWith('en-GB'), ...resolvesWith('en-gb', 'v_2F5733082A3F564F183EE0F26E131F5A') },
  { ...requestWith('es'), ...resolvesWith('es', 'v_2F5733082A3F564F183EE0F26E131F5A') },

  { ...requestWith('it-it', 'A11y'), ...resolvesWith('it', 'v_420F23DBE52FA3158BE6F4A999C23F6E', 'A11y') },
  { ...requestWith('it', 'A11y'), ...resolvesWith('it', 'v_420F23DBE52FA3158BE6F4A999C23F6E', 'A11y') },
  { ...requestWith('de', 'A11y'), ...resolvesWith('de', 'v_420F23DBE52FA3158BE6F4A999C23F6E', 'A11y') },
  { ...requestWith('en', 'A11y'), ...resolvesWith('en', 'v_420F23DBE52FA3158BE6F4A999C23F6E', 'A11y') },
  { ...requestWith('es', 'A11y'), ...resolvesWith('es', 'v_420F23DBE52FA3158BE6F4A999C23F6E', 'A11y') },

  { ...requestWith('fake', 'web-app'), ...resolvesWith('default', 'v_2F5733082A3F564F183EE0F26E131F5A', 'bundles/web-app') },
  { ...requestWith('fake', 'A11y'), ...resolvesWith('default', 'v_420F23DBE52FA3158BE6F4A999C23F6E', 'A11y') },

  { ...requestWith('es', 'fake'), ...resolvesWith('es', 'v_2F5733082A3F564F183EE0F26E131F5A', 'bundles/web-app') },
  { ...requestWith('fr', 'fake'), ...resolvesWith('fr', 'v_2F5733082A3F564F183EE0F26E131F5A', 'bundles/web-app') },
];

// ****************************************************
// Test i18n Loader
// ****************************************************

describe('i18nCDN', () => {
  // beforeEach(() => enableMockFetch());
  describe('resolveUrl', () => {
    SCENARIOS.forEach(({ requested, resolved }) => {
      it(`should resolve locale='${requested.locale}' and bundleName='${requested.bundleName}'`, async () => {
        const calculatedUrl = await i18nCDN.resolveUrl(requested);
        const root = requested.root || initParams.root;
        const expectedUrl = buildUrl(root, resolved.bundle, resolved.version, resolved.lang);

        expect(calculatedUrl).toBe(expectedUrl);
      });
    });

    it('should use specified CDN root', async () => {
      const { requested, resolved } = {
        ...requestWith('it-it', 'web-app', 'https://cdn.example.com'),
        ...resolvesWith('it', 'v_2F5733082A3F564F183EE0F26E131F5A'),
      };
      const expectedUrl = buildUrl(requested.root, resolved.bundle, resolved.version, resolved.lang);
      const calculatedUrl = await i18nCDN.resolveUrl(requested);

      expect(calculatedUrl).toBe(expectedUrl);
    });
  });

  describe('on fetch errors', () => {
    it('should return an empty localization URL', async () => {
      const mockfetch = global.fetch as jest.Mock;
      mockfetch.mockImplementation(() => Promise.reject('Error fetching i18n registry'));

      const { requested } = { ...requestWith('en'), ...resolvesWith('en', 'v_2F5733082A3F564F183EE0F26E131F5A') };
      const calculatedUrl = await i18nCDN.resolveUrl(requested);

      expect(calculatedUrl).toBe('');
    });

    it('should return an empty localization bundle', async () => {
      const mockfetch = global.fetch as jest.Mock;
      mockfetch.mockImplementation(() => Promise.reject('Error fetching i18n registry'));

      const { requested } = { ...requestWith('en'), ...resolvesWith('en', 'v_2F5733082A3F564F183EE0F26E131F5A') };
      const bundle = await i18nCDN.loadJson(requested);

      expect(bundle).toBeDefined();
      expect(Object.keys(bundle).length).toBe(0);
    });
  });
});
