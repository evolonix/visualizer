/* eslint-disable @typescript-eslint/no-explicit-any */

import { LogTracker } from './tracker.utils';

export type CheckPermissions = (node: Record<string, unknown>, guards: PermissionGuards) => void;
export type ShowPermissionLog = (passThru: any) => any;

// **********************************************************************
// UnAuthorized Tracking
// **********************************************************************

export type GuardLogType = 'LxP Admin' | 'LxP Learner' | 'ACM Learner' | 'ACM Admin';

class PermissionTracker extends LogTracker {
  constructor(context: GuardLogType) {
    super(`Permission Guards for ${context} navigation`, {
      key: 'menu',
      value: 'blocked by',
    });
  }

  override track(key: string, value: string, url?: string) {
    if (!this.findEntryBy(key)) {
      const entry = {
        [this.key]: key,
        [this.value]: value,
      };
      if (url) entry.url = url;

      this.registry.push(entry);
    }
  }
}

// ***********************************************************************
// Internal Tracking utils
// ***********************************************************************

const blockedGuards: Record<GuardLogType, PermissionTracker> = {} as Record<GuardLogType, PermissionTracker>;

const trackerFor = (which: GuardLogType): PermissionTracker => {
  if (!blockedGuards[which]) {
    blockedGuards[which] = new PermissionTracker(which);
  }

  return blockedGuards[which];
};

// ***********************************************************************
// Guard Lookups
// ***********************************************************************

/**
 * Update node visibility based on parent and child guard permissions
 * NOTE: this will also log any items with blocked (visible = false) access.
 */
export const checkPermssionsFor = (context: GuardLogType, isProduction = false): [CheckPermissions, ShowPermissionLog] => {
  const tracker = trackerFor(context);
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const report = !isProduction ? tracker.report.bind(tracker) : () => {};

  const checkPermissionFn = (node: Record<string, any>, guards: PermissionGuards) => {
    const isVisible = guards.reduce((result, g: GuardItem) => {
      const append = (source: string, extra: string): string => (source ? `${source}, ${extra}` : extra);

      const url = node.href || node.routerLink || node.url || '';
      const hasChildren = Object.keys(g.children || {}).length > 0;
      const selfAuthorized = g.permissions && g.settings && g.featureFlags;
      const noChildrenAuthorized = selfAuthorized && hasChildren && !g.isAuthorized;

      let blockers = '';
      if (!g.permissions) blockers = append(blockers, '[permissions]');
      if (!g.settings) blockers = append(blockers, '[settings]');
      if (!g.featureFlags) blockers = append(blockers, '[featureFlags]');
      if (noChildrenAuthorized) blockers = append(blockers, '[no children authorized]');

      if (blockers) tracker.track(g.name, blockers, url);

      // All guards must be authorized, and - for each guard -
      // all permissions, settings, and featureFlags must be authorized

      return result && g.isAuthorized;
    }, true);

    node.visible = isVisible;
  };

  return [checkPermissionFn, report];
};

// **********************************************************************
// Public Types
// **********************************************************************

export type MatchState = boolean | undefined;
export interface GuardItem {
  name: string;
  permissions: boolean;
  settings: boolean;
  featureFlags: boolean;
  isAuthorized: boolean;
  children?: Record<string, GuardItem>;
  child: (id: string) => GuardItem;
  addChildren: (list: GuardItem[]) => GuardItem;
}

export type PermissionGuards = GuardItem[];

// **********************************************************************
// Public Utils
// **********************************************************************

/**
 * Make are GuardItem instance; which may contain optional children
 * Parent permissions will also check for ANY child permissions.
 *
 * @param name
 * @param permissionsState  list of user permissions
 * @param settingsState     list of organization settings
 * @param featureFlagsState list of featureFlags
 */
export const makeGuard = (
  name: string,
  permissionsState: MatchState[] = [],
  settingsState: MatchState[] = [],
  featureFlagsState: MatchState[] = []
): GuardItem => {
  const evaluate = (targets: MatchState[]): boolean => {
    return !!targets.reduce((result, p) => {
      return result && !!p;
    }, true);
  };
  const permissions = evaluate(permissionsState);
  const settings = evaluate(settingsState);
  const featureFlags = evaluate(featureFlagsState);
  const isAuthorized = permissions && settings && featureFlags;

  const guard = {
    name: toCamelCase(name),
    permissions,
    settings,
    featureFlags,
    isAuthorized, // allows root menu items to easily check child items
    children: {} as Record<string, GuardItem>,

    /**
     * Child guard accessor (by ID)
     */
    child: (id: string): GuardItem => {
      const source = guard.children[toCamelCase(id)];
      if (!source) throw new Error(`Uknown child guard ${id} in ${guard.name}`);

      return source;
    },

    /**
     * Child guard registrations
     */
    addChildren: (items: GuardItem[]) => {
      // Track all children (if any)
      const children: Record<string, GuardItem> = (items || []).reduce(
        (results, it) => {
          const fullName = `${guard.name} > ${toCamelCase(it.name)}`;
          return { ...results, [it.name]: { ...it, name: fullName } };
        },
        {} as Record<string, GuardItem>
      );

      // Do ANY registered children authorize; this allows a parent to authorize ANY child
      const anyChildAuthorized = Object.keys(children).reduce((authorized, key) => {
        return authorized || children[key].isAuthorized;
      }, false);

      // Update fields
      guard.children = children;
      guard.isAuthorized = permissions && settings && featureFlags && anyChildAuthorized;

      return guard;
    },
  };

  return guard;
};

const toCamelCase = (source: string) => source.replace(/^\w/, (c) => c.toUpperCase());
