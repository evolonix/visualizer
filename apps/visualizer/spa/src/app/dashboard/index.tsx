import { getCategories } from '../../data';

/**
 * Get the navigation for the categories
 */
export async function loader() {
  const [, navigation] = await getCategories();

  // Return the navigation for the route handle to use in the breadcrumb
  return { navigation };
}

export const Component = () => {
  return (
    <div>
      <h1 className="mb-8 text-4xl font-bold">Welcome to the Visualizer!</h1>
      <p>[Placeholder for a really informational description of what the Visualizer is and how to use it!]</p>
    </div>
  );
};

Component.displayName = 'Dashboard';
