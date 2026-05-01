import { generateListings } from '../components/listingCard.js';

let allListings = [];
let currentPage = 1;

export const listingsPerPage = 9;

function getPaginationElements() {
  return {
    container: document.getElementById('listingContainer'),
    pageNumberSpan: document.getElementById('page-number'),
    prevBtn: document.getElementById('prevBtn'),
    nextBtn: document.getElementById('nextBtn'),
  };
}

export function displayPage(page) {
  const { container, pageNumberSpan, prevBtn, nextBtn } =
    getPaginationElements();
  if (!container) {
    console.warn('Listing container not found');
    return;
  }

  const start = (page - 1) * listingsPerPage;
  const end = start + listingsPerPage;
  const listingsToDisplay = allListings.slice(start, end);

  container.innerHTML = '';
  generateListings(listingsToDisplay, container);

  const totalPages = Math.ceil(allListings.length / listingsPerPage);

  if (pageNumberSpan) {
    pageNumberSpan.textContent = `Page ${page} of ${totalPages}`;
  }

  if (prevBtn) prevBtn.disabled = page === 1;
  if (nextBtn) nextBtn.disabled = page === totalPages;

  window.scrollTo({ top: 0, behavior: 'smooth' });

  return listingsToDisplay;
}

export function getCurrentPage() {
  return currentPage;
}

export function setupPagination(listings) {
  allListings = listings;

  const { prevBtn, nextBtn } = getPaginationElements();

  if (prevBtn) prevBtn.onclick = prevPage;
  if (nextBtn) nextBtn.onclick = nextPage;
  currentPage = Number(sessionStorage.getItem('currentPage')) || 1;
  // sessionStorage.removeItem('currentPage');
  sessionStorage.clear();
  displayPage(currentPage);
}

export function nextPage() {
  const totalPages = Math.ceil(allListings.length / listingsPerPage);
  if (currentPage < totalPages) {
    currentPage++;
    displayPage(currentPage);
  }
}

export function prevPage() {
  if (currentPage > 1) {
    currentPage--;
    displayPage(currentPage);
  }
}
