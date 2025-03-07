import React from 'react';
import { useTranslation } from 'react-i18next';
import './Footer.css';

function Footer() {
  const { t } = useTranslation();
  
  // Gauti dabartinį metus
  const getCurrentYear = () => {
    return new Date().getFullYear();
  };

  return (
    <footer className="footer">
      <div className="footer-content">
        <p>© {getCurrentYear()} Gretvėja-SVS. {t('common.system.copyright')}</p>
        <p>{t('common.system.created_by')}</p>
      </div>
    </footer>
  );
}

export default Footer; 