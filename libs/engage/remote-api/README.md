# Engage REST API

The Engage API follows REST best practices and includes

- semantic versioning in the URL root,
- plural entity 'noun' names, and
- the use of common HTTP methods to indicate desired 'action'

<br/>

---

## Paginate DataServices

REST endpoints that provide data paginated on the server have special requirements. All calls related to paginated data should return payload responses that <u>include</u> current pagination information.

Paginated responses are affected not only by search and filtering criteria but also by sorting, desire page, and page size settings. Without **payloads** + **pagination** information, many FE scenarios will NOT be supported without _convoluted/extra-logic_ and server calls.

Consider the following request criteria often found used in <u>server-paginated dataservices</u>:

```ts
export interface RulesPaginationParams {
  page?: number;
  pageSize?: number;

  sortBy?: string;
  sortDirection?: string;

  searchBy?: string;
  filterBy?: string;
}
```

All REST endpoints that support server-paginated responses must include the following `ServerPagination` information in each response:

```ts
export interface ServerPagination {
  page: number;
  pageSize: number;
  numPages: number;
  totalResults: number;
}
```

In fact, all responses to FE consumers should include the following fields: `status`, `payload`, and `pagination`:

```ts
export interface PaginatedRestResponse<T extends Entity | Entity[]> {
  payload: T;
  status: {
    code: number;
    message?: string;
    exception?: Record<string, never>;
  };
  pagination: {
    page: number;
    pageSize: number;
    numPages: number;
    totalResults: number;
  };
}
```

<br/>

---

## Rules

The Rules API is a subset of paginated request/response APIs at Degreed. Here is an example `loadRules()` URL:

`https://dev.degreed.com/api/v1.0/rules?page=3&pageSize=24`

### Rule EndPoints

<br/>

| URL                    | HTTP Method | Action           |
| :--------------------- | ----------: | :--------------- |
| `/api/v1.0/rules`      |         GET | `loadRules()`    |
| `/api/v1.0/rules`      |        POST | `createRule()`   |
| `/api/v1.0/rules/<id>` |         GET | `loadRuleByID()` |
| `/api/v1.0/rules/<id>` |         PUT | `saveRule()`     |
| `/api/v1.0/rules/<id>` |       PATCH | `updateRule()`   |
| `/api/v1.0/rules/<id>` |      DELETE | `deleteRule()`   |

<br/>

Each endpoint may have 1..n query parameters than can be used to refine search results OR the pagination response(s). Query params may include `searchBy`, `sort`, `direction`, `filter`, `page`, and `pageSize`

<br/>

#### 1. `loadRules()`

Get a list of paged rules

**GET** `/api/v1.0/rules`

Headers

```
Authorization: Bearer eyJhb...jFgEE
```

Optional Parameters

```
page=1      // default vale if page has not explicitly set
pageSize=12 // default if pageSize is not explicitly set
```

##### Response

If either the `page` or `pageSize` pagination param is provided, pagination data and the requested page results are returned.

Conditions:

- If the `page` requested is out-of-range, then the last page is returned.

<br/>

Future enhancements:

If ALL the Rules are desired with the `/rules` endpoint, then it is recommended that the `pageSize=all` query parameter is used. This API enhancement would simultaneously support UIs uninterested in pagination and UIs requiring pagination.

> This enhancement wil not be supported in v1.0; as there are no FE requirements for this feature

<br/>

```json
{
  "payload": [
    {
      "id": "79c919be-3ee5-493e-a630-dc6f8a807b61",
      "name": "Qui facere in corporis sunt dolores in",
      "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent volutpat eget leo et placerat.",
      "frequency": 1,
      "activation": "conditions",
      "conditions": [...],
      "actions": ["Send Email"],
      "creatorName": "Oscar Turner",
      "createdAt": "2022-01-27T12:53:19.813Z",
      "modifierName": "Oscar Turner",
      "modifiedAt": "2022-09-27T14:43:29.510Z",
      "isActive": false
    },
    {
      "id": "26e0a1b3-d9a3-447d-a0e9-d64e53b4da56",
      "name": "Neque ipsa assumenda",
      "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent volutpat eget leo et placerat.",
      "frequency": 1,
      "activation": "conditions",
      "conditions": [...],
      "actions": ["Send Custom Email"],
      "creatorName": "Ms. Damon Pfannerstill",
      "createdAt": "2022-01-27T12:53:19.813Z",
      "modifierName": "Oscar Turner",
      "modifiedAt": "2022-09-27T14:43:29.510Z",
      "isActive": false
    }
  ],
  "pagination": {
    "page": 1,
    "pageSize": 12,
    "numPages": 1,
    "totalResults": 2
  },
  "status": { "code": 200 }
}
```

> The response above is a partial depiction. See [rule-model.ts]('https://github.com/degreed/fe-workspace/blob/main/libs/shared/remote-api/engage/src/lib/rules/rule-model.ts') for details.

<br/>

#### 2. `createRule()`

Create a rule

##### Conditions

- Without sorting or filtering criteria specified, rule is added to the 'end' of the list
- the `pagination` information will specify the page that contains new rule (based on current pageSize settings)

**POST** `/api/v1.0/rules`

Headers

```
Authorization: Bearer eyJhb...jFgEE
```

Optional Parameters

```
pageSize=12
```

Body

```json
{
  "name": "Example Rule",
  "description": "Lorem ipsum dolor sit amet",
  "frequency": 1
}
```

##### Response

The created rule is returned along with pagination data

- reflecting what page the new rule belongs to, and
- the page results that include the new rule.
- the page is determined by any current sorting and filtering.
- If the pagination paramter is not provided, the last page is returned using the default page size.

Client applications will need to call `loadRules()` with this pagination information if full pageset (containing the rule) is desired.

```json
{
  "payload": {
    "id": "f84cc8af-238b-4656-83c1-da3744a70a4d",
    "name": "Example Rule",
    "description": "Lorem ipsum dolor sit amet",
    "frequency": 1,
    "activation": "conditions",
    "conditions": [...],
    "actions": ["Send Email"],
    "creatorName": "Oscar Turner",
    "createdAt": "2022-01-27T12:53:19.813Z",
    "modifierName": "Oscar Turner",
    "modifiedAt": "2022-09-27T14:43:29.510Z",
    "isActive": false
  },
  "pagination": {
    "page": 1,
    "pageSize": 12,
    "numPages": 1,
    "totalResults": 3
  },
  "status": { "code": 200 }
}
```

#### 3. `saveRule()`

Update an existing rule.

**PUT** `/api/v1.0/rules/f84cc8af-238b-4656-83c1-da3744a70a4d`

Headers

```
Authorization: Bearer eyJhb...jFgEE
```

Optional Parameters

```
pageSize=12
```

Body

```json
{
  "id": "f84cc8af-238b-4656-83c1-da3744a70a4d",
  "name": "Example Modified Rule",
  "description": "Lorem ipsum dolor sit amet",
  "frequency": 1,
  "activation": "conditions",
  "actions": ["Send Email"],
  "isActive": false
}
```

##### Response

The updated rule is returned

- along with pagination data reflecting what page the rule belongs to, and
- the page results that include the rule.
- the page is determined by any current sorting and filtering.

If the pagination paramter is not provided, the page is determined and returned using the default page size.

```json
{
  "payload": {
    "id": "f84cc8af-238b-4656-83c1-da3744a70a4d",
    "name": "Example Modified Rule",
    "description": "Lorem ipsum dolor sit amet",
    "frequency": 1,
    "activation": "conditions",
    "conditions": [...],
    "actions": ["Send Email"],
    "creatorName": "Oscar Turner",
    "createdAt": "2022-01-27T12:53:19.813Z",
    "modifierName": "Oscar Turner",
    "modifiedAt": "2022-09-27T14:43:29.510Z",
    "isActive": false
  },
  "pagination": {
    "page": 1,
    "pageSize": 12,
    "numPages": 1,
    "totalResults": 3
  },
  "status": { "code": 200 }
}
```

<br/>

## Conditions

When requesting Condition data from the server, the responses will NOT include any pagination information; Conditions are not paginated.

<br/>

### Condition EndPoints

<br/>

| URL                                                    | HTTP Method | Action              |
| :----------------------------------------------------- | ----------: | :------------------ |
| ~~`/api/v1.0/rules/<rule-id>/conditions`~~             |         GET | ~~Not Supported~~   |
| ~~`/api/v1.0/rules/<rule-id>/conditions/<type>`~~      |         GET | ~~Not Supported~~   |
| `/api/v1.0/rules/<rule-id>/conditions/<type>`          |        POST | `createCondition()` |
| ~~`/api/v1.0/rules/<rule-id>/conditions/<type>/<id>`~~ |         GET | ~~Not Supported~~   |
| `/api/v1.0/rules/<rule-id>/conditions/</type>/<id>`    |         PUT | `saveCondition()`   |
| ~~`/api/v1.0/rules/<rule-id>/conditions/<type>/<id>`~~ |       PATCH | ~~Not Supported~~   |
| `/api/v1.0/rules/<rule-id>/conditions/<type>/<id>`     |      DELETE | `deleteCondition()` |

<br/>

#### 1. `createCondition()`

Create a condition of given type for a rule

###### Conditions

**POST** `/api/v1.0/rules/f84cc8af-238b-4656-83c1-da3744a70a4d/conditions/event`

Headers

```
Authorization: Bearer eyJhb...jFgEE
```

Body

```json
{
  "type": "attribute",
  "requirement": "With",
  "trait": "Job Role",
  "operator": "Is",
  "value": "Director"
}
```

##### Response

The created condition is returned

```json
{
  "payload": {
    "id": "c0b5b9f9-5b9f-4b9f-9b5c-9f5b9f5b9f5b",
    "type": "attribute",
    "order": 1,
    "requirement": "With",
    "trait": "Job Role",
    "operator": "Is",
    "value": "Director",
    "creatorName": "Oscar Turner",
    "createdAt": "2022-01-27T12:53:19.813Z",
    "modifierName": "Oscar Turner",
    "modifiedAt": "2022-09-27T14:43:29.510Z",
    "isActive": true
  },
  "status": { "code": 200 }
}
```

#### 2. `saveCondition()`

Update an existing condition

**PUT** `/api/v1.0/rules/f84cc8af-238b-4656-83c1-da3744a70a4d/conditions/event/c0b5b9f9-5b9f-4b9f-9b5c-9f5b9f5b9f5b`

Headers

```
Authorization: Bearer eyJhb...jFgEE
```

Body

```json
{
  "id": "c0b5b9f9-5b9f-4b9f-9b5c-9f5b9f5b9f5b",
  "type": "attribute",
  "order": 1,
  "requirement": "With",
  "trait": "Job Role",
  "operator": "Is",
  "value": "Manager",
  "isActive": true
}
```

##### Response

The updated condition is returned

```json
{
  "payload": {
    "id": "c0b5b9f9-5b9f-4b9f-9b5c-9f5b9f5b9f5b",
    "type": "attribute",
    "order": 1,
    "requirement": "With",
    "trait": "Job Role",
    "operator": "Is",
    "value": "Manager",
    "creatorName": "Oscar Turner",
    "createdAt": "2022-01-27T12:53:19.813Z",
    "modifierName": "Oscar Turner",
    "modifiedAt": "2022-09-27T14:43:29.510Z",
    "isActive": true
  },
  "status": { "code": 200 }
}
```

<br/>

---

<br/>

## Auth

| Action     | URL                     | HTTP Method |
| :--------- | :---------------------- | ----------: |
| `login()`  | `/api/v1.0/auth/token`  |        POST |
| `logout()` | `/api/v1.0/auth/logout` |        POST |

<br/>

#### 1. `login()`

Get an auth token to be usesd in the Authorization header as a Bearer token for protected endpoints.

##### Request

**POST** `/api/v1.0/auth/token`

Body

```json
{
  "username": "user@example.com",
  "password": "password"
}
```

##### Response

```json
{
  "status": {
    "code": 200,
  }
  "payload": {
    "userName": "user@degreed.com"
    "accessToken": "eyJhb...jFgEE",
    "refreshToken": "dfazdd...gdsdf"
    "expires": -1,
  }
}
```
