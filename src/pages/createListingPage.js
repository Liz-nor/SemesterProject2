import { post } from '../services/apiClient.js';
import { renderListingForm } from '../components/listingForm.js';

export async function createListingPage() {
  renderListingForm();
  const form = document.getElementById('listingForm');
  const createListingsButton = document.getElementById('listingsButton');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const title = document.getElementById('title').value.trim();
    const description = document.getElementById('description').value.trim();
    const endDate = document.getElementById('endDate').value;
    const imageUrl = document.getElementById('imageUrl').value.trim();
    const imageAlt = document.getElementById('imageAlt').value.trim();
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
      ...(imageUrl ? { media: [{ url: imageUrl, alt: imageAlt }] } : {}),
      endsAt: new Date(endDate).toISOString(),
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
