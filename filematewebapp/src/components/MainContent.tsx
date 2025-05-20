import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const MainContent: React.FC = () => {
  const { translations } = useLanguage();

  return (
    <main className="App-main">
      <h1>{translations.welcome.title}</h1>
      <p>{translations.welcome.subtitle}</p>
    </main>
  );
};

export default MainContent; 