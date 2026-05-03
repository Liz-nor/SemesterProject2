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
  const container = document.getElementById('bidHistoryContainer');

  if (!container) return;

  container.innerHTML = '';

  if (!bids || bids.length === 0) {
    container.innerHTML = '<p>No bids yet</p>';
    return;
  }

  bids.forEach((bid) => {
    const div = document.createElement('div');
    div.className = 'border p-2 mb-2 rounded';

    div.innerHTML = `
      <p><strong>${bid.bidder?.name || 'Unknown'}</strong></p>
      <p>Amount: ${bid.amount}</p>
    `;

    container.appendChild(div);
  });
}
