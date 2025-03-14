// *****************************************************
// Entity Helpers
// *****************************************************

import { Entity } from './entity';

export function upsertEntity<T extends Entity>(list: T[], item: T | null, idProp: keyof T = 'id'): T[] {
  if (!item) return list;

  const mergeExisting = (i: T, idx: number) => (idx === index ? { ...i, ...item } : i);
  const index = list.findIndex((i) => i[idProp] === item[idProp]);

  return index === -1 ? [...list, item] : list.map(mergeExisting);
}

export function replaceEntity<T extends Entity>(list: T[], item: T | null, id: keyof T = 'id'): T[] {
  if (!item) return list;

  const index = list.findIndex((i) => i[id] === item[id]);
  const replaceExisting = (it: T) => (it[id] === item[id] ? item : it);

  return index === -1 ? [...list, item] : list.map(replaceExisting);
}

export function upsertRecord<T extends Entity>(
  list: Record<string, Record<string, T>>,
  item: Record<string, T> | null
): Record<string, Record<string, T>> {
  const id = item?.['en']?.id;

  if (item && id) {
    const found = list[id as string];
    const updated = Object.entries(item).reduce((acc, [k, v]) => {
      return { ...acc, [k]: { ...v, ...item[k] } };
    }, found);

    return { ...list, [id]: updated };
  }

  return list;
}

export function replaceRecord<T extends Entity>(
  list: Record<string, Record<string, T>>,
  item: Record<string, T> | null
): Record<string, Record<string, T>> {
  const id = item?.['en']?.id;

  if (item && id) {
    return { ...list, [id]: item };
  }

  return list;
}
