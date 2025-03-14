import { Authenticator, UserService } from '../auth';

const usersService = new UserService();
const authenticator = new Authenticator(usersService);

export const onIsAuthorized = (req, res, next) => {
  console.log('[Middleware] Authentication route guard ');

  const [status, message] = authenticator.isAuthorized(req);
  if (!status) return res.status(401).json({ authenticated: false, message });

  next();
};

/**
 * Logout known user and clear access token
 */
export const onLogoutUser = (req, res) => {
  const { userName } = req.body;
  authenticator.logout(userName);
  return res.status(200).json('success');
};

/**
 * Login user with password and publish access token
 */
export const onLoginUser = (req, res) => {
  const [status, response] = authenticator.login(req.body);
  return res.status(status).json(response);
};

/**
 * Show Welcome message
 */
export const onShowWelcome = (req, res) => {
  return res.send('Welcome to Engage API Server!');
};

/**
 * To easily support /api/auth GET + POST, just encode query params as body
 * params and then call the POST handler
 */
export const toPostRequest = (target: (req, res) => Record<string, never>) => {
  return (req, res) => {
    const { userName, password } = req.query;
    req.body = { ...req.body, userName, password };

    return target(req, res);
  };
};
