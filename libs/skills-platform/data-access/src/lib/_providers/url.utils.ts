/**
 * When normalizing url segments:
 * - Trim whitespace
 * - Remove empty segments
 *
 * - Keep leading slashes on first segment (if provided)
 * - Keep trailing slashes on last segment (if provided)
 * - Keep first or last segments that are slashes-only
 *
 * - Join segments with a single slash
 */
const trimEach = (value: string) => value.trim();
const hasValue = (value: string) => !!value;
const hasMany = (source: string[]) => source.length > 1;

const isFirst = (index: number) => index === 0;
const isLast = (index: number, source: string[]) => index === source.length - 1;

const normalizeFirst = (value: string, index: number, source: string[]) =>
  isFirst(index) && hasMany(source) ? value.replace(/\/$|^\/$/, '') : value;

const normalizeMiddle = (value: string, index: number, source: string[]) =>
  !isFirst(index) && !isLast(index, source) ? value.replace(/^\/|\/$/g, '') : value;

const normalizeLast = (value: string, index: number, source: string[]) =>
  isLast(index, source) && hasMany(source) ? value.replace(/^\/|^\/$/, '') : value;

// ****************************************************************
// Public API
// ****************************************************************

/**
 * join()
 * Concatenate url segments together, ensuring single slashes between each segment
 */
export function join(...segments: string[]): string {
  // prettier-ignore
  return segments
    .map(trimEach)
    .filter(hasValue)
    .map(normalizeFirst)
    .map(normalizeMiddle)
    .map(normalizeLast)
    .join('/');
}
