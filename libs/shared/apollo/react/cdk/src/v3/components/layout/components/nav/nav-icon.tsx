import { twMerge } from '../../../../utils';
import { Icon } from '../../../icon';
import { LayoutNavigationItem } from '../../layout.model';

export interface NavIconProps {
  item: LayoutNavigationItem;
  active?: boolean;
  className?: string;
}

export const NavIcon = ({ item, active, className }: NavIconProps) => {
  return item.icon ? (
    <Icon icon={item.icon} className={className} />
  ) : item.image ? (
    <img
      src={item.image}
      alt=""
      className={twMerge('tw-rounded-full', active ? 'tw-ring-2 tw-ring-[var(--apollo-layout-highlight)] tw-ring-offset-2' : '', className)}
      aria-hidden="true"
    />
  ) : null;
};
