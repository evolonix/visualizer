import { LayoutNavigationItem } from './layout.model';

/**
 * Check if the href is active
 * @param pathname The current pathname
 * @param href The href to compare
 * @param end If the pathname should end with the href
 * @returns If the href is active
 */
export const isActive = (pathname: string, path?: string, end = false) => {
  if (!path) {
    return false;
  }

  if (end) {
    return pathname.endsWith(path);
  }

  return pathname.startsWith(path);
};

/**
 * Check if a sub item is active
 * @param pathname The current pathname
 * @param subItems The sub items to check
 * @returns If a sub item is active
 */
export const isSubItemActive = (pathname: string, subItems: LayoutNavigationItem[]): boolean => {
  return subItems.some((subItem) => {
    return isActive(pathname, subItem.href || subItem.routerLink, subItem.end);
  });
};

/**
 * Get the active sub item
 * @param pathname The current pathname
 * @param subItems The sub items to check
 * @returns The active sub item
 */
export const getActiveSubItem = (pathname: string, subItems: LayoutNavigationItem[]): LayoutNavigationItem | null => {
  for (const subItem of subItems) {
    if (isActive(pathname, subItem.href || subItem.routerLink, subItem.end)) {
      return subItem;
    }
  }

  return null;
};

/**
 * Find the active item with a title
 * @param pathname The current pathname
 * @param items The items to check
 * @param lastFoundTitle The last found title
 * @returns The active item with the last found title
 */
export const findActiveWithTitle = (
  pathname: string,
  items: LayoutNavigationItem[],
  lastFoundTitle?: string
): LayoutNavigationItem | null => {
  for (const item of items) {
    if (item.subItems) {
      const found = findActiveWithTitle(pathname, item.subItems, item.headerTitle);
      if (found) {
        return found;
      }
    } else if (isActive(pathname, item.href || item.routerLink, item.end)) {
      return { ...item, headerTitle: item.headerTitle || lastFoundTitle };
    }
  }

  return null;
};
