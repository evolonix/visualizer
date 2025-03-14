export interface Preview {
  id: string;
  name: string;
  category?: Category; // This is the category that this preview belongs to.

  image?: string;
  url?: string;
  html?: string;
  code?: string;
  designUrl?: string; // Link to the design file for this preview.
}

/**
 * This interface is used to validate the data in the pages/categories.ts file.
 */
export interface Category {
  id: string;
  name: string;
  previews: Preview[];
}
