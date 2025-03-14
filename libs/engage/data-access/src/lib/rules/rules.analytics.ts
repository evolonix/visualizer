import { Rule } from '@engage/remote-api';

function ruleToParams(rule: Rule) {
  return {
    ruleId: rule.id,
    ruleName: rule.ruleName,
    isActive: rule.isActive,
  };
}
/**
 * Analytics events for the rules module
 */
export const RuleActions = {
  rulesDashboardOpened: () => ({
    action: 'Engage Dashboard Viewed',
  }),

  ruleEditorOpened: (rule: Rule) => ({
    action: `Engage Rule Editor Opened`,
    properties: ruleToParams(rule),
  }),

  rulesSearched: (searchParams: Record<string, unknown>) => ({
    action: 'Engage Rules Loaded',
    properties: {
      ...searchParams,
    },
  }),

  ruleSaved: (rule: Rule, isNewRule = false) => ({
    action: `Engage Rule ${isNewRule ? 'Created' : 'Edited'}`,
    properties: {
      ...ruleToParams(rule),
      event: rule.predicates[0].comparisonValue, // for now, engage only supports one predicate
      outcome: rule.outcomes[0].updateTypeResourceId, // for now, engage only supports one outcome
    },
  }),

  ruleDeleted: (rule: Rule) => ({
    action: `Engage Rule Deleted`,
    properties: ruleToParams(rule),
  }),
};
