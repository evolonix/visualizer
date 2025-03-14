import { StatusState, getRequestStatus, readFirst } from '@degreed/rsm';
import { first } from 'rxjs/operators';

import { LoadRulesResponse, RulesState, RulesStore } from '..';
import { PAGES, RulesDataService } from './_mocks_';

describe('RulesStore', () => {
  let store: RulesStore;
  beforeEach(() => {
    store = new RulesStore();
  });

  describe('initialization', () => {
    it('should have API', () => {
      expect(store).toBeTruthy();
      expect(store).toHaveObservables(['state$', 'status$']);
      expect(store).toHaveMethods(['updateRules']);
    });

    it('should initialize with correct state', () => {
      const state = store.useQuery((s) => s);
      const { searchBy, allRules } = state;

      expect(searchBy).toBe(''); // Default startup value for the Rule search
      expect(allRules).toEqual([]);

      // Do the emitted stream values match the snapshot values?
      const state$ = store.state$.pipe(first());
      state$.subscribe((s: RulesState) => {
        expect(s.searchBy).toEqual(searchBy);
        expect(s.allRules).toEqual(allRules);
      });
    });

    it('should initialize with correct state', () => {
      const state = store.useQuery((s) => s);
      const { searchBy, allRules } = state;

      expect(searchBy).toBe(''); // Default startup value for the Rule search
      expect(allRules).toEqual([]);

      // Do the emitted stream values match the snapshot values?
      const state$ = store.state$.pipe(first());
      state$.subscribe((s: RulesState) => {
        expect(s.searchBy).toEqual(searchBy);
        expect(s.allRules).toEqual(allRules);
      });
    });
  });

  describe('updateRules', () => {
    const api = new RulesDataService();
    const status = () => store.useQuery<StatusState>(getRequestStatus).value;

    it('should update search and allRules', () => {
      const findSearchCriteria = (s: RulesState) => s.searchBy;
      const findNumRulesShown = (s: RulesState) => s.allRules.length;
      const findNumRulesAvailable = (s: RulesState) => s.pagination.total;
      const findCurrentPage = (s: RulesState) => s.pagination.currentPage;

      const page1 = PAGES[0];
      const page2 = PAGES[1];

      expect(page2.pagination.currentPage).not.toBe(page1.pagination.currentPage);

      // Add 1st page
      store.updateRules('canine', page1.payload, page1.pagination);

      expect(store.state$).toEmit('canine', findSearchCriteria);
      expect(store.state$).toEmit(page1.payload.length, findNumRulesShown);
      expect(store.state$).toEmit(page1.pagination.total, findNumRulesAvailable);
      expect(store.state$).toEmit(page1.pagination.currentPage, findCurrentPage);

      // Add 2nd page
      store.setLoading();
      store.updateRules('canine', page2.payload, page2.pagination);

      expect(store.state$).toEmit('canine', findSearchCriteria);
      expect(store.state$).toEmit(page2.payload.length, findNumRulesShown);
      expect(store.state$).toEmit(page2.pagination.total, findNumRulesAvailable);
      expect(store.state$).toEmit(page2.pagination.currentPage, findCurrentPage);

      expect(store.hasPage(2)).toBe(true);
      expect(store.hasPage(3)).toBe(false);

      // Adding page auto-selects that page
      // Expect currentPage to be emitted as #2
      expect(store.state$).toEmit(2, findCurrentPage);
    });

    it('should clear all pages when the search criteria changes', () => {
      const findCurrentPage = (s: RulesState) => s.pagination.currentPage;
      const findSearchCriteria = (s: RulesState) => s.searchBy;

      [0, 1].map((i) => store.updateRules('', PAGES[i].payload, PAGES[i].pagination));
      expect(store.useQuery(findSearchCriteria)).toBe('');
      expect(store.state$).toEmit(2, findCurrentPage);
      expect(store.hasPage(1)).toBe(true);
      expect(store.hasPage(2)).toBe(true);

      // Add Rules with NEW search criteria
      store.updateRules('snakes', PAGES[0].payload, PAGES[0].pagination);

      expect(store.useQuery(findSearchCriteria)).toBe('snakes');
      expect(store.state$).toEmit(1, findCurrentPage);
      expect(store.hasPage(1)).toBe(true);
    });

    it('should set status == "success"', () => {
      expect(status()).toBe('initializing');

      store.setLoading();
      expect(status()).toBe('pending');

      const { payload, pagination } = readFirst<LoadRulesResponse>(api.searchRules({ searchBy: '', page: 1 }));

      store.updateRules('', payload, pagination);
      expect(status()).toBe('success');

      store.setLoading(false);
      expect(status()).toBe('success');
    });

    it('trackLoadStatus() should set status == "error" for API fails', () => {
      const mapError = (error: unknown) => {
        //console.log(`api.searchWithError has error: ${JSON.stringify(error)}`);
        return error;
      };

      api
        .searchWithError({ searchBy: '', page: 1 })
        .pipe(store.trackLoadStatus(mapError))
        .subscribe({
          error: () => {
            expect(status()).toBe('error');
          },
        });
    });
  });
});
