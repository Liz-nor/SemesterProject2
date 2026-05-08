import { Collapse } from 'bootstrap';
import { openLoginModal } from './modals/openLoginModal.js';
import { requireLogin } from '../utils/authGuard.js';

export function navbar() {
  const nav = document.getElementById('nav');

  nav.innerHTML = `
  <span class="seperator"></span>
  <nav class="navbar navbar-expand-lg bg-body-tertiary border-bottom">
  <div class="container-fluid">
    <a class="navbar-brand" href="#/home">
    <img 
    class="img-fluid" 
    style="height: 50px;"
    src="../public/images/nordbidLogo.png" 
    alt="NordBid Logo"></a>
    <p class="mt-3">Simple. Fair. Nordic.</p>
    <button
    class="navbar-toggler"
      type="button" 
      data-bs-toggle="collapse" 
      data-bs-target="#navbarSupportedContent" 
      aria-controls="navbarSupportedContent" 
      aria-expanded="false" 
      aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <ul class="navbar-nav me-auto mb-2 mb-lg-0">
        <li class="nav-item m-2">
          <a class="nav-link route-link active btn-nord btn" aria-current="page" href="#/home">Home</a>
        </li>
        <li class="nav-item m-2">
          <a class="nav-link route-link btn-nord btn" href="#/profile" onclick="if (!requireLogin()) return;">My Profile</a>
        </li>       
      </ul>
      <button id="registerButton" class="btn-nord btn m-2">Register</button>
      <button id="loginButton" class="btn btn-nord m-2">Login</button>
      <button id="logoutButton" class="btn btn-nord m-2">Logout</button>
    </div>
  </div>
</nav>`;

  const navbarCollapseEl = document.getElementById('navbarSupportedContent');
  const routeLinks = nav.querySelectorAll('.route-link');
  const loginButton = document.getElementById('loginButton');
  const registerButton = document.getElementById('registerButton');
  const logoutButton = document.getElementById('logoutButton');

  loginButton?.addEventListener('click', openLoginModal);
  registerButton?.addEventListener('click', () => {
    window.location.href = '#/register';
  });

  routeLinks.forEach((link) => {
    link.addEventListener('click', () => {
      if (window.innerWidth < 992) {
        const bsCollapse = Collapse.getOrCreateInstance(navbarCollapseEl);
        bsCollapse.hide();
      }
    });
  });

  logoutButton?.addEventListener('click', () => {
    localStorage.removeItem('token');
    alert('Logged out successfully!');
    window.location.href = '#/home';
  });
}
