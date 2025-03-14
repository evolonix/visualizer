import { inject } from '@degreed/core-react';
import { StoreApi, useStore } from 'zustand';
import { FilesStore, FilesViewModel } from './files.state';

// ************************************************************************
// Files/Bulk Upload Hook and Results
// ************************************************************************

/**
 * Tuple response from the useMovieFacade hook
 */
export type FilesHookResults<T> = T;

/**
 * Hook that returns the FilesViewModel from the singleton facade + reactive store
 * Supports optional state selectors for optimized queries and memoization
 *
 * @returns FilesViewModel | Slice
 */
export function useFilesStore(): FilesViewModel {
  const store = inject<StoreApi<FilesViewModel>>(FilesStore);
  return useStore(store);
}
