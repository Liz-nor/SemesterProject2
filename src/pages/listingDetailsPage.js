import { BASE_URL } from '../services/apiClient.js';
import { formatDate } from '../utils/formatDate.js';
import { renderBidHistory } from '../components/bidHistory.js';

export async function listingDetailsPage() {
  const app = document.getElementById('app');
  const id = window.location.hash.split('/')[2];
  app.innerHTML = `<p>Loading listing ${id}...</p>`;

  try {
    const response = await fetch(
      `${BASE_URL}/auction/listings/${id}?_bids=true&_seller=true`,
    );
    const data = await response.json();

    const hasImage = !!data.data.media?.[0]?.url;
    const listing = data.data;

    app.innerHTML = `
    <div class="container my-4">
      <div class="row g-4">
        <div class="col-12 col-lg-8">
          <div class="card p-3">
            <div class="card-body d-flex flex-column align-items-center">
              ${
                hasImage
                  ? `<img
                      id="heroImage"
                      src="${listing.media?.[0]?.url}"
                      alt="${listing.title}"
                      class="img-fluid mb-2 w-100"
                      style="max-height: 400px; object-fit: cover;">`
                  : `<div class="d-flex align-items-center justify-content-center bg-light text-muted" style="height: 400px;">
                      <i class="bi bi-image" style="font-size: 2rem;"></i>
                      <span class="text-muted">No image available</span>
                    </div>`
              }
              <h1 class="card-title">${listing.title}</h1>
              <p class="card-text">${listing.description}</p>
              <p class="card-text">Current bid: ${listing.bids?.length ? Math.max(...listing.bids.map((b) => b.amount)) : 'No bids yet'}</p>
              <p>Ends at: ${formatDate(listing.endsAt)}</p>
              <p>Bid Count: <strong>${listing._count?.bids ?? 0}</strong></p>
            </div>
          </div>
        </div>
        <div class="col-12 col-lg-4">
          <div class="card p-3 h-100">
            <h2 class="h5 mb-3">Bid History</h2>
            <div id="bidHistoryContainer" class="overflow-auto" style="max-height: 500px;"></div>
          </div>
        </div>
      </div>
    </div>
    `;
    renderBidHistory(listing.bids);
    const heroImage = app.querySelector('#heroImage');
    const allImages = listing.media;

    if (heroImage && allImages?.length > 1) {
      const thumbnailContainer = document.createElement('div');
      thumbnailContainer.className = 'd-flex gap-2 mb-3 flex-wrap';

      allImages.forEach((img, index) => {
        const thumb = document.createElement('img');
        thumb.src = img.url;
        thumb.alt = listing.title;
        thumb.style.cssText = `height: 70px; width: 70px; object-fit: cover; cursor: pointer; border: 2px solid ${index === 0 ? '#0d6efd' : 'transparent'}; border-radius: 4px;`;

        thumb.addEventListener('click', () => {
          heroImage.src = img.url;
          thumbnailContainer
            .querySelectorAll('img')
            .forEach((t) => (t.style.borderColor = 'transparent'));
          thumb.style.borderColor = '#0d6efd';
        });

        thumbnailContainer.appendChild(thumb);
      });

      const cardBody = app.querySelector('.card-body');
      const title = cardBody.querySelector('.card-title');
      cardBody.insertBefore(thumbnailContainer, title);
    }
  } catch (error) {
    app.innerHTML = `<p>Something went wrong</p>`;
    console.error(error);
  }
}
