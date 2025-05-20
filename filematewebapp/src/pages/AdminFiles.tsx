import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import ConfirmModal from '../components/ConfirmModal';
import FileViewer from '../components/FileViewer';
import '../styles/AdminDashboard.css';

type FileType = {
  id: number;
  filename: string;
  filepath: string;
  uploadedBy: number;
  createdAt: string;
  updatedAt: string;
  mimeType: string;
};

function formatFilename(originalName: string): string {
  const now = new Date();
  const pad = (n: number) => n.toString().padStart(2, '0');
  const datePart = [
    pad(now.getDate()),
    pad(now.getMonth() + 1),
    now.getFullYear().toString().slice(-2),
    pad(now.getHours()),
    pad(now.getMinutes()),
    pad(now.getSeconds())
  ].join('_');
  return `${datePart}_${originalName}`;
}

const mockFiles: FileType[] = [
  {
    id: 1,
    filename: formatFilename('Rapor.pdf'),
    filepath: '/uploads/' + formatFilename('Rapor.pdf'),
    uploadedBy: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    mimeType: 'application/pdf',
  },
  {
    id: 2,
    filename: formatFilename('Fotoğraf.jpg'),
    filepath: '/uploads/' + formatFilename('Fotoğraf.jpg'),
    uploadedBy: 1,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 3600000).toISOString(),
    mimeType: 'image/jpeg',
  },
];

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

const AdminFiles: React.FC = () => {
  const [files, setFiles] = useState<FileType[]>(mockFiles);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'warning'>('success');
  const [showConfirm, setShowConfirm] = useState(false);
  const [fileToDelete, setFileToDelete] = useState<FileType | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<FileType | null>(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [fileToUpdate, setFileToUpdate] = useState<FileType | null>(null);
  const [updateForm, setUpdateForm] = useState<Omit<FileType, 'id'>>({
    filename: '',
    filepath: '',
    uploadedBy: 0,
    createdAt: '',
    updatedAt: '',
    mimeType: '',
  });
  const [selectedFileForPreview, setSelectedFileForPreview] = useState<{ url: string, mimeType: string } | null>(null);
  const [fileViewerWidth, setFileViewerWidth] = useState<number | undefined>(undefined);
  const [showFileModal, setShowFileModal] = useState(false);
  const [fileToView, setFileToView] = useState<FileType | null>(null);

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

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
    setUpdateForm({
      filename: file.filename,
      filepath: file.filepath,
      uploadedBy: file.uploadedBy,
      createdAt: file.createdAt,
      updatedAt: file.updatedAt,
      mimeType: file.mimeType,
    });
    setShowUpdateModal(true);
  };

  const handleCloseUpdateModal = () => {
    setShowUpdateModal(false);
    setFileToUpdate(null);
    setSelectedFileForPreview(null);
  };

  const handleUpdateChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, files } = e.target;
    if (name === 'file' && files && files[0]) {
      const file = files[0];
      const formatted = formatFilename(file.name);
      setUpdateForm((prev) => ({
        ...prev,
        filename: formatted,
        filepath: '/uploads/' + formatted,
      }));
      const url = URL.createObjectURL(file);
      setSelectedFileForPreview({ url, mimeType: file.type });
    } else {
      setUpdateForm((prev) => ({
        ...prev,
        [name]: type === 'number' ? Number(value) : value,
      }));
    }
  };

  const handleUpdateSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (fileToUpdate) {
      const updatedFile: FileType = {
        ...fileToUpdate,
        ...updateForm,
        updatedAt: new Date().toISOString(),
      };
      setFiles(files.map((f) => (f.id === fileToUpdate.id ? updatedFile : f)));
      showToastMessage(`${updateForm.filename} dosyası başarıyla güncellendi`, 'success');
      handleCloseUpdateModal();
    }
  };

  const handleDeleteClick = (file: FileType) => {
    setFileToDelete(file);
    setShowConfirm(true);
  };

  const handleConfirmDelete = () => {
    if (fileToDelete) {
      setFiles(files.filter((f) => f.id !== fileToDelete.id));
      showToastMessage(`${fileToDelete.filename} dosyası başarıyla silindi`, 'warning');
    }
    setShowConfirm(false);
    setFileToDelete(null);
  };

  const handleCancelDelete = () => {
    setShowConfirm(false);
    setFileToDelete(null);
  };

  const handleViewFile = (file: FileType) => {
    window.open(file.filepath, '_blank');
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
              <th>filename</th>
              <th>uploadedBy</th>
              <th>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {files.map((file) => (
              <tr key={file.id}>
                <td>{file.id}</td>
                <td>{file.filename}</td>
                <td>
                  <button className="btn btn-link btn-sm" onClick={() => handleViewUser(file.uploadedBy)}>
                    {file.uploadedBy}
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
                <p><b>Dosya Adı:</b> {selectedFile.filename} {' '}
                  <button className="btn btn-secondary btn-sm" onClick={() => handleViewFile(selectedFile)}>
                    Görüntüle
                  </button>
                </p>
                <p><b>Dosya Yolu:</b> {selectedFile.filepath}</p>
                <p><b>Yükleyen Kullanıcı ID:</b> {selectedFile.uploadedBy}</p>
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
                    <FileViewer filename={updateForm.filename} filepath={selectedFileForPreview.url} mimeType={selectedFileForPreview.mimeType} />
                  </div>
                )}
                <div className="mb-3">
                  <label className="form-label">Dosya Adı</label>
                  <input type="text" className="form-control" name="filename" value={updateForm.filename} readOnly />
                </div>
                <div className="mb-3">
                  <label className="form-label">Yükleyen Kullanıcı ID</label>
                  <input type="number" className="form-control" name="uploadedBy" value={updateForm.uploadedBy} onChange={handleUpdateChange} required readOnly/>
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
          description={fileToDelete ? `${fileToDelete.filename} dosyasını silmek istediğinize emin misiniz?` : ''}
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
                transition: 'width 0.2s, max-width 0.2s',
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
              <div className="modal-body">
                <FileViewer
                  filename={fileToView.filename}
                  filepath={fileToView.filepath}
                  mimeType={fileToView.mimeType}
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