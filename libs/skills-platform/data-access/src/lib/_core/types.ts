import { Entity } from '@degreed/rsm';

export type Nullable<T> = T | null;

export interface Localization {
  languageCode: string;
  name: string;
  description?: string;
  dateCreated: Date;
  dateUpdated?: Date;
}

interface LocalizedEntity extends Entity {
  localizations: Localization[];
}

export interface LocalizedScaleLevel extends LocalizedEntity {
  value: number;
  valueString?: string;
}

export interface LocalizedScale extends LocalizedEntity {
  isPrimary?: boolean;
  wasPublishedAsPrimary?: boolean;
  totalLevelCount?: number;
  levels: LocalizedScaleLevel[];
}
