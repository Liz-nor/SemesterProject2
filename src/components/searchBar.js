import { setupPagination } from './pagination.js';

export function searchBar(allListings) {
  const container = document.getElementById('searchBarContainer');

  if (!container) {
    console.warn('Search bar container not found');
    return;
  }

  container.innerHTML = `
  <div class="input-group">
      <input id="searchInput" class="form-control" placeholder="What are you looking for today?" aria-label="Search" type="search">
      <button id="searchButton" class="btn btn-nord">
        <i class="bi bi-search"></i>
      </button>
    </div>
    `;

  const searchInput = document.getElementById('searchInput');
  const searchButton = document.getElementById('searchButton');

  function handleSearch() {
    const query = searchInput.value.trim().toLowerCase();
    searchInput.addEventListener('input', () => {
      if (serarchInput.value === '') handleSearch();
    });

    const filteredListings = query
      ? allListings.filter((item) => {
          const title = item.title?.toLowerCase() || '';
          const description = item.description?.toLowerCase() || '';
          const tags = item.tags?.join(' ').toLowerCase() || '';
          const seller = item._seller?.toLowerCase() || '';

          return (
            title.includes(query) ||
            description.includes(query) ||
            tags.includes(query) ||
            seller.includes(query)
          );
        })
      : allListings;

    setupPagination(filteredListings);
  }
  searchButton.addEventListener('click', handleSearch);

  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  });
}
