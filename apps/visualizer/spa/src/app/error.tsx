import { isRouteErrorResponse, useRouteError } from 'react-router-dom';

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  const message = isRouteErrorResponse(error) ? error.statusText : error instanceof Error ? error.message : '';

  return (
    <div className="grid h-full flex-1 place-content-center">
      <h1 className="mb-8 text-4xl font-bold">Oops!</h1>

      <p className="mb-4">Sorry, an unexpected error has occurred.</p>
      <p>
        <i>{message}</i>
      </p>
    </div>
  );
}
