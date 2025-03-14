/* eslint-disable @typescript-eslint/no-explicit-any */
export type State = {
  [key: string]: any;
};

/**
 * Compare two (2) states to see if specific fields are different.
 * For example,
 *  This could be used to compare RSM state and Route QueryParams.
 *  Changes to QueryParams should trigger updates to the RSM state.
 * @return  null if SAME, or updated values if DIFFERENT
 */
export function compareState<T>(updated: State, current: State, keys: string[]): T | null {
  const hasChanged = keys.reduce<boolean>((result, key) => {
    const modified = updated[key] !== current[key];
    const cleared = !updated[key] && !!current[key];

    return result || modified || cleared;
  }, false);

  // Debugging
  // if (hasChanged) {
  //   Object.keys(updated).forEach((key) => {
  //     if (updated[key] !== current[key]) {
  //       console.log(`${key} changed %c${updated[key]} => ${updated[key]}`, 'color: green');
  //     }
  //   });
  // }

  return hasChanged ? ({ ...current, ...updated } as T) : null;
}
