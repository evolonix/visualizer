/* eslint-disable @typescript-eslint/no-explicit-any */

import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { StoreApi, createStore } from 'zustand/vanilla';

import { EventBus, computeWith, replaceRecord, upsertRecord } from '@degreed/rsm';

import { trackStatusWith, waitFor } from '@degreed/rsm';
import { DataserviceResults } from '../_core/graphql';

import { scaleChanged, scaleDeleted, scaleSelected } from './scale.events';
import { ScalesDataService } from './scales.data-service';
import { Language, LanguageRegistry, PublishDetails, PublishError, PublishValidation, Scale, ScaleRegistry } from './scales.model';
import { ScaleAPI, ScalesState, ScalesViewModel, initState } from './scales.state';
import { syncStoreFromUrl } from './scales.url-sync';
import { asPublishErrors, sleepFor, validateScaleForLanguages } from './utils/scales.utils';

type Nullable<T> = T | null;

// *************************************************
// Zustand Store Factory
// *************************************************

const findPrimary = (registry: ScaleRegistry): Nullable<LanguageRegistry> => {
  const found = Object.entries(registry).find(
    ([id, localizations]) => Object.values(localizations).find((scale) => scale.isPrimary)?.id === id
  );

  return found ? found[1] : null;
};

/**
 * These ACTIONS enable waitFor() to look up existing, async request (if any)
 */
const ACTIONS = {
  prefetch: () => 'scales-store:prefetch-before',
  loadAll: () => 'scales-store:loadAll',
  loadAllLanguages: () => 'scales-store:loadAllLanguages',
  findById: (id: string) => `scales-store:findById:${id}`,
};

/**
 * Create an instance of the Zustand store engine
 */
export function buildScalesStore(service: ScalesDataService, eventbus?: EventBus): StoreApi<ScalesViewModel> {
  // Calculate our computed properties
  const buildComputedFn = (partial: Partial<ScalesViewModel>): ScalesViewModel => {
    const state = partial as ScalesState;

    const selected = state.registry[state.selectedId] || null;
    const primary = findPrimary(state.registry);

    return { ...state, selected, primary } as ScalesViewModel;
  };

  /**
   * Factory to create a Zustand Reactive ScaleStore; which emits a ScaleViewModel
   */
  const configureStore = (set: (data: any) => any, get: () => ScalesState, store: StoreApi<ScalesViewModel>): ScalesViewModel => {
    set = computeWith<ScalesViewModel>(buildComputedFn, store);

    const deletedIds: string[] = [];
    const data: ScalesState = initState();
    const computed = buildComputedFn(data);

    const trackStatus = trackStatusWith(get, set);

    // Broadcast events via EventBus
    const announceDeletion = (id: string) => eventbus?.announce(scaleDeleted(id));
    const announceChange = (localizations: LanguageRegistry | null) => {
      if (localizations) {
        const id = localizations['en']?.id;
        eventbus?.announce(scaleChanged(id));
      }
      return localizations;
    };
    const announceSelected = (id: string) => eventbus?.announce(scaleSelected(id));
    const silentPrefetch = () =>
      waitFor(ACTIONS.prefetch(), async () => {
        const { registry, showSkeleton } = get();
        const hasScales = Object.keys(registry).length > 0;

        if (!hasScales && showSkeleton) {
          const registry = service.loadAllScales(false);
          const allLanguages = await service.loadAllSupportedLanguages();

          // Update state WITHOUT changing status...
          set({ allLanguages, registry });
        }
      });

    const api: ScaleAPI = {
      /**
       * Scale CRUD
       */
      loadAllScales: async (includeLevels = false, delayWith = 300): Promise<ScaleRegistry> => {
        const { registry } = get();
        const buildLoadRequest = async (registry: ScaleRegistry) => {
          const forceSkeleton = Object.keys(registry).length === 0;

          return trackStatus(async () => {
            const [registry, gqlErrors] = await service.loadAllScales(includeLevels);
            const errors = gqlErrors?.map((it) => it.message) || [];
            const allSupportedLanguages = await api.loadAllSupportedLanguages();

            // Introduce a delay for the skeletons to display a minimum amount of time
            await sleepFor(delayWith);

            return { allSupportedLanguages, registry: registry || [], errors } as Partial<ScalesState>;
          }, forceSkeleton);
        };

        await waitFor(ACTIONS.loadAll(), () => buildLoadRequest(registry));
        return get().registry;
      },
      /**
       * Since navigation allows direct-to-edit starts, we 1st make
       * sure we have the summary list loaded...
       * then we try to load a "full" scale (with levels and mappings)
       *
       * Note: api.loadAllScales() is NOT `service.loadAllScales()`
       *       we do not merge the full scale into the summary list we replace it!
       */
      loadScaleById: async (id?: string, refresh = false, delayWith = 150): Promise<Nullable<LanguageRegistry>> => {
        if (!id) return null;
        if (deletedIds.includes(id)) return null; // Don't try to reload a deleted scale

        await silentPrefetch();

        let { registry: list, allSupportedLanguages } = get();
        let scale = list[id];
        const shouldReload = refresh || !scale;

        if (shouldReload) {
          await trackStatus(async () => {
            const [localizations, gqlErrors] = await service.loadScaleById(id, true);
            const errors = gqlErrors?.map((it) => it.message) || [];
            allSupportedLanguages = await api.loadAllSupportedLanguages();

            if (Object.keys(list).length < 1) {
              const [refreshed] = await service.loadAllScales(true);
              list = refreshed || {};
            }
            const registry = replaceRecord(list, localizations);

            // Introduce a delay for the skeletons to display a minimum amount of time
            await sleepFor(delayWith);

            return { registry, errors, allSupportedLanguages } as Partial<ScalesState>;
          }, true);
          scale = get().registry[id];
        }

        return scale;
      },
      saveScale: async (localizations: LanguageRegistry, autoSelect = false): Promise<Nullable<LanguageRegistry>> => {
        let id = localizations['en']?.id;
        localizations = validateScaleForLanguages(localizations);

        await trackStatus(async () => {
          const [saved, gqlErrors] = await service.saveScale(localizations);
          const errors = gqlErrors?.map((it) => it.message) || [];

          const registry = upsertRecord(get().registry, saved);

          if (autoSelect && saved) {
            // We need to wait until the store updates with the results from #L126
            api.selectScale(saved['en'].id);
          }

          id = saved ? saved['en']?.id : ''; // Useful for new scales
          return { registry, errors } as Partial<ScalesState>;
        });

        return api.loadScaleById(id).then(announceChange);
      },
      deleteScale: async (localizations: LanguageRegistry | null): Promise<boolean> => {
        if (!localizations) return false;

        const id = localizations['en'].id;

        await trackStatus(async () => {
          const { registry: list } = get();
          const [deleted, gqlErrors] = await service.deleteScale(id);
          const errors = gqlErrors?.map((it) => it.message) || [];

          let registry: ScaleRegistry = {};

          if (deleted) {
            for (const key in list) {
              if (key !== id) {
                registry[key] = list[key];
              }
            }

            // Broadcast deletion
            announceDeletion(id);

            // Track the deleted id so we don't try to reload it
            deletedIds.push(id);
          } else {
            registry = list;
          }

          return { registry, errors, selectedId: '' } as Partial<ScalesState>;
        });

        return true;
      },
      selectPrimaryScale: async (shouldAnnounceChange = false): Promise<Nullable<LanguageRegistry>> => {
        const state = get();
        const { isLoading } = state;
        let { registry } = state;
        let primary = findPrimary(registry);

        if (!primary && !isLoading) {
          registry = await api.loadAllScales(true, 0);
          primary = findPrimary(registry);
        }
        if (shouldAnnounceChange) {
          announceChange(primary);
        }

        return primary;
      },
      selectScale: async (id: string | undefined): Promise<boolean> => {
        if (!id) return false;

        const selectIfLoaded = (): boolean => {
          const isLoaded = !!get().registry[id];
          if (get().selectedId !== id) {
            announceSelected(id);
            set({ selectedId: id || '' });
          }
          return isLoaded;
        };

        return !selectIfLoaded();
      },
      markScaleAsPrimary: async (scale: Nullable<Scale>): Promise<Nullable<Scale>> => {
        if (!scale) return null;

        let { registry } = get();

        await trackStatus(async () => {
          const [primaryScaleId, gqlErrors] = await service.setAsPrimaryScale(scale.id);
          const errors = gqlErrors?.map((it) => it.message) || [];

          if (primaryScaleId) {
            // Update the primary flag on all scales
            registry = Object.entries(registry).reduce((acc, [id, value]) => {
              const localizations = Object.entries(value).reduce((a, [languageCode, v]) => {
                a[languageCode] = { ...v, isPrimary: v.id === primaryScaleId };

                return a;
              }, {} as LanguageRegistry);

              acc[id] = { ...localizations };

              return acc;
            }, {} as ScaleRegistry);
          }

          return { registry, errors } as Partial<ScalesState>;
        });

        announceChange(registry[scale.id]);

        return findPrimary(registry)?.['en'] || null;
      },
      // This calls the data service directly, and does not use the store, so we don't need to track status
      checkPublishable: async (): Promise<[Nullable<PublishDetails>, Nullable<PublishValidation>, PublishError[], PublishError[]]> => {
        const [response] = await service.checkPublishable();

        const { details, validation } = response || {};

        const errors = validation?.hasErrors ? asPublishErrors(validation?.errors.mappings) : [];
        const warnings = validation?.hasWarnings ? asPublishErrors(validation?.warnings.mappings) : [];

        return [details || null, validation || null, errors, warnings];
      },
      // This calls the data service directly, and does not use the store, so we don't need to track status
      publish: async (
        languageCode = 'en'
      ): Promise<[Nullable<PublishDetails>, Nullable<PublishValidation>, PublishError[], PublishError[]]> => {
        const [response] = await service.publish(languageCode);

        const { details, validation } = response || {};

        const errors = validation?.hasErrors ? asPublishErrors(validation?.errors.mappings) : [];
        const warnings = validation?.hasWarnings ? asPublishErrors(validation?.warnings.mappings) : [];

        // Wait to allow the "publishing" indicator to show for a bit...
        await sleepFor(450);

        return [details || null, validation || null, errors, warnings];
      },

      /**
       *  Load supported Languages for Scales
       *  (1) this does NOT auto update the store state!
       *  (2) this does NOT load again if already loaded; unless `force` is true
       *
       *   NOTE: Because languages is used by Scales and Mapping stores we need to ensure
       *         we loading 1x and only 1x.  This is why we use a shared Promise variable to track
       */
      loadAllSupportedLanguages: async (force = false): Promise<Language[]> => {
        if (!force && get().allSupportedLanguages.length) return get().allSupportedLanguages;

        const response = await waitFor(ACTIONS.loadAllLanguages(), () => service.loadAllSupportedLanguages());

        const [allSupportedLanguages] = response as DataserviceResults<Language[]>;
        return allSupportedLanguages || [];
      },
    };

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
  const store = createStore<ScalesViewModel>()(
    // prettier-ignore
    devtools(
        immer(
          configureStore
        ), 
        { name: 'scales' }
      )
  );

  return syncStoreFromUrl(store);
}
