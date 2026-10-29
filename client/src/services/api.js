/**
 * API Service for ApplyFlow
 * Handles communication with the Express backend
 */

// In production, VITE_API_URL can point to https://your-backend.onrender.com/api
// In local development, defaults to '/api' which is proxied by Vite to http://localhost:5000
const BASE_URL = import.meta.env.VITE_API_URL || '/api';

/**
 * Helper to handle fetch responses and parse errors
 */
const handleResponse = async (response) => {
  const contentType = response.headers.get('content-type');
  const isJson = contentType && contentType.includes('application/json');
  const data = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    let errorMessage = 'Request failed';
    if (typeof data === 'object') {
      if (data.errors && Array.isArray(data.errors)) {
        errorMessage = data.errors.map((e) => e.message || e.msg).join(', ');
      } else if (data.message) {
        errorMessage = data.message;
      }
    } else if (typeof data === 'string') {
      errorMessage = data;
    }
    const error = new Error(errorMessage);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
};

/**
 * Fetch list of applications with optional search and filters
 */
export const getApplications = async ({ search = '', status = '', jobType = '', sort = 'date_desc' } = {}) => {
  const params = new URLSearchParams();
  if (search) params.append('search', search);
  if (status && status !== 'All') params.append('status', status);
  if (jobType && jobType !== 'All') params.append('jobType', jobType);
  if (sort) params.append('sort', sort);

  const url = `${BASE_URL}/applications${params.toString() ? `?${params.toString()}` : ''}`;
  const response = await fetch(url);
  return handleResponse(response);
};

/**
 * Fetch dashboard statistics
 */
export const getApplicationStats = async () => {
  const response = await fetch(`${BASE_URL}/applications/stats`);
  return handleResponse(response);
};

/**
 * Check backend health & database connectivity
 */
export const checkHealth = async () => {
  const response = await fetch(`${BASE_URL}/health`);
  return handleResponse(response);
};

/**
 * Fetch a single application by ID
 */
export const getApplicationById = async (id) => {
  const response = await fetch(`${BASE_URL}/applications/${id}`);
  return handleResponse(response);
};

/**
 * Create a new job application
 */
export const createApplication = async (applicationData) => {
  const response = await fetch(`${BASE_URL}/applications`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(applicationData),
  });
  return handleResponse(response);
};

/**
 * Update an existing job application
 */
export const updateApplication = async (id, applicationData) => {
  const response = await fetch(`${BASE_URL}/applications/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(applicationData),
  });
  return handleResponse(response);
};

/**
 * Delete a job application
 */
export const deleteApplication = async (id) => {
  const response = await fetch(`${BASE_URL}/applications/${id}`, {
    method: 'DELETE',
  });
  return handleResponse(response);
};

/**
 * Seed or reset sample demonstration data
 */
export const seedSampleData = async () => {
  const response = await fetch(`${BASE_URL}/applications/seed`, {
    method: 'POST',
  });
  return handleResponse(response);
};
