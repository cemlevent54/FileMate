import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const { translations, language, setLanguage } = useLanguage();
  const { isAuthenticated, logout } = useAuth();

  const toggleLanguageDropdown = () => {
    setIsLanguageDropdownOpen(!isLanguageDropdownOpen);
  };

  const handleLanguageChange = (newLanguage: 'tr' | 'en') => {
    setLanguage(newLanguage);
    setIsLanguageDropdownOpen(false);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
        <Link className="navbar-brand" to="/">FileMate</Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">{translations.navbar.home}</Link>
            </li>
            {isAuthenticated && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/my-files">{translations.navbar.files}</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/profile">{translations.navbar.profile}</Link>
                </li>
              </>
            )}
          </ul>
          <ul className="navbar-nav">
            <li className="nav-item dropdown">
              <button
                className="btn btn-outline-secondary dropdown-toggle ms-lg-2"
                type="button"
                onClick={toggleLanguageDropdown}
              >
                {language.toUpperCase()}
              </button>
              {isLanguageDropdownOpen && (
                <ul className="dropdown-menu show position-absolute">
                  <li>
                    <button
                      className={`dropdown-item ${language === 'tr' ? 'active' : ''}`}
                      onClick={() => handleLanguageChange('tr')}
                    >
                      {translations.common.turkish}
                    </button>
                  </li>
                  <li>
                    <button
                      className={`dropdown-item ${language === 'en' ? 'active' : ''}`}
                      onClick={() => handleLanguageChange('en')}
                    >
                      {translations.common.english}
                    </button>
                  </li>
                </ul>
              )}
            </li>

            <li className="nav-item ms-lg-3 mt-2 mt-lg-0">
              {isAuthenticated ? (
                <button onClick={logout} className="btn btn-outline-primary">
                  {translations.common.logout}
                </button>
              ) : (
                <Link to="/login" className="btn btn-primary">
                  {translations.navbar.loginRegister}
                </Link>
              )}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
