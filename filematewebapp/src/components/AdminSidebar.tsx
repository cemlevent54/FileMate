import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/AdminSidebar.css';

const AdminSidebar: React.FC = () => {
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
          <li>
            <Link to="/admin/settings">
              <i className="fas fa-cog"></i>
              Ayarlar
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default AdminSidebar; 