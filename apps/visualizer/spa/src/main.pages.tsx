import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import ErrorPage from './app/error';

const router = createBrowserRouter(
  [
    {
      path: '/:categoryId/:previewId',
      lazy: () => import('./app/pages/page'),
      errorElement: <ErrorPage />,
    },
  ],
  { basename: '/pages' }
);

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);

export * from './lib/page.utils';
