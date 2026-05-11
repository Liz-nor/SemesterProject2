import { showModal } from './showModal.js';
import { loginUser } from '../../services/auth.js';

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
          <p>Don't have an account? <a href="#/register" id="registerLink">Register here</a></p>
        <div id="loginMessage" class="text-danger small"></div>

        <button type="submit" class="btn btn-primary w-100">
          Login
        </button>
      </form>
    `,
  });

  const form = document.getElementById('loginForm');
  const message = document.getElementById('loginMessage');
  const emailInput = document.getElementById('loginEmail');
  const registerLink = document.getElementById('registerLink');

  registerLink.addEventListener('click', () => {
    modalInstance.hide();
    window.location.hash = '#/register';
  });
  modalElement.addEventListener('shown.bs.modal', () => {
    emailInput?.focus();
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const credentials = {
      email: form.email.value.trim(),
      password: form.password.value.trim(),
    };

    try {
      const profile = await loginUser(credentials);
      console.log('Login successful:', profile);
      modalInstance.hide();
    } catch (error) {
      console.error(error.message);
    }
  });
}
