document.addEventListener('DOMContentLoaded', function() {
  const projectsContainer = document.getElementById('projects-container');
  const writeupsContainer = document.getElementById('writeups-container');
  const container = projectsContainer || writeupsContainer;
  if (!container) return;

  const searchInput = document.getElementById('search-input');
  const searchButton = document.getElementById('search-button');
  const tagFilterButtons = document.querySelectorAll('.tag-filter');
  const noResultsMessage = document.getElementById('no-results');
  const cards = container.querySelectorAll('.card');

  let activeFilters = [];   // <-- multiple filters now
  let currentSearch = '';

  function filterCards() {
    let visibleCount = 0;

    cards.forEach(card => {
      const cardTags = (card.getAttribute('data-tags') || '').split(' ');
      const cardText = card.textContent.toLowerCase();

      // Check if card includes all active filters (AND logic)
      const matchesAllTags = activeFilters.every(tag => cardTags.includes(tag));

      // Check if card matches search
      const matchesSearch = !currentSearch || cardText.includes(currentSearch);

      // Only show if it matches both the selected filters AND the search
      if (matchesAllTags && matchesSearch) {
        card.style.display = '';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    if (visibleCount === 0) {
      noResultsMessage.classList.remove('hidden');
    } else {
      noResultsMessage.classList.add('hidden');
    }
  }

  // Toggle filter on button click
  tagFilterButtons.forEach(button => {
    button.addEventListener('click', function() {
      const filter = this.getAttribute('data-tag');

      // If “all” is clicked, clear other filters
      if (filter === 'all') {
        activeFilters = [];
        // Reset all buttons except “all”
        tagFilterButtons.forEach(btn => {
          btn.classList.remove('active');
        });
        // “all” remains active
        this.classList.add('active');
      } else {
        // Uncheck the “all” button
        const allButton = document.querySelector('.tag-filter[data-tag="all"]');
        if (allButton) {
          allButton.classList.remove('active');
        }
        // Toggle this filter in the activeFilters list
        if (activeFilters.includes(filter)) {
          activeFilters = activeFilters.filter(f => f !== filter);
          this.classList.remove('active');
        } else {
          activeFilters.push(filter);
          this.classList.add('active');
        }
      }
      filterCards();
    });
  });

  // Handle search
  function handleSearch() {
    currentSearch = searchInput.value.toLowerCase();
    filterCards();
  }

  if (searchInput && searchButton) {
    searchButton.addEventListener('click', handleSearch);

    searchInput.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') {
        handleSearch();
      }
    });

    let debounceTimeout;
    searchInput.addEventListener('input', function() {
      clearTimeout(debounceTimeout);
      debounceTimeout = setTimeout(handleSearch, 300);
    });
  }

  // Initial filter
  filterCards();
});
