import { TrackRequest, makeTrackRequest } from './utils/track.utils';
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint prefer-spread: "off" */
import { freeze, produce } from 'immer';
import { EMPTY, MonoTypeOperatorFunction, Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { Store, createStore, emitOnce, withProps } from '@ngneat/elf';
import {
  deleteAllEntities,
  deleteEntities,
  getActiveIds,
  getAllEntities,
  getEntity,
  resetActiveIds,
  selectAllEntities,
  setActiveIds,
  upsertEntities,
  withActiveIds,
  withEntities,
} from '@ngneat/elf-entities';

import { Entity, StatusState, getRequestStatus, updateRequestStatus } from '../_shared';
import { ElfStoreState, StoreSelector, initElfStoreState } from './store.model';
import { selectInitializingStatus, selectLoadingStatus, selectReadyStatus, trackRequestStatus } from './utils/elf-requests';

/**
 *
 * Reactive Store without pagination
 * Supports single entity collection, selections, and status tracking
 */
export class ReactiveStore<T extends ElfStoreState, K extends Entity> {
  protected _store: Store = {} as Store;

  readonly state$: Observable<T> = EMPTY;
  readonly entities$: Observable<K[]> = EMPTY;
  readonly status$: Observable<StatusState> = EMPTY;
  readonly isLoading$: Observable<boolean> = EMPTY; // pending activity
  readonly isReady$: Observable<boolean> = EMPTY; // initial loads and full refreshes
  readonly showSkeleton$: Observable<boolean> = EMPTY; // store never 'loaded', show idle!

  get selectedIDs(): string[] {
    return this._store.query(getActiveIds);
  }

  get selectedItems(): K[] {
    return this._store.query(getActiveIds).map((id) => this._store.query(getEntity(id)));
  }

  get snapshot(): T {
    return this._store.getValue();
  }

  /**
   * Store constructor
   * @param storeName
   * @param initState
   */
  constructor(
    protected storeName: string,
    protected initState: () => Partial<T>
  ) {
    /**
     * Create store and streams for  status$ and state$
     * Note: state$ includes computed properties and pagination
     */
    this._store = createStore(
      { name: storeName }, // store name
      withProps<T>({ ...initState(), ...initElfStoreState<T>() }), // Store State
      withEntities<K>(), // entity collection for Items
      withActiveIds() // support selections of 0...n entity items
    );

    this.state$ = this._store.asObservable();

    this.entities$ = this._store.pipe(selectAllEntities());
    this.status$ = this._store.pipe(map(getRequestStatus));
    this.isReady$ = this._store.pipe(selectReadyStatus(), startWith(false));
    this.isLoading$ = this._store.pipe(selectLoadingStatus(), startWith(false));
    this.showSkeleton$ = this._store.pipe(selectInitializingStatus(), startWith(true));
  }

  /**********************************************
   * Store Methods
   **********************************************/

  /**
   * Update state and auto-freeze properties
   *
   * Note: Instead of using spread operators i.e. - store.update(state => ({...state})),
   *       we can guarantee immutability using ImmerJS `produce()`
   *       @see https://ngneat.github.io/elf/docs/immer
   */
  public update(fn: (state: T) => T | void, items?: K[], reset = false) {
    emitOnce(() => {
      if (reset === true) this.reset();

      if (items) this.upsertItems(items);

      this._store.update(produce(fn)); // enforce immutability
      this._store.update(updateRequestStatus('success')); // Always update status to 'success' after update
    });
  }

  /**
   * Delete records from the store
   *
   */
  public deleteEntities(options: { entityIds?: string[]; deleteAll?: boolean }) {
    if (options.deleteAll) this._store.update(deleteAllEntities());
    else this._store.update(deleteEntities(options.entityIds));
  }

  /**
   * Add page of items WITHOUT changing active page or pagination information
   */
  public upsertItems(items: K[], reset = false) {
    emitOnce(() => {
      if (reset === true) this.reset();
      // prettier-ignore
      this._store.update(
        upsertEntities(freeze(items)), 
        updateRequestStatus('success')
      );
    });
  }

  /**
   * Query support for snapshots of current internal store state...
   * synchronously extract state value using selector
   */
  public useQuery<T>(selector: StoreSelector<T>): T {
    return this._store.query<T>(selector);
  }

  /**
   * Is the specified item in memory (regardless of page location)
   * NOTE: 'id' may be the full ID or a partial GUID (from URL)
   */
  public findItemByID<T extends Entity>(id: string): T | undefined {
    if (!id) return undefined;

    const findByPartialID = () => {
      const allEntities = this.useQuery<Entity[]>(getAllEntities());
      const usePartialIDMatch = ((it: T): boolean => it.id.startsWith(id)) as any;

      return allEntities.find(usePartialIDMatch);
    };
    return this.useQuery(getEntity(id)) || findByPartialID();
  }

  /**
   * Enable store to be reset with custom state
   * NOTE: the custom state will normally be called only from tests
   */
  public reset(initCustomState = (): T => ({}) as T) {
    this._store.update(
      resetActiveIds(),
      deleteAllEntities(),
      (s: T) => ({
        ...s,
        ...this.initState(),
        ...initCustomState(),
        ...initElfStoreState(),
      }),
      updateRequestStatus('initializing')
    );
  }

  public showSkeleton(visible = true) {
    this.updateStatus(visible ? 'initializing' : 'success');
  }

  /**
   * Special handler to track async/await calls and
   * auto-update status/error state
   */
  public makeTrackRequest<T>(methodName: string): TrackRequest<T> {
    const key = `${this._store.name}::${methodName}`;
    return makeTrackRequest(key, this._store);
  }

  /**********************************************
   * Selection Methods
   **********************************************/

  public clearAllSelections(): void {
    this._store.update(resetActiveIds());
  }

  /**
   * Select an item as 'active'
   * Remove any other selections if clearAll === true
   */
  public selectItem(id: string, clearAll = true) {
    if (!id) return;

    const clearActives = clearAll ? resetActiveIds : () => (s: T) => s;
    const actives = clearAll ? [] : this._store.query(getActiveIds);
    const isActive = actives.indexOf(id) < 0;

    if (!isActive || clearAll) {
      this._store.update(clearActives(), setActiveIds([...actives, id]));
    }
  }

  /**********************************************
   * Status Features
   **********************************************/

  /**
   * Create RxJS operator to easily track REST calls
   * Specify a 'mapError' function to transform or log the error
   * NOTE: this is used in the Facade with HTTP service calls
   */
  public trackLoadStatus(mapError?: (error: any) => any): MonoTypeOperatorFunction<any> {
    mapError = mapError || ((error: any) => error);
    return trackRequestStatus(this._store, { mapError });
  }

  /**
   * Easily update the status of the ReactiveStore
   * 'busy'|'succes'|'initializing'|'error' for store activity
   *
   * @see https://ngneat.github.io/elf/docs/features/requests/requests-status/#updaterequestsstatus
   */
  public updateStatus(flag: 'success' | 'initializing' | 'pending' | 'error', error?: any) {
    this._store.update(updateRequestStatus(flag, error)); // eslint-disable prefer-spread
  }

  /**
   * 'busy' | 'success' for store activity
   */
  public setLoading(isLoading = true) {
    this._store.update(updateRequestStatus(isLoading ? 'pending' : 'success'));
  }
}
