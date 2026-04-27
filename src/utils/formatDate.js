export function formatDate(dateString) {
  if (!dateString) return 'Unknown date';

  const date = new Date(dateString);

  return date.toLocaleString('en-gb', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
