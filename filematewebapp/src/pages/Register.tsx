import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { translations } = useLanguage();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError(translations.register.passwordMismatch);
      return;
    }

    try {
      await register(formData.name, formData.email, formData.password);
      navigate('/login');
    } catch (err: any) {
      setError(err.message || translations.register.error);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <div className="card shadow-sm p-4" style={{ maxWidth: '500px', width: '100%' }}>
        <h3 className="text-center mb-4">{translations.register.title}</h3>
        {error && <div className="alert alert-danger text-center">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">{translations.register.name}</label>
            <input
              type="text"
              className="form-control"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder={translations.register.namePlaceholder}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">{translations.register.email}</label>
            <input
              type="email"
              className="form-control"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder={translations.register.emailPlaceholder}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">{translations.register.password}</label>
            <input
              type="password"
              className="form-control"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder={translations.register.passwordPlaceholder}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="confirmPassword" className="form-label">{translations.register.confirmPassword}</label>
            <input
              type="password"
              className="form-control"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder={translations.register.confirmPasswordPlaceholder}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">{translations.register.submit}</button>
        </form>
        <div className="text-center mt-3">
          <span>{translations.register.hasAccount} </span>
          <Link to="/login" className="btn btn-outline-primary btn-sm ms-2">{translations.register.login}</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
