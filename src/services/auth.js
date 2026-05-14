import { BASE_URL } from './apiClient.js';
import { saveUser } from '../utils/storage.js';

export async function registerUser(userData) {
  const response = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.errors?.[0]?.message || 'Registration failed');
  }

  return result.data;
}

export async function loginUser(credentials) {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.errors?.[0]?.message || 'Login failed');
  }

  saveUser(result.data);
  return result.data;
}
