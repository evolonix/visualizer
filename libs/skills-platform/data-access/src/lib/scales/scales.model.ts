import { NamedEntity } from '@degreed/rsm';
import { Nullable } from '../_core';

export interface Language {
  id: string;
  languageCode: string;
  name: string;
}

export interface ComputedLocalizationProperties {
  languageCode?: string;
  dateCreated?: Date;
}

export interface ScaleLevel extends NamedEntity, ComputedLocalizationProperties {
  description?: string;
  value: number;
  valueString?: string;
}

export interface Scale extends NamedEntity, ComputedLocalizationProperties {
  description?: string;
  isPrimary?: boolean;
  wasPublishedAsPrimary?: boolean;
  totalLevelCount?: number;
  levels: ScaleLevel[];
  isShallowLoaded?: boolean; // Client-side only
}

export type LanguageRegistry = Record<string, Scale>; // key: languageCode
// const localizations: LanguageRegistry;
export type ScaleRegistry = Record<string, LanguageRegistry>; // key: scaleId
// const registry: ScaleRegistry;

export const markListAsShallow = <T>(list: Nullable<T[]>, isShallow: boolean): Nullable<T[]> =>
  list ? list.map((target: T): T => ({ ...target, isShallowLoaded: isShallow })) : null;

export const markAsShallow = <T>(target: Nullable<T>, isShallow: boolean): Nullable<T> =>
  target ? { ...target, isShallowLoaded: isShallow } : null;

/* -------------- */
/* Publish models */
/* -------------- */

export interface PublishMappingsError {
  primaryScaleId: string;
  primaryScaleName: string;
  missingScaleId: string;
  missingScaleName: string;
  missingLevelId: string;
  missingLevelName: string;
}

export interface PublishError {
  subtitle: string;
  errors: string[];
}

export interface PublishDetails {
  version: number;
  publishedDate: Date;
  scaleId: string;
}

export interface PublishValidation {
  hasErrors: boolean;
  hasWarnings: boolean;
  errors: { mappings: PublishMappingsError[] };
  warnings: { mappings: PublishMappingsError[] };
}
