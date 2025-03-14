import { ChevronRightIcon, HomeIcon } from '@heroicons/react/20/solid';
import { ReactElement } from 'react';
import { NavLink, useMatches } from 'react-router-dom';

export function Breadcrumbs() {
  const matches = useMatches();
  const crumbs = matches
    // First get rid of any matches that don't have handle, crumb and data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .filter((match) => Boolean((match.handle as any | undefined)?.crumb) && Boolean(match.data))
    // Next, map them into an array of elements, passing the loader data to each one
    .map((match) => (match.handle as { crumb: (data: unknown) => ReactElement }).crumb(match.data));

  return (
    <nav className="box-content hidden h-11 items-center py-1 lg:flex" aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <li>
          <div>
            <NavLink to="/" className="text-slate-400 hover:text-slate-500 dark:text-slate-500 dark:hover:text-slate-400">
              <HomeIcon className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
              <span className="sr-only">Home</span>
            </NavLink>
          </div>
        </li>
        {crumbs.map((crumb, index) => (
          <li key={index}>
            <div className="flex items-center">
              <ChevronRightIcon className="h-5 w-5 flex-shrink-0 text-slate-400 dark:text-slate-500" aria-hidden="true" />
              {crumb}
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
}
