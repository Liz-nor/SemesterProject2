import { post } from './apiClient.js';

export async function placeBid(listingId, amount) {
  try {
    const payload = {
      amount: Number(amount),
    };

    const result = await post(`/auction/listings/${listingId}/bids`, payload);
    return result.data;
  } catch (error) {
    console.error('Error placing bid:', error);
    throw error;
  }
}
