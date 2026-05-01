import { BASE_URL } from './apiClient.js';

export async function fetchListings() {
  const response = await fetch(`${BASE_URL}/auction/listings?_bids=true`);
  const result = await response.json();

  return result.data;
}
