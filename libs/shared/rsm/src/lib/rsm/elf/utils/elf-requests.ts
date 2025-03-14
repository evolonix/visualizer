/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Store } from '@ngneat/elf';
import { defer, MonoTypeOperatorFunction, Observable, pipe } from 'rxjs';
import { distinctUntilChanged, map, tap } from 'rxjs/operators';

import { Entity, getIsInitializing, getIsLoading, getIsReady, getRequestStatus, StoreState, updateRequestStatus } from '../../_shared/';

// ****************************************************
// Status Map Functions
// ****************************************************

export function trackRequestStatus<S extends StoreState, T extends Entity>(
  store: Store,
  options?: { mapError?: (error: any) => any }
): MonoTypeOperatorFunction<T> {
  return function (source: Observable<T>) {
    return defer(() => {
      if (store.query(getRequestStatus).value !== 'initializing') {
        store.update(updateRequestStatus('pending'));
      }

      return source.pipe(
        tap({
          error(error) {
            store.update(updateRequestStatus('error', options?.mapError ? options?.mapError(error) : error));
          },
        })
      );
    });
  };
}

// ****************************************************
// Custom RxJS MonoTypeOperatorFunction(s)
//
// NOTE: we ignore the `_` argument because Elf stores request status by storeName, we emulate the API
//       but we store the status in the store itself
// ****************************************************

export function selectRequestStatus() {
  return pipe(map(getRequestStatus));
}

export function selectLoadingStatus() {
  return pipe(map(getIsLoading), distinctUntilChanged());
}

export function selectInitializingStatus() {
  return pipe(map(getIsInitializing), distinctUntilChanged());
}

export function selectReadyStatus() {
  return pipe(map(getIsReady), distinctUntilChanged());
}

// ****************************************************
