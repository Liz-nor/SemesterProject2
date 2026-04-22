import { showModal } from './showModal.js';

export function openLoginModal() {
  const { modalElement, modalInstance } = showModal({
    title: 'Login',
    body: `
      <form id="loginForm">
        <div class="mb-3">
          <label for="loginEmail" class="form-label">Email</label>
          <input
            type="email"
            class="form-control"
            id="loginEmail"
            name="email"
            required
          >
        </div>

        <div class="mb-3">
          <label for="loginPassword" class="form-label">Password</label>
          <input
            type="password"
            class="form-control"
            id="loginPassword"
            name="password"
            required
          >
        </div>

        <div id="loginMessage" class="text-danger small"></div>

        <button type="submit" class="btn btn-primary w-100">
          Login
        </button>
      </form>
    `,
  });

  if (!modalElement) return;

  const form = document.getElementById('loginForm');
  const emailInput = document.getElementById('loginEmail');
  const message = document.getElementById('loginMessage');

  modalElement.addEventListener('shown.bs.modal', () => {
    emailInput?.focus();
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = form.email.value.trim();
    const password = form.password.value.trim();

    try {
      message.textContent = '';

      // Temporary fake login
      // Replace this with your real login API call later
      if (!email || !password) {
        throw new Error('Please fill in all fields');
      }

      localStorage.setItem('accessToken', 'fake-token');
      localStorage.setItem(
        'profile',
        JSON.stringify({ email, name: email.split('@')[0] }),
      );

      modalInstance.hide();

      // Optional: refresh page UI after login
      window.dispatchEvent(new Event('authChanged'));
    } catch (error) {
      message.textContent = error.message;
    }
  });
}
