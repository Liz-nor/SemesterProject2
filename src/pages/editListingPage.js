import { renderListingForm } from '../components/listingForm.js';
import { get, put } from '../services/apiClient.js';
import { profilePage } from './profilePage.js';

export async function renderEditListingPage() {
  const listingId = window.location.hash.split('/')[2];

  const result = await get(`/auction/listings/${listingId}`);
  console.log(result);
  const listing = result.data;

  renderListingForm({
    mode: 'edit',
    listing,
  });

  const listingForm = document.getElementById('listingForm');
  const editFormMessage = document.getElementById('formMessage');
  listingForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const updatedListing = {
      title: listingForm.title.value.trim(),
      description: listingForm.description.value.trim(),
      endsAt: new Date(listingForm.endDate.value).toISOString(),
      tags: listingForm.categories.value
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
      media: [...listingForm.querySelectorAll('.image-entry')]
        .map((entry) => ({
          url: entry.querySelector('.image-url-input').value.trim(),
          alt: entry.querySelector('.image-alt-input').value.trim(),
        }))
        .filter((m) => m.url),
    };

    await put(`/auction/listings/${listingId}`, updatedListing);
    editFormMessage.textContent = 'Listing updated successfully!';
    setTimeout(() => {
      window.location.href = `#/profile`;
    }, 1000);
  });
}
