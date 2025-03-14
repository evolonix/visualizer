/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { EntitiesState, withEntities } from '@ngneat/elf-entities';
import { Entity, initStoreState, StoreState } from '../_shared';

/**
 * Selector to quickly determine isLoading state
 */
export type ElfStoreState = StoreState & EntitiesState<Entity>;

export type StoreSelector<T> = (s: any) => T;

export const initElfStoreState = <T = ElfStoreState>() => {
  const {
    props: { entities, ids },
  } = withEntities();
  return {
    ...initStoreState(),
    entities,
    ids,
  } as T;
};
