import React from 'react';
import { Briefcase, Clock, Calendar, Award } from 'lucide-react';

const SummaryCards = ({ stats, currentFilter, onSelectFilter }) => {
  const cards = [
    {
      id: 'All',
      title: 'Total Applications',
      count: stats?.totalApplications ?? 0,
      icon: Briefcase,
      color: 'blue',
      description: 'All tracked job submissions',
    },
    {
      id: 'Active',
      title: 'Active Applications',
      count: stats?.activeApplications ?? 0,
      icon: Clock,
      color: 'amber',
      description: 'Applied & Under review',
    },
    {
      id: 'Interview',
      title: 'Interviews',
      count: stats?.interviews ?? 0,
      icon: Calendar,
      color: 'purple',
      description: 'Screening & panel rounds',
    },
    {
      id: 'Offer',
      title: 'Offers Received',
      count: stats?.offers ?? 0,
      icon: Award,
      color: 'emerald',
      description: 'Accepted or negotiating',
    },
  ];

  return (
    <div className="summary-grid">
      {cards.map((card) => {
        const IconComponent = card.icon;
        const isActive = currentFilter === card.id;

        return (
          <div
            key={card.id}
            onClick={() => onSelectFilter(card.id)}
            className={`summary-card card-${card.color} ${isActive ? 'is-active-card' : ''}`}
            role="button"
            tabIndex={0}
            title={`Click to filter by ${card.title}`}
          >
            <div className="summary-card-header">
              <span className="summary-card-title">{card.title}</span>
              <div className={`summary-icon-wrapper icon-${card.color}`}>
                <IconComponent size={20} />
              </div>
            </div>
            <div className="summary-card-count">{card.count}</div>
            <div className="summary-card-footer">
              <span className="summary-card-desc">{card.description}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SummaryCards;
