export async function renderListingForm({
  mode = 'create',
  listing = null,
} = {}) {
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
        <label for="imageUrl" class="form-label">Image URL (optional)</label>
        <input name="media" type="text" class="form-control" accept="image/*" multiple id="imageUrl" placeholder="https://image1.jpg, https://image2.jpg" value="${listing?.media?.[0]?.url || ''}">
    <div id="imageInputs"></div>
        <button type="button" id="addImageBtn" class="btn btn-secondary mt-3">
        Add image
        </button>
    </div>
    <div class="mb-3">
        <label for="imageAlt" class="form-label">Image Alt Text (optional)</label>
        <input name="mediaAlt" type="text" class="form-control" id="imageAlt" placeholder="Description of the image" value="${listing?.media?.[0]?.alt || ''}">
    </div>
    <button id="listingsButton" type="submit" class="btn btn-nord mb-3">${mode === 'edit' ? 'Update listing' : 'Create Listing'}</button>
    </form>
`;
}
