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
    <p class="mt-3"><strong>Simple. Fair. Nordic.</strong></p>
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
    <div class="collapse navbar-collapse d-flex justify-content-end" id="navbarSupportedContent">
      <ul class="navbar-nav mb-2 mb-lg-0">
        <li class="nav-item m-2">
          <a class="nav-link route-link active " aria-current="page" href="#/home">Home</a>
        </li>
        <li class="nav-item m-2">
          <a id="profileButton" class="nav-link route-link" href="#/profile">My Profile</a>
        </li> 
        <li class="nav-item m-2">
          <a id="registerButton" class="nav-link route-link" href="#/register">Register</a>
        </li> 
        <li class="nav-item m-2">
          <a id="loginButton" class="nav-link route-link" href="#">Login</a>
        </li>
        <li class="nav-item m-2">
          <a id="logoutButton" class="nav-link route-link" href="#/">Logout</a>
        </li>
      </ul>
    </div>
  </div>
</nav>`;

  const navbarCollapseEl = document.getElementById('navbarSupportedContent');
  const routeLinks = nav.querySelectorAll('.route-link');
  const profileButton = document.getElementById('profileButton');
  const loginButton = document.getElementById('loginButton');
  const registerButton = document.getElementById('registerButton');
  const logoutButton = document.getElementById('logoutButton');

  const isLoggedIn = localStorage.getItem('accessToken') !== null;

  profileButton.style.display = isLoggedIn ? '' : 'none';
  logoutButton.style.display = isLoggedIn ? '' : 'none';
  loginButton.style.display = isLoggedIn ? 'none' : '';
  registerButton.style.display = isLoggedIn ? 'none' : '';

  loginButton?.addEventListener('click', (event) => {
    event.preventDefault();
    openLoginModal();
  });

  profileButton?.addEventListener('click', (event) => {
    if (!requireLogin()) {
      event.preventDefault();
    }
  });

  logoutButton?.addEventListener('click', () => {
    if (!requireLogin()) return;
    {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('profile');
      alert('Logged out successfully!');
      window.location.href = '#/home';
    }
  });

  routeLinks.forEach((link) => {
    link.addEventListener('click', () => {
      if (window.innerWidth < 992) {
        const bsCollapse = Collapse.getOrCreateInstance(navbarCollapseEl);
        bsCollapse.hide();
      }
    });
  });
}
