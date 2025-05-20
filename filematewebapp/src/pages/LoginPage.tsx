import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { translations, language } = useLanguage();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const { login } = useAuth();

  const placeholders: Record<'tr' | 'en', { email: string; password: string }> = {
    en: {
      email: 'Enter your email',
      password: 'Enter your password'
    },
    tr: {
      email: 'E-posta adresinizi girin',
      password: 'Şifrenizi girin'
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError(translations.login.error);
      return;
    }

    try {
      const { isAdmin } = await login(email, password);
      if (isAdmin) {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(translations.login.error);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <div className="card shadow-sm p-4" style={{ maxWidth: '400px', width: '100%' }}>
        <h3 className="text-center mb-4">{translations.login.title}</h3>
        {error && <div className="alert alert-danger text-center">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="page-email" className="form-label">{translations.login.email}</label>
            <input
              type="email"
              className="form-control"
              id="page-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={placeholders[language].email}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="page-password" className="form-label">{translations.login.password}</label>
            <input
              type="password"
              className="form-control"
              id="page-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={placeholders[language].password}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">
            {translations.login.submit}
          </button>
        </form>

        <div className="text-center mt-3">
          <button
            type="button"
            className="btn btn-outline-primary btn-sm ms-2"
            onClick={() => navigate('/register')}
          >
            {translations.login.noAccount}
          </button>

          <br />
          <br />

          <button
            type="button"
            className="btn btn-outline-primary btn-sm ms-2"
            onClick={() => navigate('/forgot-password')}
          >
            {translations.login.forgotPassword}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
