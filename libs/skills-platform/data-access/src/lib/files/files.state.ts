import { InjectionToken } from '@degreed/core-react';

import { StoreState, initStoreState } from '@degreed/rsm';
import { RestErrors } from '../_core/rest';
import { LanguageRegistry } from '../scales';

// *****************************************************
// Reactive Store Interfaces
// *****************************************************

/**
 * Use this token for DI since the actual ScalesStore is a function (not a class)
 * and the resulting instance is a `StoreAPI<ScalesViewModel>` object
 */
export const FilesStore = new InjectionToken('Skaas Bulk/File Store');

/**
 * Read-only values computed from existing/updated state
 */
export interface FilesComputedState {
  errors: string[];
}

/**
 * This is a simple API meant for use within the
 * UI layer html templates
 */
export interface FilesAPI {
  downloadTemplate: () => Promise<string>;
  validateLevels: (data: FormData, localizations: LanguageRegistry) => Promise<[LanguageRegistry, RestErrors]>;
  exportLevels: (scaleId: string) => Promise<string>;
}

export type FilesViewModel = StoreState & FilesAPI & FilesComputedState;

// *****************************************************
// Reactive Store Functions
// *****************************************************

/**
 * State initializer function
 */
export function initFilesState(): StoreState {
  return {
    ...initStoreState(),
  };
}
