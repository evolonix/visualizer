import { LocalizedScaleLevel, Nullable } from '../_core';

export interface RestScaleLevelListData {
  ratingSourceLevels: {
    ratingSourceLevelId: string;
    ratingLevelValue: number;
    ratingLevelValueString?: string;
    localizedStrings: {
      languageCodeString: string;
      name: string;
      description?: string;
      dateCreated: Date;
    }[];
  }[];
}

export const API = {
  FILE: {
    downloadTemplate: () =>
      [
        {
          method: 'GET',
          url: '/api/Bulk/levelTranslationsTemplate',
          headers: {
            Accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          },
          responseType: 'arraybuffer',
        },
        (data: string): Nullable<string> => {
          if (!data) return null;

          return data;
        },
      ] as const,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    validateLevels: (data: FormData, levelCount: number, ratingSourceId?: string) =>
      [
        {
          method: 'POST',
          url: `/api/Bulk/validateLevelTranslations?levelCount=${levelCount}${ratingSourceId ? `&ratingSourceId=${ratingSourceId}` : ''}`,
          data,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
        (data: RestScaleLevelListData): Nullable<LocalizedScaleLevel[]> => {
          if (!data) return null;

          return data.ratingSourceLevels.map(({ ratingSourceLevelId, ratingLevelValue, ratingLevelValueString, localizedStrings }) => ({
            id: ratingSourceLevelId === '00000000-0000-0000-0000-000000000000' ? '' : ratingSourceLevelId,
            value: ratingLevelValue,
            valueString: ratingLevelValueString,
            localizations: localizedStrings.map(({ languageCodeString, name, description, dateCreated }) => ({
              languageCode: languageCodeString,
              name,
              description,
              dateCreated,
            })),
          }));
        },
      ] as const,
    exportLevels: (scaleId: string) =>
      [
        {
          method: 'GET',
          url: `/api/Bulk/levelTranslations?ratingSourceId=${scaleId}`,
          headers: {
            Accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          },
          responseType: 'arraybuffer',
        },
        (data: string): Nullable<string> => {
          if (!data) return null;

          return data;
        },
      ] as const,
  },
};
