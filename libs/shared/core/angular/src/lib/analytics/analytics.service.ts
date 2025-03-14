/* eslint-disable @typescript-eslint/no-explicit-any */
import { DOCUMENT, Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { Observable, Subject, buffer, catchError, debounceTime, forkJoin, map, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { BOOTSTRAP_SETTINGS, BootstrapSettings } from '../bootstrap.settings';
import { getLocale, getPerformanceTrackingProps, getTimezone, sanitizeSensitiveQuery, searchToParams } from '../browser';

import { ActionReport, TrackingEventData, TrackingEventsParams } from './analytics.model';
import { groupByContext } from './analytics.utils';

@Injectable()
export class AnalyticsService {
  private queue = new Subject<TrackingEventsParams>(); // analytics event queue
  private _analyticsHost: string;
  private _userProfileKey: number;
  private _currentLocation?: URL;

  constructor(
    @Inject(BOOTSTRAP_SETTINGS) private apiSettings: BootstrapSettings,
    @Inject(DOCUMENT) private document: Document,
    private httpClient: HttpClient,
    private router: Router,
    private title: Title,
    private location: Location
  ) {
    this._analyticsHost = this.apiSettings.analyticsEndpoint;
    this._userProfileKey = this.apiSettings.userProfileKey;

    this.queue
      .asObservable()
      .pipe(
        buffer(this.queue.pipe(debounceTime(300))),
        map(groupByContext),
        mergeMap((events) => {
          const all = events.map((it) => this.dispatch(it));
          return forkJoin(all); // emit in parallel
        })
      )
      .subscribe();

    this.watchLocation();
  }

  /**
   * Report SPA actions (activity):
   *
   * Transform action details [to the format expected by the remote analytics service]
   * and submit to async dispatching queue
   */
  public report({ action, properties = {} }: ActionReport): void {
    const localProperties: Record<string, any> = {
      location: 'Engage', // default location, could be overwritten
      platform: 'Web', // default platform, could be overwritten
      ...properties,
    };
    const details = this.getCommonDetails(localProperties);

    this.addToQueue({
      eventName: action,
      properties: localProperties,
      context: details.context,
      userId: this._userProfileKey,
    });
  }

  // ************************************************************************
  // ********* Private methods ************************************
  // ************************************************************************

  /**
   * Send events group by context to the remote analytics service
   */
  private dispatch(trackData: TrackingEventsParams): Observable<unknown> {
    const endpoint = `${this._analyticsHost}/api/analytics/trackbatch`;

    return this.httpClient.post(endpoint, trackData).pipe(
      catchError((error) => {
        console.error('Failed to send tracking batch', error);
        return of(); // swallow tracking send errors
      })
    );
  }

  /**
   * Submit the tracking event to the 'debouncing, grouping' queue
   */
  private addToQueue(trackData: TrackingEventData): void {
    const event: TrackingEventsParams = {
      userId: trackData.userId,
      context: trackData.context,
      eventsData: [
        {
          ...trackData,
          properties: {
            ...trackData.properties,
            ...getPerformanceTrackingProps(),
          },
        },
      ],
    };

    // Emit event
    this.queue.next(event);
  }

  /**
   * Get details common to all current session's tracking events
   */
  private getCommonDetails(props: Record<string, any>) {
    const location = this.currentLocation;
    const page = {
      title: this.title.getTitle(),
      url: location.href,
      search: location.search,
      path: props['path'] || location.pathname,
      params: searchToParams(location.search),
      referrer: this.router.getCurrentNavigation()?.previousNavigation?.finalUrl?.toString(),
    };

    return {
      userId: this._userProfileKey,
      context: {
        library: { name: 'dg.js' }, // TODO: This is the value set in the main degreed app.  Should this be something different?
        timezone: getTimezone(),
        locale: getLocale(),
        userAgent: navigator.userAgent,
        page: sanitizeSensitiveQuery(this.currentLocation, page),
      },
      sentAt: new Date(),
      receivedAt: undefined,
    };
  }

  /**
   * Whenever the location URL changes, trigger lazy-init of
   * `currentLocation` property; recalculated on the next 'read',
   */
  private watchLocation() {
    const forceLazyRecalc = () => (this._currentLocation = undefined);

    this.location.subscribe(forceLazyRecalc);
    this._currentLocation = undefined;
  }

  /**
   * Compute the currentLocaion URL lazily
   */
  private get currentLocation() {
    // lazy-init
    if (!this._currentLocation) {
      this._currentLocation = new URL(`${this.document.location.origin}${this.location.prepareExternalUrl(this.location.path())}`);
    }
    return this._currentLocation;
  }
}
