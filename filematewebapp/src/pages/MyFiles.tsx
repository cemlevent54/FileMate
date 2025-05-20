import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { Button, Table, Modal, Form } from 'react-bootstrap';
import FileViewer from '../components/FileViewer';
import ConfirmModal from '../components/ConfirmModal';

interface FileData {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadDate: string;
  url: string;
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
    fetchUserFiles();
  }, []);

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  const fetchUserFiles = async () => {
    try {
      // Simüle edilmiş API gecikmesi
      await new Promise(resolve => setTimeout(resolve, 500));

      // Mock veriler
      const mockFiles: FileData[] = [
        {
          id: '1',
          name: 'rapor.pdf',
          size: 2048576, // 2MB
          type: 'application/pdf',
          uploadDate: '2024-03-15T10:30:00',
          url: 'https://example.com/files/rapor.pdf'
        },
        {
          id: '2',
          name: 'sunum.pptx',
          size: 5242880, // 5MB
          type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
          uploadDate: '2024-03-14T15:45:00',
          url: 'https://example.com/files/sunum.pptx'
        },
        {
          id: '3',
          name: 'resim.jpg',
          size: 1048576, // 1MB
          type: 'image/jpeg',
          uploadDate: '2024-03-13T09:15:00',
          url: 'https://example.com/files/resim.jpg'
        },
        {
          id: '4',
          name: 'dokuman.docx',
          size: 3145728, // 3MB
          type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          uploadDate: '2024-03-12T14:20:00',
          url: 'https://example.com/files/dokuman.docx'
        }
      ];

      setFiles(mockFiles);
    } catch (error) {
      console.error('Dosyalar yüklenirken hata oluştu:', error);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      // Simüle edilmiş API gecikmesi
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Yeni dosya için mock veri oluştur
      const newFile: FileData = {
        id: Date.now().toString(),
        name: selectedFile.name,
        size: selectedFile.size,
        type: selectedFile.type,
        uploadDate: new Date().toISOString(),
        url: URL.createObjectURL(selectedFile)
      };

      // Mevcut dosyalara yeni dosyayı ekle
      setFiles(prevFiles => [...prevFiles, newFile]);
      
      setShowUploadModal(false);
      setSelectedFile(null);
      setPreviewUrl('');
    } catch (error) {
      console.error('Dosya yüklenirken hata oluştu:', error);
    }
  };

  const handleDeleteClick = (file: FileData) => {
    setFileToDelete(file);
    setShowConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (!fileToDelete) return;

    try {
      // Simüle edilmiş API gecikmesi
      await new Promise(resolve => setTimeout(resolve, 500));

      // Dosyayı listeden kaldır
      setFiles(prevFiles => prevFiles.filter(file => file.id !== fileToDelete.id));
      showToastMessage(`${fileToDelete.name} dosyası başarıyla silindi`, 'warning');
      setShowConfirm(false);
      setFileToDelete(null);
    } catch (error) {
      console.error('Dosya silinirken hata oluştu:', error);
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
    setUpdatePreviewUrl(file.url);
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
          name: file.name,
          type: file.type,
          size: file.size,
          url: url
        });
      }
    }
  };

  const handleUpdateSubmit = async () => {
    if (!fileToUpdate) return;

    try {
      // Simüle edilmiş API gecikmesi
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Dosyayı güncelle
      setFiles(prevFiles => 
        prevFiles.map(file => 
          file.id === fileToUpdate.id ? fileToUpdate : file
        )
      );

      showToastMessage(`${fileToUpdate.name} dosyası başarıyla güncellendi`, 'success');
      handleCloseUpdateModal();
    } catch (error) {
      console.error('Dosya güncellenirken hata oluştu:', error);
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
            <th>{translations.myFiles.fileSize}</th>
            <th>{translations.myFiles.fileType}</th>
            <th>{translations.myFiles.uploadDate}</th>
            <th>{translations.myFiles.actions}</th>
          </tr>
        </thead>
        <tbody>
          {files.map((file) => (
            <tr key={file.id}>
              <td>{file.name}</td>
              <td>{(file.size / 1024).toFixed(2)} KB</td>
              <td>{file.type}</td>
              <td>{new Date(file.uploadDate).toLocaleDateString()}</td>
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
              />
            </Form.Group>
            {previewUrl && (
              <div className="mt-3">
                <h6>{translations.myFiles.preview}</h6>
                <img
                  src={previewUrl}
                  alt="Preview"
                  style={{ maxWidth: '100%', maxHeight: '200px' }}
                />
              </div>
            )}
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
                filename={fileToView.name}
                filepath={fileToView.url}
                mimeType={fileToView.type}
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
                  accept=".pdf,.jpg,.jpeg,.png"
                />
              </div>
              
              {updatePreviewUrl && (
                <div className="mb-4">
                  <label className="form-label">Önizleme</label>
                  <FileViewer
                    filename={fileToUpdate.name}
                    filepath={updatePreviewUrl}
                    mimeType={fileToUpdate.type}
                    onDocxWidthChange={setUpdateFileViewerWidth}
                  />
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
        description={fileToDelete ? `${fileToDelete.name} dosyasını silmek istediğinize emin misiniz?` : ''}
        confirmText="Evet, Sil"
        cancelText="Vazgeç"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
};

export default MyFiles; 