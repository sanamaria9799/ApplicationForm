import React from 'react';
import {
  LayoutDashboard,
  Clock,
  Calendar,
  Award,
  XCircle,
  PlusCircle,
  TrendingUp,
  FileSpreadsheet,
} from 'lucide-react';

const Sidebar = ({
  currentFilter,
  onSelectFilter,
  stats,
  onOpenCreateModal,
  totalCount,
}) => {
  const navItems = [
    { id: 'All', label: 'All Applications', icon: LayoutDashboard, count: totalCount },
    { id: 'Active', label: 'Active Pipeline', icon: Clock, count: stats?.activeApplications ?? 0 },
    { id: 'Interview', label: 'Interviews', icon: Calendar, count: stats?.interviews ?? 0 },
    { id: 'Offer', label: 'Offers', icon: Award, count: stats?.offers ?? 0 },
    { id: 'Rejected', label: 'Archived / Rejected', icon: XCircle, count: stats?.rejected ?? 0 },
  ];

  return (
    <aside className="app-sidebar">
      <div className="sidebar-brand">
        <div className="brand-logo">
          <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
            <rect width="32" height="32" rx="8" fill="#2563EB" />
            <path
              d="M9 13.5C9 12.1193 10.1193 11 11.5 11H20.5C21.8807 11 23 12.1193 23 13.5V22C23 23.1046 22.1046 24 21 24H11C9.89543 24 9 23.1046 9 22V13.5Z"
              stroke="white"
              strokeWidth="2"
            />
            <path
              d="M13 11V9C13 7.89543 13.8954 7 15 7H17C18.1046 7 19 7.89543 19 9V11"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M13 17L15 19L19 15"
              stroke="#93C5FD"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div className="brand-text">
          <h1 className="brand-title">ApplyFlow</h1>
          <span className="brand-subtitle">Job Tracker</span>
        </div>
      </div>

      <div className="sidebar-action">
        <button onClick={onOpenCreateModal} className="btn-sidebar-add">
          <PlusCircle size={18} />
          <span>Add Application</span>
        </button>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section-title">Navigation</div>
        <ul className="nav-list">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentFilter === item.id;

            return (
              <li key={item.id} className="nav-item">
                <button
                  onClick={() => onSelectFilter(item.id)}
                  className={`nav-button ${isActive ? 'nav-button-active' : ''}`}
                >
                  <Icon size={18} className="nav-icon" />
                  <span className="nav-label">{item.label}</span>
                  <span className="nav-badge">{item.count}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="sidebar-widget">
        <div className="widget-header">
          <TrendingUp size={16} className="widget-icon" />
          <span className="widget-title">Interview Rate</span>
        </div>
        <div className="widget-metric">
          {stats?.totalApplications
            ? `${Math.round(((stats.interviews || 0) / stats.totalApplications) * 100)}%`
            : '0%'}
        </div>
        <div className="widget-subtext">
          {stats?.interviews ?? 0} interviews out of {stats?.totalApplications ?? 0} applied
        </div>
      </div>

      <div className="sidebar-footer">
        <div className="footer-status">
          <span className="status-indicator-dot"></span>
          <span>ApplyFlow v1.0.0</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
