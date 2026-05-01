import { NOROFF_API_KEY } from '../utils/storage.js';
import { API_URL } from '../utils/storage.js';

export const BASE_URL = API_URL;

export async function apiClient(endpoint, options = {}) {
  const accessToken = localStorage.getItem('accessToken');

  const headers = {
    'Content-Type': 'application/json',
    'X-Noroff-API-Key': NOROFF_API_KEY,
    ...options.headers,
  };

  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  const config = {
    method: options.method || 'GET',
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  };

  const response = await fetch(BASE_URL + endpoint, config);

  if (!response.ok) {
    const errorMessage = await response.json()
      .then((data) => data?.errors?.[0]?.message)
      .catch(() => null);
    throw new Error(errorMessage || 'Something went wrong');
  }

  return response.status !== 204 ? response.json() : {};
}

export function get(endpoint) {
  return apiClient(endpoint);
}

export function post(endpoint, body) {
  return apiClient(endpoint, {
    method: 'POST',
    body,
  });
}

export function put(endpoint, body) {
  return apiClient(endpoint, {
    method: 'PUT',
    body,
  });
}

export function del(endpoint) {
  return apiClient(endpoint, {
    method: 'DELETE',
  });
}
