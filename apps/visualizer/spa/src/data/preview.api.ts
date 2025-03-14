import { hydratePreview } from '../lib';
import { Category } from './preview.model';

/**
 * Get all of the categories and their preview summaries.
 */
export async function getCategories(): Promise<Category[]> {
  return await import('../../pages/categories')
    .then((m) => m.default)
    .then(
      async (categories) =>
        await Promise.all(
          categories.map(async (category) => ({
            ...category,
            previews: await Promise.all(category.previews.map(hydratePreview(category, false))),
          }))
        )
    )
    .then((categories) => {
      // Sort the categories and previews by name
      categories = categories.sort((a, b) => a.name.localeCompare(b.name));
      categories.forEach((category) => {
        category.previews = category.previews.sort((a, b) => a.name.localeCompare(b.name));
      });
      return categories;
    });
}
