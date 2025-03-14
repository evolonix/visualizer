import { useEffect, useState } from 'react';

import { inject } from '@degreed/core-react';
import { StoreApi, useStore } from 'zustand';
import { useShallow } from 'zustand/react/shallow';

import { Nullable } from '../_core';
import { LanguageRegistry } from './scales.model';
import { PublishViewModel, ScalesPublishStore } from './scales.publish';
import { ScaleAPI, ScalesStore, ScalesViewModel, makeScale, selectPrimaryScale } from './scales.state';
import { syncUrlFromStore } from './scales.url-sync';

// ************************************************************************
// Store Slice Selectors
// Useful for optimized queries and memoization
// ************************************************************************

export const selectAllScales = (state: ScalesViewModel) => state.registry;

// ************************************************************************
// MovieStore Hook and Results
// ************************************************************************

/**
 * Tuple response from the useScalesStore hook
 */
export type ScalesHookResults<T> = T;

/**
 * Hook that returns the ScalesViewModel from the singleton facade + reactive store
 * Supports optional state selectors for optimized queries and memoization
 *
 * @returns ScalesViewModel | Slice
 */
export function useScalesStore(): ScalesViewModel {
  const store = inject<StoreApi<ScalesViewModel>>(ScalesStore);
  const vm = useStore(store);

  /**
   * If store has NOT been initialized with remote data,
   * autoload all scales (with all levels)
   */
  useEffect(() => {
    // response will be an array if a selector was used
    if (vm.showSkeleton) vm.api.loadAllScales(true);
  }, [vm]);

  // Update URL as store state changes
  useEffect(() => {
    const stopSync = syncUrlFromStore(store);
    return () => stopSync();
  }, [store]);

  return vm;
}

/**
 * Find scale in memory or load from API or create a new scale
 */
export function useScale(scaleId = 'new'): [Nullable<LanguageRegistry>, ScaleAPI, ScalesViewModel] {
  const [newScale] = useState<Nullable<LanguageRegistry>>(() => (scaleId === 'new' ? makeScale() : null));
  const store = inject<StoreApi<ScalesViewModel>>(ScalesStore);
  const vm = useStore(store);

  useEffect(() => {
    (async () => {
      vm.api.selectScale(scaleId);

      const { selected, isLoading } = vm;
      if (!newScale && !selected && !isLoading) {
        await vm.api.loadScaleById(scaleId);
      }
    })();
  }, [scaleId, newScale, vm]);

  return [newScale ?? vm.selected, vm.api, vm];
}

/**
 * Find primary scale in memory or load from API
 */
export function usePrimaryScale(fullLoad = true): [LanguageRegistry | null, ScaleAPI, ScalesViewModel] {
  const store = inject<StoreApi<ScalesViewModel>>(ScalesStore);
  const [localizations, api, vm] = useStore(store, useShallow(selectPrimaryScale));
  const [primary, setPrimary] = useState(localizations);

  useEffect(() => {
    if (!localizations && !vm.isLoading) {
      api.selectPrimaryScale().then((primary) => {
        setPrimary(primary);

        const s = primary?.['en'];
        if (s?.isShallowLoaded && fullLoad) {
          api.loadScaleById(s.id, true);
        }
      });
    }
  }, [localizations, api, fullLoad, vm.isLoading]);

  return [primary, api, vm];
}

/**
 * Hook to publish or validate if scale can be published (and return errors/warnings)
 * Internally the ScalesPublishStore uses the
 *  - ScalesStore to publish/validate
 *  - EventBus to listen for scale changes, deletions... and forces a re-validation
 */
export function usePublishScales() {
  const [isPublished, setIsPublished] = useState(false);
  const store = inject<StoreApi<PublishViewModel>>(ScalesPublishStore);

  // Auto-check if publishable
  useEffect(() => {
    const api = store.getState();
    api.validateCanPublish();
    store.subscribe((state) => {
      state.showSuccessToast && setIsPublished(state.showSuccessToast);
    });
  }, [store]);

  // return entire view model or selected slice
  const vm = useStore(store);

  return [vm, isPublished] as const;
}
