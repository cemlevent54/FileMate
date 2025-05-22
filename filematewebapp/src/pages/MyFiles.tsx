import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { Button, Table, Modal, Form } from 'react-bootstrap';
import FileViewer from '../components/FileViewer';
import ConfirmModal from '../components/ConfirmModal';
import axios from 'axios';

interface FileData {
  id: string;
  uploadedFilename: string;
  url: string;
  uploadUserId: number;
  createdAt: string;
  updatedAt: string;
}

const MyFiles: React.FC = () => {
  const { translations } = useLanguage();
  const { user } = useAuth();
  const [files, setFiles] = useState<FileData[]>([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [showFileModal, setShowFileModal] = useState(false);
  const [fileToView, setFileToView] = useState<FileData | null>(null);
  const [fileViewerWidth, setFileViewerWidth] = useState<number | undefined>(undefined);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [fileToUpdate, setFileToUpdate] = useState<FileData | null>(null);
  const [updatePreviewUrl, setUpdatePreviewUrl] = useState<string>('');
  const [updateFileViewerWidth, setUpdateFileViewerWidth] = useState<number | undefined>(undefined);
  const [showConfirm, setShowConfirm] = useState(false);
  const [fileToDelete, setFileToDelete] = useState<FileData | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'warning'>('success');

  useEffect(() => {
    if (user?.id) {
      fetchUserFiles();
    }
  }, [user]);

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  const fetchUserFiles = async () => {
    try {
      if (!process.env.REACT_APP_API_URL) {
        throw new Error('API URL tanımlı değil');
      }

      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/files/user/${user?.id}`);
      setFiles(response.data.files);
    } catch (error) {
      console.error('Dosyalar yüklenirken hata oluştu:', error);
      showToastMessage('Dosyalar yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.', 'warning');
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      console.log('Seçilen dosya türü:', file.type);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !user?.id) return;

    try {
      if (!process.env.REACT_APP_API_URL) {
        throw new Error('API URL tanımlı değil');
      }

      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('userId', user.id.toString());

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/files/upload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      setFiles(prevFiles => [...prevFiles, response.data.file]);
      showToastMessage('Dosya başarıyla yüklendi', 'success');
      setShowUploadModal(false);
      setSelectedFile(null);
      setPreviewUrl('');
    } catch (error) {
      console.error('Dosya yüklenirken hata oluştu:', error);
      showToastMessage('Dosya yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.', 'warning');
    }
  };

  const handleDeleteClick = (file: FileData) => {
    setFileToDelete(file);
    setShowConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (!fileToDelete || !user?.id) return;

    try {
      if (!process.env.REACT_APP_API_URL) {
        throw new Error('API URL tanımlı değil');
      }

      await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/files/${fileToDelete.id}?userId=${user.id}`
      );

      setFiles(prevFiles => prevFiles.filter(file => file.id !== fileToDelete.id));
      showToastMessage(`${fileToDelete.uploadedFilename} dosyası başarıyla silindi`, 'success');
      setShowConfirm(false);
      setFileToDelete(null);
    } catch (error) {
      console.error('Dosya silinirken hata oluştu:', error);
      showToastMessage('Dosya silinirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.', 'warning');
    }
  };

  const handleCancelDelete = () => {
    setShowConfirm(false);
    setFileToDelete(null);
  };

  const handleViewFile = (file: FileData) => {
    setFileToView(file);
    setShowFileModal(true);
  };

  const handleCloseFileModal = () => {
    setShowFileModal(false);
    setFileToView(null);
  };

  const handleShowUpdate = (file: FileData) => {
    setFileToUpdate(file);
    setUpdatePreviewUrl(`${process.env.REACT_APP_API_URL}${file.url}`);
    setShowUpdateModal(true);
  };

  const handleCloseUpdateModal = () => {
    setShowUpdateModal(false);
    setFileToUpdate(null);
    setUpdatePreviewUrl('');
  };

  const handleUpdateFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setUpdatePreviewUrl(url);
      if (fileToUpdate) {
        setFileToUpdate({
          ...fileToUpdate,
          uploadedFilename: file.name
        });
      }
    }
  };

  const handleUpdateSubmit = async () => {
    if (!fileToUpdate || !user?.id) return;

    try {
      if (!process.env.REACT_APP_API_URL) {
        throw new Error('API URL tanımlı değil');
      }

      const formData = new FormData();
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (fileInput?.files?.[0]) {
        formData.append('file', fileInput.files[0]);
      }
      formData.append('userId', user.id.toString());

      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/files/${fileToUpdate.id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      setFiles(prevFiles => 
        prevFiles.map(file => 
          file.id === fileToUpdate.id ? response.data.file : file
        )
      );

      showToastMessage(`${fileToUpdate.uploadedFilename} dosyası başarıyla güncellendi`, 'success');
      handleCloseUpdateModal();
    } catch (error) {
      console.error('Dosya güncellenirken hata oluştu:', error);
      showToastMessage('Dosya güncellenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.', 'warning');
    }
  };

  const showToastMessage = (message: string, type: 'success' | 'warning') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
  };

  return (
    <div className="container mt-4">
      {/* Toast Mesajı */}
      {showToast && (
        <div
          style={{
            position: 'fixed',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            padding: '12px 20px',
            backgroundColor: toastType === 'success' ? '#28a745' : '#ffc107',
            color: 'white',
            borderRadius: '4px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            zIndex: 9999,
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            animation: 'fadeIn 0.3s ease-out',
            minWidth: '200px',
            textAlign: 'center',
            justifyContent: 'center',
          }}
        >
          <span>{toastMessage}</span>
          <button
            onClick={() => setShowToast(false)}
            style={{
              background: 'none',
              border: 'none',
              color: 'white',
              marginLeft: '8px',
              cursor: 'pointer',
              padding: '0',
              fontSize: '16px',
              opacity: '0.8',
              lineHeight: '1',
            }}
          >
            ×
          </button>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translate(-50%, -10px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
      `}</style>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>{translations.myFiles.title}</h2>
        <Button variant="primary" onClick={() => setShowUploadModal(true)}>
          {translations.myFiles.uploadFile}
        </Button>
      </div>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>{translations.myFiles.fileName}</th>
            <th>{translations.myFiles.uploadDate}</th>
            <th>{translations.myFiles.actions}</th>
          </tr>
        </thead>
        <tbody>
          {files.map((file) => (
            <tr key={file.id}>
              <td>{file.uploadedFilename}</td>
              <td>{new Date(file.createdAt).toLocaleDateString()}</td>
              <td>
                <Button
                  variant="info"
                  size="sm"
                  className="me-2"
                  onClick={() => handleViewFile(file)}
                >
                  Görüntüle
                </Button>
                <Button
                  variant="warning"
                  size="sm"
                  className="me-2"
                  onClick={() => handleShowUpdate(file)}
                >
                  Düzenle
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDeleteClick(file)}
                >
                  Sil
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showUploadModal} onHide={() => setShowUploadModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{translations.myFiles.uploadFile}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>{translations.myFiles.selectFile}</Form.Label>
              <Form.Control
                type="file"
                onChange={handleFileSelect}
                accept=".jpg,.jpeg,.png,.pdf,.pptx"
              />
            </Form.Group>
            {previewUrl && selectedFile && (() => {
              const name = selectedFile.name.toLowerCase();
              const type = selectedFile.type;
              // PDF ise hiç preview gösterme
              if (type === 'application/pdf' || name.endsWith('.pdf')) {
                return null;
              }
              return (
                <div className="mt-3">
                  <h6>{translations.myFiles.preview}</h6>
                  {type === 'application/vnd.openxmlformats-officedocument.presentationml.presentation' || name.endsWith('.pptx') ? (
                    <FileViewer
                      filename={selectedFile.name}
                      filepath={previewUrl}
                      mimeType="application/vnd.openxmlformats-officedocument.presentationml.presentation"
                    />
                  ) : type.startsWith('image/') || name.endsWith('.jpg') || name.endsWith('.jpeg') || name.endsWith('.png') ? (
                    <img
                      src={previewUrl}
                      alt="Preview"
                      style={{ maxWidth: '100%', maxHeight: '200px' }}
                    />
                  ) : (
                    <div style={{ color: 'red', fontSize: '14px' }}>
                      Bu dosya türü için önizleme desteklenmiyor.
                    </div>
                  )}
                </div>
              );
            })()}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowUploadModal(false)}>
            {translations.common.cancel}
          </Button>
          <Button variant="primary" onClick={handleUpload}>
            {translations.common.upload}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Dosya Görüntüleme Modalı */}
      {showFileModal && fileToView && (
        <div className="custom-modal-backdrop" onClick={handleCloseFileModal}>
          <div
            className="custom-modal animate-modal"
            style={{
              maxWidth: fileViewerWidth ? `${fileViewerWidth + 8}vw` : 700,
              width: fileViewerWidth ? `${fileViewerWidth + 8}vw` : '90%',
              minWidth: 350,
              maxHeight: '90vh',
              transition: 'width 0.2s, max-width 0.2s',
              display: 'flex',
              flexDirection: 'column',
            }}
            onClick={e => e.stopPropagation()}
          >
            <div className="modal-header" style={{ position: 'relative' }}>
              <h5 className="modal-title">Dosya Görüntüle</h5>
              <button
                type="button"
                className="btn-close"
                aria-label="Kapat"
                onClick={handleCloseFileModal}
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
                  zIndex: 2,
                }}
              >
                &#10005;
              </button>
            </div>
            <div className="modal-body" style={{ overflowY: 'auto', flex: 1 }}>
              <FileViewer
                filename={fileToView.uploadedFilename}
                filepath={`${process.env.REACT_APP_API_URL}${fileToView.url}`}
                mimeType={fileToView.uploadedFilename.endsWith('.pdf') ? 'application/pdf' : 'image/jpeg'}
                onDocxWidthChange={setFileViewerWidth}
              />
            </div>
          </div>
        </div>
      )}

      {/* Düzenleme Modalı */}
      {showUpdateModal && fileToUpdate && (
        <div className="custom-modal-backdrop" onClick={handleCloseUpdateModal}>
          <div
            className="custom-modal animate-modal"
            style={{
              maxWidth: updateFileViewerWidth ? `${updateFileViewerWidth + 8}vw` : 700,
              width: updateFileViewerWidth ? `${updateFileViewerWidth + 8}vw` : '90%',
              minWidth: 350,
              maxHeight: '90vh',
              transition: 'width 0.2s, max-width 0.2s',
              display: 'flex',
              flexDirection: 'column',
            }}
            onClick={e => e.stopPropagation()}
          >
            <div className="modal-header" style={{ position: 'relative' }}>
              <h5 className="modal-title">Dosya Düzenle</h5>
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
                  zIndex: 2,
                }}
              >
                &#10005;
              </button>
            </div>
            <div className="modal-body" style={{ overflowY: 'auto', flex: 1 }}>
              <div className="mb-4">
                <label className="form-label">Yeni Dosya Seç</label>
                <input
                  type="file"
                  className="form-control"
                  onChange={handleUpdateFileSelect}
                  accept=".pdf,.jpg,.jpeg,.png,.pptx"
                />
              </div>
              
              {updatePreviewUrl && (
                <div className="mb-4">
                  <label className="form-label">Önizleme</label>
                  {fileToUpdate?.uploadedFilename.endsWith('.pdf') ? (
                    <FileViewer
                      filename={fileToUpdate.uploadedFilename}
                      filepath={updatePreviewUrl}
                      mimeType="application/pdf"
                      onDocxWidthChange={setUpdateFileViewerWidth}
                    />
                  ) : fileToUpdate?.uploadedFilename.endsWith('.pptx') ? (
                    <FileViewer
                      filename={fileToUpdate.uploadedFilename}
                      filepath={updatePreviewUrl}
                      mimeType="application/vnd.openxmlformats-officedocument.presentationml.presentation"
                      onDocxWidthChange={setUpdateFileViewerWidth}
                    />
                  ) : (
                    <img
                      src={updatePreviewUrl}
                      alt="Preview"
                      style={{ maxWidth: '100%', maxHeight: '200px' }}
                    />
                  )}
                </div>
              )}

              <div className="text-end mt-4">
                <button
                  type="button"
                  className="btn btn-secondary me-2"
                  onClick={handleCloseUpdateModal}
                >
                  İptal
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleUpdateSubmit}
                >
                  Güncelle
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        show={showConfirm}
        title="Dosyayı Sil"
        description={fileToDelete ? `${fileToDelete.uploadedFilename} dosyasını silmek istediğinize emin misiniz?` : ''}
        confirmText="Evet, Sil"
        cancelText="Vazgeç"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
};

export default MyFiles; 