import { useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { inject } from '@degreed/core-react';
import { StoreApi, useStore } from 'zustand';

import { SourceMapping } from './mappings.model';
import { MappingsStoreToken, MappingsViewModel, selectSourceById } from './mappings.state';

// ************************************************************************
// Store Slice Selectors
// Useful for optimized queries and memoization
// ************************************************************************

export const selectAllSources = (state: MappingsViewModel) => state.sources;

// ************************************************************************
// SourcMappings Hook and Results
// ************************************************************************

/**
 * Tuple response from the useMovieFacade hook
 */
export type SourcesHookResults<T> = T;

/**
 * Hook that returns the MappingsViewModel from the singleton facade + reactive store
 * Supports optional state selectors for optimized queries and memoization
 *
 * @returns MappingsViewModel
 */
export function useSourceMappings(): MappingsViewModel {
  const store = inject<StoreApi<MappingsViewModel>>(MappingsStoreToken);
  return useStore(store);
}

/**
 * Find a Source Mapping by ID
 * If no ID is provided, the currently selected source is returned
 * If not found load it from the API.
 */
export function useSource(sourceId?: string, lang = 'en'): [SourceMapping | null, MappingsViewModel] {
  const store = inject<StoreApi<MappingsViewModel>>(MappingsStoreToken);
  const [source, vm] = useStore(store, useShallow(selectSourceById(sourceId)));

  // Auto select if found...
  useEffect(() => {
    if (source) vm.api.selectSource(source);
    else if (!vm.isLoading) vm.api.loadSource(sourceId, lang);
  }, [sourceId, lang, source, vm]);

  return [source, vm];
}
