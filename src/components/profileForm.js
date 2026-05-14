export function renderProfileForm({ profile = null } = {}) {
  const app = document.getElementById('app');
  app.innerHTML = `
    <form id="profileForm" class="w-75 mx-auto mt-4">
      <h2 class="mb-4">Edit Profile</h2>
      <div class="mb-3">
        <label for="name" class="form-label">Username</label>
        <input name="name" type="text" class="form-control" id="name" value="${profile?.name || ''}" disabled>
      </div>
      <div class="mb-3">
        <label for="bio" class="form-label">Bio</label>
        <textarea name="bio" class="form-control" id="bio" rows="3" placeholder="Tell us about yourself">${profile?.bio || ''}</textarea>
      </div>
      <div class="mb-3">
        <label for="profilePictureUrl" class="form-label">Profile Picture URL</label>
        <input name="profilePictureUrl" type="url" class="form-control" id="profilePictureUrl" placeholder="https://example.com/avatar.jpg" value="${profile?.avatar?.url || ''}">
      </div>
      <div class="mb-3">
        <label for="bannerPictureUrl" class="form-label">Banner Picture URL</label>
        <input name="bannerPictureUrl" type="url" class="form-control" id="bannerPictureUrl" placeholder="https://example.com/banner.jpg" value="${profile?.banner?.url || ''}">
      </div>
      <button type="submit" class="btn btn-nord mb-3">Save Changes</button>
      <button type="button" class="btn btn-secondary mb-3" onclick="window.location.hash='#/profile'">Cancel</button>
    </form>
  `;
}
