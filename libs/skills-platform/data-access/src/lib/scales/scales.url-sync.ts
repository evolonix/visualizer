// *******************************************************************
// Bookmark URL Synchronizer
// *******************************************************************

import { StoreApi } from 'zustand';
import { ScalesViewModel } from './scales.state';

const QUERY_KEY = 'selSc'; // selected scale  (encoded to not conflict with skill 'selected' param)

/**
 * Update the store to reflect current URL state.
 * Do this on app startup or store creation
 */
export const syncStoreFromUrl = (_store: StoreApi<ScalesViewModel>): StoreApi<ScalesViewModel> => {
  // On app startup, determine if we have a search query in the URL
  const { searchParams } = new URL(document.location.href);
  const id = searchParams.get(QUERY_KEY) || '';
  if (id) {
    _store.getState().api.loadScaleById(id);
  }
  return _store;
};

/**
 * Update the URL to reflect current store state.
 * Whenever the scale selectedId changes, update the URL
 *
 * NOTE: use query param `scale` to differentiate from skill `selected` param
 *
 * @returns Unsubscribe function
 */
export const syncUrlFromStore = (_store: StoreApi<ScalesViewModel>): (() => void) => {
  const onUpdateUrl = (state: ScalesViewModel) => {
    const { selectedId } = state;
    const { searchParams } = new URL(document.location.href);

    if (selectedId) searchParams.set(QUERY_KEY, selectedId);
    else searchParams.delete(QUERY_KEY);

    const newUrl = searchParams.size > 0 ? `${window.location.pathname}?${searchParams.toString()}` : window.location.pathname;
    window.history.replaceState({}, '', newUrl);
  };

  // Immediately update...
  onUpdateUrl(_store.getState());

  return _store.subscribe(onUpdateUrl);
};
