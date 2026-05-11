import { openLoginModal } from '../components/modals/openLoginModal';
import { showModal } from '../components/modals/showModal';

export function requireLogin() {
  const token = localStorage.getItem('accessToken');

  if (token) {
    return true;
  } else {
    openLoginModal();
    return false;
  }
}
