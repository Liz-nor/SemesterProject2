import { requireLogin } from '../utils/authGuard.js';
import { post } from '../services/apiClient.js';
import { renderListingForm } from '../components/listingForm.js';

export async function createListingPage() {
  if (!requireLogin()) {
    return;
  }
  renderListingForm();
  const form = document.getElementById('listingForm');
  const createListingsButton = document.getElementById('listingsButton');

  createListingsButton.addEventListener('click', () => {
    if (!requireLogin()) return;

    openBidModal(item);
  });
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const title = document.getElementById('title').value.trim();
    const description = document.getElementById('description').value.trim();
    const endDate = document.getElementById('endDate').value;
    const container = document.getElementById('imageInputs');
    const addBtn = document.getElementById('addImageBtn');

    addBtn.addEventListener('click', () => {
      const inputWrapper = document.createElement('div');
      inputWrapper.className = 'd-flex gap-2 mb-2';

      inputWrapper.innerHTML = `
      <input
      type="text"
      placeholder="Image URL"
      class="form-control image-input"
      >
      <button type="button class="btn btn-danger remove-btn">X</button>
      `;

      inputWrapper
        .querySelector('.remove-btn')
        .addEventListener('click', () => {
          inputWrapper.remove();
        });

      container.appendChild(inputWrapper);
    });

    function getMedia() {
      const inputs = container.querySelectorAll('.image-input');
      return Array.from(inputs)
        .map((input) => input.value.trim())
        .filter(Boolean)
        .map((url) => ({
          url,
          alt: document.getElementById('title').value.trim(),
        }));
    }

    const media = getMedia();

    const categories = (document.getElementById('categories').value || '')
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    if (!title || !endDate || !description || !categories.length) {
      alert('Please fill in all required fields.');
      return;
    }

    const payload = {
      title,
      ...(description ? { description } : {}),
      ...(categories.length ? { categories } : {}),
      ...(media.length ? { media } : {}),
      endsAt: new Date(endDate).toISOString(),
      ...addBtn(media.lenght ? { media } : {}),
    };

    createListingsButton.disabled = true;
    createListingsButton.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Creating...`;

    try {
      await post('/auction/listings', payload);
      alert('Listing created successfully!');
      window.location.href = '#/profile';
    } catch (error) {
      console.error('Error creating listing:', error);
      createListingsButton.disabled = false;
      createListingsButton.textContent = 'Create Listing';
    }
  });
}
