import { BASE_URL } from './apiClient.js';

const MAX_PAGES = 3;

export async function fetchListings(sortBy = 'created', sortOrder = 'desc') {
  let allListings = [];

  for (let page = 1; page <= MAX_PAGES; page++) {
    const url = `${BASE_URL}/auction/listings?page=${page}&limit=100&_bids=true&_seller=true&_sort=${sortBy}&_sortOrder=${sortOrder}`;
    const response = await fetch(url);

    const result = await response.json();
    allListings.push(...result.data);

    if (result.meta.isLastPage) break;
  }

  allListings.sort((a, b) => new Date(b.created) - new Date(a.created));

  return allListings;
}
