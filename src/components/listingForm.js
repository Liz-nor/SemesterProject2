export function renderListingForm({ mode = 'create', listing = null } = {}) {
  const app = document.getElementById('app');

  const endDateValue = listing?.endsAt
    ? new Date(listing.endsAt).toISOString().slice(0, 16)
    : '';

  app.innerHTML = `
    <form id="listingForm" class="w-75 mx-auto">
      <h2 class="mb-4">${mode === 'edit' ? 'Edit Listing' : 'Create New Listing'}</h2>
      <div class="mb-3">
        <label for="title" class="form-label">Title<span class="text-danger"><strong>*</strong></span></label>
        <input name="title" type="text" class="form-control" id="title" required placeholder="Enter a title for your listing" value="${listing?.title || ''}">
      </div>
      <div class="mb-3">
        <label for="categories" class="form-label">Categories<span class="text-danger"><strong>*</strong></span></label>
        <input name="categories" type="text" class="form-control" id="categories" required placeholder="Enter categories separated by commas (e.g. Electronics, Home, Fashion)" value="${listing?.tags?.join(', ') || ''}">
      </div>
      <div class="mb-3">
        <label for="endDate" class="form-label">End Date<span class="text-danger"><strong>*</strong></span></label>
        <input name="endDate" type="datetime-local" class="form-control" value="${endDateValue}" id="endDate" required>
      </div>
      <div class="mb-3">
        <label for="description" class="form-label">Description<span class="text-danger"><strong>*</strong></span></label>
        <textarea name="description" class="form-control" id="description" rows="3" required placeholder="Enter a description for your listing">${listing?.description || ''}</textarea>
      </div>
      <div class="mb-3">
        <label class="form-label">Images (optional)</label>
        <div id="imageInputs"></div>
        <button type="button" id="addImageBtn" class="btn btn-secondary mt-2">Add image</button>
      </div>
      <div id="formMessage" class="text-success mb-3"></div>
      <button id="listingsButton" type="submit" class="btn btn-nord mb-3">${mode === 'edit' ? 'Update listing' : 'Create Listing'}</button>
      <button type="button" class="btn btn-secondary mb-3" onclick="window.location.hash='#/profile'">Cancel</button>
    </form>
  `;

  const container = document.getElementById('imageInputs');
  const initialMedia = listing?.media?.length
    ? listing.media
    : [{ url: '', alt: '' }];
  initialMedia.forEach((m) =>
    container.appendChild(createImageEntry(m.url, m.alt)),
  );

  document.getElementById('addImageBtn').addEventListener('click', () => {
    container.appendChild(createImageEntry('', ''));
  });
}

function createImageEntry(url = '', alt = '') {
  const div = document.createElement('div');
  div.className = 'image-entry d-flex gap-2 mb-2';
  div.innerHTML = `
    <input type="url" class="form-control image-url-input" placeholder="Image URL" value="${url}">
    <input type="text" class="form-control image-alt-input" placeholder="Image description" value="${alt}">
    <button type="button" class="btn btn-danger remove-btn">X</button>
  `;
  div
    .querySelector('.remove-btn')
    .addEventListener('click', () => div.remove());
  return div;
}
