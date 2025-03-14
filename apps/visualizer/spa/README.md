# Design-to-Web Visualizer

To improve the Designer-Developer process, the Visualizer was created as an implementation playground and exploration of Degreed's HTML-1st solutions.

[![Slides](https://user-images.githubusercontent.com/210413/163684486-1a81c4b6-a6f7-4574-823f-5b07824b0156.png)](https://slides.com/thomasburleson/degreed-architecture-2022-5b2e8c?token=ke_X_RuJ)

> Click to see [slide presentation](https://slides.com/thomasburleson/degreed-architecture-2022-5b2e8c?token=ke_X_RuJ)

<br/>

## Our _HTML-1st_ Process

The challenges of **translation and validation** is the largest friction point in the complex _design_-to-_deployment_ process for Degreed's Web products.

- Translation of Figma designs to Angular components conflates the creation of HTML/CSS with Angular development and build processes
- As designs improve, changes to the Angular components are difficult and time consuming. Iterations are frustratingly slow.
- Visualization, validation, and regression testings of the design implementations would require builds of Angular SPAs

The HTML-1st approach uses Tailwind CSS to quickly create static HTML (aka web) versions of the product designs (aka _views_).

Exploring the static designs allows designers, developers, and leadership to easily view the solutions and validate rich features like

- responsiveness
- accessibility (a11y)
- multi-language (i18n)
- themes and dark mode

And once the static HTML/CSS versions are confirmed, these assets are used as the next steps to copy into the SPA products using Angular, React, or NextJS.

<br/>

<img width="956" alt="image" src="https://user-images.githubusercontent.com/210413/163684332-5c838388-3916-4dd2-9a6b-f3dc1aa2f51d.png">

<img width="956" alt="image" src="https://user-images.githubusercontent.com/210413/163684715-c4a7e86b-183d-49ad-8afc-899086b8516b.png">

<img width="955" alt="image" src="https://user-images.githubusercontent.com/210413/163684344-7830f150-b8a7-4317-ac50-fea414d83264.png">

<img width="956" alt="image" src="https://user-images.githubusercontent.com/210413/163684359-b603a999-29a7-4e62-aaf0-4c0b34268b46.png">

<br/>

### Components

The HTML-1st approach uses Tailwind CSS to quickly create static HTML (aka web) versions of the product designs (aka _views_).
By default, these views contain only _RAW_ HTML with CSS classnames. Portions of the HTML are often replicated across many views.

This replication is NOT ideal and creates significant design-change friction when updating the HTML-1st implmentations.

A "Component" features has been implemented to allow developers to easily create centralized html snippets... that can be shared across many 1..n views. Refer to the [Visualizer Components](./docs/components.md) documentation for details.

### Future

The intent is that ALL Degreed web products will use this HTML-1st approach. ALL web designs will be represented and available within the Visualizer.

> It is important to note that that all HTML-1st solutions are static-pages only; no business logic will be implemented in the Visualizer templates.

These assets are `master` templates that can be easily copied and used with SPA application development. These templates are also integral to our vision of clean UI components and distinct business layers within our SPA development.

<br/>

## Enhance the Visualizer

In the FE-Nx monorepository, the **Visualizer** application is contained in the `apps/visualizer/spa` folder. The HTML/CSS and resulting renderering should be considered the `master` layouts approved [by Product and Designers] for deployment.

<br/>

## Running the Visualizer

To start the Visualizer application, just run:

```bash
npx nx serve app-visualizer
```

Then open a browser at `http://localhost:4200`.

## Preview Pages

To add a new preview page, create a new HTML file in `pages/categories/` and add it to the array in `pages/categories.ts`. Use the HTML file's name as the `id` and give it a proper `name` for display.

For example, to add a new page for the `foo` preview in the `bar` category, create `pages/categories/bar/foo.html` and add the following to `pages/categories.ts`:

```ts
const bar = {
  id: 'bar',
  name: 'Bar',
  previews: [
    {
      id: 'foo',
      name: 'Foo',
    },
  ],
};

export default [
  // ...
  bar,
] satisfies Category[];
```

After developing the page, take a screenshot of it at full screen, name it the `{id}.png` (in our example obove, it would be named `foo.png`) and place it in the appropriate `pages/categories/` folder (in our example above, the image would be placed in `/pages/categories/bar/`).

Recommendations for generating a good screenshot:

- Use an aspect ratio of 4:3 or 16:9
- Use a resolution of 1024x768 or above
- Resize the screenshot to a width of 400 pixels, keeping the aspect ratio

1. Open Chrome DevTools and ensure you are on the screen you want to take a screenshot of (i.e. Clicking the `Full Screen` button on the preview page)
1. Toggle the device toolbar (Ctrl+Shift+M, or Cmd+Shift+M on macOS) and select the device you want to take a screenshot of (i.e. `iPad Mini`)
1. Choose a device that will be 1024x768 or larger to get a `Large` view of the preview. `iPad Mini` is a good choice because it is 1024x768.
1. Make sure it is in landscape mode
1. Take a screenshot of the page (Ctrl+Shift+P, or Cmd+Shift+P on macOS) and select `Capture screenshot` or `Capture full size screenshot`
1. Hint: You can start typing `screenshot` to filter the list of commands
1. Open the screenshot in an image editor and resize it to the desired aspect ratio and resolution
1. A 1024x768 screenshot will be 4:3
1. Rename the png file to `{id}.png` and place it in the appropriate `pages/categories/` folder
