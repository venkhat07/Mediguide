import { Users, FileCheck, MessageSquare, Clock, TrendingUp } from 'lucide-react';

const ICON_MAP = {
  'Total Patients': { icon: Users, colorClass: 'stat-icon-emerald', trend: '+14% this month' },
  'Summaries Processed': { icon: FileCheck, colorClass: 'stat-icon-blue', trend: '+28% vs last week' },
  'Messages Sent': { icon: MessageSquare, colorClass: 'stat-icon-purple', trend: '98% delivery rate' },
  'Pending Processing': { icon: Clock, colorClass: 'stat-icon-amber', trend: 'Avg. 45s AI turnaround' },
};

export default function StatCard({ label, value, trend, icon: CustomIcon, colorClass }) {
  const config = ICON_MAP[label] || { icon: Users, colorClass: 'stat-icon-emerald', trend: '+5%' };
  const IconComponent = CustomIcon || config.icon;
  const cardColorClass = colorClass || config.colorClass;
  const displayTrend = trend || config.trend;

  return (
    <div className="stat-card-custom">
      <div className="stat-info">
        <div className="stat-label">{label}</div>
        <div className="stat-val-row">
          <div className="stat-value">{value}</div>
          {displayTrend && (
            <div className="stat-trend up">
              <TrendingUp size={12} />
              <span>{displayTrend}</span>
            </div>
          )}
        </div>
      </div>
      <div className={`stat-icon-wrapper ${cardColorClass}`}>
        <IconComponent size={24} />
      </div>
    </div>
  );
}
