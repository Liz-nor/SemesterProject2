import {
  formatDate,
  getCountdown,
  isAuctionExpired,
} from '../utils/listingsCountdown.js';
import { renderAddCard } from './addListingCard.js';
import { getCurrentPage } from './pagination.js';
import { openBidModal } from './modals/openBidModal.js';
import { getHighestBid } from '../utils/highestBids.js';
import { requireLogin } from '../utils/authGuard.js';

export function generateListings(listings, container) {
  listings.forEach((item, index) => {
    if (index === 3) {
      renderAddCard(container);
    }
    const highestBid = getHighestBid(item.bids);

    const card = document.createElement('div');
    card.className = 'col-10 col-md-6 col-lg-4 mb-4';

    card.innerHTML = `
        <div class="card h-100 rounded-0 hover-shadow d-flex flex-column">
        ${
          item.media?.length
            ? `
        <img
        src="${item.media?.[0]?.url || 'images/no-image.png'}"
        alt="${item.title}"
        class="card-img-top"
        style="height: 200px; object-fit: cover;"
        onerror="this.onerror=null; this.src='images/no-image.png'">
        `
            : `
        <div
        class="d-flex align-items-center justify-content-center bg-light text-muted"
        style="height: 200px;">
        <i class="bi bi-image" style="font-size: 3rem; padding-right: 1rem;"></i>
        <span>No image available</span>
        </div>
        `
        }
        <div class="card-body d-flex flex-column p-3">
          <h3 class="h5 mb-2">${item.title}</h3> 
          <a href="${item?.seller?.name ? `#/profile/${item.seller.name}` : '#'}" class="text-muted small text-decoration-none mb-2">${item.seller?.name || 'Unknown Seller'}</a>
          <div class="d-flex flex-row justify-content-between gap-1 mt-auto pt-2 border-top">
            <p class="text-danger fw-bold mb-1">Ends in: ${getCountdown(item.endsAt)}</p>
            <p class="mb-1">Bid: ${highestBid ?? '—'}</p>
          </div>
          <div class="d-flex gap-2 pt-2 justify-content-between align-items-center border-top">
            <button class="btn btn-nord btn-sm view-listing-btn" data-id="${item.id}">View Listing</button>
            <button id="makeBidButton-${item.id}" class="btn btn-nord btn-sm make-bid-btn">Make a bid</button>
          </div>
        </div>
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
      if (!requireLogin()) return;
      openBidModal(item);
    });

    container.appendChild(card);
  });
}
