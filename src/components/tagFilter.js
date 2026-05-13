import { setupPagination } from './pagination.js';

export function filtersDropdown(allListings) {
  renderTagCheckboxes(allListings);
  setupTagFilters(allListings);
}

function getAllTags(allListings) {
  const tags = new Set();
  let hasNoTags = false;

  allListings.forEach((item) => {
    const validTags = item.tags?.filter((tag) => tag.trim() !== '') || [];

    if (validTags.length === 0) {
      hasNoTags = true;
    } else {
      validTags.forEach((tag) => tags.add(tag.trim()));
    }
  });

  if (hasNoTags) {
    tags.add('No tags');
  }
  return [...tags].sort();
}

function renderTagCheckboxes(allListings) {
  const container = document.getElementById('tagCheckboxContainer');
  const tags = getAllTags(allListings);

  container.innerHTML = tags
    .map(
      (tag) => `
        <div class="form-check">
          <input
            class="form-check-input tag-checkbox"
            type="checkbox"
            value="${tag}"
            id="tag-${tag}"
          >
          <label class="form-check-label" for="tag-${tag}">
            ${tag}
          </label>
        </div>
      `,
    )
    .join('');
}

function setupTagFilters(allListings) {
  const checkboxes = document.querySelectorAll('.tag-checkbox');

  checkboxes.forEach((checkbox) => {
    checkbox.addEventListener('change', () => {
      const selectedTags = [
        ...document.querySelectorAll('.tag-checkbox:checked'),
      ].map((checkbox) => checkbox.value);

      const filteredListings =
        selectedTags.length === 0
          ? allListings
          : allListings.filter((item) => {
              return selectedTags.some((tag) => {
                if (tag === 'No tags') {
                  return !item.tags || item.tags.length === 0;
                }
                return item.tags?.includes(tag);
              });
            });
      setupPagination(filteredListings);
    });
  });
}

export function getSimilarListings(allListings, listing) {
  return allListings.filter((item) => {
    return (
      item.id !== listing.id &&
      item.tags &&
      listing.tags &&
      item.tags.some((tag) => listing.tags.includes(tag))
    );
  });
}
