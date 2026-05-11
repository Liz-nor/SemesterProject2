import { BASE_URL } from '../services/apiClient.js';
import { formatDate } from '../utils/formatDate.js';
import { renderBidHistory } from '../components/bidHistory.js';
import { getHighestBid } from '../utils/highestBids.js';
import { openBidModal } from '../components/modals/openBidModal.js';
import { isAuctionExpired } from '../utils/listingsCountdown.js';
import { similarListings } from '../components/tagFilter.js';

export async function listingDetailsPage() {
  const app = document.getElementById('app');

  const id = window.location.hash.split('/')[2];
  if (!id || id === 'undefined') {
    app.innerHTML = `<p>Missing listing ID</p>`;
    return;
  }
  app.innerHTML = `<p>Loading listing ${id}...</p>`;

  try {
    const response = await fetch(
      `${BASE_URL}/auction/listings/${id}?_bids=true&_seller=true`,
    );

    if (!response.ok) {
      throw new Error('Failed to fetch listing details');
    }

    const data = await response.json();

    const listing = data.data;
    const hasImage = !!listing.media?.[0]?.url;

    app.innerHTML = `
    <div class="container my-4">
      <div class="row g-4">
        <div class="col-12 col-lg-8">
          <div class="card p-3">
            <div class="card-body d-flex flex-column align-items-center">
              <h1 class="card-title">${listing.title}</h1>

              ${
                hasImage
                  ? `<img
                      id="heroImage"
                      src="${listing.media?.[0]?.url}"
                      alt="${listing.title}"
                      class="img-fluid mb-2 w-100"
                      style="max-height: 400px; object-fit: contain;">`
                  : `<div class="d-flex align-items-center justify-content-center bg-light text-muted" style="height: 400px;">
                      <i class="bi bi-image" style="font-size: 2rem;"></i>
                      <span class="text-muted">No image available</span>
                    </div>`
              }
              <p>Listed by: <a href="${listing.seller?.name ? `#/profile/${listing.seller.name}` : '#'}" class="text-decoration-none">${listing.seller?.name || 'Unknown Seller'}</a></p>
              <p>Highest Bid: <strong>${getHighestBid(listing.bids) ?? 'No bids yet'}</strong></p>
              <p class="card-text"><strong>Details about this listing:</strong> ${listing.description}</p>
              <p>Ends at: ${formatDate(listing.endsAt)}</p>
              <button id="placeBidBtn" class="btn btn-nord mt-2" ${isAuctionExpired(listing.endsAt) ? 'disabled' : ''}>
                ${isAuctionExpired(listing.endsAt) ? 'Auction Ended' : 'Place Bid'}
              </button>
            </div>
          </div>
        </div>
        <div class="col-12 col-lg-4">
          <div class="card p-3 h-100">
            <h2 class="h5 mb-3">Bid History</h2>
            <div id="bidHistory" class="overflow-auto"></div>
          </div>
        </div>
      </div>
    </div>
    <aside class="similar-listings-container container my-4">
      <h2 class="h4 mb-3">Similar Listings</h2>
      <div id="similarListings" class="row g-4">egethertah</div>
    </aside>
    `;
    renderBidHistory(listing.bids);

    const placeBidBtn = app.querySelector('#placeBidBtn');
    if (placeBidBtn && !isAuctionExpired(listing.endsAt)) {
      placeBidBtn.addEventListener('click', () => openBidModal(listing));
    }

    const heroImage = app.querySelector('#heroImage');
    const allImages = listing.media || [];

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
      cardBody.insertBefore(thumbnailContainer, heroImage.nextSibling);
      similarListings(listing);
    }
  } catch (error) {
    app.innerHTML = `<p>Something went wrong</p>`;
    console.error(error);
  }
}
