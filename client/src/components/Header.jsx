import React from 'react';
import { Search, Plus, Download, Database, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';

const Header = ({
  search,
  onSearchChange,
  onOpenCreateModal,
  onExportCsv,
  onSeedData,
  isSeeding,
  health,
  onRefresh,
}) => {
  return (
    <header className="top-header">
      <div className="header-left">
        <div className="search-bar">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search by company, title, location, or notes..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="search-input"
          />
          {search && (
            <button
              onClick={() => onSearchChange('')}
              className="clear-search-btn"
              title="Clear search"
            >
              &times;
            </button>
          )}
        </div>
      </div>

      <div className="header-actions">
        {/* Backend health status pill */}
        <div
          className={`health-pill ${health?.status === 'healthy' ? 'pill-healthy' : 'pill-warning'}`}
          title={`Backend: ${health?.status || 'connecting'} | Database: ${health?.database?.status || 'checking'}`}
        >
          <span className="pulse-dot"></span>
          <span className="health-label">
            {health?.database?.connected
              ? 'Atlas Connected'
              : health?.status === 'healthy'
              ? 'API Active'
              : 'Connecting...'}
          </span>
        </div>

        {/* Refresh button */}
        <button
          onClick={onRefresh}
          className="btn btn-secondary icon-btn"
          title="Refresh data"
        >
          <RefreshCw size={16} />
        </button>

        {/* Demo Seed Data button */}
        <button
          onClick={onSeedData}
          disabled={isSeeding}
          className="btn btn-secondary"
          title="Reset or load realistic sample job applications"
        >
          <Database size={16} />
          <span>{isSeeding ? 'Seeding...' : 'Sample Data'}</span>
        </button>

        {/* Export CSV button */}
        <button
          onClick={onExportCsv}
          className="btn btn-secondary"
          title="Export current applications to a CSV spreadsheet"
        >
          <Download size={16} />
          <span>Export CSV</span>
        </button>

        {/* Add Application primary button */}
        <button
          onClick={onOpenCreateModal}
          className="btn btn-primary"
          title="Create a new job application record"
        >
          <Plus size={18} />
          <span>New Application</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
