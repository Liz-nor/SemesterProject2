import { showModal } from './showModal.js';
import { loginUser } from '../../services/auth.js';
import { navbar } from '../navbar.js';

export function openLoginModal() {
  const { modalElement, modalInstance } = showModal({
    title: 'Login',
    body: `
      <form id="loginForm">
        <div class="mb-3">
          <label for="loginEmail" class="form-label"></label>
          <input
            type="email"
            class="form-control"
            id="loginEmail"
            name="email"
            placeholder="name@stud.noroff.no"
            required
          >
        </div>

        <div class="mb-3">
          <label for="loginPassword" class="form-label"></label>
          <input
            type="password"
            class="form-control"
            id="loginPassword"
            name="password"
            placeholder="Password"
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
      navbar();
    } catch (error) {
      console.error(error.message);
    }
  });
}
