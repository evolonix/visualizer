/**
 * This is a list of the categories and previews data that is used in the visualizer.
 */

import { Category } from '../src/data';

const apollo = {
  id: 'apollo',
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

export default [apollo] satisfies Category[];
