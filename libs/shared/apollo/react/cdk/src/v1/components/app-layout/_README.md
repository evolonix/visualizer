# Apollo Nav Component

The `Navigation` is a complex, composite component that will need to be implemented in both React and Angular.
The Navigation component is used to provide a consistent navigation experience across applications using the Apollo UI Design System.

The current Apollo `Nav` component is a React component that renders a sidebar navigation, header and footer.
After the changes listed below are ready (and tested), the Angular version of the component will be implemented:

- ACM + React Navigation
- SKills + React Navigation
- LxP + Angular Navigation

## Changelog

### 2023 versus 2024 versions

- Navigation
  - (options, icons, and links) is now completely data-driven
  - navigation items are moved from a JavaScript object to a JSON file
  - Remove accordions in favor of flyout menus
    ![](https://github.com/degreed/fe-workspace/assets/1501490/25655d55-89df-47b1-8000-af073aeca278)
  - Icons are dynamically loaded by icon name from the Apollo Icon library
    - This library uses Heroicons and will be prepared for React and Angular usages.
- Header bar
  - Product Switcher items are moved from a JavaScript object to a JSON file
  - Add an optional global search as a command palette to the header
    ![](https://github.com/degreed/fe-workspace/assets/1501490/b6b6e887-37b9-471d-8d85-3d839883f4e5)
