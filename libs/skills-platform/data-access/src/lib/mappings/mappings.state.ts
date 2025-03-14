import { InjectionToken } from '@degreed/core-react';

import { StoreState, initStoreState } from '@degreed/rsm';
import { StoreApi } from 'zustand';
import { Nullable } from '../_core';
import { SourceMapping } from './mappings.model';

// *****************************************************
// Reactive Store Interfaces
// *****************************************************

/**
 * Use this token for DI since the actual ScalesStore is a function (not a class)
 * and the resulting instance is a `StoreAPI<ScalesViewModel>` object
 */
export const MappingsStoreToken = new InjectionToken('Skaas Mappings Store');
export type MappingsStore = StoreApi<MappingsViewModel>;
/**
 * This state is serializable
 */
export interface MappingsState extends StoreState {
  sources: SourceMapping[];
  selectedId?: string;
}

/**
 * Read-only values computed from existing/updated state
 */
export interface MappingsComputedState {
  errors: string[];
  selected: Nullable<SourceMapping>;
}

/**
 * This is a simple API meant for use within the
 * UI layer html templates
 */
export interface MappingsAPI {
  // Mappings CRUD
  loadSource: (sourceId?: string, lang?: string, delayWith?: number) => Promise<Nullable<SourceMapping>>;
  saveSource: (source: SourceMapping) => Promise<Nullable<SourceMapping>>;
  selectSource: (source: SourceMapping, lang?: string) => Promise<Nullable<SourceMapping>>;
  autoMapSource: (source: SourceMapping, lang?: string) => Promise<SourceMapping>;
}

export type MappingsViewModel = MappingsState & MappingsComputedState & { api: MappingsAPI };

// *****************************************************
// Reactive Store Functions
// *****************************************************

/**
 * State initializer function
 */
export function initSourceState(): MappingsState {
  return {
    ...initStoreState(),
    sources: [],
    selectedId: '',
  };
}

/**
 * ScaleStore State Selector
 * @param id
 * @returns Scale | null
 */
export type SelectMappingsResults = [Nullable<SourceMapping>, MappingsViewModel];

/**
 * Select fully-loaded Scale by id
 *
 * @param id
 * @returns null if only summary information has been
 */
export const selectSourceById =
  (id?: string) =>
  (vm: MappingsViewModel): SelectMappingsResults => {
    const { sources } = vm;
    const findInList = (id: string) => sources.find((it) => it.id === id) ?? null;
    const source: Nullable<SourceMapping> = id ? findInList(id) : (vm.selected ?? null); // Do NOT make a new blank source

    return [source, vm];
  };
