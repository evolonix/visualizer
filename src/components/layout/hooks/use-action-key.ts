import { useEffect, useState } from 'react';

export type KeyboardEventModifierKey = { ctrlKey: boolean } | { metaKey: boolean };

const ACTION_KEY_DEFAULT = ['Ctrl ', 'Control', { ctrlKey: true }];
const ACTION_KEY_APPLE = ['⌘', 'Command', { metaKey: true }];

/**
 * Get the action key for the current platform.
 * @returns Either Ctrl or ⌘ depending on the platform.
 */
export function useActionKey() {
  const [actionKey, setActionKey] = useState<(string | KeyboardEventModifierKey)[]>();

  useEffect(() => {
    if (typeof navigator !== 'undefined') {
      if (/(Mac|iPhone|iPod|iPad)/i.test(navigator.userAgent)) {
        setActionKey(ACTION_KEY_APPLE);
      } else {
        setActionKey(ACTION_KEY_DEFAULT);
      }
    }
  }, []);

  return actionKey;
}
