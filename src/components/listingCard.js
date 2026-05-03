import {
  formatDate,
  getCountdown,
  isAuctionExpired,
} from '../utils/listingsCountdown.js';
import { renderAddCard } from './addListingCard.js';
import { getCurrentPage } from './pagination.js';

export function generateListings(listings, container) {
  listings.forEach((item, index) => {
    if (index === 3) {
      renderAddCard(container);
    }

    const highestBid = item.bids?.length
      ? Math.max(...item.bids.map((b) => b.amount))
      : null;

    const card = document.createElement('div');
    card.className = 'col-10 col-md-6 col-lg-4 mb-4';

    card.innerHTML = `
        <div class="card h-100 p-3 hover-shadow">
        <div class="d-flex justify-content-between align-items-center gap-3 mb-2">
        <a href="${item?.seller?.name ? `#/profile/${item.seller.name}` : '#'}" class="badge bg-info text-dark mb-1 p-2 text-decoration-none">${item.seller?.name || 'Unknown Seller'}</a>
        </div>
        ${
          item.media?.length
            ? `
        <img
        src="${item.media?.[0]?.url || 'images/no-image.png'}"
        alt="${item.title}"
        class ="card-img-top img-fluid"
        style="height: 300px; object-fit: contain; font-size: 2rem;"
        onerror="this.onerror=null; this.src='images/no-image.png'">
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
        <h3 class="h4 mb-3">${item.title}</h3>
        <p>Ends at: ${formatDate(item.endsAt)}</p>
        <p>Created at: ${formatDate(item.created)}</p>
        <p class="text-danger fw-bold">Ends in: ${getCountdown(item.endsAt)}</p>
        <p>Current bid: ${highestBid ?? 'No bids yet'}</p>
        <div class="d-flex gap-2 justify-content-between align-items-center">
        <button class="btn btn-nord view-listing-btn">View Listing</button>
        <button class="btn btn-nord make-bid-btn">Make a bid</button>
        </div>
        </div>
        `;

    const viewButton = card.querySelector('.view-listing-btn');
    const makeBidButton = card.querySelector('.make-bid-btn');
    const isExpired = isAuctionExpired(item.endsAt);

    if (isExpired) {
      makeBidButton.disabled = true;
      makeBidButton.textContent = 'Auction Ended';
    }

    viewButton?.addEventListener('click', () => {
      sessionStorage.setItem('currentPage', getCurrentPage());
      window.location.href = `#/listing/${item.id}`;
    });

    makeBidButton?.addEventListener('click', (e) => {
      e.stopPropagation();
      sessionStorage.setItem('currentPage', getCurrentPage());
      window.location.href = `#/listing/${item.id}`;
    });

    container.appendChild(card);
  });
}
