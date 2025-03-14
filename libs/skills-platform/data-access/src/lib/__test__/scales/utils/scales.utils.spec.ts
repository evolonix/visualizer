import { LanguageRegistry, Scale, shouldDiscardScale, validateScaleForLanguage } from '../../../scales';

describe('shouldDiscardScale', () => {
  // Mock data for testing
  const mockScale: Scale = {
    id: '1',
    name: 'Scale Name',
    description: 'Scale Description',
    totalLevelCount: 2,
    levels: [
      { id: '1', name: 'Level 1', value: 1 },
      { id: '2', name: 'Level 2', value: 2 },
    ],
  };

  const mockDefaultScale: Scale = {
    id: '2',
    name: 'Default Scale Name',
    description: 'Default Scale Description',
    levels: [
      { id: '1', name: '', value: 1 },
      { id: '2', name: '', value: 2 },
    ],
  };

  const initialLocalizations: LanguageRegistry = {
    en: mockScale,
  };

  it('should discard the scale when it has default level values and the language code did not initially exist', () => {
    const languageCode = 'fr'; // French

    const result = shouldDiscardScale(mockDefaultScale, languageCode, initialLocalizations);
    expect(result).toBe(true);
  });

  it('should not discard the scale when the language code initially existed', () => {
    const languageCode = 'en'; // English

    const result = shouldDiscardScale(mockScale, languageCode, initialLocalizations);
    expect(result).toBe(false);
  });

  it('should not discard the scale when it has non-default level values', () => {
    const languageCode = 'fr'; // French

    const result = shouldDiscardScale(mockScale, languageCode, initialLocalizations);
    expect(result).toBe(false);
  });
});

describe('validateScaleForLanguage', () => {
  // Mock data for testing
  const mockScale: Scale = {
    id: '1',
    name: 'Scale Name',
    description: 'Scale Description',
    totalLevelCount: 2,
    levels: [
      { id: '1', name: 'Level 1', value: 1 },
      { id: '2', name: 'Level 2', value: 2 },
    ],
  };

  const localizations: LanguageRegistry = {
    en: mockScale,
  };

  it('should add a new language with empty levels when it does not exist in the localizations', () => {
    const languageCode = 'fr'; // French

    const result = validateScaleForLanguage(localizations, languageCode);
    expect(result).toHaveProperty(languageCode);
    expect(result[languageCode].name).toBe(localizations.en.name);
    expect(result[languageCode].description).toBe(localizations.en.description);
    expect(result[languageCode].levels).toHaveLength(0);
  });

  it('should use the default language values if scale title or description is not set', () => {
    const languageCode = 'fr'; // French
    const scaleWithMissingValues: Scale = {
      id: '2',
      name: '',
      description: '',
      levels: [],
    };
    const localizationsWithMissingValues: LanguageRegistry = {
      ...localizations,
      [languageCode]: scaleWithMissingValues,
    };

    const result = validateScaleForLanguage(localizationsWithMissingValues, languageCode);
    expect(result).toHaveProperty(languageCode);
    expect(result[languageCode].name).toBe(localizations.en.name);
    expect(result[languageCode].description).toBe(localizations.en.description);
  });

  it('should not modify scales when language exists and title/description are set', () => {
    const languageCode = 'en'; // English

    const result = validateScaleForLanguage(localizations, languageCode);
    expect(result).toEqual(localizations);
  });
});
