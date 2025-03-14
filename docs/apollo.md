# Apollo Design System

The Apollo Design System is a collection of reusable components, guidelines, and best practices that help teams design and build consistent user experiences across Degreed products.

## How do I use the Apollo Design System?

By default, any configuration you add in your own tailwind.config.js file is intelligently merged with the default configuration, with your own configuration acting as a set of overrides and extensions.

The presets option lets you specify a different configuration to use as your base, making it easy to package up a set of customizations that you’d like to reuse across projects.

You can use the Apollo Design System by configuring your Tailwind CSS config (`tailwind.config.ts`) in your project to use Degreed's custom Tailwind CSS presets.

```ts
import tailwindPreset from '@degreed/apollo-tailwind';

export default {
  presets: [tailwindPreset],
  // ...
} satisfies Config;
```

You can also use the React and Angular components from the Apollo CDK in your project (coming soon).
