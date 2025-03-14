# Engage API NodeJS Services

Engage API uses a NodeJS Express + Json-Server to provide mock REST APIs for local development.

<img width="1004" alt="image" src="https://user-images.githubusercontent.com/210413/182897301-9a06c90a-264f-4e86-8eac-a3b19b880d82.png">

<br/>

## Running the Engage API Server

Developer use the terminal shell to launch the Engage API server:

```shell
npx serve server-engage
```

which should then respond with something similar to:

```shell
> fe-nx@0.0.2 server-engage
> nx serve server-engage


> nx run engage-server:serve
webpack compiled successfully (b787cda96f860524)
Debugger listening on ws://localhost:9229/a25eb0bf-81d2-4b62-82f3-13610b3c5c6d

Engage API REST Services
http://localhost:3333/api/v2.0

Rules database: 'assets/database/rules.json'
[Protected] http://localhost:3333/api/v2.0/rules
```

Running on port '3333', the server provides REST access for users and rules:

```shell
http://localhost:3333/api/v2.0/
```

### Semantic URLs

Business Rules can be access using the following HTTP procotols and versioned URLs:

- GET `/rules` returns a list of all known rules; based on criteria
- GET `/rules/<rule-id>` loads specific business rule with details; from the database
- DELETE `/rules/<rule-id>` deletes the business rule; returns `<rule_id>`
- PUT `/rules/<rule-id>` will update the specified business rule; returns full `rule`
- PATCH `/rules/<rule-id>` will update parts of the specified rule; returns full `rule`

All of these endpoints will return `pagination` information in the response!

> Note that Rules are 'protected' routes and require user login and JWT access tokens.

---

## API Documentation

Here are links to relevant docs and services used within the Engage SPA:

- [Remote REST API](https://github.com/degreed/fe-workspace/tree/main/libs/shared/remote-api/engage) Documentation

---

## Rules Database

The Engage business rules JSON database is stored in `assets/database/rules.json`. Developers can access this database with the following url:

```shell
http://localhost:3333/api/v2.0/rules
```

---

### Protected Routes: Rules

The Rules API (`/rules/*`) are protected and require an access token that is returned during `/auth/token`. This access token can be provided in the GET URL with a `token=xxx` query param.

###### Sample URL: "get all rules" with access token

```shell
http://localhost:3333/api/v2.0/rules?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyTmFtZSI6IlRob21hcyIsInBhc3N3b3JkIjoibm9uZSIsImlhd
```

More appropriately, the access token can be provided in an `authorization` header string; using the format `BEARER <accessToken>`.All protected routes will require 1 of these two formats: `token` query param or `authorization` header.

### Paginated API Request/Response

This server emulates the PaginatedResponses API documents in [/libs/shared/remote-api/engage](https://github.com/degreed/fe-workspace/tree/main/libs/shared/remote-api/engage).

Developers are encouraged to review that document. The BE API will also emulate this `FE-Nx` API.

---

### Angular SPA Authentication

Angular SPAs use the following code to set the `authorization` header:

```ts
private modifyRequest(
    req: HttpRequest<any>,
    token: string | null
  ): HttpRequest<any> {
    if (!token) {
      return req;
    }

    return req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
  }
}
```

<br/>

## User Authentication

Users must authenticate before access to the 'protected' routes is allowed. The following routes are used for User registration and login:

- `/auth/token`: login user and return JWT access token if successful

Both GET and POST methods are supported and require `userName` and `password` params.

- GET `/auth/token?userName=xxx&password=xxx` to login as a user
- POST `/auth/token` with body params `userName` and `password`

User information is saved in the JSON database `assets/database/users.json`.
