import { formatDate } from './formatters';

/**
 * Escapes values for safe CSV output
 */
const escapeCsvValue = (val) => {
  if (val === null || val === undefined) return '""';
  const stringVal = String(val);
  // If value contains quotes, commas, or line breaks, wrap in quotes and escape internal quotes
  if (stringVal.includes('"') || stringVal.includes(',') || stringVal.includes('\n') || stringVal.includes('\r')) {
    return `"${stringVal.replace(/"/g, '""')}"`;
  }
  return `"${stringVal}"`;
};

/**
 * Exports an array of application objects into a CSV file downloaded directly by the user's browser
 */
export const exportApplicationsToCSV = (applications = []) => {
  if (!applications || applications.length === 0) {
    alert('No job applications to export.');
    return false;
  }

  const headers = [
    'Company',
    'Job Title',
    'Location',
    'Application Date',
    'Status',
    'Job Type',
    'Job Posting URL',
    'Notes',
  ];

  const rows = applications.map((app) => [
    escapeCsvValue(app.company),
    escapeCsvValue(app.jobTitle),
    escapeCsvValue(app.location),
    escapeCsvValue(formatDate(app.applicationDate)),
    escapeCsvValue(app.status),
    escapeCsvValue(app.jobType),
    escapeCsvValue(app.jobPostingUrl || ''),
    escapeCsvValue(app.notes || ''),
  ]);

  const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\r\n');

  // Create a Blob and trigger a download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  const today = new Date().toISOString().split('T')[0];
  link.setAttribute('href', url);
  link.setAttribute('download', `ApplyFlow_Applications_${today}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  return true;
};
