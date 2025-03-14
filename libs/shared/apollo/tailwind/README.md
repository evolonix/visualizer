# Tailwind

> NOTE ABOUT RELEASE & DEPLOYMENT OF THIS NPM PACKAGE: After successfully publishing this package to Degreed's NPM registry (usually done as part of the CI/CD pipeline by creating a GitHub Release), you will need to manually deploy the package to Learn In's NPM registry. This can be done by running the following commands in the root of the repository:

```bash
# Replace ${{ github.ref_name }} with the name of the release tag
# For example:
# gh run download -n lib-shared-apollo-tailwind@1.0.0 -D ./output
gh run download -n ${{ github.ref_name }} -D ./output
cd ./output
npm pkg set name=@learnin-inc/apollo-tailwind
npm publish --registry https://npm.pkg.github.com/ --tag latest
cd ..
rm -rf ./output
```

Tailwind is a utility-first CSS framework for rapidly building custom designs. It's a great fit for teams who are building a design system and want to maintain a consistent look and feel across their entire application. It's also a great fit for teams who are working on a large application and want to be able to quickly iterate on designs without having to write custom CSS.

This library is a custom configuration of Tailwind CSS for use in applications built by Degreed.

## Getting started

To use Tailwind in your application, you need to install the `@degreed/apollo-tailwind` package:

```bash
npm install -D @degreed/apollo-tailwind
```

Once installed, you can install and use the `tailwindcss` package to generate a `tailwind.config.js` file in your project:

```bash
npm install -D tailwindcss
npx tailwindcss init
```

This will create a `tailwind.config.js` file in your project root. You can use this file to customize your Tailwind installation.

## Customizing Tailwind

The `tailwind.config.js` file is where you can import and use this library as a preset.

```javascript
module.exports = {
  presets: [require('@degreed/apollo-tailwind')],
  theme: {
    extend: {
      // ...
    },
  },
  plugins: [
    // ...
  ],
};
```

You can learn more about configuring Tailwind by reading the [documentation](https://tailwindcss.com/docs/configuration).

## This library in the workspace

This library is used in the workspace as a Tailwind CSS configuration preset for many projects. It is also published externally as an NPM package for use in other projects, such as the LXP and ACM.

The project is imported differently than other libraries in the workspace. Other libraries have their path specified in the `paths` object in the `tsconfig.base.json` file. This library is imported as a local, file-based NPM package, so it is not included in the `paths` object.

![](https://github.com/degreed/fe-workspace/assets/1501490/7353c06f-7217-47dd-9be8-b3bea7aeccd0)

Because of the way it is imported, when serving a project within the workspace, any changes to this library will not be reflected in the project until the project is rebuilt (restart dev server). This is because the project is importing the library as an NPM package, and the project is not watching the library for changes.
