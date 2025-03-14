import { useCallback, useState } from 'react';

type StorageType = number | string | boolean;

/**
 * Get cached value by 'key' and return setter function
 */
export function useLocalStorage<T = StorageType>(
  key: string,
  initialValue?: unknown
): [T, (value: T | ((val: unknown) => T), announceChange?: boolean) => void] {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window !== 'undefined') {
      try {
        // Get and parse value from local storage by key
        const item = window.localStorage.getItem(key);
        return item ? JSON.parse(item) : initialValue;
      } catch (error) {
        console.log(error);
      }
    }
    return initialValue;
  });

  const setValue = useCallback(
    (value: T | ((val: unknown) => T), announceChange = true) => {
      try {
        const isFunction = value instanceof Function; // Allow value to be a function so we have same API as useState
        const valueToStore = isFunction ? value(storedValue) : value;
        const isObj = typeof valueToStore === 'object';

        if (announceChange) setStoredValue(valueToStore);

        if (typeof window !== 'undefined') {
          localStorage.setItem(key, isObj ? JSON.stringify(valueToStore) : String(valueToStore));
        }
      } catch (error) {
        console.log(error);
      }
    },
    [key, storedValue, setStoredValue]
  );
  return [storedValue, setValue];
}
