import { homePage } from '../pages/homePage.js';
import { profilePage } from '../pages/profilePage.js';
import { registerPage } from '../pages/registerPage.js';
import { isLoggedIn } from '../services/auth.js';

const routes = {
  '#/': homePage,
  '#/home': homePage,
  '#/profile': profilePage,
  '#/register': registerPage,
};

export function router() {
  const hash = window.location.hash || '#/';
  const page = routes[hash] || notFoundPage;
  page();
}

export function initRouter() {
  window.addEventListener('hashchange', router);
  window.addEventListener('load', router);
}
