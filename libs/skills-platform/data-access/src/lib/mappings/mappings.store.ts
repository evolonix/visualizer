/* eslint-disable @typescript-eslint/no-explicit-any */

import { EventBus, upsertEntity } from '@degreed/rsm';

import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { createStore } from 'zustand/vanilla';

import { computeWith } from '@degreed/rsm';

import { trackStatusWith } from '@degreed/rsm';

import produce from 'immer';
import { SCALE_EVENTS, sleep } from '../scales';
import { alphabetically } from '../utils';
import { MappingsDataService } from './mappings.data-service';
import { mappingChanged } from './mappings.events';
import { SourceMapping } from './mappings.model';
import { MappingsAPI, MappingsState, MappingsStore, MappingsViewModel, initSourceState } from './mappings.state';
import { autoSuggestMappings, computeMappedToLevelsForSelected, updateMappingToLevelIdsFromMappedToLevels } from './mappings.utils';

type Nullable<T> = T | null;

// *************************************************
// Zustand Store Factory
// *************************************************

const findById = (id: string, list: SourceMapping[]) => list?.find((scale: SourceMapping) => scale.id === id) || null;
const sortPrimaryFirst = (a: SourceMapping, b: SourceMapping) => (a.isPrimary ? -1 : b.isPrimary ? 1 : 0);

/**
 * Create an instance of the Zustand store engine
 */
export function buildMappingsStore(service: MappingsDataService, eventbus?: EventBus): MappingsStore {
  // Calculate our computed properties
  const buildComputedFn = (partial: Partial<MappingsViewModel>): MappingsViewModel => {
    const state = partial as MappingsState;
    let sources = [...state.sources].sort(alphabetically).sort(sortPrimaryFirst); // Sort alphabetically, then primary 1st
    let selected = findById(state.selectedId || '', sources); // only 1 selected at a time

    if (selected) {
      selected = computeMappedToLevelsForSelected(selected);
      sources = upsertEntity(sources, selected);
    }

    return { ...state, sources, selected } as MappingsViewModel;
  };

  /**
   * Factory to create a Zustand Reactive ScaleStore; which emits a ScaleViewModel
   */
  const configureStore = (set: (data: any) => any, get: () => MappingsState, store: MappingsStore): MappingsViewModel => {
    set = computeWith<MappingsViewModel>(buildComputedFn, store);

    const data: MappingsState = initSourceState();
    const computed = buildComputedFn(data);

    const trackStatus = trackStatusWith(get, set);

    // Broadcast events via EventBus
    const announceChange = (mapping: SourceMapping | null) => {
      if (mapping) {
        eventbus?.announce(mappingChanged(mapping.id));
      }
      return mapping;
    };

    const api: MappingsAPI = {
      /**
       * SourceMapping CRUD
       */
      loadSource: async (sourceId?: string, lang = 'en', delayWith = 300): Promise<Nullable<SourceMapping>> => {
        const forceSkeleton = get().sources.length === 0;
        const notFound = () => `SourceMapping not found for primary or for id: ${sourceId}`;
        await trackStatus(async () => {
          // Introduce a delay for the skeletons to display a minimum amount of time
          const [source, gqlErrors] = await service.loadMappings(sourceId, lang);
          const errors = gqlErrors?.map((it) => it.message) || [];
          if (delayWith > 0) await sleep(delayWith);

          // Add to list and auto-select
          return !source
            ? ({ errors: errors || [notFound()], selectedId: '' } as Partial<MappingsState>)
            : ({ sources: upsertEntity(get().sources, source), selectedId: source.id, errors: [] } as Partial<MappingsState>);
        }, forceSkeleton);

        return buildComputedFn(get()).selected;
      },
      saveSource: async (source: SourceMapping): Promise<Nullable<SourceMapping>> => {
        let result = null;
        await trackStatus(async () => {
          // Update the mapping to level ids from the mapped to levels
          // Server expects the mappingToLevelIds
          source = updateMappingToLevelIdsFromMappedToLevels(source);
          const [saved, gqlErrors] = await service.saveMappings(source);
          const errors = gqlErrors?.map((it) => it.message) || [];
          const sources = upsertEntity(get().sources, saved);

          result = saved;
          return { sources, errors: errors || [] };
        });

        announceChange(result);
        return result;
      },
      selectSource: async (source: SourceMapping): Promise<Nullable<SourceMapping>> => {
        if (get().selectedId !== source?.id) {
          set({ selectedId: source?.id || '' });
        }

        return source;
      },
      autoMapSource: async (source: SourceMapping): Promise<SourceMapping> => {
        // This is called from the editor. The user must call the Save button to persist to the server.
        const updated = autoSuggestMappings(source);
        const src = computeMappedToLevelsForSelected(updated);
        console.log('autoMapSource', get().sources);
        return src;
      },
    };

    const reloadSource = (id?: string) => {
      const sourceId = id ?? get().selectedId ?? '';
      api.loadSource(sourceId);
    };

    // When a Scale changes (new, modified, deleted) we need to refresh the mappings.
    eventbus?.onMany({
      [SCALE_EVENTS.ScaleChanged]: reloadSource,
      [SCALE_EVENTS.ScaleDeleted]: (scaleId: string) => {
        const vm = get();
        const sources = produce(vm.sources, (draft: SourceMapping[]) => {
          const selected = draft.find((source) => source.id === vm.selectedId);
          if (selected) {
            // remove scale from 'mappings' list
            selected.mappings = selected.mappings.filter((mapping) => mapping.id !== scaleId);
          }
        });

        set({ sources });
      },
    });

    // Initial Store view model
    return {
      ...data,
      ...computed,
      api,
    };
  };

  /**
   * Enable the ReactiveStore for Redux DevTools, and persistence to localStorage,
   * and ensure the ViewModel is immutable using Immer
   */
  const store = createStore<MappingsViewModel>()(
    // prettier-ignore
    devtools(
        immer(
          configureStore
        ), 
        { name: 'mappings' }
      )
  );

  return store;
}
