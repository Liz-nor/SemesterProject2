import { get } from './apiClient.js';

export async function fetchAllListings(sort = 'created', sortOrder = 'desc') {
  const data = await get(
    `/auction/listings?_bids=true&_seller=true&sort=${sort}&sortOrder=${sortOrder}`,
  );

  return data.data;
}
