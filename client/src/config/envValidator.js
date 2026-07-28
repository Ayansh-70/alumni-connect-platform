export const validateClientEnv = () => {
  const isProd = import.meta.env.PROD;
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  if (isProd && !baseUrl) {
    throw new Error(
      "[FATAL] VITE_API_BASE_URL is missing in the production environment. " +
      "The application cannot start because it does not know where to send API requests."
    );
  }
};

const normalizeApiBaseUrl = (baseUrl) => {
  const normalizedBaseUrl = baseUrl.replace(/\/+$/, '');
  return normalizedBaseUrl.endsWith('/api') ? normalizedBaseUrl : `${normalizedBaseUrl}/api`;
};

export const getApiBaseUrl = () => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  if (import.meta.env.PROD) {
    return normalizeApiBaseUrl(baseUrl);
  }
  // Safe fallback for development only
  return normalizeApiBaseUrl(baseUrl || 'http://localhost:5000/api');
};
