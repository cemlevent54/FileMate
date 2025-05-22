import React, { useState, useEffect } from 'react';
import '../styles/AdminDashboard.css';
import AdminSidebar from '../components/AdminSidebar';
import ConfirmModal from '../components/ConfirmModal';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8030';

interface User {
  id: number;
  firstName: string | null;
  lastName: string | null;
  email: string;
  isActive: boolean;
  roleId: number | null;
  createdAt: string;
  updatedAt: string;
  role?: string; // Frontend'de kullanılan rol gösterimi
  password?: string; // Frontend'de kullanılan şifre gösterimi
}

// Tarih formatı için yardımcı fonksiyon
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

const mockUsers: User[] = [
  {
    id: 1,
    firstName: 'Ahmet',
    lastName: 'Yılmaz',
    email: 'user1@example.com',
    isActive: true,
    roleId: 1,
    createdAt: new Date().toISOString(), // Şu anki tarih
    updatedAt: new Date().toISOString(), // Şu anki tarih
  },
  {
    id: 2,
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@example.com',
    isActive: false,
    roleId: 2,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 gün önce
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 gün önce
  },
];

const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [userToUpdate, setUserToUpdate] = useState<User | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'warning'>('success');
  const [updateForm, setUpdateForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: '',
    password: '',
    isActive: true
  });

  // Toast mesajını otomatik kapatma
  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        setShowToast(false);
      }, 4000); // 4 saniye
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  const showToastMessage = (message: string, type: 'success' | 'warning') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
  };

  const handleShowDetails = (user: User) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedUser(null);
  };

  const handleShowUpdate = (user: User) => {
    setUserToUpdate(user);
    setUpdateForm({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email,
      role: user.roleId === 2 ? 'admin' : 'user',
      password: '********',
      isActive: user.isActive
    });
    setShowUpdateModal(true);
  };

  const handleCloseUpdateModal = () => {
    setShowUpdateModal(false);
    setUserToUpdate(null);
  };

  const handleUpdateChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setUpdateForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (userToUpdate) {
      try {
        const token = localStorage.getItem('token');
        
        // Güncelleme verilerini hazırla
        const updateData: {
          firstName: string;
          lastName: string;
          email: string;
          role: string;
          isActive: boolean;
          password?: string;
        } = {
          firstName: updateForm.firstName,
          lastName: updateForm.lastName,
          email: updateForm.email,
          role: updateForm.role,
          isActive: updateForm.isActive
        };

        // Şifre sadece değiştirilmişse gönder
        if (updateForm.password !== '********') {
          updateData.password = updateForm.password;
        }

        const response = await axios.put(
          `${API_BASE_URL}/admin/users/${userToUpdate.id}`,
          updateData,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        
        // API'den gelen veriyi frontend formatına dönüştür
        const updatedUser = {
          ...response.data,
          role: response.data.roleId === 2 ? 'admin' : 'user',
          password: '********'
        };
        
        // Tablo verilerini güncelle
        setUsers(prevUsers => 
          prevUsers.map(user => 
            user.id === userToUpdate.id 
              ? {
                  ...user,
                  firstName: updateForm.firstName,
                  lastName: updateForm.lastName,
                  email: updateForm.email,
                  role: updateForm.role,
                  isActive: updateForm.isActive,
                  roleId: updateForm.role === 'admin' ? 2 : 1
                }
              : user
          )
        );

        showToastMessage(`${updateForm.firstName || 'Kullanıcı'} başarıyla güncellendi`, 'success');
        handleCloseUpdateModal();
      } catch (error) {
        console.error('Güncelleme hatası:', error);
        showToastMessage('Kullanıcı güncellenirken bir hata oluştu', 'warning');
      }
    }
  };

  const handleToggleActive = async (id: number) => {
    try {
      const token = localStorage.getItem('token');
      const user = users.find(u => u.id === id);
      if (!user) return;

      const endpoint = user.isActive ? 'block' : 'activate';
      await axios.post(
        `${API_BASE_URL}/admin/users/${id}/${endpoint}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setUsers(users.map(u => {
        if (u.id === id) {
          const newStatus = !u.isActive;
          const message = newStatus 
            ? `${u.firstName || 'Kullanıcı'} ${u.lastName || ''} kullanıcısı başarıyla aktif edildi`
            : `${u.firstName || 'Kullanıcı'} ${u.lastName || ''} kullanıcısı başarıyla engellendi`;
          showToastMessage(message, newStatus ? 'success' : 'warning');
          return { ...u, isActive: newStatus };
        }
        return u;
      }));
    } catch (error) {
      showToastMessage('Kullanıcı durumu güncellenirken bir hata oluştu', 'warning');
    }
  };

  const handleDeleteClick = (user: User) => {
    setUserToDelete(user);
    setShowConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (userToDelete) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`${API_BASE_URL}/admin/users/${userToDelete.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setUsers(users.filter(u => u.id !== userToDelete.id));
        showToastMessage(`${userToDelete.firstName || 'Kullanıcı'} ${userToDelete.lastName || ''} kullanıcısı başarıyla silindi`, 'warning');
      } catch (error) {
        showToastMessage('Kullanıcı silinirken bir hata oluştu', 'warning');
      }
    }
    setShowConfirm(false);
    setUserToDelete(null);
  };

  const handleCancelDelete = () => {
    setShowConfirm(false);
    setUserToDelete(null);
  };

  // Kullanıcıları getir
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/admin/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // API'den gelen veriyi frontend formatına dönüştür
      const formattedUsers = response.data.map((user: any) => ({
        ...user,
        role: user.roleId === 2 ? 'admin' : 'user', // roleId'ye göre rol belirle
        password: '********' // Şifre gösterilmeyecek
      }));
      
      setUsers(formattedUsers);
    } catch (error) {
      showToastMessage('Kullanıcılar yüklenirken bir hata oluştu', 'warning');
    }
  };

  // Component yüklendiğinde kullanıcıları getir
  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-content">
        <h2>Kullanıcılar</h2>
        
        {/* Toast Mesajı */}
        {showToast && (
          <div 
            style={{
              position: 'fixed',
              top: '20px',
              right: '20px',
              padding: '15px 25px',
              backgroundColor: toastType === 'success' ? '#28a745' : '#ffc107',
              color: 'white',
              borderRadius: '4px',
              boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              animation: 'slideIn 0.3s ease-out'
            }}
          >
            <i className={`fas fa-${toastType === 'success' ? 'check-circle' : 'exclamation-circle'}`}></i>
            <span>{toastMessage}</span>
            <button 
              onClick={() => setShowToast(false)}
              style={{
                background: 'none',
                border: 'none',
                color: 'white',
                marginLeft: '10px',
                cursor: 'pointer',
                padding: '0 5px'
              }}
            >
              ×
            </button>
          </div>
        )}

        <style>
          {`
            @keyframes slideIn {
              from {
                transform: translateX(100%);
                opacity: 0;
              }
              to {
                transform: translateX(0);
                opacity: 1;
              }
            }
          `}
        </style>

        <table className="table">
          <thead>
            <tr>
              <th>id</th>
              <th>Ad</th>
              <th>Soyad</th>
              <th>Rol</th>
              <th>Oluşturulma</th>
              <th>Güncellenme</th>
              <th>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.firstName || ''}</td>
                <td>{user.lastName || ''}</td>
                <td>{user.role}</td>
                <td>{formatDate(user.createdAt)}</td>
                <td>{formatDate(user.updatedAt)}</td>
                <td>
                  <button className="btn btn-info btn-sm me-2" onClick={() => handleShowDetails(user)}>Detaylar</button>
                  <button className="btn btn-warning btn-sm me-2" onClick={() => handleToggleActive(user.id)}>
                    {user.isActive ? 'Engelle' : 'Aktif Et'}
                  </button>
                  <button className="btn btn-danger btn-sm me-2" onClick={() => handleDeleteClick(user)}>Sil</button>
                  <button className="btn btn-secondary btn-sm" onClick={() => handleShowUpdate(user)}>Güncelle</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Detaylar Modalı */}
        {showModal && selectedUser && (
          <div className="custom-modal-backdrop" onClick={handleCloseModal}>
            <div className="custom-modal animate-modal" onClick={e => e.stopPropagation()}>
              <div className="modal-header" style={{ position: 'relative' }}>
                <h5 className="modal-title">Kullanıcı Detayları</h5>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Kapat"
                  onClick={handleCloseModal}
                  style={{
                    position: 'absolute',
                    top: 16,
                    right: 20,
                    fontSize: '1.5rem',
                    background: 'none',
                    border: 'none',
                    color: '#888',
                    cursor: 'pointer',
                    opacity: 0.8,
                    zIndex: 2
                  }}
                >
                  &#10005;
                </button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6">
                    <p><b>ID:</b> {selectedUser.id}</p>
                    <p><b>Ad:</b> {selectedUser.firstName || ''}</p>
                    <p><b>Soyad:</b> {selectedUser.lastName || ''}</p>
                    <p><b>E-posta:</b> {selectedUser.email}</p>
                  </div>
                  <div className="col-md-6">
                    <p><b>Rol:</b> {selectedUser.role}</p>
                    <p><b>Şifre:</b> {selectedUser.password}</p>
                    <p><b>Oluşturulma:</b> {formatDate(selectedUser.createdAt)}</p>
                    <p><b>Güncellenme:</b> {formatDate(selectedUser.updatedAt)}</p>
                    <p><b>Durum:</b> {selectedUser.isActive ? 'Aktif' : 'Engelli'}</p>
                  </div>
                </div>
                <button className="btn btn-primary mt-3">Kullanıcı Dosyaları</button>
              </div>
            </div>
          </div>
        )}

        {/* Güncelleme Modalı */}
        {showUpdateModal && userToUpdate && (
          <div className="custom-modal-backdrop" onClick={handleCloseUpdateModal}>
            <div className="custom-modal animate-modal" onClick={e => e.stopPropagation()}>
              <div className="modal-header" style={{ position: 'relative' }}>
                <h5 className="modal-title">Kullanıcı Güncelle</h5>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Kapat"
                  onClick={handleCloseUpdateModal}
                  style={{
                    position: 'absolute',
                    top: 16,
                    right: 20,
                    fontSize: '1.5rem',
                    background: 'none',
                    border: 'none',
                    color: '#888',
                    cursor: 'pointer',
                    opacity: 0.8,
                    zIndex: 2
                  }}
                >
                  &#10005;
                </button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleUpdateSubmit}>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Ad</label>
                      <input
                        type="text"
                        className="form-control"
                        name="firstName"
                        value={updateForm.firstName}
                        onChange={handleUpdateChange}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Soyad</label>
                      <input
                        type="text"
                        className="form-control"
                        name="lastName"
                        value={updateForm.lastName}
                        onChange={handleUpdateChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">E-posta</label>
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      value={updateForm.email}
                      onChange={handleUpdateChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Rol</label>
                    <select
                      className="form-select"
                      name="role"
                      value={updateForm.role}
                      onChange={handleUpdateChange}
                      required
                    >
                      <option value="user">Kullanıcı</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Şifre</label>
                    <input
                      type="password"
                      className="form-control"
                      name="password"
                      value={updateForm.password}
                      onChange={handleUpdateChange}
                      required
                    />
                  </div>
                  <div className="mb-3 form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      name="isActive"
                      checked={updateForm.isActive}
                      onChange={handleUpdateChange}
                      id="isActiveCheck"
                    />
                    <label className="form-check-label" htmlFor="isActiveCheck">
                      Aktif
                    </label>
                  </div>
                  <div className="text-end">
                    <button type="button" className="btn btn-secondary me-2" onClick={handleCloseUpdateModal}>
                      İptal
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Güncelle
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        <ConfirmModal
          show={showConfirm}
          title="Kullanıcıyı Sil"
          description={userToDelete ? `${userToDelete.email} kullanıcısını silmek istediğinize emin misiniz?` : ''}
          confirmText="Evet, Sil"
          cancelText="Vazgeç"
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      </div>
    </div>
  );
};

export default AdminUsers; 