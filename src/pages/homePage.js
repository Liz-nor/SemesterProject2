import { BASE_URL } from '../services/apiClient.js';
import { setupPagination } from '../components/pagination.js';
import { searchBar } from '../components/searchBar.js';
import { formatDate } from '../utils/formatDate.js';

export async function homePage() {
  const app = document.getElementById('app');

  app.innerHTML = `<p>Loading...</p>`;

  try {
    const response = await fetch(`${BASE_URL}/auction/listings?_bids=true`);
    const data = await response.json();

    app.innerHTML = `
    <div class="container d-flex gap-3 align-items-center mb-4">
      <div class="dropdown" id="categoryDropdown">
        <button class="btn btn-outline-secondary" data-bs-toggle="offcanvas" data-bs-target="#menu">☰Categories
          </button>
          <div class="offcanvas offcanvas-start" tabindex="-1" id="menu">
            <div class="offcanvas-header">
              <h5 class="offcanvas-title">Categories</h5>
              <button type="button" class="btn-close" data-bs-dismiss="offcanvas"></button>
            </div>
            <div class="offcanvas-body">
            <select id="tagFilter" class="form-select w-auto">
              <option value="">All tags</option>
            </select>
            </div>
          </div>
      </div>
      <div id="searchBarContainer" class="flex-grow-1"></div>
      <button id="sellButton" class="btn btn-nord mb-4">SELL</button>
      <button id="buyButton" class="btn btn-nord mb-4">BUY</button>
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
    const allListings = data.data;

    const tagFilter = document.getElementById('tagFilter');

    function getAllTags(listings) {
      const tagSet = new Set();

      listings.forEach((item) => {
        item.tags?.forEach((tag) => tagSet.add(tag));
      });

      return [...tagSet];
    }

    function renderTagDropdown(listings) {
      listings.forEach((tag) => {
        const option = document.createElement('option');
        option.value = tag;
        option.textContent = tag;

        tagFilter.appendChild(option);
      });
    }

    function filterByTag(listings, selectedTag) {
      if (!selectedTag) return listings;

      return listings.filter((item) => item.tags?.includes(selectedTag));
    }

    renderTagDropdown(getAllTags(allListings));

    tagFilter.addEventListener('change', () => {
      const filtered = filterByTag(allListings, tagFilter.value);
    });

    setupPagination(allListings);
    searchBar(allListings);
  } catch (error) {
    app.innerHTML = `<p>Something went wrong</p>`;
    console.error(error);
  }
}

export function generatePosts(listings, container) {
  listings.forEach((item, index) => {
    if (index === 3) {
      renderAddCard(container);
    }

    const highestBid = item.bids?.length
      ? Math.max(...item.bids.map((b) => b.amount))
      : null;

    const card = document.createElement('div');
    card.className = 'col-10 col-md-6 col-lg-4 mb-4';
    card.style.cursor = 'pointer';
    card.addEventListener('click', () => {
      window.location.href = `#/listing/${item.id}`;
    });
    const hasImage = item.media?.[0]?.url;

    card.innerHTML = `
        <div class="card h-100 p-3 hover-shadow">
        ${
          hasImage
            ? `
        <img
        src="${item.media?.[0]?.url}"
        alt="${item.title}"
        class ="card-img-top img-fluid"
        style="height: 300px; object-fit: contain;">
        `
            : `
        <div
        class="d-flex align-items-center justify-content-center align-items-center bg-light text-muted"
        style="height: 300px;">
        <i class="bi bi-image" style="font-size: 2rem;"></i>
        <span>No image available</span>
        </div>
        `
        }
        <p>Bid Count: ${item._count?.bids ?? 0}</p>
        <p>First bid amount: ${item.bids?.[0]?.amount ?? 'No bids yet'}</p>
        <h2>${item.title}</h2>
        <p>${formatDate(item.created)}</p>
        <p>${formatDate(item.endsAt)}</p>
        
        <p>Current bid: ${highestBid ?? 'No bids yet'}</p>
        <div class="d-flex w-50px justify-content-between align-items-center">
        <button class="btn btn-nord">View Listing</button>
        <button class="btn btn-secondary mt-2">Make a bid</button>
        </div>
        </div>
        `;

    container.appendChild(card);
  });
}

function renderAddCard(container) {
  const addCard = document.createElement('div');
  addCard.className = 'col-12 mb-4';

  addCard.innerHTML = `
    <div class="card p-4 text-center bg-light">
      <img class="img-fluid" src="../public/images/1.png" alt="Add Listing" style="max-height: 200px; object-fit: cover; position: bottom;">
      <h2 class="h5 mb-2">Add your own listing</h2>
      <p class="mb-3">Start selling and receive bids today</p>
      <button class="btn btn-nord">Create Listing</button>
    </div>
  `;
  container.appendChild(addCard);
}
