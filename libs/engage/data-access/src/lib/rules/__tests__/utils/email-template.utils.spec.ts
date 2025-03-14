import { Rule } from '@engage/remote-api';
import { of } from 'rxjs';
import { loadEmailTemplates } from '../../utils';

describe('loadEmailTemplates', () => {
  it('should return a load template request', () => {
    const template = { id: '1' };
    const rule = { outcomes: [{ emailTemplate: template }] };
    const api = { loadEmailTemplate: () => of(template) };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [isMissing, templatesToLoad] = loadEmailTemplates(rule as Rule, api as any);

    expect(isMissing).toBe(true);
    expect(templatesToLoad.length).toBe(1);
  });

  it('should not return a load template request', () => {
    const template = { id: '1', emailContent: 'content' };
    const rule = { outcomes: [{ emailTemplate: template }] };
    const api = { loadEmailTemplate: () => of(template) };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [isMissing, templatesToLoad] = loadEmailTemplates(rule as Rule, api as any);

    expect(isMissing).toBe(false);
    expect(templatesToLoad.length).toBe(0);
  });
});
