import { registerUser } from '../services/auth.js';

export function renderProfileForm({ mode = 'register', profile = {} } = {}) {
  // Ternary operator - short line if/else statement
  const app = document.getElementById('app');

  app.innerHTML = `
  <form class="container mt-4" id="profileForm">
    <h1 class="mb-4">${mode === 'edit' ? 'Edit Profile' : 'Create Account'}</h1>
  <div class="mb-3">
    <input type="text" class="form-control" name="name" id="floatingName" placeholder="Your name">
  </div>

  <div class=" mb-3">
    <input type="email" class="form-control" name="email" id="floatingInput" placeholder="name@stud.noroff.no">
  </div>

  <div class="mb-3">
    <input type="password" class="form-control" name="password" id="floatingPassword" placeholder="Password">
  </div>

  <div class="mb-3">
    <textarea class="form-control"  placeholder="Tell us something about you" name="bio" id="floatingTextarea2" style="height: 100px" ></textarea>
  </div>

  <div class="mb-3">
    <label for="profilePictureUrl" class="form-label">Profile Picture URL</label>
    <input name="profilePictureUrl" type="url" class="form-control" id="profilePictureUrl" placeholder="https://example.com/avatar.jpg" value="${profile?.avatar?.url || ''}">
  </div>
  <div class="mb-3">
    <label for="bannerPictureUrl" class="form-label">Banner Picture URL</label>
    <input name="bannerPictureUrl" type="url" class="form-control" id="bannerPictureUrl" placeholder="https://example.com/banner.jpg" value="${profile?.banner?.url || ''}">
  </div>

<button type="submit" class="btn btn-nord my-3">${mode === 'edit' ? 'Save Changes' : 'Register'}</button>

<div id="registerMessage" class="text-danger small mt-2"></div>
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

    window.location.hash = '#/profile';
    const userData = {
      name: form.name.value.trim(),
      email: form.email.value.trim(),
      password: form.password.value.trim(),
      bio: form.bio.value,
    };

    if (!userData.email.endsWith('@stud.noroff.no')) {
      console.error('Email must be a stud.noroff.no address');
      return;
    }

    if (!userData.name || !userData.password) {
      message.textContent = 'Please fill in all required fields.';
      return;
    }

    try {
      await registerUser(userData);
      alert('Registration successful. You can now log in.');
    } catch (error) {
      alert(error.message);
    }
  });
}
