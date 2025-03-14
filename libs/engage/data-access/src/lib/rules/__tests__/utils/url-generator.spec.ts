import { makeUrlGenerator, RulesUrlRegsistry } from '../../utils/url-generator';

export interface Entity {
  id: string;
}

const BASE_URL = 'http://localhost:7010';
describe('urlGenerator Registry', () => {
  let generator: RulesUrlRegsistry;

  describe('for Rules API', () => {
    beforeEach(() => {
      generator = makeUrlGenerator(BASE_URL, 1).rules;
    });

    describe('loadRules()', () => {
      it('should generate url without pagination criteria', () => {
        const url = generator.loadAllRules();
        expect(url).toEqual(`${BASE_URL}/organizations/1/engage/rules`);
      });
    });

    describe('searchRules()', () => {
      it('should generate url without pagination criteria', () => {
        const url = generator.searchRules('', {});
        expect(url).toEqual(`${BASE_URL}/organizations/1/engage/rules`);
      });

      it('should generate url with pagination criteria', () => {
        const url = generator.searchRules('', { currentPage: 1, perPage: 12 });
        expect(url).toEqual(`${BASE_URL}/organizations/1/engage/rules?page=1&pageSize=12`);
      });

      it('should generate url with filtering and pagination criteria', () => {
        const url = generator.searchRules('iowa', { currentPage: 1, perPage: 12 });
        expect(url).toEqual(`${BASE_URL}/organizations/1/engage/rules?page=1&pageSize=12&searchBy=iowa`);
      });
    });

    describe('saveRule() for new rule', () => {
      it('should generate url without', () => {
        const url = generator.saveRule('', {});
        expect(url).toEqual(`${BASE_URL}/organizations/1/engage/rules`);
      });

      it('should not include trailing question mark', () => {
        const url = generator.saveRule('', {});
        expect(url).not.toEqual(`${BASE_URL}/organizations/1/engage/rules?`);
      });

      it('should generate url with pagination critieria', () => {
        const url = generator.saveRule('', { currentPage: 3, perPage: 24 });
        expect(url).toEqual(`${BASE_URL}/organizations/1/engage/rules?pageSize=24&page=3`);
      });
    });

    describe('saveRule() for existing rule', () => {
      const rule: Entity = { id: '3373' };
      it('should generate url without pagination critieria', () => {
        const url = generator.saveRule(rule, {});
        expect(url).toEqual(`${BASE_URL}/organizations/1/engage/rules/3373`);
      });

      it('should generate url with pagination critieria', () => {
        const url = generator.saveRule(rule, { currentPage: 3, perPage: 24 });
        expect(url).toEqual(`${BASE_URL}/organizations/1/engage/rules/3373?pageSize=24&page=3`);
      });
    });

    describe('loadEvents()', () => {
      it('should generate url', () => {
        const url = generator.loadEvents();
        expect(url).toEqual(`${BASE_URL}/organizations/1/engage/events`);
      });
    });
  });
});
