import '../styles/components/footer.css';

export function renderFooter() {
  const footer = document.createElement('footer');
  footer.className = 'app-footer';

  const currentYear = new Date().getFullYear();

  footer.innerHTML = `
    <div class="footer-content">
      <p>&copy; ${currentYear} Customer Management System. All rights reserved.</p>
      <p class="developer-credit">Developed by <strong>Omindu Kumara</strong></p>
    </div>
  `;

  return footer;
}
