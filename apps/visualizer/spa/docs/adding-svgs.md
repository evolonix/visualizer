# How to properly add an SVG to your markup

When copying an SVG such as an icon from Figma, you will get inline fill or stroke colors. Here is an example of an SVG copy from Figma:

```html
<!-- Icon: chevron-down -->
<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M13 5.5L8 10.5L3 5.5" stroke="#44515A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
</svg>
```

The `fill` and `stroke` attributes are inline styles that will override any CSS styles you apply to the SVG. To properly add an SVG to your markup, you should update the `fill` and `stroke` attribute values with `currentColor` and apply the text color on the SVG element or its parent. Here is the same SVG with the `stroke` attribute updated:

```html
<!-- Icon: chevron-down -->
<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M13 5.5L8 10.5L3 5.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
</svg>
```

Then, you can apply the `text-*` color on the SVG or its parent, or omit it and allow the SVG to inherit the text color from its parent. Here is an example of applying the `text-neutral-600` color to the SVG:

```html
<!-- Icon: chevron-down -->
<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" class="text-neutral-600">
  <path d="M13 5.5L8 10.5L3 5.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
</svg>
```

This approach is more flexible and allows you to change the text color without updating the SVG's inline styles.
