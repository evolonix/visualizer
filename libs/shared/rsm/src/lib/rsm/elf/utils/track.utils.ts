/* eslint-disable @typescript-eslint/no-explicit-any */
import { Store } from '@ngneat/elf';
import { getRequestStatus, updateRequestStatus } from '../../_shared';

const _requests = new Map<string, Promise<unknown>>();

export type TrackRequest<T> = (makeRequest: () => Promise<T>, options?: { mapError?: (error: any) => any }) => Promise<T>;

/**
 * Partial application to allow users to create a request-tracking function
 * for a specific store.
 *
 * The request-tracking is used for async/await functions; not observables.
 * This function will ignore subsequent makeRequest() calls while the first one is still pending.
 * All calls to trackRequest - while the internal request is pending - will recieve
 * the same response/error.
 *
 */
export const makeTrackRequest = <T>(key: string, store: Store): TrackRequest<T> => {
  key = `${store.name}::${key}`;

  // Update the store status to 'pending' and cache the request promise
  const saveAsPending = (request: Promise<T>) => {
    if (store) {
      if (store.query(getRequestStatus).value !== 'initializing') {
        store.update(updateRequestStatus('pending'));
      }
    }
    _requests.set(key, request);
  };
  // Create the promise-based request, cache it, and trap errors and completion
  const trackRequest = (makeRequest: () => Promise<T>, options?: { mapError?: (error: any) => any }) => {
    const convertError = (error: unknown) => (options?.mapError ? options?.mapError(error) : error);
    const clearCache = () => {
      _requests.delete(key);
    };
    const trackError = (error: unknown) => {
      if (store) store.update(updateRequestStatus('error', convertError(error)));
      throw error;
    };

    if (!_requests.has(key)) {
      const request = makeRequest().catch(trackError);
      saveAsPending(request);

      // Ensure the cache is cleared when the request is complete
      request.finally(clearCache);
    }

    return _requests.get(key);
  };

  return trackRequest as TrackRequest<T>;
};
