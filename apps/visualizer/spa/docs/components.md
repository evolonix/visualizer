# Visualizer Components

A Visualizer **component** is an html+tailwind snippet that can be easily shared and used within _view_ html.

> Components are flat HTML constructs... a component cannot contain other components!

## Developer Conventions

Using convention-over-configuration, the following conventions are used:

- **pages** are stored in `/pages/categories/**/*.html`
- **components** are stored in `/pages/components/**/*.html`

Naming conventions for a custom component tag (with optional attributes) define how the html snippet is resolved

- Tags should be in kebob-case (e.g. `<html-component name="apollo/dropdown"></html-component>`)
- Tag names point to the associated html file (e.g. `apollo/dropdown.html`)
- Tags are parsed to determine the relative snippet location
- Tags may contain additional attribute/value pairs

<br/>

---

<br/>

## Component API

Components (aka html snippets) support simple, text-only inputs using the following rules.

The following attributes are available for use:

- class="..." (e.g. `<html-component name="apollo/dropdown" class="w-1/2"></html-component>`); The provided classes will be appended to the component's root elements
- id="..." (e.g. `<html-component name="apollo/dropdown" id="my-dropdown"></html-component>`); The provided id will replace any <!-- ID --> found in the component's html
- title="..." (e.g. `<html-component name="apollo/dropdown" title="My Dropdown"></html-component>`); The provided title will replace any <!-- TITLE --> found in the component's html

These rules enable robust Component APIs.

<br/>

<!-- ### Custom Tag Transformation

Consider the following custom tag in the `role-select` view:

##### `/templates/previews/onboarding/role-select.html`

```xml
<Footer
  context="onboarding"
  info="1 of 3 ratings added"
  onNavigateBack="parent.location.href = '/preview/onboarding/welcome'"
  onNavigateNext="parent.location.href = '/preview/onboarding/assigned-skills'"
/>
```

This uses the snippet:

##### `/templates/components/onboarding/footer.html`

```html
<footer
  class="h-18 shadow-top md:px-18 fixed bottom-0 z-20 flex w-full items-center justify-between bg-white px-4 text-neutral-900 dark:bg-neutral-800 dark:text-white"
>
  <button class="button-secondary py-[9px]" onclick="{onNavigateBack}">Back</button>
  <div>
    <a href="#" class="bg-ebony inline-block h-[6px] w-[6px] rounded-full dark:bg-white"></a>
    <a href="#" class="bg-ebony-hue-25 mx-2 inline-block h-[6px] w-[6px] rounded-full dark:bg-neutral-500"></a>
    <a href="#" class="bg-ebony-hue-25 inline-block h-[6px] w-[6px] rounded-full dark:bg-neutral-500"></a>
  </div>
  <div class="inline-flex items-center">
    <div class="mr-3 text-sm">{info}</div>
    <button class="button-primary py-[9px]" onclick="{onNavigateNext}">Next Step</button>
  </div>
</footer>
```

> Note the use of `{info}`, `{onNavigateBack}`, and `{onNavigateNext}` in the snippet above.

The result HTML will be:

```html
<footer
  class="h-18 shadow-top md:px-18 fixed bottom-0 z-20 flex w-full items-center justify-between bg-white px-4 text-neutral-900 dark:bg-neutral-800 dark:text-white"
>
  <button class="button-secondary py-[9px]" onclick="parent.location.href = '/preview/onboarding/welcome'">Back</button>
  <div>
    <a href="#" class="bg-ebony inline-block h-[6px] w-[6px] rounded-full dark:bg-white"></a>
    <a href="#" class="bg-ebony-hue-25 mx-2 inline-block h-[6px] w-[6px] rounded-full dark:bg-neutral-500"></a>
    <a href="#" class="bg-ebony-hue-25 inline-block h-[6px] w-[6px] rounded-full dark:bg-neutral-500"></a>
  </div>
  <div class="inline-flex items-center">
    <div class="mr-3 text-sm">1 of 3 ratings added</div>
    <button class="button-primary py-[9px]" onclick="parent.location.href = '/preview/onboarding/assigned-skills'">Next Step</button>
  </div>
</footer>
```

When the RoleSelect view is rendered in the Visualizer, all custom tags are dynamically replaced with component html... and the final html is rendered! -->
