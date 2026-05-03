import { homePage } from '../pages/homePage.js';
import { profilePage } from '../pages/profilePage.js';
import { registerPage } from '../pages/registerPage.js';
import { listingDetailsPage } from '../pages/listingDetailsPage.js';
import { createListingPage } from '../pages/createListingPage.js';
import { renderEditListingPage } from '../pages/editListingPage.js';
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
  '#/create-listing': createListingPage,
  // '#/edit-profile': editProfilePage,
  '#/edit-listing/:id': renderEditListingPage,
};

export function router() {
  const hash = window.location.hash || '#/';

  if (hash.startsWith('#/listing/')) {
    listingDetailsPage();
    return;
  }

  if (hash.startsWith('#/edit-listing/')) {
    renderEditListingPage();
    return;
  }

  if (hash.startsWith('#/profile/')) {
    profilePage();
    return;
  }

  const page =
    routes[hash] ||
    (hash.startsWith('#/listing/') ? listingDetailsPage : notFoundPage);
  page();
}

export function initRouter() {
  window.addEventListener('hashchange', router);
  window.addEventListener('load', router);
}
