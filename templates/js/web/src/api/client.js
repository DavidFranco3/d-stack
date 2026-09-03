import { FluentRestClient } from 'fluent-rest-client';

/**
 * Pre-configured FluentRestClient instance for D-Stack Web.
 *
 * Authentication is handled with an httpOnly cookie set by the API,
 * so no token is stored in localStorage (XSS-safe).
 */
export const api = new FluentRestClient('/api', {
  onAuthError: () => {
    // Session expired — redirect to login (avoid loops when already there)
    if (!window.location.pathname.startsWith('/login')) {
      window.location.href = '/login';
    }
  },
});

export default api;