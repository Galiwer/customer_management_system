import React from 'react';
import '../styles/components/footer.css';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="app-footer">
      <div className="footer-content">
        <p>&copy; {currentYear} Customer Management System. All rights reserved.</p>
        <p className="developer-credit">Developed by <strong>Omindu Kumara</strong></p>
      </div>
    </footer>
  );
}
