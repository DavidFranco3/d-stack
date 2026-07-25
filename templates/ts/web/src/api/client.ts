import { FluentRestClient } from 'fluent-rest-client';

/**
 * Pre-configured FluentRestClient instance for D-Stack Web
 */
export const api = new FluentRestClient('/api', {
  onGetToken: async () => localStorage.getItem('token'),
  onSaveToken: async (token: string) => localStorage.setItem('token', token),
  onAuthError: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.reload();
  },
});

export default api;
