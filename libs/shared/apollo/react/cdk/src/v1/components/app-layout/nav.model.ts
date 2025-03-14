import { IconName } from '../dynamic-icon';

export type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] };

export type NavigationSubItem = WithRequired<Omit<NavigationItem, 'title'>, 'href'>;

export interface NavigationItem {
  text: string;
  title?: string;
  icon?: IconName;
  image?: string;
  svg?: string;
  href?: string;
  subItems?: NavigationSubItem[];
  end?: boolean;
}
