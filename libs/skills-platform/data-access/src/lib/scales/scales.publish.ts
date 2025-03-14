/* eslint-disable @typescript-eslint/no-explicit-any */

import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { StoreApi, createStore } from 'zustand/vanilla';

import { InjectionToken } from '@degreed/core-react';
import { EventBus } from '@degreed/rsm';

import { PublishDetails, PublishError, PublishValidation, SCALE_EVENTS, ScalesViewModel } from '.';
import { Nullable } from '../_core';
import { MAPPINGS_EVENTS as MAPPING_EVENTS } from '../mappings';

// ******************************************************
// Interfaces & Types
// ******************************************************

export interface PublishState {
  isLoading: boolean;
  isPublishing: boolean;
  validation: Nullable<PublishValidation>;

  errors: PublishError[];
  warnings: PublishError[];

  showSuccessToast: boolean;
  showErrorToast: boolean;

  lastPublished?: Date;
  lastChecked?: Date;
}

export interface PublishApi {
  publish: (validateOnly?: boolean) => Promise<void>;
  validateCanPublish: () => Promise<void>;
  closeToast: () => void;
}

export type PublishViewModel = PublishState & PublishApi;

type PublishPayload = [Nullable<PublishDetails>, Nullable<PublishValidation>, PublishError[], PublishError[]];

// ******************************************************
// DI Token
// ******************************************************

/**
 * Use this token for DI since the actual ScalesPublishStore is a function (not a class)
 * and the resulting instance is a `StoreAPI<PublishViewModel>` object
 */
export const ScalesPublishStore = new InjectionToken('Skaas Scale-Publish Store');

// ******************************************************
// State
// ******************************************************

const initState = () => ({
  validation: null,
  errors: [],
  warnings: [],

  isLoading: true,
  isPublishing: false,

  showSuccessToast: false,
  showErrorToast: false,

  lastPublished: undefined,
  lastChecked: undefined,
});

const EMPTY_PAYLOAD = [null, null, [], []] as PublishPayload;

// ******************************************************
// Store
// ******************************************************

/**
 * Create an instance of the Zustand store engine
 */
export function buildPublishScalesStore(scaleStore: StoreApi<ScalesViewModel>, eventbus: EventBus): StoreApi<PublishViewModel> {
  /**
   * Factory to create a Zustand Reactive ScaleStore; which emits a ScaleViewModel
   */
  const configureStore = (set: (data: any) => any, get: () => PublishState, store: StoreApi<PublishViewModel>): PublishViewModel => {
    const updatePublishState = (results: PublishPayload, checkOnly: boolean) => {
      set((draft: PublishState) => {
        const [details, validation, errors, warnings] = results;
        draft.validation = validation;
        draft.errors = errors;
        draft.warnings = warnings;

        if (errors.length) {
          if (!checkOnly) {
            draft.showErrorToast = true;
          }
        } else {
          draft.lastPublished = details?.publishedDate;
          if (!checkOnly) {
            draft.showSuccessToast = true;
          }
        }

        draft.isPublishing = false;
        draft.isLoading = false;
      });
    };
    const publish = async (validateOnly = false) => {
      try {
        set({ isLoading: true, isPublishing: !validateOnly, lastChecked: new Date() });

        const api = scaleStore.getState().api;
        const results = validateOnly ? await api.checkPublishable() : await api.publish();

        updatePublishState(results, validateOnly);
      } catch (e) {
        updatePublishState(EMPTY_PAYLOAD, validateOnly);
      }
    };
    // Conditionally validate only if stale (not already validated)
    const validateCanPublish = async () => {
      if (!get().lastChecked) {
        api.publish(true);
      }
    };
    const closeToast = () => set({ showSuccessToast: false, showErrorToast: false });
    const markValidationAsStale = () => set({ lastChecked: undefined });

    // Ready to build initial store state; note API always remains the same
    const data: PublishState = initState();
    const api: PublishApi = { publish, validateCanPublish, closeToast };

    // When a Scale changes (new, modified, deleted) or Mappings change
    // we need to recheck validation by
    // marking as stale to validate later on-demand.
    eventbus?.onMany({
      [SCALE_EVENTS.ScaleChanged]: markValidationAsStale,
      [SCALE_EVENTS.ScaleDeleted]: markValidationAsStale,
      [MAPPING_EVENTS.MappingChanged]: markValidationAsStale,
    });

    // Initial Store view model
    return {
      ...data,
      ...api,
    };
  };

  /**
   * Enable the ReactiveStore for Redux DevTools, and persistence to localStorage,
   * and ensure the ViewModel is immutable using Immer
   */
  const store = createStore<PublishViewModel>()(
    // prettier-ignore
    devtools(
        immer(
          configureStore
        ), 
        { name: 'scales-publish' }
      )
  );

  return store;
}
