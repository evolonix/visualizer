import { EmailTemplate, Rule } from '@engage/remote-api';
import { faker } from '@faker-js/faker';
import * as _ from 'lodash';

export interface Database {
  rules: Rule[];
  'email-templates': EmailTemplate[];
  events: { payload: string[] };
}

const NUM_OF_RESULTS = 0;

const emailTemplates = _.times<EmailTemplate>(NUM_OF_RESULTS, () => ({
  id: faker.datatype.uuid(),
  emailSubject: faker.lorem.sentence(),
  emailContent: faker.lorem.paragraph(),
}));

const rules = _.times<Rule>(NUM_OF_RESULTS, (n: number) => ({
  id: faker.datatype.uuid(),
  organizationId: faker.datatype.number(),
  ruleName: faker.lorem.sentence(),
  businessRuleType: 'engage',
  predicates: [
    {
      fieldName: 'eventName',
      comparisonOperator: '=',
      comparisonValue: 'event_name',
    },
  ],
  outcomes: [
    {
      updateTypeResourceId: 'SendEmail',
      updateValue: '',
      emailTemplate: {
        id: emailTemplates[n].id,
      },
    },
  ],
  predicateOperators: [],
  isActive: true,
}));

const events = { payload: ['Onboarding Completed', 'Pathway Completed', 'Mentorship Completed'] };

export const DATA: Database = {
  rules,
  'email-templates': emailTemplates,
  events,
};
