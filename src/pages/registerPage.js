import { registerUser } from '../services/auth.js';

export function registerPage() {
  const app = document.getElementById('app');

  app.innerHTML = `
  <form class="container mt-4" id="registerForm">

  <div class="mb-3">
  <input type="text" class="form-control" name="name" id="floatingName" placeholder="Your name">
</div>

<div class=" mb-3">
  <input type="email" class="form-control" name="email" id="floatingInput" placeholder="name@example.com">
</div>

<div class="mb-3">
  <input type="password" class="form-control" name="password" id="floatingPassword" placeholder="Password">
</div>

<div class="mb-3">
  <textarea class="form-control"  placeholder="Tell us something about you" name="bio" id="floatingTextarea2" style="height: 100px" ></textarea>
</div>

<div class="input-group mb-3">
  <label for="myfile" class="m-2">Select a file:</label>
  <input type="file" class="m-2" id="myfile" name="myfile"><br><br>
</div>

<button type="submit" class="btn btn-nord">Register</button>

<div id="registerMessage" class="text-danger small mt-2"></div>
</form>
`;

  const form = document.getElementById('registerForm');

  if (!form) {
    console.warn('Register form not found');
    return;
  }

  const message = document.getElementById('registerMessage');

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

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
