import { Entity } from '../_responses';

//   GET /api/v1.0/rules
//   GET /api/v1.0/rules/<id>
//  POST /api/v1.0/rules/<id>
//   PUT /api/v1.0/rules/<id>
// PATCH /api/v1.0/rules/<id>
export interface Rule extends Entity {
  organizationId: number;
  ruleName: string;
  businessRuleType: string;
  predicates: Array<Predicate>;
  outcomes: Array<Outcome>;
  predicateOperators: Array<PredicateOperator>;
  isActive: boolean;
}

export interface Predicate {
  fieldName: string;
  comparisonOperator: string;
  comparisonValue: string;
}

export interface Outcome {
  updateTypeResourceId: string; // Todo rename to `outcomeType`
  updateValue: string; // TODO: What is this?
  emailTemplate?: EmailTemplate; // only valid for SendEmail
}

export interface EmailTemplate {
  id: string;
  emailSubject?: string;
  emailContent?: string;
}

export interface RuleEvent {
  name: string;
  displayName: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface PredicateOperator {}

/**
 * Create an empty rule so modal editors are not aware of construction details
 */
export function makeRule(organizationId: number): Rule {
  return {
    id: '',
    organizationId,
    ruleName: '',
    businessRuleType: 'engage',
    predicates: [
      {
        fieldName: 'event_type',
        comparisonOperator: '=',
        comparisonValue: '',
      },
    ],
    outcomes: [
      {
        updateTypeResourceId: 'SendEmail',
        updateValue: '',
        emailTemplate: {
          id: '',
          emailSubject: '',
          emailContent: '',
        },
      },
    ],
    predicateOperators: [],
    isActive: true,
  } as Rule;
}
