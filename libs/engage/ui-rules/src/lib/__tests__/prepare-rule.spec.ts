import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { makeRule } from '@engage/remote-api';

import { prepareRule } from '../utils/prepare-rule';

describe('prepareRule', () => {
  it('should populate the rule with the form values', () => {
    const rule = makeRule(1);
    const ruleForm = new FormGroup({
      ruleName: new FormControl('ruleName'),
      outcomes: new FormArray([
        new FormGroup({
          emailSubject: new FormControl('emailSubject'),
          emailContent: new FormControl('emailContent'),
        }),
      ]),
      predicates: new FormArray([
        new FormGroup({
          comparisonValue: new FormControl('Onboarding Completed'),
        }),
      ]),
    });

    const preparedRule = prepareRule(rule, ruleForm.get('outcomes') as FormArray, ruleForm.get('predicates') as FormArray, ruleForm);

    expect(preparedRule.ruleName).toEqual('ruleName');
    expect(preparedRule.outcomes[0].emailTemplate?.emailSubject).toEqual('emailSubject');
    expect(preparedRule.outcomes[0].emailTemplate?.emailContent).toEqual('emailContent');
    expect(preparedRule.predicates[0].comparisonValue).toEqual('Onboarding Completed');
  });

  it('should trim the rule name', () => {
    const rule = makeRule(1);
    const ruleForm = new FormGroup({
      ruleName: new FormControl(' ruleName '),
      outcomes: new FormArray([
        new FormGroup({
          emailSubject: new FormControl('emailSubject'),
          emailContent: new FormControl('emailContent'),
        }),
      ]),
      predicates: new FormArray([
        new FormGroup({
          comparisonValue: new FormControl('comparisonValue'),
        }),
      ]),
    });

    const preparedRule = prepareRule(rule, ruleForm.get('outcomes') as FormArray, ruleForm.get('predicates') as FormArray, ruleForm);

    expect(preparedRule.ruleName).toEqual('ruleName');
  });

  it('should trim the email subject', () => {
    const rule = makeRule(1);
    const ruleForm = new FormGroup({
      ruleName: new FormControl('ruleName'),
      outcomes: new FormArray([
        new FormGroup({
          emailSubject: new FormControl(' emailSubject '),
          emailContent: new FormControl('emailContent'),
        }),
      ]),
      predicates: new FormArray([
        new FormGroup({
          comparisonValue: new FormControl('comparisonValue'),
        }),
      ]),
    });

    const preparedRule = prepareRule(rule, ruleForm.get('outcomes') as FormArray, ruleForm.get('predicates') as FormArray, ruleForm);

    expect(preparedRule.outcomes[0].emailTemplate?.emailSubject).toEqual('emailSubject');
  });

  it('should trim the email content', () => {
    const rule = makeRule(1);
    const ruleForm = new FormGroup({
      ruleName: new FormControl('ruleName'),
      outcomes: new FormArray([
        new FormGroup({
          emailSubject: new FormControl('emailSubject'),
          emailContent: new FormControl(' emailContent '),
        }),
      ]),
      predicates: new FormArray([
        new FormGroup({
          comparisonValue: new FormControl('comparisonValue'),
        }),
      ]),
    });

    const preparedRule = prepareRule(rule, ruleForm.get('outcomes') as FormArray, ruleForm.get('predicates') as FormArray, ruleForm);

    expect(preparedRule.outcomes[0].emailTemplate?.emailContent).toEqual('emailContent');
  });

  it('should not trim the email subject if it is undefined', () => {
    const rule = makeRule(1);
    const ruleForm = new FormGroup({
      ruleName: new FormControl('ruleName'),
      outcomes: new FormArray([
        new FormGroup({
          emailSubject: new FormControl(undefined),
          emailContent: new FormControl('emailContent'),
        }),
      ]),
      predicates: new FormArray([
        new FormGroup({
          comparisonValue: new FormControl('comparisonValue'),
        }),
      ]),
    });

    const preparedRule = prepareRule(rule, ruleForm.get('outcomes') as FormArray, ruleForm.get('predicates') as FormArray, ruleForm);

    expect(preparedRule.outcomes[0].emailTemplate?.emailSubject).toEqual(undefined);
  });
});
