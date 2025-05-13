import React from 'react';
import { useTranslation } from 'react-i18next';

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
  };

  return (
    <div className="flex items-center space-x-2">
      <button onClick={() => changeLanguage('en')} className="text-sm text-gray-700 hover:text-blue-600">EN</button>
      <span className="text-gray-400">|</span>
      <button onClick={() => changeLanguage('es')} className="text-sm text-gray-700 hover:text-blue-600">ES</button>
    </div>
  );
}
