import { PAGES } from './_mocks_/rules.data';
import { RuleActions } from '../rules.analytics';

describe('Rules Analytic Events', () => {
  describe('rulesDashboardOpened', () => {
    it('should have an action', () => {
      const event = RuleActions.rulesDashboardOpened();

      expect(event.action).toEqual('Engage Dashboard Viewed');
    });
  });

  describe('ruleEditorOpened', () => {
    it('should have an action with properties', () => {
      const mockRule = PAGES[0].payload[0];
      const event = RuleActions.ruleEditorOpened(mockRule);

      expect(event).toEqual({
        action: 'Engage Rule Editor Opened',
        properties: {
          ruleId: mockRule.id,
          ruleName: mockRule.ruleName,
          isActive: mockRule.isActive,
        },
      });
    });
  });

  describe('rulesSearched', () => {
    it('should have an action with properties', () => {
      const mockSearchParams = { pageNum: 1 };
      const event = RuleActions.rulesSearched(mockSearchParams);

      expect(event).toEqual({
        action: 'Engage Rules Loaded',
        properties: { ...mockSearchParams },
      });
    });
  });

  describe('ruleSaved', () => {
    it('should indicate a rule was created', () => {
      const mockRule = PAGES[0].payload[0];
      const event = RuleActions.ruleSaved(mockRule, true);

      expect(event.action).toEqual('Engage Rule Created');
    });

    it('should indicate a rule was edited', () => {
      const mockRule = PAGES[0].payload[0];
      const event = RuleActions.ruleSaved(mockRule);

      expect(event.action).toEqual('Engage Rule Edited');
    });

    it('should contain contain additional properties', () => {
      const mockRule = PAGES[0].payload[0];
      const event = RuleActions.ruleSaved(mockRule);

      expect(event).toEqual({
        action: expect.anything(),
        properties: {
          ruleId: mockRule.id,
          ruleName: mockRule.ruleName,
          isActive: mockRule.isActive,
          event: mockRule.predicates[0].comparisonValue,
          outcome: mockRule.outcomes[0].updateTypeResourceId,
        },
      });
    });
  });

  describe('ruleDeleted', () => {
    it('should have an action with properties', () => {
      const mockRule = PAGES[0].payload[0];
      const event = RuleActions.ruleDeleted(mockRule);

      expect(event).toEqual({
        action: 'Engage Rule Deleted',
        properties: {
          ruleId: mockRule.id,
          ruleName: mockRule.ruleName,
          isActive: mockRule.isActive,
        },
      });
    });
  });
});
