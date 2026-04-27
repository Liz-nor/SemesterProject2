import { BASE_URL } from '../services/apiClient.js';
import { generatePosts } from './homePage.js';

export async function listingDetailsPage() {
  const app = document.getElementById('app');
  const id = window.location.hash.split('/')[2];
  const hasImage = !!app.querySelector('.card img');
  app.innerHTML = `<p>Loading listing ${id}...</p>`;

  try {
    const response = await fetch(`${BASE_URL}/auction/listings/${id}`);
    const data = await response.json();
    console.log(data);
    console.log(data.data);
    console.log(data.data.title);
    app.innerHTML = `
    <div class="card p-3">
      <div class="card-body d-flex flex-column align-items-center">
        ${
          hasImage
            ? `
        <img
        src="${data.data.media?.[0]?.url}"
        alt="${data.data.title}"
        class="img-fluid mb-3"
        style="max-height: 400px; object-fit: cover;">
        `
            : `
      <div class="d-flex align-items-center justify-content-center align-items-center bg-light text-muted">
        <i class="bi bi-image" style="font-size: 2rem;"></i>
        <span class="text-muted">No image available</span>
      </div>
        `
        }
        <h1 class="card-title">${data.data.title}</h1>
        <p class="card-text">${data.data.description}</p>
        <p class="card-text">Current bid: ${data.data.bids?.length ? Math.max(...data.data.bids.map((b) => b.amount)) : 'No bids yet'}</p>
        `;
  } catch (error) {
    app.innerHTML = `<p>Something went wrong</p>`;
    console.error(error);
  }
}
