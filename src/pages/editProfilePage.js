import { get, put } from '../services/apiClient.js';
import { getProfile, getToken } from '../utils/storage.js';
import { renderProfileForm } from '../components/profileForm.js';

export async function editProfilePage() {
  const app = document.getElementById('app');

  if (!getToken()) {
    window.location.hash = '#/';
    return;
  }

  const myProfile = getProfile();
  const profileId = myProfile?.name || window.location.hash.split('/')[2];

  const result = await get(`/auction/profiles/${profileId}`);
  const profile = result.data;

  renderProfileForm({ profile });

  const profileForm = document.getElementById('profileForm');
  const message = document.getElementById('message');
  profileForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const updatedProfile = {
      bio: profileForm.bio.value.trim(),
      avatar: {
        url: profileForm.profilePictureUrl.value.trim(),
        alt: `${profile.name}'s profile picture`,
      },
      banner: {
        url: profileForm.bannerPictureUrl.value.trim(),
        alt: `${profile.name}'s banner picture`,
      },
    };

    await put(`/auction/profiles/${profileId}`, updatedProfile);
    message.textContent = 'Profile updated successfully!';

    setTimeout(() => {
      window.location.hash = `#/profile/${profile.name}`;
    }, 3000);
  });
}
