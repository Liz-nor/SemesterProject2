import { setupPagination } from '../components/pagination.js';
import { searchBar } from '../components/searchBar.js';
import { fetchListings } from '../services/listingsApi.js';
import { setupHomeControls } from '../components/homeControls.js';
import { filtersDropdown } from '../components/tagFilter.js';

export async function homePage() {
  const app = document.getElementById('app');

  app.innerHTML = `
    <div class="container d-flex gap-3 align-items-center mb-4">
      <div class="dropdown" id="categoryDropdown">
        <button class="btn btn-outline-secondary" data-bs-toggle="dropdown" data-bs-target="#menu">☰Categories
          </button>
          <div class="dropdown-menu" tabindex="-1" id="menu">
            <div class="dropdown-header d-flex justify-content-between align-items-center">
              <h5 class="dropdown-title">Tags</h5>
              <button type="button" class="btn-close" data-bs-dismiss="dropdown"></button>
            </div>

            <div class="dropdown-body">
            <div class="m-3" id="tagCheckboxContainer"></div>
            </div>
          </div>
      </div>
      <div id="searchBarContainer" class="flex-grow-1"></div>
      <button id="sellButton" class="btn btn-nord">SELL</button>
      <button id="buyButton" class="btn btn-nord">BUY</button>
    </div>
    
    <section class="container mt-4">
        <h1 class="text-center mb-4">Listings</h1>
        <div id="listingContainer" class="row"></div>
        
        <div class="d-flex justify-content-center align-items-center gap-3 m-4">
          <button id="prevBtn" class="btn btn-nord btn-sm">Previous</button>
          <span id="page-number"></span>
          <button id="nextBtn" class="btn btn-nord btn-sm">Next</button>
        </div>
      </section>
    `;

  try {
    const allListings = await fetchListings();

    setupHomeControls();
    searchBar(allListings);
    setupPagination(allListings);
    filtersDropdown(allListings);
  } catch (error) {
    app.innerHTML = `<p>Something went wrong</p>`;
    console.error(error);
  }
}
