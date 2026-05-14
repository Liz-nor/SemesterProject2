import { requireLogin } from '../utils/authGuard.js';
import { post } from '../services/apiClient.js';
import { renderListingForm } from '../components/listingForm.js';
import { openLoginModal } from '../components/modals/openLoginModal.js';

export async function createListingPage() {
  if (!requireLogin()) return;

  renderListingForm();

  const form = document.getElementById('listingForm');
  const createListingsButton = document.getElementById('listingsButton');

  function getMedia() {
    return [...form.querySelectorAll('.image-entry')]
      .map((entry) => ({
        url: entry.querySelector('.image-url-input').value.trim(),
        alt: entry.querySelector('.image-alt-input').value.trim(),
      }))
      .filter((m) => m.url);
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const title = document.getElementById('title').value.trim();
    const description = document.getElementById('description').value.trim();
    const endDate = document.getElementById('endDate').value;
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
      description,
      tags: categories,
      endsAt: new Date(endDate).toISOString(),
      ...(media.length ? { media } : {}),
    };
    createListingsButton.disabled = true;
    createListingsButton.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Creating...`;

    try {
      await post('/auction/listings', payload);
      alert('Listing created successfully!');
      window.location.hash = '#/profile';
    } catch (error) {
      console.error('Error creating listing:', error);
      createListingsButton.disabled = false;
      createListingsButton.textContent = 'Create Listing';
    }
  });
}
