import React from 'react';

interface ConfirmModalProps {
  show: boolean;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  show,
  title = 'Onay',
  description = 'Bu işlemi yapmak istediğinize emin misiniz?',
  confirmText = 'Evet',
  cancelText = 'İptal',
  onConfirm,
  onCancel,
}) => {
  if (!show) return null;
  return (
    <div className="custom-modal-backdrop" onClick={onCancel}>
      <div className="custom-modal animate-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header" style={{ position: 'relative' }}>
          <h5 className="modal-title">{title}</h5>
          <button
            type="button"
            className="btn-close"
            aria-label="Kapat"
            onClick={onCancel}
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
          <p style={{ marginBottom: 24 }}>{description}</p>
          <div style={{ display: 'flex', gap: 12 }}>
            <button className="btn btn-danger flex-fill" onClick={onConfirm}>{confirmText}</button>
            <button className="btn btn-secondary flex-fill" onClick={onCancel}>{cancelText}</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal; 