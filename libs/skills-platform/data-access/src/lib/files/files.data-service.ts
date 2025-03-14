import { LocalizedScale, LocalizedScaleLevel } from '../_core';
import { AsyncResponse, RestDataService, Selector, process } from '../_core/rest';
import { LanguageRegistry, markAsShallow } from '../scales';
import { transformFromLocalizedScale, transformToLocalizedScale } from '../scales/utils/localized.utils';
import { API } from './files.rest';

/**
 * A data layer service that requests files from the bulk rest API
 */
export class FilesDataService extends RestDataService {
  // *********************************************************************
  // File API
  // *********************************************************************

  async downloadTemplate(): AsyncResponse<string> {
    const [config, selectorFn] = API.FILE.downloadTemplate();
    const query = this.buildQuery<string>(config);

    return await process(query, selectorFn as Selector<string>);
  }

  async validateLevels(data: FormData, localizations: LanguageRegistry): AsyncResponse<LanguageRegistry> {
    const id = localizations['en'].id;
    if (id) {
      data.append('ratingSourceId', id);
    }

    const levelCount: number = localizations['en'].totalLevelCount || 0;
    if (levelCount) {
      data.append('levelCount', `${levelCount}`);
    }

    const [gql, selectorFn] = API.FILE.validateLevels(data, levelCount, id);
    const query = this.buildQuery<LocalizedScaleLevel[]>(gql);

    const [localizedLevels, errors] = await process(query, selectorFn as Selector<LocalizedScaleLevel[]>);

    if (!localizedLevels) return [null, errors];

    const localizedScale = markAsShallow(transformToLocalizedScale(localizations), false) as LocalizedScale;

    // Find missing levels based on level.value in current localizedLevels. Value should incremenet by 1.
    const uniqueValues = new Set(localizedLevels.map((level) => level.value));
    const max = localizedScale.totalLevelCount || Math.max(...uniqueValues);
    const missingValues = Array.from({ length: max }, (_, i) => i + 1).filter((value) => !uniqueValues.has(value));

    // Add missing levels to localizedLevels, then sort by value
    const updatedLocalizedLevels = localizedLevels
      .concat(
        missingValues.map((value) => ({
          id: '',
          value,
          localizations: [],
        }))
      )
      .sort((a, b) => a.value - b.value);

    localizedScale.levels = updatedLocalizedLevels;

    const updated = transformFromLocalizedScale(localizedScale);

    return [updated, errors];
  }

  async exportLevels(scaleId: string): AsyncResponse<string> {
    const [config, selectorFn] = API.FILE.exportLevels(scaleId);
    const query = this.buildQuery<string>(config);

    return await process(query, selectorFn as Selector<string>);
  }
}
