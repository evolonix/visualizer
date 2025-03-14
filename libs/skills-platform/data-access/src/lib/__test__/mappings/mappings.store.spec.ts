import { EmitEvent, EventBus } from '@degreed/rsm';
import { Subject } from 'rxjs';
import { mockSourceMapping } from './../_mock';

import {
  MappingsAPI,
  MappingsDataService,
  MappingsViewModel,
  buildMappingsStore,
  initSourceState,
  updateMappingToLevelIdsFromMappedToLevels,
} from '../../mappings';

describe('Mappings Store', () => {
  let eventBus: EventBus;
  let dataService: DataserviceAPI;
  let store: ReturnType<typeof buildMappingsStore>;
  const api = () => store.getState().api as MappingsAPI;
  const vm = () => store.getState() as MappingsViewModel;

  beforeEach(() => {
    eventBus = EventBusMock();
    dataService = MappingsDataServiceMock();
    store = buildMappingsStore(dataService as unknown as MappingsDataService, eventBus);

    console.error = () => void 0; // Silence zustand requestStatus error logging
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with default state', () => {
    const vm: MappingsViewModel = store.getState();
    expect(vm).toEqual(expect.objectContaining(initSourceState()));
  });

  describe('MappingsAPI', () => {
    describe('loadSource()', () => {
      it('should load Source mappings', async () => {
        dataService.loadMappings.mockResolvedValueOnce([mockSourceMapping, []]);

        await api().loadSource('1', 'en', 0);

        const { sources, selected, errors } = vm();

        expect(sources.length).toBe(1);
        expect(selected?.id).toBe(mockSourceMapping.id);
        expect(errors.length).toBe(0);
      });
      it('should handles errors', async () => {
        dataService.loadMappings.mockResolvedValueOnce([null, [{ message: 'Network Error' }]]);
        await api().loadSource('source1', 'en', 0);
        expect(vm().errors).toEqual(['Network Error']);
      });
    });
    describe('saveSource()', () => {
      test('should updates state on success', async () => {
        const transformed = updateMappingToLevelIdsFromMappedToLevels(mockSourceMapping);
        dataService.saveMappings.mockResolvedValueOnce([transformed, null]);
        expect(vm().sources.length).toBe(0);

        await api().saveSource(mockSourceMapping);

        expect(dataService.saveMappings).toHaveBeenCalledWith(transformed);
        expect(vm().sources.length).toBe(1);
        expect(vm().sources[0].id).toBe(transformed.id);
      });
      test('saveSource updates errors on failure', async () => {
        dataService.saveMappings.mockResolvedValueOnce([null, [{ message: 'Save Error' }]]);

        await api().saveSource(mockSourceMapping);
        expect(vm().errors).toEqual(['Save Error']);
      });
    });

    describe('selectSource()', () => {
      it('should select a source', async () => {
        expect(vm().selected).toBeNull();

        await api().selectSource(mockSourceMapping);
        expect(vm().selectedId).toBe(mockSourceMapping.id);
      });
    });
  });
});

// *****************************************************
// Factorys and Types for Spec Setup
// *****************************************************

// Mock EventBus
const EventBusMock = () =>
  ({
    cache: {},
    options: {},

    on: jest.fn(),
    onMany: jest.fn(),
    reset: jest.fn(),

    announce: jest.fn(),
    observableFor: jest.fn(),
    captureEvents: jest.fn(),
    listenForDestroy: jest.fn(),

    emitter: Subject<EmitEvent<unknown>>,
    destroy$: Subject<EmitEvent<unknown>>,
  }) as unknown as EventBus;

type DataserviceAPI = { loadMappings: jest.Mock; saveMappings: jest.Mock };
const MappingsDataServiceMock = () => ({ loadMappings: jest.fn(), saveMappings: jest.fn() });
