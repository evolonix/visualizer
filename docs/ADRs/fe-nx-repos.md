# FE Mono-Repositories with Nx Workspaces

- Status: accepted, in-progress.
- Deciders:
  - Thomas Burleson, FE Principal Architect
  - Chris Whitchurch, Director Engineering (former)
  - Tat Ng, Senior VP Engineering (former)
- Date: Q1, 2022

## Context

Most software development teams use (a) a Poly-Repository approach to code management, and (b) a single-tree monolithic code structure to organize their code. These two patterns are easy defaults for teams to adopt... and create huge problems as the code complexity increases.

Using traditional, multiple FE repositories (aka PolyRepos) presents the following issues;

- version conflicts with dependencies
- forces non-atomic commits and testing
- significantly complicates debugging and fixes
- creates confusion regarding code ownership
- challenges to code maintenance
- de-centralizes documentation
- de-centralizes testing
- discourage team collaboration
- inhibits innovation
- inhibits CI/CD

Using a Monolithic codebase (aka Monolith) presents the following issues:

- inhibits incremental compiles
- increases build and debug times
- creates code sharing friction
- encourages 'copy pasta'; the antithesis of DRY
- encourages 'deep-import' spaghetti
- promotes technical debt

## Decision

Degreed will use a Nx Workspace to centralize all Frontend (FE) development within a Mono-repository. This repository will support

- multiple (1..n) applications,
- multiple (1..n) FE technologies (Angular, NodeJS, React, & NextJS),
- multiple (1..n) Typescript libraries,
- Degreed's HTML-1st Visualizer application and code assets
- Tailwind CSS + Improved integrations into the product-design processes,
- Leverage best practices for:
  - Code organization and GitWorkflows
  - Reactive architectures
  - Jest Testing,
- All FE documentation related to FE architectures, GitOps, and more

Our **mono-repository** choice is only focused on FrontEnd Web products (JavaScript & TypeScript) and supporting middle-tier NodeJS servers. For BackEnd (BE) technologies and database systems, the decisions and constraints for repository and code-organization constraints are separate concerns.

## Rationale

### Nx Workspaces

Nx provides tooling and conventions to enable teams to centralize all FE development within a single repository: a Mono-repository.

## Consequences

- AngularJS Migration
- Team Participation
- Support for Sass Support
- Grunt/Gulp Tooling
- Code Conventions
  - Libraries & Public APIs

## Considered Options

## Resources/References
