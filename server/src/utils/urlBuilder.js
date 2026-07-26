/**
 * Centralized utility for generating frontend URLs.
 * 
 * Ensures that production never accidentally falls back to localhost.
 */
export const getFrontendUrl = (path = '') => {
  const isProd = process.env.NODE_ENV === 'production';
  const clientUrl = process.env.CLIENT_URL;

  // In production, envValidator guarantees this exists and is valid.
  if (!clientUrl) {
    if (isProd) {
      throw new Error('[FATAL] CLIENT_URL is missing in production environment');
    }
    return `http://localhost:5173${path.startsWith('/') ? path : `/${path}`}`;
  }

  const baseUrl = clientUrl.endsWith('/') ? clientUrl.slice(0, -1) : clientUrl;
  const safePath = path.startsWith('/') ? path : `/${path}`;

  return `${baseUrl}${safePath}`;
};
