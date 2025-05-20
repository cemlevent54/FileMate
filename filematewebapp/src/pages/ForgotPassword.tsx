import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate } from 'react-router-dom';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const { translations } = useLanguage();
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Şifre sıfırlama isteği:', { email });
    setSubmitted(true);
  };

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <div className="card shadow-sm p-4" style={{ maxWidth: '450px', width: '100%' }}>
        <h3 className="text-center mb-3">{translations.forgotPassword.title}</h3>
        <p className="text-muted text-center mb-4">
          {translations.forgotPassword.description}
        </p>

        {submitted ? (
          <div className="alert alert-success text-center">
            {translations.forgotPassword.successMessage || 'Şifre sıfırlama bağlantısı e-posta adresinize gönderildi.'}
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">{translations.login.email}</label>
              <input
                type="email"
                className="form-control"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-100">
              {translations.forgotPassword.submit}
            </button>
          </form>
        )}

        <div className="text-center mt-3">
          <button
            type="button"
            className="btn btn-outline-primary btn-sm ms-2"
            onClick={() => navigate('/login')}
          >
            {translations.forgotPassword.backToLogin}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
