import { post } from '../../_core/graphql';
import { MappingsDataService, sortMappings } from '../../mappings';
import { mockSourceMapping, nxSkillsPlatformBootstrapObj } from '../_mock';

jest.mock('../../_core/graphql');

describe('SortMappings', () => {
  it('should sorts levels in ascending value order', () => {
    const errors = null;
    const sortedResults = sortMappings([JSON.parse(JSON.stringify(mockSourceMapping)), errors]);

    expect(sortedResults[0]?.levels).toMatchObject([
      { value: mockSourceMapping.levels[1].value },
      { value: mockSourceMapping.levels[0].value },
      { value: mockSourceMapping.levels[2].value },
    ]);
  });

  it('should throw new Error("Network Error") on failure', () => {
    const errors = [new Error('Network Error')];
    const [, error] = sortMappings([null, errors]);
    expect(error).toEqual(errors);
  });
});

describe('MappingsDataService', () => {
  let mappingsDataService: MappingsDataService;
  beforeEach(() => {
    mappingsDataService = new MappingsDataService(nxSkillsPlatformBootstrapObj);
  });

  describe('loadMappings', () => {
    it('should calls post with correct arguments and sorts results', async () => {
      const sourceID = 'sourceID';
      const lang = 'en';
      const errors = null;

      (post as jest.Mock).mockResolvedValue([mockSourceMapping]);

      const mappings = await mappingsDataService.loadMappings(sourceID, lang);

      const expectedMappings = sortMappings([mockSourceMapping, errors]);
      expect(mappings[0]).toEqual(expectedMappings[0]);
    });

    it('should return error on failure', async () => {
      const sourceID = 'sourceID';
      const lang = 'en';

      (post as jest.Mock).mockResolvedValue([null, new Error('error')]);

      const [, error] = await mappingsDataService.loadMappings(sourceID, lang);

      expect(error).toEqual(new Error('error'));
    });
  });

  describe('saveMappings', () => {
    it('should calls post with correct arguments and sorts results', async () => {
      const errors = null;

      (post as jest.Mock).mockResolvedValue([mockSourceMapping]);

      const mappings = await mappingsDataService.saveMappings(mockSourceMapping);

      const expectedMappings = sortMappings([mockSourceMapping, errors]);
      expect(mappings[0]).toEqual(expectedMappings[0]);
    });
    it('should return error on failure', async () => {
      (post as jest.Mock).mockResolvedValue([null, new Error('error')]);
      const [, error] = await mappingsDataService.saveMappings(mockSourceMapping);
      expect(error).toEqual(new Error('error'));
    });
  });
});
