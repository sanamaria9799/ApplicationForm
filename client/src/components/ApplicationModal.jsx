import React, { useState, useEffect } from 'react';
import { X, Building2, Briefcase, MapPin, Calendar, Globe, FileText, Check } from 'lucide-react';
import { formatDateForInput } from '../utils/formatters';

const STATUS_OPTIONS = ['Applied', 'Reviewing', 'Interview', 'Offer', 'Rejected'];
const JOB_TYPE_OPTIONS = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'];

const ApplicationModal = ({ isOpen, onClose, onSave, application }) => {
  const isEditMode = Boolean(application && application._id);

  const [formData, setFormData] = useState({
    company: '',
    jobTitle: '',
    location: '',
    applicationDate: formatDateForInput(),
    status: 'Applied',
    jobType: 'Full-time',
    jobPostingUrl: '',
    notes: '',
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Sync form state when editing or opening modal
  useEffect(() => {
    if (isOpen) {
      if (application) {
        setFormData({
          company: application.company || '',
          jobTitle: application.jobTitle || '',
          location: application.location || '',
          applicationDate: formatDateForInput(application.applicationDate),
          status: application.status || 'Applied',
          jobType: application.jobType || 'Full-time',
          jobPostingUrl: application.jobPostingUrl || '',
          notes: application.notes || '',
        });
      } else {
        setFormData({
          company: '',
          jobTitle: '',
          location: '',
          applicationDate: formatDateForInput(),
          status: 'Applied',
          jobType: 'Full-time',
          jobPostingUrl: '',
          notes: '',
        });
      }
      setErrors({});
      setSubmitting(false);
    }
  }, [isOpen, application]);

  if (!isOpen) return null;

  const validateForm = () => {
    const errs = {};
    if (!formData.company.trim()) {
      errs.company = 'Company name is required';
    }
    if (!formData.jobTitle.trim()) {
      errs.jobTitle = 'Job title is required';
    }
    if (!formData.location.trim()) {
      errs.location = 'Location is required';
    }
    if (!formData.applicationDate) {
      errs.applicationDate = 'Application date is required';
    }
    if (formData.jobPostingUrl && !formData.jobPostingUrl.startsWith('http')) {
      errs.jobPostingUrl = 'URL should begin with http:// or https://';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setSubmitting(true);
      await onSave(formData, application?._id);
      onClose();
    } catch (err) {
      setErrors((prev) => ({
        ...prev,
        submit: err.message || 'An error occurred while saving the application.',
      }));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title-group">
            <h2 className="modal-title">
              {isEditMode ? 'Edit Job Application' : 'Track New Job Application'}
            </h2>
            <p className="modal-subtitle">
              {isEditMode
                ? 'Update application details, interview status, or notes.'
                : 'Fill in the position and company information to track your submission.'}
            </p>
          </div>
          <button onClick={onClose} className="modal-close-btn" aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        {/* Form Error Banner */}
        {errors.submit && (
          <div className="alert-banner alert-error">
            <span>{errors.submit}</span>
          </div>
        )}

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-row form-grid-2">
            {/* Company Name */}
            <div className="form-group">
              <label htmlFor="company" className="form-label required">
                Company Name
              </label>
              <div className="input-with-icon">
                <Building2 size={16} className="input-icon" />
                <input
                  id="company"
                  name="company"
                  type="text"
                  placeholder="e.g. Stripe, Google, Acme Corp"
                  value={formData.company}
                  onChange={handleChange}
                  className={`form-input ${errors.company ? 'input-error' : ''}`}
                />
              </div>
              {errors.company && <span className="field-error">{errors.company}</span>}
            </div>

            {/* Job Title */}
            <div className="form-group">
              <label htmlFor="jobTitle" className="form-label required">
                Job Title
              </label>
              <div className="input-with-icon">
                <Briefcase size={16} className="input-icon" />
                <input
                  id="jobTitle"
                  name="jobTitle"
                  type="text"
                  placeholder="e.g. Senior Frontend Engineer"
                  value={formData.jobTitle}
                  onChange={handleChange}
                  className={`form-input ${errors.jobTitle ? 'input-error' : ''}`}
                />
              </div>
              {errors.jobTitle && <span className="field-error">{errors.jobTitle}</span>}
            </div>
          </div>

          <div className="form-row form-grid-2">
            {/* Location */}
            <div className="form-group">
              <label htmlFor="location" className="form-label required">
                Location
              </label>
              <div className="input-with-icon">
                <MapPin size={16} className="input-icon" />
                <input
                  id="location"
                  name="location"
                  type="text"
                  placeholder="e.g. Remote, New York, NY"
                  value={formData.location}
                  onChange={handleChange}
                  className={`form-input ${errors.location ? 'input-error' : ''}`}
                />
              </div>
              {errors.location && <span className="field-error">{errors.location}</span>}
            </div>

            {/* Application Date */}
            <div className="form-group">
              <label htmlFor="applicationDate" className="form-label required">
                Application Date
              </label>
              <div className="input-with-icon">
                <Calendar size={16} className="input-icon" />
                <input
                  id="applicationDate"
                  name="applicationDate"
                  type="date"
                  value={formData.applicationDate}
                  onChange={handleChange}
                  className={`form-input ${errors.applicationDate ? 'input-error' : ''}`}
                />
              </div>
              {errors.applicationDate && (
                <span className="field-error">{errors.applicationDate}</span>
              )}
            </div>
          </div>

          <div className="form-row form-grid-2">
            {/* Status */}
            <div className="form-group">
              <label htmlFor="status" className="form-label required">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="form-select"
              >
                {STATUS_OPTIONS.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            {/* Job Type */}
            <div className="form-group">
              <label htmlFor="jobType" className="form-label required">
                Job Type
              </label>
              <select
                id="jobType"
                name="jobType"
                value={formData.jobType}
                onChange={handleChange}
                className="form-select"
              >
                {JOB_TYPE_OPTIONS.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Job Posting URL */}
          <div className="form-group">
            <label htmlFor="jobPostingUrl" className="form-label">
              Job Posting URL <span className="label-hint">(optional)</span>
            </label>
            <div className="input-with-icon">
              <Globe size={16} className="input-icon" />
              <input
                id="jobPostingUrl"
                name="jobPostingUrl"
                type="url"
                placeholder="https://company.com/careers/job-id"
                value={formData.jobPostingUrl}
                onChange={handleChange}
                className={`form-input ${errors.jobPostingUrl ? 'input-error' : ''}`}
              />
            </div>
            {errors.jobPostingUrl && (
              <span className="field-error">{errors.jobPostingUrl}</span>
            )}
          </div>

          {/* Notes */}
          <div className="form-group">
            <div className="notes-label-row">
              <label htmlFor="notes" className="form-label">
                Notes & Timeline Details <span className="label-hint">(optional)</span>
              </label>
              <span className="char-count">{formData.notes.length}/2000</span>
            </div>
            <textarea
              id="notes"
              name="notes"
              rows={3}
              maxLength={2000}
              placeholder="Add recruiter contact, referral notes, interview rounds, salary expectations, or follow-up dates..."
              value={formData.notes}
              onChange={handleChange}
              className="form-textarea"
            />
          </div>

          {/* Actions */}
          <div className="modal-actions">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary"
            >
              {submitting ? (
                <span>Saving...</span>
              ) : (
                <>
                  <Check size={16} />
                  <span>{isEditMode ? 'Update Application' : 'Save Application'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplicationModal;
