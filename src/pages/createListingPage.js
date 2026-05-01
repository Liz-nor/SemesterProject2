import { post } from '../services/apiClient.js';

export async function createListing() {
  const app = document.getElementById('app');

  app.innerHTML = `
    <form id="createListingForm" class="w-50 mx-auto">
      <h2 class="mb-4">Create New Listing</h2>
      <div class="mb-3">
        <label for="title" class="form-label">Title</label>
        <input type="text" class="form-control" id="title" required>
      </div>
      <div class="mb-3">
        <label for="tags" class="form-label">Tags (comma-separated)</label>
        <input type="text" class="form-control" id="tags">
      </div>
      <div class="mb-3">
        <label for="description" class="form-label">Description</label>
        <textarea class="form-control" id="description" rows="3"></textarea>
      </div>
      <div class="mb-3">
        <label for="imageUrl" class="form-label">Image URL (optional)</label>
        <input type="url" class="form-control" id="imageUrl">
      </div>
      <div class="mb-3">
        <label for="imageAlt" class="form-label">Image Alt Text (optional)</label>
        <input type="text" class="form-control" id="imageAlt">
      </div>
      <div class="mb-3">
        <label for="endDate" class="form-label">End Date</label>
        <input type="datetime-local" class="form-control" id="endDate" required>
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
    const tags = (document.getElementById('tags').value || '')
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    if (!title || !endDate) {
      alert('Please fill in Title and End Date');
      return;
    }

    const payload = {
      title,
      ...(description ? { description } : {}),
      ...(tags.length ? { tags } : {}),
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
