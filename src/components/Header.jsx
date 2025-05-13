import React from 'react';
import { useTranslation } from 'react-i18next';
import { FaChevronDown } from 'react-icons/fa';
import { Link } from 'react-router-dom';
// import logo from '../assets/logo.png';

export default function Header() {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lang) => i18n.changeLanguage(lang);
console.log(t)
  return (
    <header className="bg-white shadow-md sticky top-0 z-50 border-b">
      {/* Language Switcher */}
      <div className="hidden md:flex justify-end max-w-7xl mx-auto px-4 py-2 text-xs text-gray-800 space-x-3">
        {['en', 'es'].map((lang) => (
          <span
            key={lang}
            onClick={() => changeLanguage(lang)}
            className={`cursor-pointer ${i18n.language === lang ? 'underline' : ''} hover:underline`}
          >
            {lang === 'en' ? 'English' : 'Español'}
          </span>
        ))}
      </div>

      {/* Logo + Nav */}
      <div className="flex flex-col md:flex-row justify-between items-center max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center space-x-4 mb-2 md:mb-0">
          {/* <img src={logo} alt="Logo" className="h-10" /> */}
          <h1 className="text-xl font-bold">LOGO</h1>
          <span className="hidden sm:inline text-sm text-gray-600 tracking-wide">Enggist & Grandjean • Software</span>
        </div>

        <nav className="w-full md:w-auto">
          <ul className="flex flex-wrap justify-center md:justify-start space-x-6 text-sm font-semibold text-gray-900">
            <li>
              <a href="/" className="text-red-700 border-b-2 border-red-600 pb-1">{t('nav.home')}</a>
            </li>

            {/* About Us Dropdown */}
            <li className="relative group">
              <button className="flex items-center gap-1 hover:text-red-600">
                {t('nav.aboutUs')} <FaChevronDown className="text-xs mt-[2px]" />
              </button>
              <div className="absolute left-0 top-full bg-white shadow-lg rounded text-sm mt-2 w-40 opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-opacity duration-200 z-10">
                <a href="#about-company" className="block px-4 py-2 hover:bg-gray-100">{t('nav.company')}</a>
                <a href="#about-team" className="block px-4 py-2 hover:bg-gray-100">{t('nav.ourTeam')}</a>
                <a href="#about-history" className="block px-4 py-2 hover:bg-gray-100">{t('nav.history')}</a>
              </div>
            </li>

            {/* Industries Dropdown */}
            <li className="relative group">
              <button className="flex items-center gap-1 hover:text-red-600">
                {t('nav.industries')} <FaChevronDown className="text-xs mt-[2px]" />
              </button>
              <div className="absolute left-0 top-full bg-white shadow-lg rounded text-sm mt-2 w-48 opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-opacity duration-200 z-10">
                <a href="#healthcare" className="block px-4 py-2 hover:bg-gray-100">{t('nav.healthcare')}</a>
                <a href="#education" className="block px-4 py-2 hover:bg-gray-100">{t('nav.education')}</a>
                <a href="#military" className="block px-4 py-2 hover:bg-gray-100">{t('nav.military')}</a>
                <a href="#hospitality" className="block px-4 py-2 hover:bg-gray-100">{t('nav.hospitality')}</a>
              </div>
            </li>

            <li>
              <a href="#blog" className="hover:text-red-600">{t('nav.blog')}</a>
            </li>
            <li>
              <a href="#try" className="hover:text-red-600">{t('nav.tryBuy')}</a>
            </li>
            <li>
              <Link to="/dashboard" className="hover:text-red-600">{t('Dashboard')}</Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
