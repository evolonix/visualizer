import { useEffect, useState } from 'react';

export type KeyboardEventModifierKey = { ctrlKey: boolean } | { metaKey: boolean };

const ACTION_KEY_DEFAULT = ['Ctrl ', 'Control', { ctrlKey: true }] as const;
const ACTION_KEY_APPLE = ['⌘', 'Command', { metaKey: true }] as const;

/**
 * Get the action key for the current platform.
 * @returns Either Ctrl or ⌘ depending on the platform.
 */
export function useActionKey() {
  const [actionKey, setActionKey] = useState<typeof ACTION_KEY_DEFAULT | typeof ACTION_KEY_APPLE>(ACTION_KEY_DEFAULT);

  useEffect(() => {
    const isApple = /(Mac|iPhone|iPod|iPad)/i.test(navigator.userAgent);
    const hasNavigator = typeof navigator !== 'undefined';
    setActionKey(hasNavigator && isApple ? ACTION_KEY_APPLE : ACTION_KEY_DEFAULT);
  }, []);

  return actionKey;
}
