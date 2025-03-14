import { EmitEvent } from '@degreed/rsm';

export const SCALE_EVENTS = {
  ScaleChanged: '[Eventbus] scaleChanged',
  ScaleDeleted: '[Eventbus] scaleDeleted',
  ScaleSelected: '[Eventbus] scaleSelected',
};

export function scaleChanged(data: string): EmitEvent<string> {
  return { type: SCALE_EVENTS.ScaleChanged, data };
}

export function scaleDeleted(data: string): EmitEvent<string> {
  return { type: SCALE_EVENTS.ScaleDeleted, data };
}

export function scaleSelected(data: string): EmitEvent<string> {
  return { type: SCALE_EVENTS.ScaleChanged, data };
}
