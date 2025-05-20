import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { translations } = useLanguage();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Login işlemleri burada yapılacak
    console.log('Login attempt:', { email, password });
    // Başarılı login sonrası ana sayfaya yönlendirme
    // navigate('/');
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-content">
          <h1>{translations.login.title}</h1>
          <form onSubmit={handleSubmit} className="login-form-centered">
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
            <div className="login-links">
              <span className="login-link" onClick={() => navigate('/register')}>{translations.login.noAccount}</span>
              <span className="login-link" onClick={() => navigate('/forgot-password')}>{translations.login.forgotPassword}</span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage; 