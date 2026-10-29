import React from 'react';
import { X, Building2, Briefcase, MapPin, Calendar, Globe, FileText, Edit2, ExternalLink } from 'lucide-react';
import { formatDate, STATUS_CONFIG, JOB_TYPE_CONFIG } from '../utils/formatters';

const ViewModal = ({ isOpen, onClose, application, onEdit }) => {
  if (!isOpen || !application) return null;

  const statusMeta = STATUS_CONFIG[application.status] || STATUS_CONFIG.Applied;
  const jobTypeMeta = JOB_TYPE_CONFIG[application.jobType] || { bg: '#F1F5F9', color: '#334155' };

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-container modal-view-container" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title-group">
            <div className="view-title-row">
              <span className="view-company-badge">
                <Building2 size={16} />
                {application.company}
              </span>
              <span
                className="status-badge"
                style={{
                  backgroundColor: statusMeta.bg,
                  color: statusMeta.color,
                  borderColor: statusMeta.border,
                }}
              >
                <span className="badge-dot" style={{ backgroundColor: statusMeta.dot }}></span>
                {application.status}
              </span>
            </div>
            <h2 className="view-job-title">{application.jobTitle}</h2>
          </div>
          <button onClick={onClose} className="modal-close-btn" aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        {/* Content Details Grid */}
        <div className="view-content-body">
          <div className="view-details-grid">
            {/* Location */}
            <div className="view-detail-card">
              <div className="view-detail-icon">
                <MapPin size={18} />
              </div>
              <div className="view-detail-info">
                <span className="view-detail-label">Location</span>
                <span className="view-detail-value">{application.location}</span>
              </div>
            </div>

            {/* Job Type */}
            <div className="view-detail-card">
              <div className="view-detail-icon">
                <Briefcase size={18} />
              </div>
              <div className="view-detail-info">
                <span className="view-detail-label">Job Type</span>
                <span
                  className="job-type-pill"
                  style={{ backgroundColor: jobTypeMeta.bg, color: jobTypeMeta.color, display: 'inline-block' }}
                >
                  {application.jobType}
                </span>
              </div>
            </div>

            {/* Application Date */}
            <div className="view-detail-card">
              <div className="view-detail-icon">
                <Calendar size={18} />
              </div>
              <div className="view-detail-info">
                <span className="view-detail-label">Applied Date</span>
                <span className="view-detail-value">{formatDate(application.applicationDate)}</span>
              </div>
            </div>

            {/* Job Posting URL */}
            <div className="view-detail-card">
              <div className="view-detail-icon">
                <Globe size={18} />
              </div>
              <div className="view-detail-info">
                <span className="view-detail-label">Job Posting</span>
                {application.jobPostingUrl ? (
                  <a
                    href={application.jobPostingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="view-link-external"
                  >
                    <span>Open Posting</span>
                    <ExternalLink size={13} />
                  </a>
                ) : (
                  <span className="text-muted">None specified</span>
                )}
              </div>
            </div>
          </div>

          {/* Notes Section */}
          <div className="view-notes-section">
            <div className="view-notes-header">
              <FileText size={16} />
              <h3>Notes & Follow-ups</h3>
            </div>
            <div className="view-notes-content">
              {application.notes ? (
                <p>{application.notes}</p>
              ) : (
                <span className="text-muted italic">No notes recorded for this application.</span>
              )}
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="modal-actions">
          <button onClick={onClose} className="btn btn-secondary">
            Close
          </button>
          <button
            onClick={() => {
              onClose();
              onEdit(application);
            }}
            className="btn btn-primary"
          >
            <Edit2 size={16} />
            <span>Edit Application</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewModal;
