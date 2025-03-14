import { NavigationItem, NavigationSubItem } from './nav.model';

export const isActive = (current: string, path?: string, end = false) => {
  if (!path) {
    return false;
  }

  if (end) {
    return current.endsWith(path);
  }

  return current.startsWith(path);
};

export const isChildActive = (current: string, children: NavigationSubItem[]): boolean => {
  return children.some((child) => {
    if (child.subItems) {
      return isChildActive(current, child.subItems);
    }
    return isActive(current, child.href);
  });
};

export const getActiveChild = (current: string, children: NavigationSubItem[]): NavigationSubItem | null => {
  for (const child of children) {
    if (child.subItems) {
      const found = getActiveChild(current, child.subItems);
      if (found) {
        return found;
      }
    } else if (isActive(current, child.href)) {
      return child;
    }
  }

  return null;
};

export const findActiveWithTitle = (current: string, items: NavigationItem[], lastFoundTitle?: string): NavigationItem | null => {
  for (const item of items) {
    if (item.subItems) {
      const found = findActiveWithTitle(current, item.subItems, item.title);
      if (found) {
        return found;
      }
    } else if (isActive(current, item.href)) {
      return { ...item, title: item.title || lastFoundTitle };
    }
  }

  return null;
};
