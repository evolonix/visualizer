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
