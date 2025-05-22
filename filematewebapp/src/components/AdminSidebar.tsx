import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import '../styles/AdminSidebar.css';

const API_BASE_URL = 'http://localhost:8030';

const AdminSidebar: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_BASE_URL}/auth/logout`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      logout();
      navigate('/login');
    } catch (error) {
      console.error('Çıkış yapılırken hata oluştu:', error);
      logout();
      navigate('/login');
    }
  };

  return (
    <div className="admin-sidebar">
      <div className="sidebar-header">
        <h3>Admin Panel</h3>
      </div>
      <nav className="sidebar-nav">
        <ul>
          <li>
            <Link to="/admin">
              <i className="fas fa-home"></i>
              Dashboard
            </Link>
          </li>
          <li>
            <Link to="/admin/users">
              <i className="fas fa-users"></i>
              Kullanıcılar
            </Link>
          </li>
          <li>
            <Link to="/admin/files">
              <i className="fas fa-file"></i>
              Dosyalar
            </Link>
          </li>
          <li className="logout-item">
            <button onClick={handleLogout} className="logout-button">
              <i className="fas fa-sign-out-alt"></i>
              Çıkış Yap
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default AdminSidebar; 