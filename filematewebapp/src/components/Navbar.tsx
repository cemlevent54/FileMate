import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import { useLanguage } from '../context/LanguageContext';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const { translations, language, setLanguage } = useLanguage();

  const toggleMenu = useCallback(() => {
    setIsMenuOpen(prev => !prev);
  }, []);

  const toggleLanguageDropdown = useCallback(() => {
    setIsLanguageDropdownOpen(prev => !prev);
  }, []);

  const handleLanguageChange = useCallback((lang: 'tr' | 'en') => {
    setLanguage(lang);
    setIsLanguageDropdownOpen(false);
  }, [setLanguage]);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-left">
          <Link to="/" className="navbar-logo">
            <a>FileMate</a>
          </Link>
        </div>
        <div className="navbar-right">
          <div className="menu-icon" onClick={toggleMenu}>
            <i className={isMenuOpen ? 'fas fa-times' : 'fas fa-bars'} />
          </div>
          <ul className={isMenuOpen ? 'nav-menu active' : 'nav-menu'}>
            <li className="nav-item">
              <Link to="/" className="nav-link">
                {translations.navbar.home}
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/files" className="nav-link">
                {translations.navbar.files}
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/shares" className="nav-link">
                {translations.navbar.shares}
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/profile" className="nav-link">
                {translations.navbar.profile}
              </Link>
            </li>
            <li className="nav-item language-selector">
              <div className="language-dropdown">
                <button className="language-dropdown-button" onClick={toggleLanguageDropdown}>
                  {language.toUpperCase()}
                  <i className={`fas fa-chevron-${isLanguageDropdownOpen ? 'up' : 'down'}`}></i>
                </button>
                {isLanguageDropdownOpen && (
                  <div className="language-dropdown-content">
                    <button 
                      className={language === 'tr' ? 'active' : ''} 
                      onClick={() => handleLanguageChange('tr')}
                    >
                      {translations.common.turkish}
                    </button>
                    <button 
                      className={language === 'en' ? 'active' : ''} 
                      onClick={() => handleLanguageChange('en')}
                    >
                      {translations.common.english}
                    </button>
                  </div>
                )}
              </div>
            </li>
            <li className="nav-item">
              <Link to="/login" className="nav-link">
                {translations.navbar.loginRegister}
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 