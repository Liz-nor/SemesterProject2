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
        ${item?.seller?.name ? `<p class="text-muted mb-1">Seller: ${item.seller.name}</p>` : ''}
        ${
          item.media?.length
            ? `
        <img
        src="${item.media?.[0]?.url || 'images/no-image.png'}"
        alt="${item.title}"
        class ="card-img-top img-fluid"
        style="height: 300px; object-fit: contain; font-size: 2rem;"
        onerror="this.onerror=null; this.src='images/no-image.png'"
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
        <h2>${item.title}</h2>
        <p>Ends at: ${formatDate(item.endsAt)}</p>
        <p>Created at: ${formatDate(item.created)}</p>
        <p class="text-danger fw-bold">${getCountdown(item.endsAt)}</p>
        <p>Current bid: ${highestBid ?? 'No bids yet'}</p>
        <div class="d-flex w-50px justify-content-between align-items-center">
        <button class="btn btn-nord view-listing-btn">View Listing</button>
        <button class="btn btn-nord mt-2 make-bid-btn">Make a bid</button>
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
