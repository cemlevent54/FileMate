import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import './Login.css';

const Login: React.FC = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { translations } = useLanguage();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Login işlemleri burada yapılacak
    console.log('Login attempt:', { email, password });
  };

  return (
    <div className="login-container">
      <button 
        className="login-button"
        onClick={() => setIsLoginOpen(!isLoginOpen)}
      >
        <i className="fas fa-user"></i>
        {translations.common.login}
      </button>

      {isLoginOpen && (
        <div className="login-modal">
          <div className="login-content">
            <h2>{translations.login.title}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="email">{translations.login.email}</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">{translations.login.password}</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="submit-button">
                {translations.login.submit}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login; 