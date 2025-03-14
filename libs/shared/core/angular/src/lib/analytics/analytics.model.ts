/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ActionReport {
  action: string;
  properties?: Record<string, any>;
}

export interface TrackingContext {
  library: { name: string };
  timezone: number;
  locale: string;
  userAgent: string;
  page: {
    path: string;
    params: any;
    referrer: string | undefined;
    search: string;
    title: string;
    url: string;
  };
}

export interface TrackingDetails {
  userId?: number;
  context?: TrackingContext;
  receivedAt?: Date | undefined;
  sentAt?: Date;
}

export interface TrackingEventData {
  eventName: string;
  properties: Record<string, any>;
  context?: TrackingContext;
  userId?: string | number;
}

export interface TrackingEventsParams {
  userId: string | number | undefined;
  eventsData: TrackingEventData[];
  context?: TrackingContext;
}
