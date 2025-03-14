# GraphQL Dataservices

Instead of REST, this library enables GraphQL for its core dataservices.

A Docker instance should be running locally and developers can use both the

- GraphQL Playground: http://localhost:8032/graphql
- Docker Powershell Commands

## Powershell Commands

- - Start-SPDockerEnvironment (-ForceRecreate -Build)
- - Restore-SPDevEnvironment -RebuildAPIDockerImages
- - New-SPJsonWebToken -ExternalOrgId 735 -UserId 1196679 -ServiceEnvironment dgscu-default
