# FE-Nx Workspace

Degreed needs to be improve the quality, modularity, and delivery speed of its customer-facing web solutions. The Nx workspace will provide a unified development environment for all FE web (HTML) development work at Degreed.

> See bottom sections for more details...

## Repository Overview

Degreed is working to finish its internal migration from AngularJS (v1.x) → Angular (v13.x) within the Monolithic SPA. The FE-Nx workspace, in turn, focuses on migration from Angular → Nx to support modular code-development and multiple applications.

The Nx effort is also investigating how to:

- use Tailwind CSS to radically improve the designer-developer lifecycles and ease the pain of styling modular components.
- use Fresco with Material OSS + Tailwind
- publish the Browser Extension as a lightweight SPA
- define best practices for migration of other Degreed LxP functional groups
- migrate the marketing NextJS application (from React 3.x to React 18.x/NextJS 13.x)

## Applications

Current applications include:

- Designs-to-Web Visualizer
- Onboarding Angular SPA
- Engage SPA

The README links for these ^ applications will contain detailed information.

### Onboarding Pilot

> To build a foundation for other teams joining the Nx workspace, current efforts are focusing only on the migration of the **LxP Onboarding** experience.

![Onboarding Flow](https://i.imgur.com/cJL3nJU.jpg)

The UX itself does not appear complex. Yet it is the actual 'evolved' implementation of the UX that leads to significant challenges with any migration:

- UI components contain significant business logic
- UI style is a complex net of Scss imports
- Code imports reveal a tangled complexity that is not modular
- Services are highly coupled and resist independent migration

### Migrating Onboarding

The repository has been organized into 1..n applications using 1..n libraries to maximize reuse and code protection/ownership.

The following are the goals of the migration:

- Library organization, lazy loading, and reuse
- superior state management,
- clear separation of UI from the business layers,
- superior testing of the business layers,
- optimized loads of localized content, and
- Performant TTl and Lighthouse scoring
- more...

![Dependency Graph](https://i.imgur.com/JKjccyN.png)

Each library can be compiled and cached independently... and **'affected'** optimize recompiles and developer testing and validation.

Developers are encouraged to use the Nx Console for code generation and more:

![Nx Console](https://i.imgur.com/PgsdF1m.png)

## Getting Started

The Onboarding application has been configured to work offline; API calls are intercepted and live-data snapshots are used to as offline caches.

From the top level folder, run:

1. `npm install`
2. `npm install nx --global`
3. `nx serve lxp-onboarding`

---

## Why FE-Nx ?

The most important aspect of the FE-Nx workspace is the 'complete' separation of FE from BE development and tooling. Web and SPA applications will connect to the backend ONLY using REST, GraphQL, and WebSocket connections.

> No more virtual machines and huge repositories with .Net and Razor page code. No database code and tooling.

## Why Nx ?

Monolithic SPA development are out-dated solutions that do not scale for multiple teams, multiple products, parallel development. Nor do such code structures promote code reuse and enforce public APIs.

![Monorepo Misconceptions](https://i.imgur.com/sMB3NLH.png)

Developers should consider a mono-repos as a 'single repository' containing 'multiple projects'. The idea of multiple projects is already familiar to developers using NPM:

![NPM Principles](https://i.imgur.com/1pILFnd.png)

Nx enhances the developer experience (DevX) using a mono-repository + Nx toolings and conventions.

- Modular libraries with great dependency management
- Incremental builds with caching
- Super-fast build and compile times
- Super-fast Jest test times
- Improved linting and code protection
- Unified tooling for code generators and IDE integrations
- Support for Angular, React, NextJS, Node, and TypeScript
- Support for Cypress and Storybook
- Single package.json for entire repo

---

### More Nx help

Visit the [Nx Documentation](https://nx.dev) to learn more.

### ☁ Nx Cloud

#### Computation Memoization in the Cloud

![Nx Cloud](https://raw.githubusercontent.com/nrwl/nx/master/images/nx-cloud-card.png)

Nx Cloud pairs with Nx in order to enable you to build and test code more rapidly, by up to 10 times. Even teams that are new to Nx can connect to Nx Cloud and start saving time instantly.

Teams using Nx gain the advantage of building full-stack applications with their preferred framework alongside Nx’s advanced code generation and project dependency graph, plus a unified experience for both frontend and backend developers.

Visit [Nx Cloud](https://nx.app/) to learn more.
