/**
 * Format ISO date string into a user-friendly format (e.g. "Oct 15, 2026")
 */
export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'N/A';
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return 'N/A';
  }
};

/**
 * Format date for HTML <input type="date"> (YYYY-MM-DD)
 */
export const formatDateForInput = (dateString) => {
  if (!dateString) return new Date().toISOString().split('T')[0];
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return new Date().toISOString().split('T')[0];
    return date.toISOString().split('T')[0];
  } catch {
    return new Date().toISOString().split('T')[0];
  }
};

/**
 * Visual styling and metadata for application statuses
 */
export const STATUS_CONFIG = {
  Applied: {
    label: 'Applied',
    badgeClass: 'badge-applied',
    bg: '#EFF6FF',
    color: '#1D4ED8',
    border: '#BFDBFE',
    dot: '#3B82F6',
  },
  Reviewing: {
    label: 'Reviewing',
    badgeClass: 'badge-reviewing',
    bg: '#FFFBEB',
    color: '#B45309',
    border: '#FDE68A',
    dot: '#F59E0B',
  },
  Interview: {
    label: 'Interview',
    badgeClass: 'badge-interview',
    bg: '#FAF5FF',
    color: '#6D28D9',
    border: '#E9D5FF',
    dot: '#8B5CF6',
  },
  Offer: {
    label: 'Offer',
    badgeClass: 'badge-offer',
    bg: '#ECFDF5',
    color: '#047857',
    border: '#A7F3D0',
    dot: '#10B981',
  },
  Rejected: {
    label: 'Rejected',
    badgeClass: 'badge-rejected',
    bg: '#FEF2F2',
    color: '#B91C1C',
    border: '#FECACA',
    dot: '#EF4444',
  },
};

/**
 * Visual styling for job types
 */
export const JOB_TYPE_CONFIG = {
  'Full-time': { bg: '#F1F5F9', color: '#334155' },
  'Part-time': { bg: '#F3E8FF', color: '#6B21A8' },
  Contract: { bg: '#FEF3C7', color: '#92400E' },
  Internship: { bg: '#E0F2FE', color: '#0369A1' },
  Remote: { bg: '#DCFCE7', color: '#166534' },
};
