# engage-data-access

This library contains the interfaces and services used to interact with the
Engage server-side API over HTTP.

The HTTP services are not exposed directly via the API of the library.

Instead, their functionality is exposed via reactive facades.

## Running unit tests

Run `nx test lib-engage-data-access` to execute the unit tests.

## Generating the TypeScript request and response interfaces

Run the server-side application by following the VS Code instructions in this
[README](https://github.com/degreed/degreed-engage/blob/main/README.md).
