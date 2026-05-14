import { BASE_URL } from '../services/apiClient.js';
import { formatDate } from '../utils/formatDate.js';
import { renderBidHistory } from '../components/bidHistory.js';
import { getHighestBid } from '../utils/highestBids.js';
import { openBidModal } from '../components/modals/openBidModal.js';
import { isAuctionExpired } from '../utils/listingsCountdown.js';
import { getSimilarListings } from '../components/tagFilter.js';
import { getProfile } from '../utils/storage.js';
import { fetchAllListings } from '../services/listingsApi.js';
import { generateListings } from '../components/listingCard.js';

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
    const myProfile = getProfile();
    const backUrl = listing.seller?.name === myProfile?.name ? `#/profile` : `#/home`;

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
                      style="max-height: 350px; object-fit: cover;">`
                  : `<div class="d-flex align-items-center justify-content-center bg-light text-muted" style="height: 350px;">
                      <i class="bi bi-image" style="font-size: 2rem;"></i>
                      <span class="text-muted">No image available</span>
                    </div>`
              }
              <p>Listed by: <a href="${listing.seller?.name ? `#/profile/${listing.seller.name}` : '#'}" class="text-decoration-none">${listing.seller?.name || 'Unknown Seller'}</a></p>
              <p>Highest Bid: <strong>${getHighestBid(listing.bids) ?? 'No bids yet'}</strong></p>
              <p class="card-text"><strong>Details about this listing:</strong> ${listing.description}</p>
              <p>Ends at: ${formatDate(listing.endsAt)}</p>
              <div class="d-flex gap-2">
                <button id="placeBidBtn" class="btn btn-nord mt-2" ${isAuctionExpired(listing.endsAt) ? 'disabled' : ''}>
                  ${isAuctionExpired(listing.endsAt) ? 'Auction Ended' : 'Place Bid'}
                </button>
                <button class="btn btn-secondary mt-2" onclick="window.location.hash='${backUrl}'">Back</button>
              </div>
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
      <div id="similarListings" class="row g-4"></div>
    </aside>
    `;
    renderBidHistory(listing.bids);

    const placeBidBtn = app.querySelector('#placeBidBtn');
    if (placeBidBtn && !isAuctionExpired(listing.endsAt)) {
      placeBidBtn.addEventListener('click', () => openBidModal(listing));
    }

    const heroImage = app.querySelector('#heroImage');
    const allImages = listing.media || [];

    if (heroImage && allImages.length > 1) {
      const thumbnailContainer = document.createElement('div');
      thumbnailContainer.className = 'd-flex gap-2 mt-2 mb-3 flex-wrap justify-content-center';

      allImages.forEach((img, index) => {
        const thumb = document.createElement('img');
        thumb.src = img.url;
        thumb.alt = img.alt || listing.title;
        thumb.style.cssText = `height: 70px; width: 70px; object-fit: cover; cursor: pointer; border: 2px solid ${index === 0 ? '#1800a2' : 'transparent'}; border-radius: 4px;`;

        thumb.addEventListener('click', () => {
          heroImage.src = img.url;
          thumbnailContainer
            .querySelectorAll('img')
            .forEach((t) => (t.style.borderColor = 'transparent'));
          thumb.style.borderColor = '#1800a2';
        });

        thumbnailContainer.appendChild(thumb);
      });

      heroImage.insertAdjacentElement('afterend', thumbnailContainer);
    }

    const similarContainer = document.getElementById('similarListings');
    try {
      const allListings = await fetchAllListings();
      const similar = getSimilarListings(allListings, listing).slice(0, 6);
      if (similar.length) {
        generateListings(similar, similarContainer);
      } else {
        similarContainer.innerHTML = '<p class="text-muted">No similar listings found.</p>';
      }
    } catch {
      similarContainer.innerHTML = '<p class="text-muted">Could not load similar listings.</p>';
    }
  } catch (error) {
    app.innerHTML = `<p>Something went wrong</p>`;
    console.error(error);
  }
}
