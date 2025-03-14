import { StoreApi } from 'zustand';

// *****************************************************
// Computed State Helpers
// *****************************************************

type SetStateHandler<T> = (state: T) => T | Partial<T>;
type SetStateInternal<T> = {
  _(
    partial:
      | T
      | Partial<T>
      | {
          _(state: T): T | Partial<T>;
        }['_'],
    replace?: false
  ): void;
  _(
    state:
      | T
      | {
          _(state: T): T;
        }['_'],
    replace: true
  ): void;
}['_'];

export type SetState<T> = (partial: SetStateHandler<T>, replace?: false) => void;
export type ComputedState<T> = (state: Partial<T>) => Partial<T>;

/**
 * This is not middleware, but a utility function to create a store
 * with computed properties.
 */
export function computeWith<T extends object>(buildComputed: ComputedState<T>, store: StoreApi<T>): SetState<T> {
  const originalSet = store.setState;

  // Set state updates & updated computed fields
  const setWithComputed: SetState<T> = (update: SetStateHandler<T>) => {
    const handler: SetStateHandler<T> = (state: T): T | Partial<T> => {
      const updated = typeof update === 'object' ? update : update(state);
      const computedState = buildComputed({ ...state, ...updated });

      return { ...updated, ...computedState };
    };

    originalSet(handler, false);
  };

  /**
   * create the store with the `set()` method tail-hooked to compute properties
   */
  store.setState = setWithComputed as SetStateInternal<T>; // for external-to-store use

  return setWithComputed;
}
