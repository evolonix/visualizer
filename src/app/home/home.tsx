import clsx from 'clsx';

export const Home = () => {
  return (
    <>
      <header className="mb-4">
        <h1 className="text-4xl font-bold">Home</h1>
        <p className="text-sm text-neutral-600">Summary of the content</p>
      </header>

      <button
        type="button"
        className={clsx(
          'rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-neutral-900 shadow-md ring-1 ring-inset ring-neutral-300',
          'hover:bg-neutral-50 focus:bg-neutral-50 active:bg-neutral-100',
        )}
      >
        Content Button
      </button>

      {/* <Lipsum /> */}
    </>
  );
};
