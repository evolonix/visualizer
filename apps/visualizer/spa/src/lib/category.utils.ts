import { matchSorter } from 'match-sorter';
import { Category } from '../data';

/**
 * Fuzzy search a dataset's keys that match ALL words in a query
 */
function fuzzySearchAllWords<T>(
  data: T[],
  keys: string[],
  query: string // potentially multi-word search string "two words"
) {
  if (!query || !query.length) {
    return data;
  }

  const terms = query.match(/[^ ]+/g);
  if (!terms) {
    return data;
  }

  // reduceRight will mean sorting is done by score for the _first_ entered word.
  return terms.reduceRight((results, term) => matchSorter(results, term, { keys }), data);
}

/**
 * Fuzzy search a dataset's keys that match ANY word in a query
 */
function fuzzySearchAnyWord<T>(
  data: T[],
  keys: string[],
  query: string // potentially multi-word search string "two words"
) {
  if (!query || !query.length) {
    return data;
  }

  const terms = query.match(/[^ ]+/g);
  if (!terms) {
    return data;
  }

  // Return true if any of the terms match
  return data.filter((item) => terms.some((term) => matchSorter([item], term, { keys }).length));
}

/**
 * Filter categories where the name or preview's name matches the query
 */
export const filterCategories = (categories: Category[], query: string) => {
  const matchedCategories = fuzzySearchAllWords(categories, ['name', 'previews.*.name'], query);

  return matchedCategories.map((category) => {
    const previews = fuzzySearchAnyWord(category.previews, ['name'], query);

    return { ...category, previews: previews.length ? previews : category.previews } satisfies Category;
  });
};
