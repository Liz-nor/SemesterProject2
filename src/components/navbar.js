import { Collapse } from 'bootstrap';
import { openLoginModal } from './modals/openLoginModal.js';

export function navbar() {
  const nav = document.getElementById('nav');

  nav.innerHTML = `
  <span class="seperator"></span>
  <nav class="navbar navbar-expand-lg bg-body-tertiary border-bottom">
  <div class="container-fluid">
    <a class="navbar-brand" href="#/">
    <img 
    class="img-fluid" 
    style="height: 50px;"
    src="../public/images/nordbidLogo.png" 
    alt="NordBid Logo"></a>
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
        <li class="nav-item">
          <a class="nav-link route-link active" aria-current="page" href="#/">Home</a>
        </li>
        <li class="nav-item">
          <a class="nav-link route-link" href="#/profile">My Profile</a>
        </li>
        <li class="nav-item">
          <a class="nav-link route-link" href="#/register">Register</a>
        </li>       
      </ul>
      <button id="registerButton" class="btn-nord btn m-2">Register</button>
      <button id="loginButton" class="btn btn-nord m-2">Login</button>
    </div>
  </div>
</nav>`;

  const navbarCollapseEl = document.getElementById('navbarSupportedContent');
  const routeLinks = nav.querySelectorAll('.route-link');
  const loginButton = document.getElementById('loginButton');
  const registerButton = document.getElementById('registerButton');

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
}
