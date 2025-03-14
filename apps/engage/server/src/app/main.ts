import bodyParser from 'body-parser';
import jsonServer from 'json-server';
import { v4 as uuidv4 } from 'uuid';

import { onLoginUser, onLogoutUser, onShowWelcome, toPostRequest } from './routes/auth'; // onIsAuthorized
import { paginateResponse, transformPartialIDs, validateQueryParams } from './routes/response-paginator';

import { DATA } from './data';

const CURRENT_VERSION = '2.0';
const ROUTES = {
  welcome: '/',
  api: '/api',
  protected: /^\/api\/(?!\/auth).*$/,
  loginUser: `/api/auth/token`,
  logoutUser: `/api/auth/logout`,
};
const REWRITE_RULES = {
  '/api/organizations/:organizationId/engage/*': '/api/v2.0/$2', // Rewrite to match MVC's proxy
  '/api/v2.0/*': '/api/$1',
};

const port = process.env.port || 3333;
const server = jsonServer.create();
const router = jsonServer.router(DATA);
const middleware = [transformPartialIDs(router), validateQueryParams, ...jsonServer.defaults()];

// Override router's createId to return a UUID instead of an integer
router.db._.mixin({
  createId: () => uuidv4(),
});

server
  .use(bodyParser.urlencoded({ extended: true })) // to handle POST, PUT and PATCH
  .use(bodyParser.json())
  .use(middleware)
  .get(ROUTES.welcome, onShowWelcome)
  .post(ROUTES.logoutUser, onLogoutUser)
  .post(ROUTES.loginUser, onLoginUser)
  .get(ROUTES.logoutUser, toPostRequest(onLogoutUser)) // support GET + POST requests
  .get(ROUTES.loginUser, toPostRequest(onLoginUser)) // support GET + POST requests
  // .use( ROUTES.protected,     onIsAuthorized)                 // guard all `<api>/*` routes EXCEPT `<api>/auth` (routed above)
  .use(jsonServer.rewriter(REWRITE_RULES))
  .use(ROUTES.api, paginateResponse(router)) // default routing for DATA routes (/rules, etc...)
  .on('error', console.error)
  .listen(port, () => {
    console.log();
    console.log('Engage API REST Services');
    console.log(`http://localhost:${port}${ROUTES.api}/v${CURRENT_VERSION}`);
    console.log();
  });
