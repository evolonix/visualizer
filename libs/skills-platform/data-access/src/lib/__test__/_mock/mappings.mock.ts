import { NxSkillsPlatformBootstrap } from '../../_providers';
import { MappedToLevel, SourceLevel, SourceLevelWithMappings, SourceMapping, SourceMappingWithLevelMappings } from '../../mappings';

const mockSourceLevel: SourceLevel[] = [
  {
    id: '2',
    name: 'Source Level 2',
    value: 2,
  },
  {
    id: '1',
    name: 'Source Level 1',
    value: 1,
  },
  {
    id: '3',
    name: 'Source Level 3',
    value: 11,
  },
];

const mockMappedToLevel: MappedToLevel[] = [
  {
    id: '1',
    name: 'Mapped To Level 1',
    value: 1,
    levelIds: ['3'],
  },
  {
    id: '2',
    name: 'Mapped To Level 2',
    value: 4,
    levelIds: ['1'],
  },
];

const mockSourceLevelWithMappings: SourceLevelWithMappings = {
  id: '3',
  name: 'Source Level 2 With Mappings 3',
  value: 3,
  mappingToLevelIds: ['2'],
  autoSuggestedMappingToLevelIds: ['1'],
};

const mockSourceMappingWithLevelMappings: SourceMappingWithLevelMappings[] = [
  {
    id: '1',
    name: 'Source Mapping With Level Mappings 1',
    levels: [mockSourceLevelWithMappings],
    mappedToLevels: mockMappedToLevel,
    isAutoSuggested: true,
  },
  {
    id: '2',
    name: 'Source Mapping With Level Mappings 2',
    levels: [mockSourceLevelWithMappings],
    mappedToLevels: mockMappedToLevel,
    isAutoSuggested: false,
  },
];

export const mockSourceMapping: SourceMapping = {
  id: '5',
  name: 'Source Mapping 5',
  isPrimary: true,
  levels: mockSourceLevel,
  mappings: mockSourceMappingWithLevelMappings,
};

export const nxSkillsPlatformBootstrapObj: NxSkillsPlatformBootstrap = {
  lang: '',
  organizationId: 0,
  authToken: '',
  rootUrl: '',
  xsrfToken: '',
  xsrfTokenVNext: '',
  cdnUrl: '',
  endpoint: '',
  baseHref: '',
  appFolder: '',
  hasChannel: false,
  hasSkillAnalytics: false,
  analyticsEndpoint: '',
  userProfileKey: 0,
  orgsToManage: [],
  assetUrl: () => '',
};
