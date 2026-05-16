import { BASE_URL, get } from '../services/apiClient.js';

export async function loadListingWithBids() {
  const id = window.location.hash.split('/')[2];

  const response = await get(
    `${BASE_URL}/auction/listings/${id}?_bids=true&_seller=true`,
  );

  if (!response.ok) {
    const error = await response.json();
    console.log('API error:', error);
    throw new Error(error.errors?.[0]?.message || 'Something went wrong');
  }

  const result = await response.json();
  const listing = result.data;

  renderBidHistory(listing.bids);
}

export function renderBidHistory(bids) {
  const container = document.getElementById('bidHistory');

  if (!container) return;

  container.innerHTML = '';

  if (!bids || bids.length === 0) {
    container.innerHTML = '<p>No bids yet</p>';
    return;
  }

  const sorted = [...bids].sort((a, b) => b.amount - a.amount);

  sorted.forEach((bid) => {
    const div = document.createElement('div');
    div.className = 'd-flex justify-content-between border p-2 mb-2 rounded';

    div.innerHTML = `
      <p class="mb-0"><strong>${bid.bidder?.name || 'Unknown'}</strong></p>
      <p class="mb-0">Amount: ${bid.amount}</p>
    `;

    container.appendChild(div);
  });
}
