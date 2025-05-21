import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Card, Alert, Modal } from 'react-bootstrap';
import axios, { AxiosResponse } from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

// API base URL'ini tanımlayalım
const API_BASE_URL = 'http://localhost:8030'; // Backend'in çalıştığı port'a göre değiştirin

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
}

interface PasswordData {
  oldPassword: string;
  newPassword: string;
}

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { translations } = useLanguage();
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    email: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchUserData = async () => {
      try {
        setLoading(true);
        const response: AxiosResponse<UserData> = await axios.get(`${API_BASE_URL}/user/me`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setUserData({
          firstName: response.data.firstName || '',
          lastName: response.data.lastName || '',
          email: response.data.email || '',
        });
        setError(null);
      } catch (error: any) {
        console.error('Kullanıcı bilgileri yüklenirken hata oluştu:', error);
        if (error.response?.status === 401) {
          navigate('/login');
        } else {
          setError(translations.profilePage.errorUserInfo);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [isAuthenticated, navigate]);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUserDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError(translations.profilePage.errorPasswordMatch);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      await axios.put(`${API_BASE_URL}/user/update-password`, {
        oldPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      setSuccess(translations.profilePage.successPassword);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error: any) {
      console.error('Şifre güncellenirken hata oluştu:', error);
      setError(translations.profilePage.errorPassword);
    } finally {
      setLoading(false);
    }
  };

  const handleUserDataSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
  
      const response = await axios.put(`${API_BASE_URL}/user/update-info`, {
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
  
      setSuccess(translations.profilePage.successInfo);
  
      // 👇 Güncel verileri state'e yaz
      if (response.data.user) {
        setUserData({
          firstName: response.data.user.firstName,
          lastName: response.data.user.lastName,
          email: response.data.user.email
        });
      }
    } catch (error: any) {
      console.error('Kullanıcı bilgileri güncellenirken hata oluştu:', error);
      setError(translations.profilePage.errorInfo);
    } finally {
      setLoading(false);
    }
  };
  

  const handleDeleteAccount = async () => {
    try {
      setLoading(true);
      setError(null);

      await axios.delete(`${API_BASE_URL}/user/delete-account`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      localStorage.removeItem('token');
      window.location.href = '/login';
    } catch (error: any) {
      console.error('Hesap silinirken hata oluştu:', error);
      setError(translations.profilePage.errorDelete);
      setShowDeleteModal(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-4">
      <h2 className="mb-4">{translations.profilePage.title}</h2>

      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      {/* Şifre Değiştirme Bölümü */}
      <Card className="mb-4">
        <Card.Body>
          <Card.Title>{translations.profilePage.changePassword}</Card.Title>
          <Form onSubmit={handlePasswordSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>{translations.profilePage.currentPassword}</Form.Label>
              <Form.Control
                type="password"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                disabled={loading}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>{translations.profilePage.newPassword}</Form.Label>
              <Form.Control
                type="password"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                disabled={loading}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>{translations.profilePage.confirmNewPassword}</Form.Label>
              <Form.Control
                type="password"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                disabled={loading}
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? translations.profilePage.updating : translations.profilePage.updatePassword}
            </Button>
          </Form>
        </Card.Body>
      </Card>

      {/* Kişisel Bilgiler Bölümü */}
      <Card className="mb-4">
        <Card.Body>
          <Card.Title>{translations.profilePage.personalInfo}</Card.Title>
          <Form onSubmit={handleUserDataSubmit}>
            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>{translations.profilePage.firstName}</Form.Label>
                  <Form.Control
                    type="text"
                    name="firstName"
                    value={userData.firstName}
                    onChange={handleUserDataChange}
                    disabled={loading}
                    required
                  />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>{translations.profilePage.lastName}</Form.Label>
                  <Form.Control
                    type="text"
                    name="lastName"
                    value={userData.lastName}
                    onChange={handleUserDataChange}
                    disabled={loading}
                    required
                  />
                </Form.Group>
              </div>
            </div>

            <Form.Group className="mb-3">
              <Form.Label>{translations.profilePage.email}</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={userData.email}
                onChange={handleUserDataChange}
                disabled={loading}
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? translations.profilePage.updating : translations.profilePage.updateInfo}
            </Button>
          </Form>
        </Card.Body>
      </Card>

      {/* Hesap Silme Bölümü */}
      <Card className="mb-4 border-danger">
        <Card.Body>
          <Card.Title className="text-danger">{translations.profilePage.deleteAccount}</Card.Title>
          <Alert variant="danger">
            {translations.profilePage.deleteAccountWarning}
          </Alert>
          <Button 
            variant="outline-danger" 
            onClick={() => setShowDeleteModal(true)}
            disabled={loading}
          >
            {translations.profilePage.deleteAccountButton}
          </Button>
        </Card.Body>
      </Card>

      {/* Hesap Silme Onay Modalı */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{translations.profilePage.deleteAccountTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {translations.profilePage.deleteAccountDesc}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            {translations.profilePage.cancel}
          </Button>
          <Button variant="danger" onClick={handleDeleteAccount} disabled={loading}>
            {loading ? translations.profilePage.deleting : translations.profilePage.deleteAccountButton}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Profile; 