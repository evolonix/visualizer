# Apollo Component Development Kit

> NOTE: PLEASE DO NOT EDIT ANY OF THE FILES HERE WITHOUT DISCUSSING CHANGES NEEDED WITH THE APOLLO TEAM FIRST.

This is a "read-only" copy of the Apollo CDK, originating in the `degreed/fe-workspace` repositiory.

It is being provided here as a copy until either: publishing the npm package to include the compiled Tailwind CSS output is in place; or the ACM FE codebase is moved into the `degreed/fe-workspace` repository.

There are multiple versions of this library, but only version 3 for Q3 2024 is included here, since the other versions aren't needed. This explains why there is a `v3` folder.

## How to use the Layout component

To use the Layout component, you first need to wrap any child content with it.

Then, provide a configuration that conforms to the `LayoutAspect` model found at [learnin.core.web/src/apollo/src/v3/components/layout/layout.model.ts](./src/v3/components/layout/layout.model.ts#L66).

> Note: We provide a static JSON file found at [learnin.core.web/src/apollo-layout/data/v3/degreed.config.json](../apollo-layout/data/v3/degreed.config.json) for now. This will soon be replaced by a call to a BE API endpoint to retrieve this data accurately configured for the user and org permissions.

Optionally, handle any events that correspond with features that are enabled in the configuration.

### Example

```tsx
import { Layout } from '@degreed/apollo-react-cdk';

import degreedConfiguration from './data/degreed.config.json';

// ...

const handleSwitchRole = (event: React.MouseEvent) => {
  console.log('Switching role via href on the link...', event);
};

// ...

<Layout configuration={degreedConfiguration.admin} onSwitchRole={handleSwitchRole}>
  {/* Routed children go here (e.g. <Routes><Route.../>...</Routes>) */}
</Layout>;

// ...
```
