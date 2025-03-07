import React from 'react';
import './Footer.css';

function Footer() {
  // Gauti dabartinį metus
  const getCurrentYear = () => {
    return new Date().getFullYear();
  };

  return (
    <footer className="footer">
      <div className="footer-content">
        <p>© {getCurrentYear()} Gretvėja-SVS. Visos teisės saugomos.</p>
        <p>Sukūrė Aurimas Butvilauskas</p>
      </div>
    </footer>
  );
}

export default Footer; 