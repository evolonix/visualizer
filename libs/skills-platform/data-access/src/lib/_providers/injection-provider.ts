import { DependencyInjector, makeInjector } from '@degreed/core-react';
import { EventBus } from '@degreed/rsm';
import {
  buildFilesStore,
  buildMappingsStore,
  buildNxBootstrap,
  buildPublishScalesStore,
  buildScalesStore,
  FilesDataService,
  FilesStore,
  MappingsDataService,
  MappingsStoreToken,
  NxBootstrapToken,
  ScalesDataService,
  ScalesPublishStore,
  ScalesStore,
} from '../../index';
import { SkillsDataService, SkillsFacade, SkillsStore } from '../skills';
import { SkillsUrlSync } from '../skills/skills.url-sync';

/**
 * Dependency injector with registered Degreed Skills Data Access services
 */
export const buildInjector = (): DependencyInjector => {
  return makeInjector([
    { provide: EventBus, useFactory: () => new EventBus({ delayNotify: 10 }) },
    { provide: NxBootstrapToken, useValue: buildNxBootstrap() },

    /**
     * Providers for Scales, Mappings, and Files (uses Zustand RSM)
     */
    { provide: FilesDataService, useClass: FilesDataService, deps: [NxBootstrapToken] },
    { provide: FilesStore, useFactory: buildFilesStore, deps: [FilesDataService] },

    { provide: MappingsDataService, useClass: MappingsDataService, deps: [NxBootstrapToken] },
    { provide: MappingsStoreToken, useFactory: buildMappingsStore, deps: [MappingsDataService, EventBus] },

    { provide: ScalesDataService, useClass: ScalesDataService, deps: [NxBootstrapToken] },
    { provide: ScalesStore, useFactory: buildScalesStore, deps: [ScalesDataService, EventBus] },
    { provide: ScalesPublishStore, useFactory: buildPublishScalesStore, deps: [ScalesStore, EventBus] },

    /**
     * Providers for Skills Catalog (uses Elf RSM)
     */
    { provide: SkillsDataService, useClass: SkillsDataService, deps: [NxBootstrapToken] },
    { provide: SkillsStore, useClass: SkillsStore },
    { provide: SkillsFacade, useClass: SkillsFacade, deps: [SkillsStore, SkillsDataService] },
    { provide: SkillsUrlSync, useClass: SkillsUrlSync, deps: [SkillsFacade] },
  ]);
};
