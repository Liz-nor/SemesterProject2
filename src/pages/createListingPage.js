import { post } from '../services/apiClient.js';

export async function createListing() {
  const app = document.getElementById('app');

  app.innerHTML = `
    <form id="createListingForm" class="w-50 mx-auto">
      <h2 class="mb-4">Create New Listing</h2>
      <div class="mb-3">
        <label for="title" class="form-label">Title<span class="text-danger"><strong>*</strong></span></label>
        <input type="text" class="form-control" id="title" required>
      </div>
      <div class="mb-3">
        <label for="categories" class="form-label">Categories<span class="text-danger"><strong>*</strong></span></label>
        <input type="text" class="form-control" id="categories" required>
      </div>
      <div class="mb-3">
        <label for="endDate" class="form-label">End Date<span class="text-danger"><strong>*</strong></span></label>
        <input type="datetime-local" class="form-control" id="endDate" required>
      </div>
      <div class="mb-3">
        <label for="description" class="form-label">Description<span class="text-danger"><strong>*</strong></span></label>
        <textarea class="form-control" id="description" rows="3" required></textarea>
      </div>
      <div class="mb-3">
        <label for="imageUrl" class="form-label">Image URL (optional)</label>
        <input type="image" class="form-control" id="imageUrl">
      </div>
      <div class="mb-3">
        <label for="imageAlt" class="form-label">Image Alt Text (optional)</label>
        <input type="text" class="form-control" id="imageAlt">
      </div>
      <button id="createListingsButton" type="submit" class="btn btn-nord">Create Listing</button>
    </form>
  `;

  const form = document.getElementById('createListingForm');
  const createListingsButton = document.getElementById('createListingsButton');

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
      alert('Please fill in Title and End Date');
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
      window.location.href = '#/';
    } catch (error) {
      console.error('Error creating listing:', error);
      createListingsButton.disabled = false;
      createListingsButton.textContent = 'Create Listing';
    }
  });
}
