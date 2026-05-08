import { showModal } from '../components/modals/showModal';

export function requireLogin() {
  const token = localStorage.getItem('accessToken');

  if (token) {
    return true;
  }

  showModal({
    title: 'Login Required',
    body: `
        <p>You need to be logged in to access this page.</p>
        <a href="#/login" class="btn btn-primary">Go to Login</a>
        `,
  });
  return false;
}
