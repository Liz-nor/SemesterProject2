export function setupHomeControls() {
  const sellButton = document.getElementById('sellButton');
  const buyButton = document.getElementById('buyButton');

  sellButton?.addEventListener('click', () => {
    window.location.href = '#/create-listing';
  });

  buyButton?.addEventListener('click', () => {
    window.location.href = '#/';
  });
}
