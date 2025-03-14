import { EmitEvent } from '@degreed/rsm';

export const MAPPINGS_EVENTS = {
  MappingChanged: '[Eventbus] mappingChanged',
};

export function mappingChanged(data: string): EmitEvent<string> {
  return { type: MAPPINGS_EVENTS.MappingChanged, data };
}
