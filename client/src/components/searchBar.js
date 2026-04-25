export function renderSearchBar(onSearch, onFilter) {
  const container = document.createElement('div');
  container.className = 'search-container';
  container.style.display = 'flex';
  container.style.gap = '10px';
  container.style.flex = '1';

  const searchInput = document.createElement('input');
  searchInput.type = 'text';
  searchInput.placeholder = 'Search by Name or NIC...';
  searchInput.className = 'search-input';
  searchInput.style.padding = '8px 12px';
  searchInput.style.borderRadius = '6px';
  searchInput.style.border = '1px solid #cbd5e0';
  searchInput.style.width = '300px';

  const filterBtn = document.createElement('button');
  filterBtn.textContent = 'Search';
  filterBtn.className = 'btn-secondary';
  filterBtn.style.padding = '8px 16px';

  container.appendChild(searchInput);
  container.appendChild(filterBtn);

  searchInput.addEventListener('input', (e) => {
    onSearch(e.target.value);
  });

  filterBtn.addEventListener('click', () => {
    if (onFilter) onFilter();
  });

  return container;
}
