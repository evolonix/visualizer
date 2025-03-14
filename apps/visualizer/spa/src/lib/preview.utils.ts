import { Cheerio, CheerioAPI, load } from 'cheerio';
import frontMatter from 'front-matter';
import htmlParser from 'prettier/plugins/html';
import prettier from 'prettier/standalone';
import { Category, Preview } from '../data';

export interface PreviewAttributes {
  wrapper?: string;
  wrapper_component?: string;
  title?: string;
  id?: string;
  className?: string;
}

const HTML_COMPONENT_RESERVED_ATTRIBUTES = ['name', 'class', 'onload', 'hide-wrapper', 'hide-component'];

/**
 * Replace placeholders in the html file with the component's attributes or html file's front matter attributes.
 */
const replaceAttributes = (html: string, attributes: [string, string][]): string => {
  for (const [key, value] of attributes) {
    // Replace the matching placeholder with the component's attribute
    html = html.replace(new RegExp(`<!--(\\s)?${key.toUpperCase()}(\\s)?-->|{(\\s)?${key.toUpperCase()}(\\s)?}`, 'g'), value);
  }

  return html;
};

/**
 * Process the front matter attributes from the top of the html files
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const applyAttributes = ($: CheerioAPI, element: Cheerio<any>, hideWrapper = false): void => {
  const elementHtml = $(element).html() || '';
  const { attributes, body } = frontMatter<PreviewAttributes>(elementHtml);

  const { wrapper = '', wrapper_component: wrapperComponent, ...rest } = attributes; // Front matter attributes

  let html = body;
  html = replaceAttributes(html, Object.entries(rest));

  // Replace the html with the body of the html file after the front matter attributes have been used to replace placeholders and removed
  $(element).html(html);

  // Skip adding the wrapper component or element if hideWrapper is true or there are no attributes (meaning, no wrappers were specified).
  // One instance when hideWrapper is true is when the preview is being processed to display in the HTML tab (Code View) of the preview page.
  if (hideWrapper || Object.keys(attributes).length === 0) return;

  // Add the wrapper component or wrapper element if specified
  const attrs = Object.entries(rest).reduceRight((prev, [k, v]) => `${prev} ${k}="${v}" `, '');
  if (wrapperComponent) {
    $(element).wrapInner(`<html-component name="${wrapperComponent}" ${attrs}>${wrapper}</html-component>`);
  } else {
    $(element).wrapInner(`<html-component ${attrs}>${wrapper}</html-component>`);
  }
};

/**
 * Replace html-component elements with the contents of the component.
 */
export async function replaceHtmlComponents(html: string, hideWrapper = false) {
  if (!html) return '';

  const pages = await import.meta.glob('../../pages/categories/**/*.html', {
    import: 'default',
    query: 'raw',
  });
  const components = await import.meta.glob('../../pages/components/**/*.html', {
    import: 'default',
    query: 'raw',
  });

  const onloads: string[] = [];

  const replaceComponentsRecursively = async (hideWrapper = false): Promise<void> => {
    // Find all html-component elements
    for (const element of $('html-component')) {
      // Check if the component should be hidden from the output (for instance, when displaying the preview in the HTML tab of the preview page)
      const hideComponent = hideWrapper && Boolean($(element).attr('hide-component'));
      if (hideComponent) {
        // If the component should be hidden, replace the html-component element with its contents, keeping any classes on the html-component element
        const innerContent = $(element).contents();
        const componentClasses = $(element).attr('class');
        if (componentClasses) {
          innerContent.toggleClass(componentClasses, true);
        }
        $(element).replaceWith($(innerContent));

        continue;
      }

      // Start with a placeholder so that the html-component element can be replaced with the component's contents
      let html = '<!-- CHILDREN -->';

      const componentName = $(element).attr('name');
      if (componentName?.startsWith('categories/')) {
        // Load the category's html file
        const page = pages[`../../pages/${componentName}.html`];
        html = (await page()) as string;
      } else if (componentName) {
        // Load the component's html file
        const component = components[`../../pages/components/${componentName}.html`];
        html = (await component()) as string;
      }

      const allAttributes = $(element).attr();
      if (allAttributes) {
        const attributes = Object.entries(allAttributes).filter(([key]) => !HTML_COMPONENT_RESERVED_ATTRIBUTES.includes(key));

        html = replaceAttributes(html, attributes);
      }

      // Replace the CHILDREN placeholder with the contents of the html-component element
      // If the placeholder has a newline after it, replace it as well to keep the formatting consistent
      const innerContent = $(element).html() || '';
      html = html.replace(/<!-- CHILDREN -->\n/g.test(html) ? /<!-- CHILDREN -->\n/g : /<!-- CHILDREN -->/g, innerContent);

      // Load the component's html file into a cheerio object
      const $component = load(html);
      // Apply the front matter attributes to the component's html file
      applyAttributes($component, $component('body'), hideWrapper && Boolean($(element).attr('hide-wrapper')));

      // Apply the element's classes to the component's top-level child/children
      const componentClasses = $(element).attr('class');
      if (componentClasses) {
        $component('body').children().toggleClass(componentClasses, true);
      }

      // Replace the html-component element with the component's contents
      $(element).replaceWith($component('body').contents());

      // Queue the element's onload function if specified
      const onload = $(element).attr('onload');
      if (onload) {
        // Split on semi-colon unless the semi-colon
        const onloadFunctions = onload
          .split(';')
          .map((f) => f.trim())
          .filter((f) => f !== '');
        onloads.push(...onloadFunctions);
      }

      return replaceComponentsRecursively(hideWrapper);
    }
  };

  // Load the html into a cheerio object
  const $ = load(html);
  // Apply the front matter attributes to the html file
  applyAttributes($, $('body'), hideWrapper);

  await replaceComponentsRecursively(hideWrapper);

  // Run all onload functions found
  onloads.forEach(async (onload) => {
    // Example: onload="selectNavItem('Catalog')"
    // Split onload value into function name and arguments
    const [functionName, ...args] = onload.split('(');
    const functionArgs = args
      .join('(')
      .split(')')[0]
      .split(/,(?=(?:(?:[^'|"]*'){2})*[^'|"]*$)/) // Split on comma unless the comma is inside of a string literal
      .map((arg) => arg.trim());

    // If arg starts with a single quote, remove single quotes, otherwise, if arg starts with a double quote, remove double quotes.
    // This allows us to pass string literals as arguments.
    for (let i = 0; i < functionArgs.length; i++) {
      const arg = functionArgs[i];
      if (arg.startsWith("'")) {
        functionArgs[i] = arg.slice(1, -1);
      } else if (arg.startsWith('"')) {
        functionArgs[i] = arg.slice(1, -1);
      }
    }

    // Run the function after a tick to give the component time to be ready
    await setTimeout(() => {
      if (functionName in window) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any)[functionName](...functionArgs);
      }
    }, 100);
  });

  return $('body').html() ?? '';
}

/**
 * Hydrate a preview summary with its category and image.
 * If full is true, fully hydrate the preview with its url, html, and code as well as all from the summary.
 */
export const hydratePreview =
  (category: Category, full = true) =>
  async (preview: Preview) => {
    const content = await import(`../../pages/categories/${category.id}/${preview.id}.html?raw`).then((m) => m.default);

    preview = {
      ...preview,
      category,
      image: await import(`../../pages/categories/${category.id}/${preview.id}.png`).then((m) => m.default).catch(() => null),
    } satisfies Preview;

    if (full) {
      preview = {
        ...preview,
        url: `/pages/${category.id}/${preview.id}`,
        html: await replaceHtmlComponents(content),
        code: await replaceHtmlComponents(content, true).then((code) =>
          // Format the code with prettier to fix any formatting issues after parsing html components
          prettier.format(code, {
            parser: 'html',
            plugins: [htmlParser],
          })
        ),
      } satisfies Preview;
    }

    return preview;
  };

/**
 * Add a grid guide to each .grid-apollo element found in the document.
 */
export const addGridGuides = (document: Document) => {
  const gridGuide = document.createElement('div');
  gridGuide.className = 'grid-guide grid-apollo absolute inset-0';
  gridGuide.innerHTML = `
    <div class="bg-red-400/20"></div>
    <div class="bg-red-400/20"></div>
    <div class="bg-red-400/20"></div>
    <div class="bg-red-400/20"></div>
    <div class="hidden bg-red-400/20 sm:block"></div>
    <div class="hidden bg-red-400/20 sm:block"></div>
    <div class="hidden bg-red-400/20 sm:block"></div>
    <div class="hidden bg-red-400/20 sm:block"></div>
    <div class="hidden bg-red-400/20 lg:block"></div>
    <div class="hidden bg-red-400/20 lg:block"></div>
    <div class="hidden bg-red-400/20 lg:block"></div>
    <div class="hidden bg-red-400/20 lg:block"></div>
  `;

  // Add the grid guide to all Apollo grids except the grid guide itself
  Array.from(document.querySelectorAll('.grid-apollo'))
    .filter((grid) => {
      return !grid.classList.contains('grid-guide') && !grid.nextElementSibling?.classList.contains('grid-guide');
    })
    .forEach((grid) => {
      // Line up the grid guide with the grid if a sidebar is present
      if (grid.classList.contains('has-sidebar')) {
        gridGuide.classList.add('has-sidebar');
      }

      grid.parentElement?.classList.add('relative');
      grid.insertAdjacentElement('afterend', gridGuide);
    });
};

/**
 * Remove all grid guides from the document.
 */
export const removeGridGuides = (document: Document) => {
  const gridGuides = document.querySelectorAll('.grid-guide');
  gridGuides?.forEach((guide) => guide.remove());
};
