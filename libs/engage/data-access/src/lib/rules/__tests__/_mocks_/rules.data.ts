import { LoadRulesApiResponse, Rule } from '@engage/remote-api';
import { LoadRulesResponse, buildClientPagination } from '../../rules.data-service';

const db: LoadRulesApiResponse = {
  pagination: {
    page: 1,
    pageSize: 12,
    numPages: 1,
    totalResults: 10,
  },
  payload: [
    {
      id: '85d7b271-76bf-4b0a-a0b2-c5728aefa007',
      organizationId: 1,
      ruleName: 'Rule 1',
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
          updateTypeResourceId: 'SemdEmail',
          updateValue: '',
          emailTemplate: {
            id: 'f83d820f-d307-4ecc-af81-a5e8c37b6300',
            emailSubject: 'Rule 1 Email Subject',
            emailContent: 'Rule 1 email content',
          },
        },
      ],
      predicateOperators: [],
      isActive: true,
    },
    {
      id: 'f83d820f-d307-4ecc-af81-a5e8c37b6342',
      organizationId: 1,
      ruleName: 'Rule 2',
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
          updateTypeResourceId: 'SemdEmail',
          updateValue: '',
          emailTemplate: {
            id: 'f83d820f-d307-4ecc-af81-a5e8c37b6301',
            emailSubject: 'Rule 2 Email Subject',
            emailContent: 'Rule 2 email content',
          },
        },
      ],
      predicateOperators: [],
      isActive: true,
    },
    {
      id: 'f91fa973-5fe6-437f-8356-cf0b27d2a911',
      organizationId: 1,
      ruleName: 'Rule 3',
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
          updateTypeResourceId: 'SemdEmail',
          updateValue: '',
          emailTemplate: {
            id: 'f83d820f-d307-4ecc-af81-a5e8c37b6302',
            emailSubject: 'Rule 3 Email Subject',
            emailContent: 'Rule 3 email content',
          },
        },
      ],
      predicateOperators: [],
      isActive: true,
    },
    {
      id: 'dfc7a63e-d7eb-4589-84ec-9a60390e7ce1',
      organizationId: 1,
      ruleName: 'Rule 4',
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
          updateTypeResourceId: 'SemdEmail',
          updateValue: '',
          emailTemplate: {
            id: 'f83d820f-d307-4ecc-af81-a5e8c37b6303',
            emailSubject: 'Rule 4 Email Subject',
            emailContent: 'Rule 4 email content',
          },
        },
      ],
      predicateOperators: [],
      isActive: true,
    },
    {
      id: 'b428b080-ce03-4c0f-ab7a-af7675fa660f',
      organizationId: 1,
      ruleName: 'Rule 5',
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
          updateTypeResourceId: 'SemdEmail',
          updateValue: '',
          emailTemplate: {
            id: 'f83d820f-d307-4ecc-af81-a5e8c37b6304',
            emailSubject: 'Rule 5 Email Subject',
            emailContent: 'Rule 5 email content',
          },
        },
      ],
      predicateOperators: [],
      isActive: true,
    },
    {
      id: 'b0d7db87-4f1c-4719-a98f-05133f7fd824',
      organizationId: 1,
      ruleName: 'Rule 6',
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
          updateTypeResourceId: 'SemdEmail',
          updateValue: '',
          emailTemplate: {
            id: 'f83d820f-d307-4ecc-af81-a5e8c37b6305',
            emailSubject: 'Rule 6 Email Subject',
            emailContent: 'Rule 6 email content',
          },
        },
      ],
      predicateOperators: [],
      isActive: true,
    },
    {
      id: '3c17e333-0821-4ba6-86d9-523385950b48',
      organizationId: 1,
      ruleName: 'Rule 7',
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
          updateTypeResourceId: 'SemdEmail',
          updateValue: '',
          emailTemplate: {
            id: 'f83d820f-d307-4ecc-af81-a5e8c37b6306',
            emailSubject: 'Rule 7 Email Subject',
            emailContent: 'Rule 7 email content',
          },
        },
      ],
      predicateOperators: [],
      isActive: true,
    },
    {
      id: '725e68d2-cc1a-4c04-ba9d-f77b7070dc30',
      organizationId: 1,
      ruleName: 'Rule 8',
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
          updateTypeResourceId: 'SemdEmail',
          updateValue: '',
          emailTemplate: {
            id: 'f83d820f-d307-4ecc-af81-a5e8c37b6307',
            emailSubject: 'Rule 8 Email Subject',
            emailContent: 'Rule 8 email content',
          },
        },
      ],
      predicateOperators: [],
      isActive: true,
    },
    {
      id: '179cd745-10d7-4937-b77f-807f2bd162af',
      organizationId: 1,
      ruleName: 'Rule 9',
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
          updateTypeResourceId: 'SemdEmail',
          updateValue: '',
          emailTemplate: {
            id: 'f83d820f-d307-4ecc-af81-a5e8c37b6308',
            emailSubject: 'Rule 9 Email Subject',
            emailContent: 'Rule 9 email content',
          },
        },
      ],
      predicateOperators: [],
      isActive: true,
    },
    {
      id: 'fb4c0182-c051-41b9-9d16-489fd26c7973',
      organizationId: 1,
      ruleName: 'Rule 10',
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
          updateTypeResourceId: 'SemdEmail',
          updateValue: '',
          emailTemplate: {
            id: 'f83d820f-d307-4ecc-af81-a5e8c37b6309',
            emailSubject: 'Rule 10 Email Subject',
            emailContent: 'Rule 10 email content',
          },
        },
      ],
      predicateOperators: [],
      isActive: true,
    },
  ],
  status: {
    code: 200,
  },
};

const { payload } = db;
export const buildPageset = (page: number, pageSize = 3): Rule[] => {
  const start = (page - 1) * pageSize;
  return payload.slice(start, start + pageSize);
};

export const PAGES: LoadRulesResponse[] = [
  { payload: buildPageset(1), pagination: buildClientPagination({ totalResults: 10, page: 1, pageSize: 3, numPages: 4 }) },
  { payload: buildPageset(2), pagination: buildClientPagination({ totalResults: 10, page: 2, pageSize: 3, numPages: 4 }) },
  { payload: buildPageset(3), pagination: buildClientPagination({ totalResults: 10, page: 3, pageSize: 3, numPages: 4 }) },
  { payload: buildPageset(4), pagination: buildClientPagination({ totalResults: 10, page: 4, pageSize: 3, numPages: 4 }) },
];
