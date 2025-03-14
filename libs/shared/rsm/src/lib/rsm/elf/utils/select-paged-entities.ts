import { StateOf, select } from '@ngneat/elf';
import { DefaultEntitiesRef, EntitiesRef, EntitiesState, getEntityType, selectMany } from '@ngneat/elf-entities';
import { withPagination } from '@ngneat/elf-pagination';
import { Observable, OperatorFunction } from 'rxjs';
import { switchMap } from 'rxjs/operators';

export function selectPage<S extends StateOf<typeof withPagination>>(page?: number): OperatorFunction<S, S['pagination']['currentPage']> {
  return select((state) => page || state.pagination.currentPage);
}

export function selectPageEntities<
  S extends StateOf<typeof withPagination> & EntitiesState<DefaultEntitiesRef>,
  Ref extends EntitiesRef = DefaultEntitiesRef,
>(page?: number): OperatorFunction<S, Array<getEntityType<S, Ref>>> {
  return function (source: Observable<S>) {
    return source.pipe(selectPage(page)).pipe(
      switchMap((page) => {
        return source.pipe(select((state) => state.pagination.pages[page])).pipe(switchMap((ids) => source.pipe(selectMany(ids ?? []))));
      })
    );
  };
}
