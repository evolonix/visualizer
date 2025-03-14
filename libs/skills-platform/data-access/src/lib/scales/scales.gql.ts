import { Localization, LocalizedScale, LocalizedScaleLevel, Nullable } from '../_core';
import { Language, PublishDetails, PublishValidation, markAsShallow, markListAsShallow } from './scales.model';

export interface PublishResponse {
  details: PublishDetails;
  validation: PublishValidation;
}

export interface GqlCheckPublishableResponse {
  response: { details: PublishDetails };
  validation: PublishValidation;
}

/**
 * GraphQL Playground: http://localhost:8032/graphql
 *
 * Docker Powershell Commands
 * - Start-SPDockerEnvironment (-ForceRecreate -Build)
 * - Restore-SPDevEnvironment -RebuildAPIDockerImages
 * - New-SPJsonWebToken -ExternalOrgId 735 -UserId 1196679 -ServiceEnvironment dgscu-default
 *
 */

export interface GqlScaleListData {
  allScales: {
    scales: {
      scale: LocalizedScale;
    }[];
  };
}

const localizationsFragment = `
  localizations: localizedStrings {
    languageCode: languageCodeString
    name
    description
    dateCreated
  }
`;

const levelsFragment = `
  levels: ratingSourceLevels {
    id: ratingSourceLevelId
    value: ratingLevelValue
    valueString: ratingLevelValueString
    ${localizationsFragment}
  }
`;

const localizationsFragmentForUpsert = (localizations: Localization[]) => `
  localizedStrings: [${localizations
    .map(
      ({ languageCode, name, description }) => `{
      languageCode: "${languageCode}"
      name: "${escape(name)}"
      description: "${escape(description)}"
    }
  `
    )
    .join(' ')}]
`;

const levelsFragmentForUpsert = (levels: LocalizedScaleLevel[]) => `
  ratingSourceLevels: [${levels
    .map(
      ({ id, value, localizations }) => `{
      ${id ? `ratingSourceLevelId: "${id}"` : ''}
      ratingLevelValue: ${value}
      ${localizationsFragmentForUpsert(localizations)}
    }
  `
    )
    .join(' ')}]
`;

const publishValidationMappingsFragment = `
  mappings {
    primaryScaleId
    primaryScaleName
    missingScaleId
    missingScaleName
    missingLevelId
    missingLevelName
  }
`;

// Escape backslashes and double quotes for graphql
const escape = (value?: string) => value?.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n').replace(/\r/g, '\\r');

export const API = {
  SCALE: {
    // Load all of scales (may including level details)
    loadAll: (includeLevels = false) =>
      [
        `
          query {
            allScales: allRatingSources (order: [{ dateCreated: ASC }]) {
              scales: edges {
                scale: node {
                  id: ratingSourceId
                  isPrimary
                  wasPublishedAsPrimary
                  totalLevelCount
                  ${localizationsFragment}
                  ${includeLevels ? levelsFragment : ''}
                }
              }
            }
          }
        `,
        (data?: GqlScaleListData): Nullable<LocalizedScale[]> => {
          const list =
            data?.allScales.scales.map(({ scale }) => ({
              ...scale,
              levels: includeLevels ? scale.levels : [],
            })) || null;

          return markListAsShallow(list, !includeLevels);
        },
      ] as const,
    // Load full scale information (includes all levels)
    loadById: (scaleId: string, includeLevels = false) =>
      [
        `
          query {
            scale: ratingSourceById (ratingSourceId: "${scaleId}") {
              id: ratingSourceId
              isPrimary
              wasPublishedAsPrimary
              totalLevelCount
              ${localizationsFragment}
              ${includeLevels ? levelsFragment : ''}
            }
          }
        `,
        (data?: { scale: LocalizedScale }): Nullable<LocalizedScale> => {
          const scale = data?.scale ? { ...data.scale, levels: includeLevels ? data.scale.levels : [] } : null;

          return markAsShallow(scale, !includeLevels);
        },
      ] as const,
    // Upsert functionality to insert or update a scale
    save: ({ id, localizations, levels }: LocalizedScale) =>
      [
        ` 
          mutation {
            scale: upsertRatingSourceWithLevels (
              ratingSource: {
                ratingSourceId: ${id ? `"${id}"` : 'null'},
                ${localizationsFragmentForUpsert(localizations)}
                ${levelsFragmentForUpsert(levels)}
              }
            ) {
              id: ratingSourceId
              isPrimary
              wasPublishedAsPrimary
              totalLevelCount
              ${localizationsFragment}
              ${levelsFragment}
            }
          }
        `,
        (data?: { scale: LocalizedScale }): Nullable<LocalizedScale> => {
          const scale = data?.scale || null;

          return markAsShallow(scale, false);
        },
      ] as const,
    delete: (id: string) =>
      [
        `
          mutation {
            scale: deleteRatingSource (ratingSourceId: "${id}") {
              id: ratingSourceId
            }
          }
        `,
        (data?: { scale: { id: string | undefined } }): Nullable<string> => {
          return data?.scale.id || null;
        },
      ] as const,
    loadPrimary: () =>
      [
        `
          query {
            scale: primaryRatingSource {
              id: ratingSourceId
              isPrimary
              wasPublishedAsPrimary
              totalLevelCount
              ${localizationsFragment}
              ${levelsFragment}
            }
          }
        `,
        (data?: { scale: LocalizedScale }): Nullable<LocalizedScale> => {
          return data?.scale || null;
        },
      ] as const,

    setAsPrimary: (id: string) =>
      [
        `
          mutation {
            scale: updatePrimaryRatingSource (ratingSourceId: "${id}") {
              id: ratingSourceId
            }
          }
        `,
        (data?: { scale: { id: string | undefined } }): Nullable<string> => {
          return data?.scale.id || null;
        },
      ] as const,

    checkPublishable: () =>
      [
        `
          query {
            response: publishedRatingSource {
              details: version {
                publishedDate
              }
            }
            validation: publishRatingSourceState {
              hasErrors
              hasWarnings
              errors {
                ${publishValidationMappingsFragment}
              }
              warnings {
                ${publishValidationMappingsFragment}
              }
            }
          }
        `,
        (data?: GqlCheckPublishableResponse): Nullable<PublishResponse> => {
          return data
            ? {
                details: data.response.details,
                validation: data.validation,
              }
            : null;
        },
      ] as const,

    publish: (languageCode = 'en') =>
      [
        `
          mutation {
            response: publishRatingSource(languageCode: "${languageCode}")
            {
              details: version {
                version
                publishedDate
                scaleId: ratingSourceId
              }
              validation: validationDetails {
                hasErrors
                hasWarnings
                errors {
                  ${publishValidationMappingsFragment}
                }
                warnings {
                  ${publishValidationMappingsFragment}
                }
              }
            }
          }
        `,
        (data?: { response: PublishResponse }): Nullable<PublishResponse> => {
          return data?.response || null;
        },
      ] as const,
  },
  LANGUAGE: {
    loadAllSupportedLanguages: () =>
      [
        `
        query {
          allSupportedLanguages {
            languageCode: code
            name
          }
        }
        `,
        (data: { allSupportedLanguages: Language[] }): Language[] => {
          return data.allSupportedLanguages;
        },
      ] as const,
  },
};
