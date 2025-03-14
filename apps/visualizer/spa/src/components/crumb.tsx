import clsx from 'clsx';
import { NavLink } from 'react-router-dom';

export const Crumb = ({ name, to }: { name: string; to: string }) => {
  return (
    <NavLink
      to={to}
      end
      className={({ isActive }) =>
        clsx(
          isActive
            ? 'text-slate-700 dark:text-slate-200'
            : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200',
          'ml-4 text-sm font-medium'
        )
      }
    >
      {name}
    </NavLink>
  );
};
