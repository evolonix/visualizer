import { AbstractControl, FormArray, FormGroup } from '@angular/forms';
import { Outcome, Predicate, Rule } from '@engage/remote-api';

/**
 * Converts the rule form values to a rule object
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const prepareRule = (rule: Rule, outcomesArray: FormArray<any>, predicatesArray: FormArray<any>, ruleForm: FormGroup<any>): Rule => {
  const populateTemplate = (outcome: Outcome, outcomeControl: AbstractControl<string, string>) => {
    const emailSubject = outcomeControl.get('emailSubject')?.value?.trim();
    const emailContent = outcomeControl.get('emailContent')?.value?.trim();

    return {
      ...outcome,
      emailTemplate: {
        id: outcome.emailTemplate?.id,
        emailSubject,
        emailContent,
      },
    } as Outcome;
  };

  // udpate the predicate comparison value based on the value selected in the dropdown
  const populatePredicate = (predicate: Predicate, predicateControl: AbstractControl<string, string>) => ({
    ...predicate,
    comparisonValue: predicateControl.get('comparisonValue')?.value,
  });

  const ruleName = ruleForm.get('ruleName')?.value?.trim();
  const outcomes = outcomesArray.controls.map((outcomeControl, i) => populateTemplate(rule?.outcomes[i], outcomeControl));
  const predicates = predicatesArray.controls.map((predicateControl, i) => populatePredicate(rule?.predicates[i], predicateControl));

  return {
    ...rule,
    ruleName,
    outcomes,
    predicates,
  };
};
