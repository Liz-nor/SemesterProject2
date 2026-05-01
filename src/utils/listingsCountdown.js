export function formatDate(dateString) {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'Invalid date';
  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

export function isAuctionExpired(endDate) {
  return new Date(endDate) <= new Date();
}

export function getCountdown(endDate) {
  const end = new Date(endDate);
  const now = new Date();

  if (isNaN(end.getTime())) {
    return 'Invalid end date';
  }
  const difference = end - now;

  if (difference <= 0) {
    return 'Auction ended';
  }
  const months = Math.floor(difference / (1000 * 60 * 60 * 24 * 30));
  if (months > 0) {
    return `${months} month${months > 1 ? 's' : ''} left`;
  }
  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((difference / (1000 * 60)) % 60);

  return `${days}d ${hours}h ${minutes}m left`;
}
