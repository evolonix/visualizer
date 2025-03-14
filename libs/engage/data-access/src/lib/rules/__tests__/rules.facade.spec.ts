import { CommonModule } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { AnalyticsService } from '@degreed/core-angular';
import { EventBus, StatusState, getRequestStatus, readFirst } from '@degreed/rsm';
import { Rule, RuleEvent } from '@engage/remote-api';

import { FeatureFlagsService } from '../../feature-flags/feature-flags.service';
import { RulesDataService } from '../rules.data-service';
import { RulesFacade } from '../rules.facade';
import { RulesState } from '../rules.model';
import { RulesStore } from '../rules.store';

import { RulesDataService as MockRulesAPI, PAGES } from './_mocks_';

const mockAnalyticsService = {
  report: jest.fn(),
};

describe('RulesFacade', () => {
  let store: RulesStore;
  let facade: RulesFacade;
  let api: MockRulesAPI;

  beforeEach(() => {
    jest.useFakeTimers();

    TestBed.configureTestingModule({
      imports: [CommonModule],
      providers: [
        {
          provide: EventBus,
          useFactory: () => new EventBus(),
        },
        {
          provide: RulesDataService,
          useClass: MockRulesAPI,
        },
        {
          provide: AnalyticsService,
          useValue: mockAnalyticsService,
        },
        FeatureFlagsService,
        RulesStore,
        RulesFacade,
      ],
    });

    api = TestBed.inject(RulesDataService) as unknown as MockRulesAPI;
    store = TestBed.inject(RulesStore);
    facade = TestBed.inject(RulesFacade);

    facade.loadRules('', 1, 3);
  });

  it('instantiate', () => {
    expect(facade).toBeTruthy();
    expect(facade).toHaveObservables(['vm$', 'status$', 'isLoading$', 'events$']);
    expect(facade).toHaveMethods(['loadRules', 'showPage']);
  });

  it('should auto-load rules for the first page', () => {
    expect(facade.vm$).toEmit(3, (s: RulesState) => s.allRules.length);
    expect(facade.vm$).toEmit(1, (s: RulesState) => s.pagination.currentPage);
  });

  describe('events$', () => {
    it('should emit events', () => {
      const events: RuleEvent[] = readFirst(facade.events$);

      expect(events).toBeDefined();
      expect(events.length).toBeGreaterThan(0);
    });
  });

  describe('loadRules()', () => {
    const findSearchBy = (s: RulesState): string => s.searchBy;
    const findCurrentPage = (s: RulesState) => s.pagination.currentPage;
    // const findNumPages = (s: RulesState): number => Object.keys(s.pagination['pages']).length;
    const status = () => store.useQuery<StatusState>(getRequestStatus).value;

    it('should prefretch next pages with using same "searchBy"', () => {
      const searchBy = readFirst(facade.vm$, findSearchBy);

      facade.loadRules(searchBy, 2);
      expect(facade.vm$).toEmit(2, findCurrentPage);

      facade.loadRules(searchBy, 3);
      expect(facade.vm$).toEmit(3, findCurrentPage);
      expect(status()).toBe('success');
    });

    it('should load more pages with using same "searchBy"', () => {
      const searchBy = readFirst(facade.vm$, findSearchBy);

      facade.loadRules(searchBy, 2);
      expect(facade.vm$).toEmit(2, findCurrentPage);

      facade.loadRules(searchBy, 3);
      expect(facade.vm$).toEmit(3, findCurrentPage);
    });

    it('should set status = "error" on API issues', () => {
      const orig = api.searchRules;
      try {
        facade.loadRules('dogs', 7);
        expect(status()).toBe('error');
      } finally {
        api.searchRules = orig;
      }
    });
  });

  describe('showPage()', () => {
    it('should navigate to valid page', () => {
      const searchBy = readFirst(facade.vm$, (s: RulesState): string => s.searchBy);
      const findCurrentPage = (s: RulesState) => s.pagination.currentPage;

      // Load rules for page 2
      facade.loadRules(searchBy, 2);
      expect(facade.vm$).toEmit(2, findCurrentPage);

      // Navigate to page 1
      facade.showPage(1);
      expect(facade.vm$).toEmit(1, findCurrentPage);
    });

    it('should skip navigation if target page is out-of-range', () => {
      const searchBy = readFirst(facade.vm$, (s: RulesState): string => s.searchBy);
      const findCurrentPage = (s: RulesState) => s.pagination.currentPage;

      // Load rules for page 2
      facade.loadRules(searchBy, 2);
      expect(facade.vm$).toEmit(2, findCurrentPage);

      // Navigate to invalid page 5 since only 4 pages valid
      facade.showPage(5);
      expect(facade.vm$).toEmit(2, findCurrentPage);

      // Navigate to invalid page 0
      facade.showPage(0);
      expect(facade.vm$).toEmit(2, findCurrentPage);

      // Navigate to invalid page -2
      facade.showPage(-2);
      expect(facade.vm$).toEmit(2, findCurrentPage);
    });

    it('should NOT autoSelect() page associated with a selected rule', () => {
      const searchBy = readFirst(facade.vm$, (s) => s.searchBy);
      const lastRule: Rule = PAGES[0].payload[PAGES[0].payload.length - 1];

      const findCurrentPage = (s: RulesState) => s.pagination.currentPage;
      const findFirstSelection = (rules: Rule[]) => rules[0]?.id;

      // Load rules and navigate to page 1
      facade.loadRules(searchBy, 1);

      // Navigate to page 4 and select rule
      facade.showPage(4);
      facade.selectRule(lastRule.id);

      expect(facade.vm$).toEmit(4, findCurrentPage);
      expect(facade.selectedRules$).toEmit(lastRule.id, findFirstSelection);

      // Navigate to page 2 and select last rule
      // Should not navigate when selecting rule on another page
      facade.showPage(2);
      facade.selectRule(lastRule.id);

      expect(facade.vm$).toEmit(2, findCurrentPage);
      expect(facade.selectedRules$).toEmit(lastRule.id, findFirstSelection);
    });

    it('should clear selections when navigating to another page', () => {
      const lastPage = PAGES[3].payload;
      const lastRule: Rule = lastPage[lastPage.length - 1];
      const searchBy = readFirst(facade.vm$, (s) => s.searchBy);

      const findCurrentPage = (s: RulesState) => s.pagination.currentPage;
      const findNumSelectedRules = (s: RulesState) => s.selectedIDs.length;
      const findFirstSelection = (rules: Rule[]) => rules[0]?.id;

      // Load 1st and navigate to page #4
      facade.loadRules(searchBy, 1);
      facade.showPage(4);

      // select rule on last page (10 total rules, pagesize = 3)
      facade.selectRule(lastRule.id);
      expect(facade.vm$).toEmit(4, findCurrentPage);
      expect(facade.selectedRules$).toEmit(lastRule.id, findFirstSelection);

      // navigate back to page #2 and assert no selections
      facade.showPage(2);
      expect(facade.vm$).toEmit(2, findCurrentPage);
      expect(facade.vm$).toEmit(0, findNumSelectedRules);

      // select rule on page #2 and assert selection
      const rule = PAGES[2].payload[0];
      facade.selectRule(rule.id);
      expect(facade.selectedRules$).toEmit(rule.id, findFirstSelection);

      // navigate to page #3 and assert no selections
      facade.showPage(3);
      expect(facade.vm$).toEmit(3, findCurrentPage);
      expect(facade.vm$).toEmit(0, findNumSelectedRules);
    });
  });

  describe('loadRule()', () => {
    it('should load a single rule by ID', () => {
      const rule$ = facade.loadRule('85d7b271-76bf-4b0a-a0b2-c5728aefa007');
      const rule = readFirst<Rule>(rule$);

      expect(rule.id).toBe('85d7b271-76bf-4b0a-a0b2-c5728aefa007');
    });

    it('should include email templates', () => {
      const saveRuleStoreSpy = jest.spyOn(store, 'saveRule');

      const rule$ = facade.loadRule('85d7b271-76bf-4b0a-a0b2-c5728aefa007');
      const rule = readFirst<Rule>(rule$);

      rule.outcomes.every((outcome) => {
        expect(outcome.emailTemplate?.id).toBeDefined();
        expect(outcome.emailTemplate?.emailSubject).toBeDefined();
        expect(outcome.emailTemplate?.emailContent).toBeDefined();
      });

      expect(saveRuleStoreSpy).not.toHaveBeenCalled();
    });

    it('should load email templates from the API', () => {
      const ruleID = 'f83d820f-d307-4ecc-af81-a5e8c37b6342';
      const apiRule = PAGES[0].payload.find((r) => r.id === ruleID);
      delete apiRule?.outcomes[0].emailTemplate?.emailSubject;
      delete apiRule?.outcomes[0].emailTemplate?.emailContent;

      jest.spyOn(store, 'findItemByID').mockReturnValueOnce(undefined);
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      jest.spyOn(api, 'loadRuleById').mockReturnValueOnce(of({ payload: apiRule! }));
      const saveRuleStoreSpy = jest.spyOn(store, 'saveRule');

      const rule$ = facade.loadRule(ruleID);
      const rule = readFirst<Rule>(rule$);

      rule.outcomes.every((outcome) => {
        expect(outcome.emailTemplate?.id).toBeDefined();
        expect(outcome.emailTemplate?.emailSubject).toBeDefined();
        expect(outcome.emailTemplate?.emailContent).toBeDefined();
      });

      expect(saveRuleStoreSpy).not.toHaveBeenCalled();
    });

    it('should load rule from the store and update back to the store', () => {
      const ruleID = 'f83d820f-d307-4ecc-af81-a5e8c37b6342';
      const storedRule = PAGES[0].payload.find((r) => r.id === ruleID);
      delete storedRule?.outcomes[0].emailTemplate?.emailSubject;
      delete storedRule?.outcomes[0].emailTemplate?.emailContent;
      const saveRuleStoreSpy = jest.spyOn(store, 'saveRule');

      jest.spyOn(store, 'findItemByID').mockReturnValueOnce(storedRule);

      const rule$ = facade.loadRule(ruleID);
      readFirst<Rule>(rule$);

      expect(saveRuleStoreSpy).toHaveBeenCalled();
    });
  });

  describe('saveRule', () => {
    it('should report analytics', async () => {
      await facade.saveRule({ id: 'f83d820f-d307-4ecc-af81-a5e8c37b6342' });

      expect(mockAnalyticsService.report).toHaveBeenCalled();
    });
  });

  describe('deleteRule', () => {
    it('should report analytics', async () => {
      await facade.deleteRule('f83d820f-d307-4ecc-af81-a5e8c37b6342');

      expect(mockAnalyticsService.report).toHaveBeenCalled();
    });
  });

  describe('searchRules', () => {
    it('should report analytics', async () => {
      await facade.searchRules({});

      expect(mockAnalyticsService.report).toHaveBeenCalled();
    });
  });
});
