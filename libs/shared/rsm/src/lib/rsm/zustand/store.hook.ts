/* eslint-disable @typescript-eslint/no-explicit-any */

import { StoreApi, useStore } from 'zustand';
import { useShallow } from 'zustand/react/shallow';

import { SliceSelector } from './slice-selector';

export type Selector<ViewModel, Slice = ViewModel> = SliceSelector<StoreApi<ViewModel>, Slice>;

// @deprecated employ `useStore(<store>, useShallow(<selector>))` instead
export const useStoreWithSelector = <ViewModel = unknown, Slice = ViewModel>(
  store: StoreApi<ViewModel>,
  selector: Selector<ViewModel, Slice>
) => {
  return useStore(store, useShallow(selector));
};
