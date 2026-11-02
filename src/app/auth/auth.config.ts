import { AuthConfig } from '@auth0/auth0-angular';
export const authConfig: AuthConfig  = {
  domain: 'dev-pu-4qw93.us.auth0.com',
  clientId: 'o72Pe8JC18OqIf0VGHC6zvgCVOp6wr92',
  authorizationParams: {
    redirect_uri: window.location.origin,
    audience: 'https://dev-pu-4qw93.us.auth0.com/api/v2/',
    scope: 'openid profile email'
  },
  useRefreshTokens: true,
  cacheLocation: 'localstorage'
};
