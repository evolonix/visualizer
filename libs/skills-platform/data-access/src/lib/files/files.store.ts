/* eslint-disable @typescript-eslint/no-explicit-any */

import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { StoreApi, createStore } from 'zustand/vanilla';

import { StoreState, computeWith, getErrorMessages, getIsInitializing, getIsLoading, getIsReady, trackStatusWith } from '@degreed/rsm';

import { RestErrors } from '../_core/rest';
import { LanguageRegistry } from '../scales';
import { FilesDataService } from './files.data-service';
import { FilesAPI, FilesViewModel, initFilesState } from './files.state';

// *************************************************
// Zustand Store Factory
// *************************************************

/**
 * Create an instance of the Zustand store engine
 */
export function buildFilesStore(service: FilesDataService): StoreApi<FilesViewModel> {
  // Calculate our computed properties
  const buildComputedFn = (partial: Partial<FilesViewModel>): FilesViewModel => {
    const state = partial as StoreState;

    const isReady = getIsReady(state);
    const isLoading = getIsLoading(state);
    const showSkeleton = getIsInitializing(state) || state.forceSkeleton;
    const errors = getErrorMessages(state);

    return { ...state, isLoading, isReady, showSkeleton, errors } as FilesViewModel;
  };

  /**
   * Factory to create a Zustand Reactive Files Store; which emits a FilesViewModel
   */
  const configureStore = (set: (data: any) => any, get: () => StoreState, store: StoreApi<FilesViewModel>): FilesViewModel => {
    set = computeWith<FilesViewModel>(buildComputedFn, store);

    const data: StoreState = initFilesState();
    const computed = buildComputedFn(data);

    const trackStatus = trackStatusWith(get, set);
    const api: FilesAPI = {
      downloadTemplate: async (): Promise<string> => {
        let template = '';

        await trackStatus(async () => {
          const [content, restErrors] = await service.downloadTemplate();
          const errors = restErrors?.map((it) => it.errorMessage) || [];
          template = content || '';

          return { errors } as Partial<StoreState>;
        });

        return template;
      },
      validateLevels: async (data: FormData, localizations: LanguageRegistry): Promise<[LanguageRegistry, RestErrors]> => {
        let response: LanguageRegistry = localizations || {};
        let fileErrors: RestErrors = [];

        await trackStatus(async () => {
          const [validated, restErrors] = await service.validateLevels(data, localizations);
          response = validated || {};
          const errors = restErrors?.map((it) => it.errorMessage) || [];

          fileErrors = restErrors || [];
          return { errors } as Partial<StoreState>;
        });

        return [response, fileErrors];
      },
      exportLevels: async (scaleId: string): Promise<string> => {
        let data = '';

        await trackStatus(async () => {
          const [content, errors] = await service.exportLevels(scaleId);
          data = content || '';

          return { errors: errors?.map((it) => it.errorMessage) } as Partial<StoreState>;
        });

        return data;
      },
    };

    // Initial Store view model
    return {
      ...data,
      ...api,
      ...computed,
    };
  };

  /**
   * Enable the ReactiveStore for Redux DevTools, and persistence to localStorage,
   * and ensure the ViewModel is immutable using Immer
   */
  const store = createStore<FilesViewModel>()(
    // prettier-ignore
    devtools(
        immer(
          configureStore
        ), 
        { name: 'files' }
      )
  );

  return store;
}
