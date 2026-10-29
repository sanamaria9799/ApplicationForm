import React, { useState } from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

const DeleteConfirmModal = ({ isOpen, onClose, application, onConfirm }) => {
  const [deleting, setDeleting] = useState(false);

  if (!isOpen || !application) return null;

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await onConfirm(application._id);
      onClose();
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-container modal-sm" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-group">
            <h2 className="modal-title text-danger">Delete Job Application</h2>
          </div>
          <button onClick={onClose} className="modal-close-btn" aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        <div className="modal-delete-body">
          <div className="delete-icon-circle">
            <AlertTriangle size={28} className="text-danger" />
          </div>
          <p className="delete-message">
            Are you sure you want to delete the application for{' '}
            <strong>{application.jobTitle}</strong> at <strong>{application.company}</strong>?
          </p>
          <p className="delete-subtext">This action cannot be undone.</p>
        </div>

        <div className="modal-actions">
          <button
            type="button"
            onClick={onClose}
            disabled={deleting}
            className="btn btn-secondary"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="btn btn-danger"
          >
            <Trash2 size={16} />
            <span>{deleting ? 'Deleting...' : 'Yes, Delete'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
