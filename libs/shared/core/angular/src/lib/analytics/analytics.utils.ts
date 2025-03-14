import { TrackingEventsParams } from './analytics.model';

type ContextGroups = Record<string, TrackingEventsParams>;
/**
 * Group batched events by shared context
 */
export function groupByContext(events: TrackingEventsParams[]): TrackingEventsParams[] {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const eventsByContext: Record<string, TrackingEventsParams> = events.reduce((memo: ContextGroups, event: any) => {
    const key = `${event.userId}:${JSON.stringify(event.context)}`;
    const hasGroup = !!memo[key];

    if (!hasGroup) {
      memo[key] = {
        ...event,
        eventsData: [],
      };
    }
    memo[key].eventsData.push(...event.eventsData);

    return memo;
  }, {});

  return Object.values(eventsByContext);
}
