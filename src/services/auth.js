import { post } from './apiClient.js';

const LOGIN_ENDPOINT = '/auth/login';

export function isLoggedIn() {
  return Boolean(localStorage.getItem('accessToken'));
}

export function updateAuthUI() {
  const loggedIn = isLoggedIn();
  document.querySelectorAll('.isloggedIn').forEach((el) => {
    el.style.display = loggedIn ? '' : 'none';
  });
  document.querySelectorAll('isLoggedOut').forEach((el) => {
    el.style.display = loggedIn ? 'none' : '';
  });
}

export async function loginUser(credentials) {
  try {
    const response = await post(LOGIN_ENDPOINT, credentials);

    const { accessToken, ...profile } = response.data;

    if (accessToken) {
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('profile', JSON.stringify(profile));
      return profile;
    } else {
      throw new Error('Login successful, but no access token received.');
    }
  } catch (error) {
    throw error;
  }
}

export function logoutUser() {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('profile');
  alert('User has been logged out.');
}
