export function getHighestBid(bids = []) {
  if (!bids.length) return null;
  return Math.max(...bids.map((bid) => bid.amount));
}
