import React from 'react';
import { useTranslation } from 'react-i18next';
import { Dropdown } from 'react-bootstrap';

const languages = {
  lt: 'Lietuvių',
  en: 'English',
  ru: 'Русский'
};

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <Dropdown>
      <Dropdown.Toggle variant="light" id="language-switcher">
        {languages[i18n.language as keyof typeof languages] || languages.lt}
      </Dropdown.Toggle>
      <Dropdown.Menu>
        {Object.entries(languages).map(([code, name]) => (
          <Dropdown.Item
            key={code}
            onClick={() => changeLanguage(code)}
            active={i18n.language === code}
          >
            {name}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default LanguageSwitcher; 