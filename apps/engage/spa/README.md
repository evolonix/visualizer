# Engage

Engage is an Angular single-page application (SPA) that supports management of Business Rules and Workflows for Degreed clients.

These business rules define actions and workflows that will be triggered based on events or non-events that happen within the Degreed application. Engage will allow such rules and workflows to be created and managed in the SPA and the workflows actioned in Degreed's server-tier background process.

<img width="1232" alt="image" src="https://user-images.githubusercontent.com/210413/182901098-b1a4e123-16a2-4e53-9388-d80d7cd22c07.png">

---

### Example Rules

- An event that occurs when a user completes onboarding. A HR employee
  might want to automatically assign the require security training to that user
  after they complete onboarding.

- A non-event might be that a user has not logged into Degreed for
  over 30 days. An organization might want to send a reminder email when this
  happens.

---

## Running the application

Run the server-side application by following the instructions in this
[README](https://github.com/degreed/degreed-engage/blob/main/README.md).

Run this SPA and a local JSON Server for FE development by executing the following
Nx script on the command line from the root directory of this repository.

```bash
npx nx serve app-engage
```

NOTE: The Nx `serve` target is configured to run the local JSON server in parallel with the Angular SPA using the `nx:run-commands` executor.

Navigate [here](http://locahost:4202) or launch the `Launch Engage (Edge)`
debugger profile (requires the `Microsoft Edge Tools for VS Code` extension to
be installed).

## Docs

Here are links to relevant docs and services used within the Engage SPA:

- [Remote REST API](https://github.com/degreed/fe-workspace/tree/main/libs/shared/remote-api/engage) Documentation
- Local [NodeJS Development Server](https://github.com/degreed/fe-workspace/tree/main/apps/engage/api) Documentation

## Tests

Run all Engage tests using the following command from the root of this
repository.

```bash
nx test app-engage
```

## Linting

Lint all Engage apps and libs using the following command from the root of this
repository.

```bash
nx lint app-engage
```

## Tests

See the [Testing the Engage SPA](https://github.com/degreed/fe-workspace/blob/main/docs/developer/testing-engage-spa.md) documtation for more information.
