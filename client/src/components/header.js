import '../styles/components/header.css';

export function renderHeader() {
  const header = document.createElement('header');
  header.className = 'app-header';

  header.innerHTML = `
    <div class="header-content">
      <div class="logo">
        <h1>Customer Management System</h1>
      </div>
    </div>
  `;

  return header;
}
