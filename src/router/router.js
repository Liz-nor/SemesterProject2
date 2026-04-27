import { homePage } from '../pages/homePage.js';
import { profilePage } from '../pages/profilePage.js';
import { registerPage } from '../pages/registerPage.js';
import { listingDetailsPage } from '../pages/listingDetailsPage.js';

function notFoundPage() {
  const app = document.getElementById('app');
  app.innerHTML = `<h1>404 - Page Not Found</h1>`;
}
const routes = {
  '#/': homePage,
  '#/home': homePage,
  '#/profile': profilePage,
  '#/register': registerPage,
  '#/listing/:id': listingDetailsPage,
};

export function router() {
  const hash = window.location.hash || '#/';
  if (hash.startsWith('#/listing/')) {
    listingDetailsPage();
  } else if (hash === '#/') {
    homePage();
  }
  const page = routes[hash] || notFoundPage;
  page();
}

export function initRouter() {
  window.addEventListener('hashchange', router);
  window.addEventListener('load', router);
}
