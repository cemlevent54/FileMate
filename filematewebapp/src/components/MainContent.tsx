import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './MainContent.css';

const MainContent: React.FC = () => {
  const { translations } = useLanguage();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate('/my-files');
    } else {
      navigate('/login');
    }
  };

  return (
    <main className="App-main">
      <div className="welcome-container">
        <div className="welcome-header">
          <h1 className="welcome-title">{translations.welcome.title}</h1>
          <p className="welcome-subtitle">{translations.welcome.subtitle}</p>
        </div>
        
        <div className="features-grid">
          <div className="feature-card">
            <h3>{translations.welcome.features.upload.title}</h3>
            <p>{translations.welcome.features.upload.description}</p>
          </div>
          
          <div className="feature-card">
            <h3>{translations.welcome.features.storage.title}</h3>
            <p>{translations.welcome.features.storage.description}</p>
          </div>
          
          <div className="feature-card">
            <h3>{translations.welcome.features.share.title}</h3>
            <p>{translations.welcome.features.share.description}</p>
          </div>
        </div>

        <div className="cta-section">
          <button className="cta-button" onClick={handleGetStarted}>
            {translations.welcome.getStarted}
          </button>
        </div>
      </div>
    </main>
  );
};

export default MainContent; 