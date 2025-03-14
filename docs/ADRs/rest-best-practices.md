# Best practices for REST API

REST APIs are one of the most common kinds of JSON web services available today.

![image](https://user-images.githubusercontent.com/210413/187441123-009d7668-f089-4c6d-91ba-d48ef3e20c08.png)

A REST API is an application programming interface that conforms to specific architectural constraints like: stateless communication and cacheable data. While REST APIs can be accessed through a number of communication protocols, most commonly, they are called over HTTPS.

> REST APIS are intended to be stateless and consistent communicate in the request (url + HTTP headers) and response (JSON) usages. The URL indicates the 'target' of the request while the HTTP method used (eg GET, PUT, POST, DELETE) indicates the action requested.

The guidelines below apply to REST API endpoints that will be called over the internet with HTTP.

- Accept and Respond with JSON
- Use nouns instead of verbs in endpoint paths
- Use logical nesting on endpoints
- Handle errors gracefully and return standard error codes
- Allow filtering, sorting, and pagination
- Cache data to improve performance
- Versioning our APIs (semantically correct URLs)
- Maintain good security practices
  - Use API keys to give existing users programmatic access
  - Role-based access

## Accept and Respond with JSON

When our REST API service responds with JSON that clients interpret it as such; we should set `Content-Type` in the response header to `application/json` when the request's response is issued.

> The only exception is if we’re trying to send and receive files between client and server. Then we need to handle file responses and send form data from client to server. But that is a topic for another time.

BE REST services should automatically set the `Content-Type` header in the response to `application/json; charset=utf-8` without any changes. Some HTTP clients (and many FE Web SPAs) look at the `Content-Type` response header and parse the data according to that format.
