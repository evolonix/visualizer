import { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider, createBrowserRouter, useLocation } from 'react-router-dom';

import App from './app/app';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

const root = document.getElementById('root') as HTMLElement;

const router = createBrowserRouter(
  [
    {
      path: '/*',
      element: (
        <>
          <ScrollToTop />
          <App />
        </>
      ),
    },
  ],
  { basename: window?.nxSkillsPlatformBootstrap.baseHref ?? '/' }
);

createRoot(root).render(<RouterProvider router={router} />);
