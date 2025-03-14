import clsx from 'clsx';
import { NavLink } from 'react-router-dom';

export const Navigation = ({ navigation }: { navigation: { name: string; to: string }[] }) => (
  <nav className="hidden lg:flex lg:flex-wrap lg:gap-x-8 lg:gap-y-2 lg:py-2" aria-label="Local">
    {navigation.map((item) => (
      <NavLink
        key={item.to}
        to={item.to}
        className={({ isActive }) =>
          clsx(
            isActive
              ? 'bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-50'
              : 'text-slate-900 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-50 dark:hover:bg-slate-900 dark:hover:text-slate-50',
            'inline-flex items-center rounded-md px-3 py-2 text-sm font-medium'
          )
        }
      >
        {item.name}
      </NavLink>
    ))}
  </nav>
);
