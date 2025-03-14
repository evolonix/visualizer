import { LayoutNavigationItem } from './layout.model';

/**
 * Check if the url is active
 * @param pathname The current pathname
 * @param url The href or routerLink to compare
 * @param end If the pathname should end with the url
 * @returns If the url is active
 */
const isActive = (pathname: string, url?: string, end = false) => {
  return url ? (end ? pathname.endsWith(url) : pathname.startsWith(url)) : false;
};

/**
 * Check if the item is active based on the current url or
 * if any of its children are active
 * Note: active is determined by url containing the pathname as a start or end
 * @param pathname The current pathname
 * @param item The item to check
 * @returns If the item is active
 */
export const isItemActive = (pathname: string) => (item: LayoutNavigationItem) => {
  const url = item.href || item.routerLink;
  const hasActiveChild = () => {
    return item.children?.some(isItemActive(pathname)) ?? false;
  };

  return url ? isActive(pathname, url, item.end) : hasActiveChild();
};

/**
 * Get the active child
 * @param pathname The current pathname
 * @param children The children to check
 * @returns The active child
 */
export const getActiveChild = (pathname: string, children: LayoutNavigationItem[]): LayoutNavigationItem | null => {
  return children?.find(isItemActive(pathname)) ?? null;
};

/**
 * Find the active item with a title
 * @param pathname The current pathname
 * @param items The items to check
 * @param lastFoundTitle The last found title
 * @returns The active item with the last found title
 */
export const findActiveItemWithTitle = (
  pathname: string,
  items: LayoutNavigationItem[],
  lastFoundTitle?: string
): LayoutNavigationItem | null => {
  for (const item of items) {
    if (item.children) {
      const found = findActiveItemWithTitle(pathname, item.children, item.headerTitle);
      if (found) {
        return found;
      }
    } else if (isActive(pathname, item.href || item.routerLink, item.end)) {
      return { ...item, headerTitle: item.headerTitle || lastFoundTitle };
    }
  }

  return null;
};
