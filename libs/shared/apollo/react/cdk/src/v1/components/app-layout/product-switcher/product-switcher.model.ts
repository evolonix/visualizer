import { NavigationSubItem } from '../nav.model';

export type Product = 'lxp' | 'academies' | 'skills-platform';

export interface ProductSwitcherNavigationItem {
  text: string;
  title: string;
  subItems?: NavigationSubItem[];
  end?: boolean;
  product: Product;
  selected?: boolean;
}
