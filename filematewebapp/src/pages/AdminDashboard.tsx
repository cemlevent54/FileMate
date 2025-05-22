import React from 'react';
import AdminSidebar from '../components/AdminSidebar';
import '../styles/AdminDashboard.css';

const AdminDashboard: React.FC = () => {
  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-content">
        <div className="admin-header">
          <h1>FileMate Admin Panel</h1>
        </div>
        <div className="admin-main">
          FileMate Admin Panel üzerinden kullanıcı hesaplarını yönetebilir, dosya işlemlerini kontrol edebilir ve sistem genelindeki aktiviteleri takip edebilirsiniz.
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 