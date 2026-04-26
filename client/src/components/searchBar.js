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
  searchInput.style.padding = '14px 18px';
  searchInput.style.borderRadius = '10px';
  searchInput.style.border = '1px solid #cbd5e0';
  searchInput.style.width = '350px';
  searchInput.style.fontSize = '16px';
  searchInput.style.backgroundColor = '#f8fafc';
  searchInput.style.color = '#1e293b';

  const filterBtn = document.createElement('button');
  filterBtn.textContent = 'Search';
  filterBtn.className = 'btn-secondary';
  filterBtn.style.padding = '14px 24px';
  filterBtn.style.borderRadius = '10px';
  filterBtn.style.fontSize = '16px';
  filterBtn.style.fontWeight = '600';
  filterBtn.style.cursor = 'pointer';

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
