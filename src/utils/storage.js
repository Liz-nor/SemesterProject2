export const API_URL = 'https://v2.api.noroff.dev';
export const NOROFF_API_KEY = `d9384ada-1b61-4c9a-9eea-d4410a3e835f`;

export function saveUser(profile) {
  localStorage.setItem('accessToken', profile.accessToken);
  localStorage.setItem('profile', JSON.stringify(profile));
}

export function getToken() {
  return localStorage.getItem('accessToken');
}

export function getProfile() {
  return JSON.parse(localStorage.getItem('profile'));
}

export function editProfile(updatedProfile) {
  localStorage.setItem('profile', JSON.stringify(updatedProfile));
}

export function logout() {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('profile');
  alert('User has been logged out.');
}
