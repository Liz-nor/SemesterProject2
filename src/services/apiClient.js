export const BASE_URL = 'https://v2.api.noroff.dev/auction';

export async function apiClient(endpoint, options = {}) {
  const { body, ...customOptions } = options;

  const accessToken = localStorage.getItem('accessToken');

  const headers = {
    'Content-Type': 'application/json',
    'X-Noroff-API-Key': NOROFF_API_KEY,
  };

  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  const config = {
    method: body ? 'POST' : 'GET',
    ...customOptions,
    headers: {
      ...headers,
      ...customOptions.headers,
    },
  };

  if (body) {
    if (body instanceof FormData) {
      config.body = body;
    } else {
      config.body = JSON.stringify(body);
      config.headers['Content-Type'] = 'application/json';
    }
  }
  try {
    const response = await fetch(BASE_URL + endpoint, config);
    const responseData = response.status !== 204 ? await response.json() : {};

    if (!response.ok) {
      alert(
        responseData?.errors?.[0]?.message ||
          'An error occurred while processing your request.',
      );
      const errorMessage =
        responseData?.errors?.Authorization?.[0]?.message ||
        'An error occurred while processing your request.';
      throw new Error(errorMessage);
    }
    return responseData;
  } catch (error) {
    console.error('API Client Error:', error);
    throw error;
  }
}

export const get = (endpoint) => apiClient(endpoint);
export const post = (endpoint, body) => apiClient(endpoint, { body });
export const put = (endpoint, body) =>
  apiClient(endpoint, { method: 'PUT', body });
export const del = (endpoint) => apiClient(endpoint, { method: 'DELETE' });
