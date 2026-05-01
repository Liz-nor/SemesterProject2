import { generateListings } from '../components/listingCard.js';

let allListings = [];
let currentPage = 1;
export const listingsPerPage = 12;

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

export function setupPagination(listings) {
  allListings = listings;
  currentPage = 1;

  const { prevBtn, nextBtn } = getPaginationElements();

  if (prevBtn) prevBtn.onclick = prevPage;
  if (nextBtn) nextBtn.onclick = nextPage;
  currentPage = Number(sessionStorage.getItem('currentPage')) || 1;
  displayPage(currentPage);
}

export function nextPage() {
  const totalPages = Math.ceil(allListings.length / listingsPerPage);
  sessionStorage.setItem('currentPage', currentPage);
  if (currentPage < totalPages) {
    currentPage++;
    displayPage(currentPage);
  }
}

export function prevPage() {
  if (currentPage > 1) {
    currentPage--;
    sessionStorage.setItem('currentPage', currentPage);
    displayPage(currentPage);
  }
}
