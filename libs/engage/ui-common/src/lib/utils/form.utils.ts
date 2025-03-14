import { FormGroup } from '@angular/forms';
import { isString } from '@ngneat/elf';

/**
 * Extract values of specified fields from a form group. Trimmed values are returned.
 * If a fields is disabled, this will still gather the values of those fields also even if it is not part of the form value
 * @param form ForGroup to extract values from
 * @param fields Fields to extract values from
 * @returns Object with values of specified fields
 */
export function trimFields<T = Record<string, string>>(form: FormGroup, fields: string[]): T {
  return fields.reduce((results, k) => {
    const value: string | number = form.get(k)?.value;
    return { ...results, [k]: isString(value) ? value.trim() : value };
  }, {}) as T;
}
