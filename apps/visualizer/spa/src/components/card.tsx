import { ForwardedRef, forwardRef } from 'react';
import { NavLink } from 'react-router-dom';
import { Category, Preview } from '../data';

export const PreviewCard = forwardRef(
  (
    {
      category,
      preview,
    }: {
      category: Category;
      preview: Preview;
    },
    forwardedRef: ForwardedRef<HTMLAnchorElement>
  ) => {
    return (
      <NavLink
        ref={forwardedRef}
        key={`${category.id}-${preview.id}`}
        to={`/dashboard/${category.id}/${preview.id}`}
        className="block overflow-hidden rounded-lg bg-white shadow ring-sky-500 transition hover:scale-105 focus:outline-none focus:ring-2 dark:bg-slate-950 dark:shadow-black dark:ring-sky-400"
      >
        <div className="relative grid aspect-video place-items-center rounded-t-lg border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900">
          {preview.image ? (
            <img className="absolute h-full w-full object-cover object-top" src={preview.image} alt="" />
          ) : (
            <svg
              className="h-40 w-40 fill-slate-400 dark:fill-slate-500"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 18"
            >
              <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
            </svg>
          )}
        </div>
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-base font-semibold leading-6">{preview.name}</h3>
        </div>
      </NavLink>
    );
  }
);
