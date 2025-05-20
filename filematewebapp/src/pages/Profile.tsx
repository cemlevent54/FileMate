import React, { useState } from 'react';
import { Container, Form, Button, Card, Alert } from 'react-bootstrap';

const Profile: React.FC = () => {
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

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Şifre değiştirme işlemi burada yapılacak
    console.log('Şifre değiştirme:', passwordData);
  };

  const handleUserDataSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Kullanıcı bilgilerini güncelleme işlemi burada yapılacak
    console.log('Kullanıcı bilgileri güncelleme:', userData);
  };

  const handleDeleteAccount = () => {
    // Hesap silme işlemi burada yapılacak
    console.log('Hesap silme işlemi');
  };

  return (
    <Container className="py-4">
      <h2 className="mb-4">Profil Ayarları</h2>

      {/* Şifre Değiştirme Bölümü */}
      <Card className="mb-4">
        <Card.Body>
          <Card.Title>Şifre Değiştir</Card.Title>
          <Form onSubmit={handlePasswordSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Mevcut Şifre</Form.Label>
              <Form.Control
                type="password"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Yeni Şifre</Form.Label>
              <Form.Control
                type="password"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Yeni Şifre (Tekrar)</Form.Label>
              <Form.Control
                type="password"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
              />
            </Form.Group>

            <Button variant="primary" type="submit">
              Şifreyi Güncelle
            </Button>
          </Form>
        </Card.Body>
      </Card>

      {/* Kişisel Bilgiler Bölümü */}
      <Card className="mb-4">
        <Card.Body>
          <Card.Title>Kişisel Bilgiler</Card.Title>
          <Form onSubmit={handleUserDataSubmit}>
            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Ad</Form.Label>
                  <Form.Control
                    type="text"
                    name="firstName"
                    value={userData.firstName}
                    onChange={handleUserDataChange}
                  />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Soyad</Form.Label>
                  <Form.Control
                    type="text"
                    name="lastName"
                    value={userData.lastName}
                    onChange={handleUserDataChange}
                  />
                </Form.Group>
              </div>
            </div>

            <Form.Group className="mb-3">
              <Form.Label>E-posta</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={userData.email}
                onChange={handleUserDataChange}
              />
            </Form.Group>

            <Button variant="primary" type="submit">
              Bilgileri Güncelle
            </Button>
          </Form>
        </Card.Body>
      </Card>

      {/* Hesap Silme Bölümü */}
      <Card className="mb-4 border-danger">
        <Card.Body>
          <Card.Title className="text-danger">Hesabı Sil</Card.Title>
          <Alert variant="danger">
            Hesabınızı silmek geri alınamaz bir işlemdir. Tüm verileriniz kalıcı olarak silinecektir.
          </Alert>
          <Button variant="outline-danger" onClick={handleDeleteAccount}>
            Hesabımı Sil
          </Button>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Profile; 