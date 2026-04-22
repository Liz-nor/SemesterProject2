import { BASE_URL } from '../services/apiClient.js';
import { setupPagination } from '../components/pagination.js';

export async function homePage() {
  const app = document.getElementById('app');

  app.innerHTML = `<p>Loading...</p>`;

  try {
    const response = await fetch(`${BASE_URL}/listings`);
    const data = await response.json();

    app.innerHTML = `
    <section class="container mt-4">
        <h1>Listings</h1>

        <div id="listingContainer" class="row"></div>

        <div class="d-flex justify-content-center align-items-center gap-3 mt-4">
          <button id="prevBtn" class="btn btn-nord btn-sm">Previous</button>
          <span id="page-number"></span>
          <button id="nextBtn" class="btn btn-nord btn-sm">Next</button>
        </div>
      </section>
    `;

    setupPagination(data.data);
  } catch (error) {
    app.innerHTML = `<p>Something went wrong</p>`;
    console.error(error);
  }
}

export function generatePosts(listings, container) {
  listings.forEach((item) => {
    const highestBid = item.bids?.length
      ? Math.max(...item.bids.map((b) => b.amount))
      : null;

    const card = document.createElement('div');
    card.className = 'col-12 col-md-6 col-lg-4 mb-4';

    card.innerHTML = `
        <div class="card h-100" p-3">
        <div>
        <img
        src="${item.media?.[0]?.url || 'fallback.jpg'}"
        alt="${item.title}"
        class ="img-fluid height-200 object-fit-cover"
        >
        </div>
        <p>Bid Count: ${item._count?.bids ?? 0}</p>
        <p>First bid amount: ${item.bids?.[0]?.amount ?? 'No bids yet'}</p>
        <h2>${item.title}</h2>
        <p>${item.created}</p>
        <p>${item.endsAt}</p>
        
        <p>Current bid: ${highestBid ?? 'No bids yet'}</p>
        </div>
        `;

    container.appendChild(card);
  });
}
