import clsx from 'clsx';

import { DynamicIcon } from '../../dynamic-icon';
import { NavigationItem } from '../nav.model';

export interface NavIconProps {
  item: NavigationItem;
  active?: boolean;
  className?: string;
  // All other props passed to the component
  [x: string]: unknown;
}

export const NavIcon = ({ item, active, className, ...props }: NavIconProps) => {
  return item.icon ? (
    <DynamicIcon icon={item.icon} className={className} {...props} />
  ) : item.image ? (
    <img
      src={item.image}
      alt=""
      className={clsx(className, active ? 'ring-2 ring-[var(--apollo-app-layout-highlight-text)] ring-offset-2' : '', 'rounded-full')}
      {...props}
    />
  ) : item.svg ? (
    // This is a security risk, but it allows the fill and stroke to be set to "currentColor" in the SVG
    <div dangerouslySetInnerHTML={{ __html: item.svg }} className={className} {...props} />
  ) : null;
};
