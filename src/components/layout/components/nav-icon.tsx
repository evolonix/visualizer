import clsx from 'clsx';

import { NavigationItem } from '../layout.model';
import { DynamicIcon } from './dynamic-icon';

export interface NavIconProps {
  item: NavigationItem;
  active?: boolean;
  className?: string;
  // All other props passed to the component
  [x: string]: unknown;
}

export const NavIcon = ({
  item,
  active,
  className,
  ...props
}: NavIconProps) => {
  return item.icon ? (
    <DynamicIcon icon={item.icon} className={className} {...props} />
  ) : item.image ? (
    <img
      src={item.image}
      alt=""
      className={clsx(
        className,
        active
          ? 'ring-2 ring-[var(--apollo-layout-highlight-text)] ring-offset-2'
          : '',
        'rounded-full',
      )}
      {...props}
    />
  ) : item.svg ? (
    // This is a security risk, but it allows the fill and stroke to be set to "currentColor" in the SVG
    <div
      dangerouslySetInnerHTML={{ __html: item.svg }}
      className={className}
      {...props}
    />
  ) : null;
};
