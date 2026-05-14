import { registerUser } from '../services/auth.js';

export function renderProfileForm({ mode = 'register', profile = {} } = {}) {
  // Ternary operator - short line if/else statement
  const app = document.getElementById('app');

  app.innerHTML = `
  <form class="container mt-4" style="max-width: 500px;" id="profileForm">
    <h1 class="mb-4">Create Account</h1>

    <div class="mb-3">
      <label for="username" class="form-label">Username <span class="text-danger">*</span></label>
      <input type="text" class="form-control" name="name" id="username" placeholder="f.eks Kari Normann" required>
      <div class="form-text">Letters, numbers, and underscores only.</div>
    </div>

    <div class="mb-3">
      <label for="email" class="form-label">Email <span class="text-danger">*</span></label>
      <input type="email" class="form-control" name="email" id="email" placeholder="name@stud.noroff.no" required>
      <div class="form-text">Must be a @stud.noroff.no address.</div>
    </div>

    <div class="mb-3">
      <label for="password" class="form-label">Password <span class="text-danger">*</span></label>
      <input type="password" class="form-control" name="password" id="password" placeholder="Minimum 8 characters" required>
    </div>

    <div class="mb-3">
      <label for="bio" class="form-label">Bio</label>
      <textarea class="form-control" name="bio" id="bio" rows="3" placeholder="Tell us something about you"></textarea>
    </div>

    <div class="mb-3">
      <label for="avatar" class="form-label">Avatar image URL</label>
      <input type="url" class="form-control" name="avatarUrl" id="avatar" placeholder="https://...">
    </div>

    <div class="mb-3">
      <label for="banner" class="form-label">Banner image URL</label>
      <input type="url" class="form-control" name="bannerUrl" id="banner" placeholder="https://...">
    </div>

    <div id="registerMessage" class="text-danger small mb-2"></div>
    <button type="submit" class="btn btn-nord w-100">Register</button>
    <p class="mt-3 text-center">Already have an account? <a href="#/home" id="backToLogin">Back to home</a></p>
  </form>
`;

  const form = document.getElementById('profileForm');

  if (!form) {
    console.warn('Register form not found');
    return;
  }

  const message = document.getElementById('registerMessage');

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    message.textContent = '';

    const name = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const bio = document.getElementById('bio').value.trim();
    const avatarUrl = document.getElementById('avatar').value.trim();
    const bannerUrl = document.getElementById('banner').value.trim();

    if (!name || !password || !email) {
      message.textContent = 'Please fill in all required fields.';
      return;
    }

    if (!email.endsWith('@stud.noroff.no')) {
      message.textContent = 'Email must be a @stud.noroff.no address.';
      return;
    }

    if (password.length < 8) {
      message.textContent = 'Password must be at least 8 characters.';
      return;
    }

    const userData = { name, email, password };
    if (bio) userData.bio = bio;
    if (avatarUrl)
      userData.avatar = { url: avatarUrl, alt: `${name}'s avatar` };
    if (bannerUrl)
      userData.banner = { url: bannerUrl, alt: `${name}'s banner` };

    try {
      await registerUser(userData);
      alert('Registration successful. You can now log in.');
      window.location.hash = '#/home';
    } catch (error) {
      message.textContent = error.message;
    }
  });
}
