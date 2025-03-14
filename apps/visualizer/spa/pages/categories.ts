/**
 * This is a list of the categories and previews data that is used in the visualizer.
 */

import { Category } from '../src/data';

const layout = {
  id: 'layout',
  name: 'Layout',
  previews: [
    {
      id: 'grid',
      name: 'Grid',
    },
    {
      id: 'grid-with-navigation',
      name: 'Grid w/ Navigation',
    },
  ],
};

export default [layout] satisfies Category[];
