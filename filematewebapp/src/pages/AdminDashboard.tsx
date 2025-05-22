import React from 'react';
import AdminSidebar from '../components/AdminSidebar';
import '../styles/AdminDashboard.css';

const AdminDashboard: React.FC = () => {
  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-content">
        <div className="admin-header">
          <h1>Dashboard</h1>
        </div>
        <div className="admin-main">
          <div className="dashboard-stats">
            <div className="stat-card">
              <h3>Toplam Kullanıcı</h3>
              <p>150</p>
            </div>
            <div className="stat-card">
              <h3>Toplam Dosya</h3>
              <p>1,250</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 