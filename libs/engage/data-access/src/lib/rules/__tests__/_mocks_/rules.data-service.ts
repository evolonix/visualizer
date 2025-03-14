import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { SearchActionParams } from '../../rules.model';

import { EmailTemplate } from '@engage/remote-api';

import { EventsResponse, LoadRuleResponse, LoadRulesResponse, SaveRuleResponse } from '../../rules.data-service';
import { emailTemplates } from './email-templates.data';
import { PAGES } from './rules.data';

/** A trivial data layer service that requests rules from a rule database API */
@Injectable()
export class RulesDataService {
  loadRuleById(id: string): Observable<LoadRuleResponse> {
    const rule = PAGES.map((page) => page.payload)
      .reduce((acc, rules) => acc.concat(rules), [])
      .find((rule) => rule.id === id);

    return of({
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      payload: rule!,
    });
  }

  searchRules(params: SearchActionParams): Observable<LoadRulesResponse> {
    const { page } = params;
    const pageNum = page || 1;
    return pageNum > PAGES.length ? this.searchWithError(params) : of(PAGES[pageNum - 1]);
  }

  searchWithError({ page }: SearchActionParams): Observable<LoadRulesResponse> {
    return new Observable<LoadRulesResponse>((subscriber) => {
      const invalidPage = new Error(`Invalid rule page requested: ${page}`);
      subscriber.error(invalidPage);
    });
  }

  loadEmailTemplate(emailTemplateID: string): Observable<EmailTemplate> {
    return of(emailTemplates.find((template) => template.id === emailTemplateID) || emailTemplates[0]);
  }

  saveRule(): Observable<SaveRuleResponse> {
    return of({ rule: PAGES[0].payload[0], pagination: PAGES[0].pagination });
  }

  deleteRule(): Observable<void> {
    return of(undefined);
  }

  loadEvents(): Observable<EventsResponse> {
    return of({ payload: ['Onboarding Completed', 'Pathway Completed', 'Mentorship Completed'] });
  }
}
