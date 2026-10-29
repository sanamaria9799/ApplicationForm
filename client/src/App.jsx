import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import SummaryCards from './components/SummaryCards';
import ApplicationTable from './components/ApplicationTable';
import ApplicationModal from './components/ApplicationModal';
import ViewModal from './components/ViewModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import {
  getApplications,
  getApplicationStats,
  checkHealth,
  createApplication,
  updateApplication,
  deleteApplication,
  seedSampleData,
} from './services/api';
import { exportApplicationsToCSV } from './utils/exportCsv';
import './App.css';

function App() {
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState({
    totalApplications: 0,
    activeApplications: 0,
    interviews: 0,
    offers: 0,
    rejected: 0,
  });
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSeeding, setIsSeeding] = useState(false);

  // Search & Filter State
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [jobTypeFilter, setJobTypeFilter] = useState('All');
  const [sortBy, setSortBy] = useState('date_desc');
  const [activeSidebarNav, setActiveSidebarNav] = useState('All');

  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingApp, setEditingApp] = useState(null);
  const [viewingApp, setViewingApp] = useState(null);
  const [deletingApp, setDeletingApp] = useState(null);

  // Notification Toast
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Check health and db connectivity
  const fetchHealthStatus = useCallback(async () => {
    try {
      const data = await checkHealth();
      setHealth(data);
    } catch {
      setHealth({ status: 'offline', database: { connected: false } });
    }
  }, []);

  // Fetch applications based on current filters
  const loadApplications = useCallback(async () => {
    setLoading(true);
    try {
      // Determine effective status filter: sidebar "Active" aggregates Applied + Reviewing on client side if needed
      let statusParam = statusFilter;
      if (activeSidebarNav === 'Active') {
        statusParam = ''; // We'll filter on client or pass all
      } else if (activeSidebarNav !== 'All' && statusFilter === 'All') {
        statusParam = activeSidebarNav;
      }

      const res = await getApplications({
        search,
        status: statusParam !== 'All' ? statusParam : '',
        jobType: jobTypeFilter !== 'All' ? jobTypeFilter : '',
        sort: sortBy,
      });

      let apps = res.data || [];
      if (activeSidebarNav === 'Active') {
        apps = apps.filter((a) => a.status === 'Applied' || a.status === 'Reviewing');
      }

      setApplications(apps);
    } catch (err) {
      showToast(err.message || 'Failed to load applications', 'error');
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, jobTypeFilter, sortBy, activeSidebarNav]);

  // Fetch dashboard metrics
  const loadStats = useCallback(async () => {
    try {
      const res = await getApplicationStats();
      if (res.stats) {
        setStats(res.stats);
      }
    } catch (err) {
      console.warn('Could not load statistics:', err.message);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchHealthStatus();
    loadStats();
    loadApplications();
  }, [fetchHealthStatus, loadStats, loadApplications]);

  // Handle Sidebar Navigation selection
  const handleSelectSidebarFilter = (navId) => {
    setActiveSidebarNav(navId);
    if (navId === 'All') {
      setStatusFilter('All');
    } else if (navId === 'Active') {
      setStatusFilter('All');
    } else {
      setStatusFilter(navId);
    }
  };

  // Reset filters
  const handleResetFilters = () => {
    setSearch('');
    setStatusFilter('All');
    setJobTypeFilter('All');
    setSortBy('date_desc');
    setActiveSidebarNav('All');
  };

  // Open Create Modal
  const handleOpenCreateModal = () => {
    setEditingApp(null);
    setIsFormModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (app) => {
    setEditingApp(app);
    setIsFormModalOpen(true);
  };

  // Open View Modal
  const handleOpenViewModal = (app) => {
    setViewingApp(app);
  };

  // Open Delete Modal
  const handleOpenDeleteModal = (app) => {
    setDeletingApp(app);
  };

  // Save (Create or Update) Application
  const handleSaveApplication = async (formData, appId) => {
    if (appId) {
      await updateApplication(appId, formData);
      showToast(`Updated application for ${formData.jobTitle} at ${formData.company}!`);
    } else {
      await createApplication(formData);
      showToast(`Added new application at ${formData.company}!`);
    }
    await loadApplications();
    await loadStats();
  };

  // Confirm Delete
  const handleConfirmDelete = async (appId) => {
    try {
      await deleteApplication(appId);
      showToast('Application deleted successfully');
      await loadApplications();
      await loadStats();
    } catch (err) {
      showToast(err.message || 'Failed to delete application', 'error');
    }
  };

  // Seed sample data
  const handleSeedData = async () => {
    try {
      setIsSeeding(true);
      const res = await seedSampleData();
      showToast(res.message || 'Sample data loaded successfully!');
      await loadApplications();
      await loadStats();
      await fetchHealthStatus();
    } catch (err) {
      showToast(err.message || 'Failed to seed sample data', 'error');
    } finally {
      setIsSeeding(false);
    }
  };

  // Export current list to CSV
  const handleExportCsv = () => {
    const success = exportApplicationsToCSV(applications);
    if (success) {
      showToast(`Exported ${applications.length} applications to CSV!`);
    }
  };

  return (
    <div className="app-container">
      {/* Toast Notification */}
      {toast && (
        <div className={`toast-notification toast-${toast.type}`} role="alert">
          <span>{toast.message}</span>
          <button onClick={() => setToast(null)} className="toast-close" aria-label="Dismiss toast">
            &times;
          </button>
        </div>
      )}

      {/* Sidebar Navigation */}
      <Sidebar
        currentFilter={activeSidebarNav}
        onSelectFilter={handleSelectSidebarFilter}
        stats={stats}
        totalCount={stats.totalApplications}
        onOpenCreateModal={handleOpenCreateModal}
      />

      {/* Main Content Area */}
      <div className="main-wrapper">
        <Header
          search={search}
          onSearchChange={setSearch}
          onOpenCreateModal={handleOpenCreateModal}
          onExportCsv={handleExportCsv}
          onSeedData={handleSeedData}
          isSeeding={isSeeding}
          health={health}
          onRefresh={() => {
            loadApplications();
            loadStats();
            fetchHealthStatus();
          }}
        />

        <main className="content-area">
          {/* Dashboard Summary Cards */}
          <SummaryCards
            stats={stats}
            currentFilter={activeSidebarNav}
            onSelectFilter={handleSelectSidebarFilter}
          />

          {/* Applications Table with Filters */}
          <ApplicationTable
            applications={applications}
            loading={loading}
            currentStatus={statusFilter}
            onStatusChange={(status) => {
              setStatusFilter(status);
              setActiveSidebarNav(status === 'All' ? 'All' : status);
            }}
            jobTypeFilter={jobTypeFilter}
            onJobTypeChange={setJobTypeFilter}
            sortBy={sortBy}
            onSortChange={setSortBy}
            onView={handleOpenViewModal}
            onEdit={handleOpenEditModal}
            onDelete={handleOpenDeleteModal}
            onResetFilters={handleResetFilters}
            onOpenCreateModal={handleOpenCreateModal}
          />
        </main>
      </div>

      {/* Create / Edit Modal */}
      <ApplicationModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSave={handleSaveApplication}
        application={editingApp}
      />

      {/* View Details Modal */}
      <ViewModal
        isOpen={Boolean(viewingApp)}
        onClose={() => setViewingApp(null)}
        application={viewingApp}
        onEdit={handleOpenEditModal}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={Boolean(deletingApp)}
        onClose={() => setDeletingApp(null)}
        application={deletingApp}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}

export default App;
