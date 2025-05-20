import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

const Login: React.FC = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { translations } = useLanguage();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login attempt:', { email, password });
    // Giriş işlemi başarılıysa modalı kapat
    setIsLoginOpen(false);
  };

  return (
    <>
      <button 
        className="btn btn-outline-primary"
        onClick={() => setIsLoginOpen(true)}
      >
        <i className="fas fa-user me-2"></i>
        {translations.common.login}
      </button>

      {isLoginOpen && (
        <div
          className="modal fade show d-block"
          tabIndex={-1}
          role="dialog"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content p-3">
              <div className="modal-header">
                <h5 className="modal-title">{translations.login.title}</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setIsLoginOpen(false)}
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="modal-email" className="form-label">{translations.login.email}</label>
                    <input
                      type="email"
                      id="modal-email"
                      className="form-control"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="modal-password" className="form-label">{translations.login.password}</label>
                    <input
                      type="password"
                      id="modal-password"
                      className="form-control"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary w-100">
                    {translations.login.submit}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Login;
