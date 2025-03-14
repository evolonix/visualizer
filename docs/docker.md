# Docker

Developing apps today requires so much more than writing code. Multiple languages, frameworks, architectures, and discontinuous interfaces between tools for each lifecycle stage creates enormous complexity. Docker simplifies and accelerates your workflow, while giving developers the freedom to innovate with their choice of tools, application stacks, and deployment environments for each project.

To start the containers, use the `up` command:

```bash
docker compose up -d
```

To rebuild an image, use the `--build` flag:

```bash
docker compose up -d --build
```

To stop the containers, use the `down` command:

```bash
docker compose down
```

To stop and remove the containers, use the `down` command with the `--rmi all` flag:

```bash
docker compose down --rmi all
```

## Build for Production

To build the images for production, use the `build` command with the `-f` flag to specify the production configuration file:

```bash
docker compose -f docker-compose.prod.yml build
```

To build the Visualizer image only, specify the service name found in the configuration file:

```bash
docker compose -f docker-compose.prod.yml build visualizer
```

> NOTE: The production builds need the apps to be built to the `dist` directory before the images can be built.
> For example, the Visualizer app would be built with the `npx nx build app-visualizer` command prior to the above Docker command.

There are NPM scripts to help with the build process, which will first build the apps then build the Docker images:

```bash
npm run docker:build:prod # Builds all images
npm run docker:build:prod:visualizer # Builds the Visualizer image
npm run docker:build:prod:skills-platform # Builds the Skills Platform image
```
