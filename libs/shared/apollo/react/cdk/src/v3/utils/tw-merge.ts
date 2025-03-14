import { extendTailwindMerge } from 'tailwind-merge';

/**
 * Tailwind Merge extended with custom prefix to match the Tailwind CSS configuration.
 * Note: Developers should import this function to use Tailwind Merge instead of the original one from 'tailwind-merge'.
 * @example
 * import { twMerge } from '@degreed/apollo-angular';
 */
export const twMerge = extendTailwindMerge({
  prefix: 'tw-',
});

/**
 * twJoin is a helper function to join multiple classes together. It is similar to `clsx` or `classnames`.
 * It should be used instead of twMerge when you don't need the overhead of the full twMerge function.
 */
export { twJoin } from 'tailwind-merge';
