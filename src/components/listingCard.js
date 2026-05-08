import {
  formatDate,
  getCountdown,
  isAuctionExpired,
} from '../utils/listingsCountdown.js';
import { renderAddCard } from './addListingCard.js';
import { getCurrentPage } from './pagination.js';
import { openBidModal } from './modals/openBidModal.js';
import { getHighestBid } from '../utils/highestBids.js';

export function generateListings(listings, container) {
  listings.forEach((item, index) => {
    if (index === 3) {
      renderAddCard(container);
    }
    console.log('listing item:', item);
    console.log('listing id:', item.id);
    const highestBid = getHighestBid(item.bids);

    const card = document.createElement('div');
    card.className = 'col-10 col-md-6 col-lg-4 mb-4';

    card.innerHTML = `
        <div class="card h-100 rounded-0 p-2 hover-shadow mt-auto">
        <div class="d-flex justify-content-between align-items-center gap-3 mb-2">
        </div>
        ${
          item.media?.length
            ? `
        <img
        src="${item.media?.[0]?.url || 'images/no-image.png'}"
        alt="${item.title}"
        class ="img-fluid"
        style="height: 200px; object-fit: contain;"
        onerror="this.onerror=null; this.src='images/no-image.png'">
        `
            : `
        <div
        class="d-flex align-items-center justify-content-center align-items-center bg-light text-muted"
        style="height: 200px;">
        <i class="bi bi-image" style="font-size: 3rem; padding-right: 1rem;"></i>
        <span>No image available</span>
        </div>
        `
        }
        <h3 class="h4 mt-2">${item.title}</h3>
        <div class="d-flex flex-row justify-content-between gap-1">
        <p class="text-danger fw-bold">Ends in: ${getCountdown(item.endsAt)}</p>
        <p>Current bid: ${highestBid ?? 'No bids yet'}</p>
        </div>
        <div class="d-flex gap-2 p-4 justify-content-between align-items-center">
        <button class="btn btn-nord view-listing-btn" data-id="${item.id}">View Listing</button>
        <button id="makeBidButton-${item.id}" class="btn btn-nord make-bid-btn">Make a bid</button>
        </div>
        <a href="${item?.seller?.name ? `#/profile/${item.seller.name}` : '#'}" class="btn btn-outline-primary rounded-0 m-0 p-2 text-decoration-none" style="hover:background-color: #1800a2;">${item.seller?.name || 'Unknown Seller'}</a>

        </div>
        `;
    card
      .querySelector('.view-listing-btn')
      .addEventListener('click', (event) => {
        const id = event.currentTarget.dataset.id;
        if (!id || id === 'undefined') return;
        window.location.hash = `#/listing/${id}`;
      });

    const makeBidButton = card.querySelector(`#makeBidButton-${item.id}`);
    const isExpired = isAuctionExpired(item.endsAt);

    if (isExpired) {
      makeBidButton.disabled = true;
      makeBidButton.textContent = 'Auction Ended';
    }

    makeBidButton?.addEventListener('click', () => {
      openBidModal(item);
    });

    container.appendChild(card);
  });
}
