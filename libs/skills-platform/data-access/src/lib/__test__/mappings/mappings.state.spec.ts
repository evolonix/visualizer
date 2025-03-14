import { MappingsAPI, MappingsState, MappingsViewModel, initSourceState, selectSourceById } from '../../mappings/mappings.state';

import { mockSourceMapping } from '../_mock';

describe('Mappings State', () => {
  let state: MappingsState;
  let api: MappingsAPI;
  let viewModel: MappingsViewModel;

  beforeEach(() => {
    state = initSourceState();
    api = {
      loadSource: jest.fn(),
      saveSource: jest.fn(),
      selectSource: jest.fn(),
      autoMapSource: jest.fn(),
    };
    viewModel = {
      ...state,
      api,
      errors: [],
      selected: null,
    };
  });

  it('should returns default state', () => {
    expect(state.sources).toEqual([]);
    expect(state.selectedId).toBe('');
  });

  describe('selectSourceById', () => {
    beforeEach(() => {
      viewModel = { ...viewModel, sources: [mockSourceMapping] };
    });
    it('should finds existing source by id', () => {
      const [source, vm] = selectSourceById(mockSourceMapping.id)(viewModel);

      expect(source).toEqual(mockSourceMapping);
      expect(vm.api).toMatchObject(api);
      expect(vm.api).not.toHaveProperty('sources'); // API shouldn't expose state directly
      expect(vm).toEqual(viewModel);
    });

    it('should returns null for empty sources', () => {
      viewModel = { ...viewModel, sources: [] };
      const [source, vm] = selectSourceById(mockSourceMapping.id)(viewModel);

      expect(source).toBeNull();
      expect(vm.api).toMatchObject(api);
    });

    it('should returns null for non-existent id', () => {
      const [source, vm] = selectSourceById('unknown')(viewModel);

      expect(source).toBeNull();
      expect(vm).toEqual(viewModel);
    });
  });

  describe('selectSelectedSource', () => {
    it('should select the selected source', () => {
      viewModel = { ...viewModel, selected: mockSourceMapping, sources: [mockSourceMapping] };

      const [selected, vm] = selectSourceById()(viewModel);

      expect(selected).toEqual(mockSourceMapping);
      expect(vm.api).toMatchObject(api);
      expect(vm).toEqual(viewModel);
    });

    it('should returns null if no selection', () => {
      const [selected, vm] = selectSourceById()(viewModel);

      expect(selected).toBeNull();
      expect(vm.api).toMatchObject(api);
      expect(vm).toEqual(viewModel);
    });
  });
});
