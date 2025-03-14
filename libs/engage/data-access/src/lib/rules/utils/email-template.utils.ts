/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-empty-function */

import { EmailTemplate, Rule } from '@engage/remote-api';
import { Observable } from 'rxjs';

import { RulesDataService } from '../rules.data-service';

export type LoadTemplateResults = [boolean, Observable<EmailTemplate>[]];

/**
 * Does the Rule need to load outcome templates?
 * If yes, and autoLoad is true, then build requests to load them.
 *
 * NOTE: This function does not actually load the templates; it only builds the requests.
 */
export const loadEmailTemplates = (rule: Rule, api: RulesDataService, autoLoad = true): LoadTemplateResults => {
  let isMissing = false;
  const templatesToLoad: Observable<EmailTemplate>[] = [];

  // Scan for any outcomes that do not have an emailTemplate
  rule.outcomes.forEach(({ emailTemplate: template }) => {
    if (template && !template?.emailContent) {
      isMissing = true;

      if (autoLoad) {
        const pending$ = api.loadEmailTemplate(template.id);
        templatesToLoad.push(pending$);
      }
    }
  });

  return [isMissing, templatesToLoad];
};
