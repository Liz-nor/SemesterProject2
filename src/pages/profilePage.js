import { getProfile } from '../utils/storage.js';
import { get } from '../services/apiClient.js';

export async function profilePage() {
  const app = document.getElementById('app');

  const hashQuery = window.location.hash.split('?')[1] || '';
  const params = new URLSearchParams(hashQuery);
  const myProfile = getProfile();
  const name = params.get('name') || myProfile?.name;
  const isOwnProfile = name === myProfile?.name;

  if (!name) {
    app.innerHTML = `<p class="text-center mt-4">Please log in to view your profile.</p>`;
    return;
  }

  app.innerHTML = `
    <section class="container mt-4">
      <h1>Profile</h1>
      <div class="" id="profileContainer"></div>
      <div id="listingsContainer"></div>
    </section>
  `;

  const profileContainer = document.getElementById('profileContainer');
  const listingsContainer = document.getElementById('listingsContainer');

  async function loadProfile() {
    const res = await get(`/auction/profiles/${name}`);
    const data = res.data;
    profileContainer.innerHTML = `
    <section class="container my-5">
      <div class="card border-0 shadow-sm rounded-4 mb-4 overflow-hidden">
        <img
        src="${data.banner.url}"
        class="card-img-top"  
        style="height: 100px; object-fit: cover;"
        alt="${data.banner.alt || name}" />

        <div class="card-body">
          <div class="d-flex flex-column flex-md-row align-items-md-end gap-3">
            <img 
            src="${data.avatar.url}"
            class="rounded-circle"  
            style="width: 110px; height: 110px; object-fit: cover; margin-top: -70px;"
            alt="${data.avatar.alt || name}" />

        <div class="flex-grow-1">
          <h2 class="h3 mb-1">
          ${data.name}</h2>
          <p class="text-muted mb-2">${data.bio}</p>
          <span class="badge bg-info text-dark">Credits: ${data.credits}</span>
          <p class="text-muted mb-2">${data._count?.listings ?? 0} listings &nbsp; ${data._count?.wins ?? 0} wins &nbsp</p>
        </div>
        <button class="btn btn-nord">Edit Profile</button>
        </div>
      </div>
    </section>
    `;
  }

  async function loadListings() {
    const res = await get(`/auction/profiles/${name}/listings`);
    const listings = res.data;
    if (!listings?.length) {
      listingsContainer.innerHTML = '<p>No listings yet.</p>';
      return;
    }

    listingsContainer.innerHTML = listings
      .map(
        (listing) => `
      <div class="d-flex justify-content-between align-items-center gap-3 mb-4 p-3">
        <h3 class="h4 mb-0">${listing.title}</h3>
        <p>${listing.description}</p>
        <img class="post-image" src="${listing.media?.[0]?.url}" alt="${listing.media?.[0]?.alt || listing.title}" onerror="this.onerror=null; this.src='images/no-image.png';" />
        <p class="text-muted mb-0">Ends at: ${new Date(listing.endsAt).toLocaleString()}</p>
        <div class="post-actions d-flex gap-2">
          <a href="#/listing/${listing.id}" class="card-link btn btn-nord">View</a>
          ${isOwnProfile ? `<a href="#/edit-listing/${listing.id}" class="card-link btn btn-nord">Edit</a>` : ''}
        </div>
      </div>
    `,
      )
      .join('');
  }

  await Promise.all([loadProfile(), loadListings()]);
}
