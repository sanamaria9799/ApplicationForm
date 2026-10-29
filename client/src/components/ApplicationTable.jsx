import React from 'react';
import {
  ExternalLink,
  Eye,
  Edit2,
  Trash2,
  MapPin,
  Calendar,
  Briefcase,
  Building2,
  SlidersHorizontal,
  Inbox,
  RotateCcw,
} from 'lucide-react';
import { formatDate, STATUS_CONFIG, JOB_TYPE_CONFIG } from '../utils/formatters';

const STATUS_TABS = ['All', 'Applied', 'Reviewing', 'Interview', 'Offer', 'Rejected'];
const JOB_TYPES = ['All', 'Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'];

const ApplicationTable = ({
  applications,
  loading,
  currentStatus,
  onStatusChange,
  jobTypeFilter,
  onJobTypeChange,
  sortBy,
  onSortChange,
  onView,
  onEdit,
  onDelete,
  onResetFilters,
  onOpenCreateModal,
}) => {
  return (
    <div className="table-card">
      {/* Table Controls: Status Tabs, Job Type & Sort Filters */}
      <div className="table-controls">
        <div className="status-tabs-container">
          <div className="status-tabs" role="tablist">
            {STATUS_TABS.map((status) => {
              const isActive = currentStatus === status;
              return (
                <button
                  key={status}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => onStatusChange(status)}
                  className={`status-tab ${isActive ? 'status-tab-active' : ''}`}
                >
                  {status}
                </button>
              );
            })}
          </div>
        </div>

        <div className="filter-dropdowns">
          <div className="select-wrapper">
            <SlidersHorizontal size={14} className="select-icon" />
            <select
              value={jobTypeFilter}
              onChange={(e) => onJobTypeChange(e.target.value)}
              className="custom-select"
              aria-label="Filter by Job Type"
            >
              <option value="All">All Job Types</option>
              {JOB_TYPES.filter((t) => t !== 'All').map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div className="select-wrapper">
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="custom-select"
              aria-label="Sort applications"
            >
              <option value="date_desc">Newest Date</option>
              <option value="date_asc">Oldest Date</option>
              <option value="company_asc">Company (A-Z)</option>
              <option value="company_desc">Company (Z-A)</option>
            </select>
          </div>

          {(currentStatus !== 'All' || jobTypeFilter !== 'All') && (
            <button
              onClick={onResetFilters}
              className="btn-reset-filters"
              title="Reset all filters"
            >
              <RotateCcw size={14} />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Table Content */}
      <div className="table-responsive">
        <table className="apps-table">
          <thead>
            <tr>
              <th>Company</th>
              <th>Role & Type</th>
              <th>Location</th>
              <th>Applied Date</th>
              <th>Status</th>
              <th>Job Posting</th>
              <th className="th-actions">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              // Loading Skeleton Rows
              Array.from({ length: 4 }).map((_, index) => (
                <tr key={`skeleton-${index}`} className="skeleton-row">
                  <td colSpan={7}>
                    <div className="skeleton-line"></div>
                  </td>
                </tr>
              ))
            ) : applications.length === 0 ? (
              // Empty State
              <tr>
                <td colSpan={7}>
                  <div className="empty-state">
                    <div className="empty-icon-circle">
                      <Inbox size={32} />
                    </div>
                    <h3 className="empty-title">No job applications found</h3>
                    <p className="empty-subtitle">
                      {currentStatus !== 'All' || jobTypeFilter !== 'All'
                        ? 'No applications match your selected filters. Try resetting your search or filter.'
                        : 'Your job search pipeline is clean and ready. Track your first job application today!'}
                    </p>
                    <div className="empty-actions">
                      {currentStatus !== 'All' || jobTypeFilter !== 'All' ? (
                        <button onClick={onResetFilters} className="btn btn-secondary">
                          Clear Filters
                        </button>
                      ) : null}
                      <button onClick={onOpenCreateModal} className="btn btn-primary">
                        + Add Application
                      </button>
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              // Applications Rows
              applications.map((app) => {
                const statusMeta = STATUS_CONFIG[app.status] || STATUS_CONFIG.Applied;
                const jobTypeMeta = JOB_TYPE_CONFIG[app.jobType] || { bg: '#F1F5F9', color: '#334155' };

                return (
                  <tr key={app._id} className="app-table-row">
                    {/* Company */}
                    <td>
                      <div className="company-cell">
                        <div className="company-avatar">
                          <Building2 size={16} />
                        </div>
                        <div className="company-info">
                          <span className="company-name">{app.company}</span>
                        </div>
                      </div>
                    </td>

                    {/* Job Title & Type */}
                    <td>
                      <div className="role-cell">
                        <span className="job-title">{app.jobTitle}</span>
                        <span
                          className="job-type-pill"
                          style={{ backgroundColor: jobTypeMeta.bg, color: jobTypeMeta.color }}
                        >
                          {app.jobType}
                        </span>
                      </div>
                    </td>

                    {/* Location */}
                    <td>
                      <div className="location-cell">
                        <MapPin size={14} className="cell-sub-icon" />
                        <span>{app.location}</span>
                      </div>
                    </td>

                    {/* Date Applied */}
                    <td>
                      <div className="date-cell">
                        <Calendar size={14} className="cell-sub-icon" />
                        <span>{formatDate(app.applicationDate)}</span>
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td>
                      <span
                        className="status-badge"
                        style={{
                          backgroundColor: statusMeta.bg,
                          color: statusMeta.color,
                          borderColor: statusMeta.border,
                        }}
                      >
                        <span
                          className="badge-dot"
                          style={{ backgroundColor: statusMeta.dot }}
                        ></span>
                        {app.status}
                      </span>
                    </td>

                    {/* Job Posting URL */}
                    <td>
                      {app.jobPostingUrl ? (
                        <a
                          href={app.jobPostingUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="posting-link"
                          title="Open original job posting"
                        >
                          <span>View Job</span>
                          <ExternalLink size={13} />
                        </a>
                      ) : (
                        <span className="text-muted">—</span>
                      )}
                    </td>

                    {/* Action Buttons */}
                    <td>
                      <div className="action-buttons">
                        <button
                          onClick={() => onView(app)}
                          className="action-btn action-view"
                          title="View Details"
                        >
                          <Eye size={15} />
                        </button>
                        <button
                          onClick={() => onEdit(app)}
                          className="action-btn action-edit"
                          title="Edit Application"
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          onClick={() => onDelete(app)}
                          className="action-btn action-delete"
                          title="Delete Application"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Table Footer Summary */}
      <div className="table-footer">
        <span className="footer-count">
          Showing <strong>{applications.length}</strong> {applications.length === 1 ? 'application' : 'applications'}
        </span>
      </div>
    </div>
  );
};

export default ApplicationTable;
