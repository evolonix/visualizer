export type KeyboardEventModifierKey =
  | { ctrlKey: boolean }
  | { metaKey: boolean };
export type ActionKey = [string, string, KeyboardEventModifierKey];

const ACTION_KEY_DEFAULT = ['Ctrl ', 'Control', { ctrlKey: true }] as ActionKey;
const ACTION_KEY_APPLE = ['⌘', 'Command', { metaKey: true }] as ActionKey;

/**
 * Get the action key for the current platform.
 * @returns Either Ctrl or ⌘ depending on the platform.
 */
export function useActionKey() {
  let actionKey: ActionKey = ACTION_KEY_DEFAULT;

  if (typeof navigator !== 'undefined') {
    if (/(Mac|iPhone|iPod|iPad)/i.test(navigator.userAgent)) {
      actionKey = ACTION_KEY_APPLE;
    }
  }

  return actionKey;
}
