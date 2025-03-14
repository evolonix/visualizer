import { NamedEntity } from '@degreed/rsm';

export const alphabetically = <T extends NamedEntity>(a: T, b: T) => a.name.localeCompare(b.name);
