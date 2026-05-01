import { getProfile } from '../utils/storage.js';
import { get } from '../services/apiClient.js';

export async function profilePage() {
  const app = document.getElementById('app');

  const params = new URLSearchParams(window.location.search);
  const myProfile = getProfile();
  const name = params.get('name') || myProfile?.name;
  const isOwnProfile = name === myProfile?.name;

  app.innerHTML = `
    <section class="container mt-4">
      <h1>Profile</h1>
      <div class="" id="profileContainer"></div>
      <div id="listingsContainer"></div>
    </section>
  `;

  const profileContainer = document.getElementById('profileContainer');
  const listingsContainer = document.getElementById('listingsContainer');
  profileContainer.classList.add(
    'd-flex',
    'align-items-center',
    'gap-3',
    'border',
    'p-3',
    'mb-4',
    'rounded',
  );
  async function loadProfile() {
    const res = await get(`/auction/profiles/${name}`);
    const data = res.data;
    profileContainer.innerHTML = `
    ${data.banner?.url ? `<img class="border-radius w-100" src="${data.banner.url}" alt="${data.banner.alt || name}" />` : ''}
      ${data.avatar?.url ? `<img class="rounded-circle" src="${data.avatar.url}" alt="${data.avatar.alt || name}" />` : ''}
      <h2>${data.name}</h2>
      ${data.bio ? `<p class="profile-bio">${data.bio}</p>` : ''}
      ${data.credits ? `<p class="profile-credits">Credits: ${data.credits}</p>` : ''}
      <p class="">${data._count?.listings ?? 0} listings &nbsp; ${data._count?.wins ?? 0} wins &nbsp</p>
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
        <div class="post-container">
          <h3>${listing.title}</h3>
          ${listing.description ? `<p>${listing.description}</p>` : ''}
          ${listing.media?.[0]?.url ? `<img class="post-image" src="${listing.media[0].url}" alt="${listing.media[0].alt || listing.title}" onerror="this.remove()" />` : ''}
          <div class="post-actions">
            <a href="#/listing/${listing.id}" class="card-link">View</a>
            ${isOwnProfile ? `<a href="#/edit-listing/${listing.id}" class="card-link">Edit</a>` : ''}
          </div>
        </div>
      `,
      )
      .join('');
  }

  await Promise.all([loadProfile(), loadListings()]);
}
