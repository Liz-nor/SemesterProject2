import { getProfile } from '../utils/storage.js';
import { get, del } from '../services/apiClient.js';
import { isAuctionExpired, getCountdown } from '../utils/listingsCountdown.js';
import { requireLogin } from '../utils/authGuard.js';
import { openLoginModal } from '../components/modals/openLoginModal.js';
import { getHighestBid } from '../utils/highestBids.js';
import { showModal } from '../components/modals/showModal.js';

export async function profilePage() {
  if (!requireLogin()) return;

  const app = document.getElementById('app');

  const hash = window.location.hash;
  const hashQuery = hash.split('?')[1] || '';
  const params = new URLSearchParams(hashQuery);
  const myProfile = getProfile();
  const pathName = hash.startsWith('#/profile/')
    ? hash.split('#/profile/')[1].split('?')[0]
    : null;
  const name = pathName || params.get('name') || myProfile?.name;
  const isOwnProfile = name === myProfile?.name;

  if (!name) {
    app.innerHTML = `<p class="text-center mt-4">Please log in to view your profile.</p>`;
    return;
  }

  app.innerHTML = `
    <section class="container mt-4">
      <h1 class="border-bottom">Profile</h1>
      <div class="" id="profileContainer"></div>
      <h2 class="border-bottom">My Listings</h2>
      <div id="listingsContainer"></div>
      <h2 class="border-bottom">My Bid History</h2>
      <div id="personalBidHistoryContainer"></div>
      <h2 class="border-bottom">Won Listings</h2>
      <div id="wonListingsContainer"></div>
    </section>
  `;

  const profileContainer = document.getElementById('profileContainer');
  const listingsContainer = document.getElementById('listingsContainer');
  const personalBidHistoryContainer = document.getElementById(
    'personalBidHistoryContainer',
  );
  const wonListingsContainer = document.getElementById('wonListingsContainer');
  listingsContainer.classList.add(
    'row',
    'row-cols-1',
    'row-cols-md-2',
    'row-cols-lg-3',
    'g-4',
    'mb-5',
  );
  async function loadProfile() {
    const res = await get(`/auction/profiles/${name}`);
    const data = res.data;
    profileContainer.innerHTML = `
    <section class="container my-5">
      <div class="card border-0 shadow-sm rounded-4 mb-4 overflow-visible">
        <div class="position-relative">
          <img
            src="${data.banner.url}"
            class="w-100 rounded-top-4"
            style="height: 200px; object-fit: cover; object-position: center;"
            alt="${data.banner.alt || name}" />
          <img
            src="${data.avatar.url}"
            class="rounded-circle border border-4 border-white position-absolute"
            style="width: 150px; height: 150px; object-fit: cover; bottom: -75px; left: 1.5rem;"
            alt="${data.avatar.alt || name}" />
        </div>

        <div class="card-body" style="padding-top: 4.5rem;">
          <div class="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
            <div>
              <h2 class="h3 mb-1">${data.name}</h2>
              <p class="text-muted mb-2">${data.bio || 'No bio added yet.'}</p>
              <span class="badge bg-info text-dark">Credits: ${data.credits}</span>
              <p class="text-muted mt-2 mb-0">
                <strong>${data._count?.listings ?? 0}</strong> listings &nbsp;
                <strong>${data._count?.wins ?? 0}</strong> wins
              </p>
            </div>
            <div class="d-flex gap-2 flex-shrink-0">
              ${isOwnProfile ? `<a href="#/edit-profile/${data.name}" class="btn btn-nord">Edit Profile</a>` : ''}
              ${isOwnProfile ? `<a href="#/create-listing" class="btn btn-nord">Create Listing</a>` : ''}
            </div>
          </div>
        </div>
      </div>
    </section>
    `;

    const createListingBtn = document.addEventListener('click', (e) => {
      if (
        e.target.matches('.btn-nord') &&
        e.target.textContent === 'Create Listing'
      ) {
        window.location.hash = '#/create-listing';
      }
    });
  }

  async function loadListings() {
    const res = await get(
      `/auction/profiles/${name}/listings?sort=created&sortOrder=desc&_bids=true`,
    );
    const listings = res.data;
    if (!listings?.length) {
      listingsContainer.innerHTML = '<p>No listings yet.</p>';
      return;
    }
    listingsContainer.innerHTML = listings
      .map(
        (listing) => `
      <div class="col">
        <div class="card h-100 p-3 hover-shadow d-flex flex-column">
          <h3 class="h4 mb-3">${listing.title}</h3>
          <img class="banner-image img-fluid rounded-4" style="height: 300px; background-size: cover; background-position: center;" src="${listing.media?.[0]?.url}" alt="${listing.media?.[0]?.alt || listing.title}" onerror="this.onerror=null; this.src='images/no-image.png';" />
          <p class="mt-3">${listing.description}</p>
            <div class="d-flex justify-content-around gap-3 align-items-center text-center mt-auto">
              <div>
                <p class="text-danger fw-bold mb-0">${getCountdown(listing.endsAt)}</p>
                <p>Ends in</p>
              </div>
              <div>
                <p class="text-danger fw-bold mb-0">${getHighestBid(listing.bids) ?? '—'}</p>
                <p>Highest Bid</p>
              </div>
            </div>
          <div class="post-actions d-flex gap-2 mt-auto pt-2">
            <a href="#/listing/${listing.id}" class="card-link btn btn-nord">View</a>
            ${isOwnProfile ? `<a href="#/edit-listing/${listing.id}" class="card-link btn btn-nord edit-btn" data-expired="${isAuctionExpired(listing.endsAt)}">Edit</a>` : ''}
            ${isOwnProfile ? `<a href="#/delete-listing/${listing.id}" class="card-link btn btn-nord delete-btn" data-expired="${isAuctionExpired(listing.endsAt)}">Delete</a>` : ''}
          </div>
        </div>
      </div>
    `,
      )
      .join('');

    listingsContainer
      .querySelectorAll(
        '.delete-btn[data-expired="true"], .edit-btn[data-expired="true"]',
      )
      .forEach((btn) => {
        btn.classList.add('disabled');
        btn.setAttribute('aria-disabled', 'true');
      });
  }

  function setupDeleteButtons() {
    listingsContainer.addEventListener('click', async (e) => {
      if (
        e.target.matches('.delete-btn') &&
        !e.target.classList.contains('disabled')
      ) {
        const listingId = e.target
          .getAttribute('href')
          .split('#/delete-listing/')[1];
        if (
          confirm(
            'Are you sure you want to delete this listing? This action cannot be undone.',
          )
        ) {
          try {
            await del(`/auction/listings/${listingId}`);
            await loadListings();
            alert('Listing deleted successfully.');
            window.location.hash = '#/profile';
          } catch (error) {
            console.error('Error deleting listing:', error);
            alert('Failed to delete listing. Please try again.');
            window.location.hash = '#/profile';
          }
        }
      }
    });
  }

  async function loadPersonalBidHistory() {
    const res = await get(
      `/auction/profiles/${name}/bids?sort=created&sortOrder=desc&_listings=true`,
    );
    const bids = res.data;
    if (!bids?.length) {
      personalBidHistoryContainer.innerHTML = '<p>No bids placed yet.</p>';
      return;
    }

    personalBidHistoryContainer.innerHTML = `
      <div class="list-group mb-5">
        ${bids
          .map(
            (bid) => `
          <a href="#/listing/${bid.listing?.id}" class="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
            <div>
              <h5 class="mb-1">${bid.listing?.title ?? 'Unknown Listing'}</h5>
              <p class="mb-1">Bid Amount: $${bid.amount}</p>
              <small class="text-muted">Placed at: ${new Date(bid.created).toLocaleString()}</small>
            </div>
          </a>
        `,
          )
          .join('')}
      </div>
    `;
  }

  async function loadWonListings() {
    const res = await get(
      `/auction/profiles/${name}/wins?sort=created&sortOrder=desc`,
    );
    const wins = res.data;
    if (!wins?.length) {
      wonListingsContainer.innerHTML = '<p>No won listings yet.</p>';
      return;
    }

    wonListingsContainer.innerHTML = `
      <div class="list-group mb-5">
        ${wins
          .map(
            (win) => `
          <a href="#/listing/${win.id}" class="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
            <div>
              <h5 class="mb-1">${win.title ?? 'Unknown Listing'}</h5>
              <small class="text-muted">${getCountdown(win.endsAt)}</small>
            </div>
            <span class="badge bg-success rounded-pill">Won</span>
          </a>
        `,
          )
          .join('')}
      </div>
    `;
  }

  await Promise.all([
    loadProfile(),
    loadListings(),
    loadPersonalBidHistory(),
    loadWonListings(),
  ]);

  setupDeleteButtons();
}
