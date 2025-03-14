const {
  utils: { getProjects },
} = require('@commitlint/config-nx-scopes');

/**
 * Developers should be considering product scopes, instead of library and application scopes
 *
 * For example, making a change to an app or library on the left results in a scope of the product on the right:
 *
 *    app-skills-platform             -> skills-platform
 *    lib-skills-platform-data-access -> skills-platform
 *    lib-skills-platform-ui-skills   -> skills-platform
 *    lib-shared-apollo-tailwind      -> apollo
 *    lib-shared-rsm                  -> rsm
 */

async function getProducts(ctx) {
  // Get application names only, and remove app- prefix for better readability
  const apps = await getProjects(ctx, ({ name, projectType }) => projectType === 'application' && name.startsWith('app-'));
  const products = apps.map((name) => name.replace('app-', ''));
  return products;
}

module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'scope-enum': async (ctx) => [2, 'always', [...(await getProducts(ctx)), 'apollo', 'core', 'rsm', 'tinymce', 'repo', 'release']],
    'scope-empty': [2, 'never'],
    'body-max-length': [0, 'always', 100],
    'body-max-line-length': [0, 'always', 100],
  },
};
