export function setupHomeControls() {
  const sellButton = document.getElementById('sellButton');

  sellButton?.addEventListener('click', () => {
    window.location.href = '#/create-listing';
  });
}
