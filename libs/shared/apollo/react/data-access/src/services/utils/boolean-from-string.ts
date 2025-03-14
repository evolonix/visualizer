/** Handles values that might be either a true boolean or a (case-insensitive) string. */
export function booleanFromString(value: boolean | string): boolean {
  // if boolean, return as-is
  if (typeof value === 'boolean') {
    return value;
  }
  return value?.toLowerCase() === 'true';
}
