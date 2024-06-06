import { NavLink } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';

import { DynamicIcon } from '../../dynamic-icon';

export interface NavItemProps {
  label: string;
  icon?: string;
  path: string;
  iconOnly?: boolean;
  className?: string;
  onClick?: () => void;
}

export const NavItem = ({
  label,
  icon,
  path,
  iconOnly,
  className,
  onClick,
}: NavItemProps) => {
  if (!icon) iconOnly = false;

  return (
    <NavLink
      to={path}
      className={twMerge(
        'flex items-center gap-2 px-7 py-2 focus:outline-none',
        'hover:bg-[rgb(from_var(--layout-highlight,theme(colors.neutral.800))_r_g_b_/_15%)] hover:text-[var(--layout-highlight,theme(colors.neutral.800))]',
        'focus:bg-[rgb(from_var(--layout-highlight,theme(colors.neutral.800))_r_g_b_/_15%)] focus:text-[var(--layout-highlight,theme(colors.neutral.800))]',
        'active:bg-[rgb(from_var(--layout-highlight,theme(colors.neutral.900))_r_g_b_/_30%)] active:text-[var(--layout-highlight,theme(colors.neutral.900))]',
        className,
      )}
      onClick={onClick}
    >
      {icon ? (
        <DynamicIcon
          icon={icon}
          type="solid"
          className="size-6 shrink-0"
          aria-hidden="true"
        />
      ) : null}
      <span className={iconOnly ? 'sr-only' : 'grow'}>{label}</span>
    </NavLink>
  );
};
