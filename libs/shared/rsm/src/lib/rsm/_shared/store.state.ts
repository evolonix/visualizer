// ****************************************************
// Store State
// ****************************************************

type Errors = { errors?: string[] };

/**
 * Selector to quickly determine isLoading state
 */
export type StoreState = {
  requestStatus: StatusState;
  errors?: string[];

  // these are computed values based on request status
  isReady: boolean; // state == 'success'
  isLoading?: boolean; // if busy
  showSkeleton?: boolean; // if not initialized
  forceSkeleton?: boolean; // force simulate 'not initialized'
};

export function initStoreState(): StoreState {
  return {
    requestStatus: { value: 'initializing' },
    isLoading: false,
    showSkeleton: true,
    forceSkeleton: false,
    isReady: false,
  };
}

// ****************************************************
// Status State
// ****************************************************

export declare type StatusState = SuccessState | ErrorState | PendingState | InitializingState;
export interface SuccessState {
  value: 'success';
}
export interface PendingState {
  value: 'pending';
}
export interface InitializingState {
  value: 'initializing';
}
export interface ErrorState {
  value: 'error';
  errors: string[];
}

export interface ComputedStatus {
  requestStatus: StatusState;
  isLoading: boolean;
  showSkeleton: boolean;
  isReady: boolean;
  errors: string[];
}

// ****************************************************
// Status Map Functions
// ****************************************************

/**
 * With 'ready' async action:
 *  -  update loading status
 *  -  trigger async action
 *  -  update with action data AND updated status
 */
export function trackStatusWith<T extends StoreState>(get: () => T, set: (state: unknown) => T) {
  return async (action: () => Promise<Partial<T> & Errors>, forceSkeleton = false) => {
    // Track isLoading state
    set(updateRequestStatus('pending', undefined, forceSkeleton));

    // Trigger async action
    const updates = await action();
    const requestStatus = resolveStatus(!updates.errors ? 'success' : 'error', updates.errors);

    // Update with action data AND updated status
    set((state: T) => ({
      ...state,
      ...updates,
      ...computeStatusFlags(requestStatus),
      forceSkeleton: false,
    }));

    return updates;
  };
}

export const getRequestStatus = (state: StoreState) => {
  return state.requestStatus;
};

export const getErrorMessages = (state: { requestStatus: StatusState }): string[] => {
  return (state.requestStatus as unknown as ErrorState).errors || [];
};

export const getIsInitializing = (s: StoreState) => getRequestStatus(s).value === 'initializing';
export const getIsLoading = (s: StoreState) => getRequestStatus(s).value === 'pending';
export const getIsReady = (s: StoreState) => getRequestStatus(s).value === 'success';
export const getIsError = (s: StoreState) => getRequestStatus(s).value === 'error';

export function updateRequestStatus<T extends StoreState>(
  flag: 'pending' | 'success' | 'initializing' | 'error',
  updates?: Partial<T> & Errors,
  forceSkeleton = false
) {
  return (state: T): T => {
    const requestStatus = resolveStatus(flag, updates?.errors);

    return {
      ...state,
      ...computeStatusFlags(requestStatus),
      forceSkeleton,
    };
  };
}

function computeStatusFlags(requestStatus: StatusState): ComputedStatus {
  return {
    requestStatus,
    isLoading: requestStatus.value === 'pending',
    showSkeleton: requestStatus.value === 'initializing',
    isReady: requestStatus.value === 'success',
    errors: getErrorMessages({ requestStatus }),
  };
}

// ****************************************************
// Internal Status Utils
// ****************************************************

function resolveStatus(flag: StatusState['value'], errors?: string[]) {
  const newStatus = {
    value: flag,
  } as StatusState;

  if (!Array.isArray(errors)) errors = errors ? [errors] : [];
  if (flag === 'error') {
    newStatus.value = 'error';
    (newStatus as unknown as ErrorState).errors = errors || [];

    // Debugging
    if (errors?.length) console.error(errors);
  }

  return newStatus;
}
