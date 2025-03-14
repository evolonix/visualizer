import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import { Navigate, RouterProvider, createBrowserRouter } from 'react-router-dom';
import App, { loader as appLoader } from './app/app';
import ErrorPage from './app/error';
import { Breadcrumbs, Crumb, Navigation } from './components';
import CrumbDropdown from './components/crumb-dropdown';
import { Category, Preview } from './data';

/**
 * Each route can have a loader function that returns data for the route.
 * This data is passed to the route's component as well as to the route's handle.
 * The handle is used to render breadcrumbs and navigation.
 */
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    loader: appLoader, // Loader to handle the app search
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Navigate to="/dashboard" /> },
      {
        path: 'dashboard',
        handle: {
          crumb: () => <Crumb name="Dashboard" to="/dashboard" />,
          navigation: ({ navigation }: { navigation: { name: string; to: string }[] }) => <Navigation navigation={navigation} />,
        },
        errorElement: <ErrorPage />,
        children: [
          {
            index: true,
            lazy: () => import('./app/dashboard'),
          },
          {
            path: ':categoryId',
            async lazy() {
              const { loader } = await import('./app/categories');
              return { loader };
            },
            handle: {
              crumb: ({ category }: { category: Category }) => <Crumb name={category.name} to={`/dashboard/${category.id}`} />,
              navigation: ({ navigation }: { navigation: { name: string; to: string }[] }) => <Navigation navigation={navigation} />,
            },
            children: [
              {
                index: true,
                lazy: () => import('./app/categories'),
              },
              {
                path: ':previewId',
                lazy: () => import('./app/previews'),
                handle: {
                  crumb: ({ preview, navigation }: { preview: Preview; navigation: { name: string; to: string }[] }) => (
                    <CrumbDropdown preview={preview} navigation={navigation} />
                  ),
                  navigation: () => <Breadcrumbs />,
                },
              },
            ],
          },
        ],
      },
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
