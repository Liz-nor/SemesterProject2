import { requireLogin } from '../utils/authGuard';
export function renderAddCard(container) {
  const addCard = document.createElement('div');
  addCard.className = 'col-12 mb-4';

  addCard.innerHTML = `
    <div class="card p-4 text-center bg-light">
      <img class="img-fluid" src="images/1.png" alt="Add Listing" style="max-height: 200px; object-fit: cover;  vertical-align: top;">
      <h2 class="h5 mb-2">Add your own listing</h2>
      <p class="mb-3">Start selling and receive bids today</p>
      <button class="btn btn-nord" id="create-listing-btn" style="background-position: bottom;">Create Listing</button>
    </div>
  `;

  const createBtn = addCard.querySelector('#create-listing-btn');
  createBtn.addEventListener('click', () => {
    if (requireLogin()) {
      window.location.href = '#/create-listing';
    }
  });
  container.appendChild(addCard);
}
