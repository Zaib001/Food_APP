// src/components/Header.jsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { FaChevronDown } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export default function Header() {
  const { t, i18n } = useTranslation();
  const changeLanguage = (lang) => i18n.changeLanguage(lang);

  return (
    <header className="bg-white/95 backdrop-blur sticky top-0 z-50 border-b">
      {/* Language Switcher */}
      <div className="hidden md:flex justify-end max-w-7xl mx-auto px-4 py-2 text-xs text-gray-700 space-x-3">
        {['en', 'es'].map((lang) => (
          <button
            key={lang}
            onClick={() => changeLanguage(lang)}
            className={`transition hover:underline ${
              i18n.language === lang ? 'text-red-600 underline' : ''
            }`}
          >
            {lang === 'en' ? 'English' : 'Español'}
          </button>
        ))}
      </div>

      {/* Brand + Nav */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        {/* BRAND: text-only “Rentable” */}
        <Link to="/" className="group inline-flex items-center gap-2">
          <div className="leading-none">
            <span className="text-2xl font-black tracking-tight bg-gradient-to-r from-rose-600 via-pink-600 to-red-600 bg-clip-text text-transparent">
              Rentable
            </span>
            {/* tiny brand dot accent */}
            <span className="inline-block h-2 w-2 rounded-full bg-rose-600 ml-1 align-super group-hover:scale-110 transition-transform" />
          </div>
         
        </Link>

        {/* NAV */}
        <nav className="w-full md:w-auto">
          <ul className="flex flex-wrap justify-center md:justify-start gap-x-6 text-sm font-semibold text-gray-900">
            <li>
              <a
                href="/"
                className="text-red-700 border-b-2 border-red-600 pb-1"
              >
                {t('nav.home')}
              </a>
            </li>

            {/* About Us Dropdown */}
            <li className="relative group">
              <button
                className="flex items-center gap-1 hover:text-red-600 focus:outline-none"
                aria-haspopup="true"
                aria-expanded="false"
              >
                {t('nav.aboutUs')} <FaChevronDown className="text-xs mt-[2px]" />
              </button>
              <div className="absolute left-0 top-full mt-2 w-44 rounded-md border border-gray-100 bg-white shadow-lg text-sm opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-opacity duration-150 z-10">
                <a href="#about-company" className="block px-4 py-2 hover:bg-gray-50">
                  {t('nav.company')}
                </a>
                <a href="#about-team" className="block px-4 py-2 hover:bg-gray-50">
                  {t('nav.ourTeam')}
                </a>
                <a href="#about-history" className="block px-4 py-2 hover:bg-gray-50">
                  {t('nav.history')}
                </a>
              </div>
            </li>

            {/* Industries Dropdown */}
            <li className="relative group">
              <button
                className="flex items-center gap-1 hover:text-red-600 focus:outline-none"
                aria-haspopup="true"
                aria-expanded="false"
              >
                {t('nav.industries')} <FaChevronDown className="text-xs mt-[2px]" />
              </button>
              <div className="absolute left-0 top-full mt-2 w-52 rounded-md border border-gray-100 bg-white shadow-lg text-sm opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-opacity duration-150 z-10">
                <a href="#healthcare" className="block px-4 py-2 hover:bg-gray-50">
                  {t('nav.healthcare')}
                </a>
                <a href="#education" className="block px-4 py-2 hover:bg-gray-50">
                  {t('nav.education')}
                </a>
                <a href="#military" className="block px-4 py-2 hover:bg-gray-50">
                  {t('nav.military')}
                </a>
                <a href="#hospitality" className="block px-4 py-2 hover:bg-gray-50">
                  {t('nav.hospitality')}
                </a>
              </div>
            </li>

            <li>
              <a href="#blog" className="hover:text-red-600">
                {t('nav.blog')}
              </a>
            </li>
            <li>
              <a href="#try" className="hover:text-red-600">
                {t('nav.tryBuy')}
              </a>
            </li>
            <li>
              <Link to="/signIn" className="hover:text-red-600">
                {t('nav.signIn') || 'Sign Up'}
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
