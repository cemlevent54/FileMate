import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import ConfirmModal from '../components/ConfirmModal';
import FileViewer from '../components/FileViewer';
import '../styles/AdminDashboard.css';
import axios from 'axios';

// Backend'den dönen dosya tipi
interface FileType {
  id: string;
  uploadedFilename: string;
  url: string;
  uploadUserId: number;
  createdAt: string;
  updatedAt: string;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

const AdminFiles: React.FC = () => {
  const [files, setFiles] = useState<FileType[]>([]);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'warning'>('success');
  const [showConfirm, setShowConfirm] = useState(false);
  const [fileToDelete, setFileToDelete] = useState<FileType | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<FileType | null>(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [fileToUpdate, setFileToUpdate] = useState<FileType | null>(null);
  const [selectedFileForPreview, setSelectedFileForPreview] = useState<{ url: string, mimeType: string } | null>(null);
  const [fileViewerWidth, setFileViewerWidth] = useState<number | undefined>(undefined);
  const [showFileModal, setShowFileModal] = useState(false);
  const [fileToView, setFileToView] = useState<FileType | null>(null);
  const [updateFile, setUpdateFile] = useState<File | null>(null);

  useEffect(() => {
    fetchFiles();
  }, []);

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  const fetchFiles = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/files`);
      setFiles(response.data.files);
    } catch (error) {
      showToastMessage('Dosyalar alınırken hata oluştu', 'warning');
    }
  };

  const showToastMessage = (message: string, type: 'success' | 'warning') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
  };

  const handleShowDetails = (file: FileType) => {
    setSelectedFile(file);
    setShowDetailsModal(true);
  };

  const handleCloseDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedFile(null);
  };

  const handleShowUpdate = (file: FileType) => {
    setFileToUpdate(file);
    setShowUpdateModal(true);
    setSelectedFileForPreview(null);
    setUpdateFile(null);
  };

  const handleCloseUpdateModal = () => {
    setShowUpdateModal(false);
    setFileToUpdate(null);
    setSelectedFileForPreview(null);
    setUpdateFile(null);
  };

  const handleUpdateChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files && files[0]) {
      setUpdateFile(files[0]);
      const url = URL.createObjectURL(files[0]);
      setSelectedFileForPreview({ url, mimeType: files[0].type });
    }
  };

  const handleUpdateSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!fileToUpdate || !updateFile) return;
    try {
      const formData = new FormData();
      formData.append('file', updateFile);
      formData.append('userId', fileToUpdate.uploadUserId.toString());
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/admin/files/${fileToUpdate.id}`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      setFiles(files.map(f => f.id === fileToUpdate.id ? response.data.file : f));
      showToastMessage('Dosya başarıyla güncellendi', 'success');
      handleCloseUpdateModal();
    } catch (error) {
      showToastMessage('Dosya güncellenirken hata oluştu', 'warning');
    }
  };

  const handleDeleteClick = (file: FileType) => {
    setFileToDelete(file);
    setShowConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (!fileToDelete) return;
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/admin/files/${fileToDelete.id}`);
      setFiles(files.filter(f => f.id !== fileToDelete.id));
      showToastMessage('Dosya başarıyla silindi', 'success');
    } catch (error) {
      showToastMessage('Dosya silinirken hata oluştu', 'warning');
    }
    setShowConfirm(false);
    setFileToDelete(null);
  };

  const handleCancelDelete = () => {
    setShowConfirm(false);
    setFileToDelete(null);
  };

  const handleViewFile = (file: FileType) => {
    setFileToView(file);
    setShowFileModal(true);
  };

  const handleViewUser = (userId: number) => {
    alert('Kullanıcı detayları gösterilecek: ' + userId);
  };

  const handleCloseFileModal = () => {
    setShowFileModal(false);
    setFileToView(null);
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-content">
        <h2>Dosyalar</h2>
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
              animation: 'slideIn 0.3s ease-out',
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
                padding: '0 5px',
              }}
            >
              ×
            </button>
          </div>
        )}
        <style>{`
          @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
        `}</style>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>id</th>
              <th>Dosya Adı</th>
              <th>Yükleyen Kullanıcı</th>
              <th>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {files.map((file) => (
              <tr key={file.id}>
                <td>{file.id}</td>
                <td>{file.uploadedFilename}</td>
                <td>
                  <button className="btn btn-link btn-sm" onClick={() => handleViewUser(file.uploadUserId)}>
                    {file.uploadUserId}
                  </button>
                </td>
                <td>
                  <button className="btn btn-info btn-sm me-2" onClick={() => handleShowDetails(file)}>Detaylar</button>
                  <button className="btn btn-secondary btn-sm me-2" onClick={() => handleViewFile(file)}>Görüntüle</button>
                  <button className="btn btn-warning btn-sm me-2" onClick={() => handleShowUpdate(file)}>Güncelle</button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDeleteClick(file)}>Sil</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* Detaylar Modalı */}
        {showDetailsModal && selectedFile && (
          <div className="custom-modal-backdrop" onClick={handleCloseDetailsModal}>
            <div className="custom-modal animate-modal" onClick={e => e.stopPropagation()}>
              <div className="modal-header" style={{ position: 'relative' }}>
                <h5 className="modal-title">Dosya Detayları</h5>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Kapat"
                  onClick={handleCloseDetailsModal}
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
              <div className="modal-body">
                <p><b>Dosya Adı:</b> {selectedFile.uploadedFilename} {' '}
                  <button className="btn btn-secondary btn-sm" onClick={() => handleViewFile(selectedFile)}>
                    Görüntüle
                  </button>
                </p>
                <p><b>Dosya Yolu:</b> {selectedFile.url}</p>
                <p><b>Yükleyen Kullanıcı ID:</b> {selectedFile.uploadUserId}</p>
                <p><b>Oluşturulma:</b> {formatDate(selectedFile.createdAt)}</p>
                <p><b>Güncellenme:</b> {formatDate(selectedFile.updatedAt)}</p>
              </div>
            </div>
          </div>
        )}
        {/* Güncelleme Modalı */}
        {showUpdateModal && fileToUpdate && (
          <div className="custom-modal-backdrop" onClick={handleCloseUpdateModal}>
            <div className="custom-modal animate-modal" onClick={e => e.stopPropagation()}>
              <div className="modal-header" style={{ position: 'relative' }}>
                <h5 className="modal-title">Dosya Güncelle</h5>
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
              <form onSubmit={handleUpdateSubmit} className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                <div className="mb-3">
                  <label className="form-label">Yeni Dosya Seç</label>
                  <input type="file" className="form-control" name="file" onChange={handleUpdateChange} />
                </div>
                {selectedFileForPreview && (
                  <div className="mb-3">
                    <label className="form-label">Önizleme</label>
                    <FileViewer filename={fileToUpdate.uploadedFilename} filepath={selectedFileForPreview.url} mimeType={selectedFileForPreview.mimeType} />
                  </div>
                )}
                <div className="mb-3">
                  <label className="form-label">Dosya Adı</label>
                  <input type="text" className="form-control" name="filename" value={fileToUpdate.uploadedFilename} readOnly />
                </div>
                <div className="mb-3">
                  <label className="form-label">Yükleyen Kullanıcı ID</label>
                  <input type="number" className="form-control" name="uploadedBy" value={fileToUpdate.uploadUserId} readOnly />
                </div>
                <div className="text-end">
                  <button type="button" className="btn btn-secondary me-2" onClick={handleCloseUpdateModal}>İptal</button>
                  <button type="submit" className="btn btn-primary">Güncelle</button>
                </div>
              </form>
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
      </div>
    </div>
  );
};

export default AdminFiles; 