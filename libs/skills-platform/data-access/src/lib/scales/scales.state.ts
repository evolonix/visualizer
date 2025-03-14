import { InjectionToken } from '@degreed/core-react';
import { StoreState, initStoreState } from '@degreed/rsm';
import { Nullable } from '../_core';
import { Language, LanguageRegistry, PublishDetails, PublishError, PublishValidation, Scale, ScaleRegistry } from './scales.model';

// *****************************************************
// Reactive Store Interfaces
// *****************************************************

/**
 * Use this token for DI since the actual ScalesStore is a function (not a class)
 * and the resulting instance is a `StoreAPI<ScalesViewModel>` object
 */
export const ScalesStore = new InjectionToken('Skaas Scales Store');

/**
 * This state is serializable
 */
export interface ScalesState extends StoreState {
  registry: ScaleRegistry;

  // Used to track which entity is selected/active
  selectedId: string;
  allSupportedLanguages: Language[];
}

/**
 * Read-only values computed from existing/updated state
 */
export interface ScalesComputedState {
  selected: Nullable<LanguageRegistry>;
  primary: Nullable<LanguageRegistry>;
}

/**
 * This is a simple API meant for use within the
 * UI layer html templates
 */
export interface ScaleAPI {
  // Scales CRUD
  loadAllScales: (includeLevels?: boolean, delayWith?: number) => Promise<ScaleRegistry>;
  loadScaleById: (id?: string, refresh?: boolean, delayWith?: number) => Promise<Nullable<LanguageRegistry>>;
  saveScale: (localizations: LanguageRegistry, autoSelect?: boolean) => Promise<Nullable<LanguageRegistry>>;
  deleteScale: (localizations: LanguageRegistry | null) => Promise<boolean>;
  selectScale: (id: string | undefined) => Promise<boolean>;
  selectPrimaryScale: (shouldAnnounceChange?: boolean) => Promise<Nullable<LanguageRegistry>>;
  markScaleAsPrimary: (scale: Nullable<Scale>) => Promise<Nullable<Scale>>;
  checkPublishable: () => Promise<[Nullable<PublishDetails>, Nullable<PublishValidation>, PublishError[], PublishError[]]>;
  publish: (languageCode?: string) => Promise<[Nullable<PublishDetails>, Nullable<PublishValidation>, PublishError[], PublishError[]]>;
  // Localizations
  loadAllSupportedLanguages: () => Promise<Language[]>;
}

export type ScalesViewModel = ScalesState & { api: ScaleAPI } & ScalesComputedState;

// *****************************************************
// Reactive Store Functions
// *****************************************************

/**
 * State initializer function
 */
export function initState(): ScalesState {
  return {
    ...initStoreState(),
    registry: {},
    selectedId: '',
    allSupportedLanguages: [],
  };
}

export function makeScale(): LanguageRegistry {
  return { en: { id: '', name: '', description: '', totalLevelCount: undefined, isPrimary: false, levels: [], isShallowLoaded: true } };
}

/**
 * ScaleStore State Selector
 * @param id
 * @returns Scale | null
 */
export type SelectScaleResults = [Nullable<LanguageRegistry>, ScaleAPI, ScalesViewModel];

/**
 * Select fully-loaded Scale by id
 *
 * @param id
 * @returns null if only summary information has been
 */
export const selectScaleById =
  (id?: string) =>
  (vm: ScalesViewModel): SelectScaleResults => {
    const { registry, api } = vm;
    const localizations = lookupScale(id, registry);

    return [localizations, api, vm];
  };

export function lookupScale(id: string | undefined, registry: ScaleRegistry) {
  const findInList = (id: string) => registry[id];
  return id && id !== 'new' ? findInList(id) : makeScale();
}

export const selectPrimaryScale = (vm: ScalesViewModel): SelectScaleResults => {
  const { registry, api } = vm;
  const primary =
    Object.values(registry).find((localizations: LanguageRegistry) => Object.values(localizations).find(() => localizations.isPrimary)) ||
    null;

  return [primary, api, vm];
};
