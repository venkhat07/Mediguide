import { Search, Bell, Menu, ShieldCheck, Stethoscope } from 'lucide-react';

export default function Header({ onMenuClick }) {
  return (
    <>
      {/* Top Header Bar for Desktop & Tablet */}
      <header className="top-header">
        <div className="header-left">
          <div className="header-search">
            <Search className="search-icon" size={16} />
            <input 
              type="text" 
              placeholder="Search patients by name, MRN, or condition..." 
            />
          </div>
        </div>

        <div className="header-right">
          <div className="hospital-badge">
            <span className="dot" />
            <span>HIPAA Secure AI Gateway</span>
          </div>

          <button className="header-icon-btn" aria-label="Notifications">
            <Bell size={18} />
            <span className="notification-badge">3</span>
          </button>
        </div>
      </header>

      {/* Mobile Bar */}
      <div className="mobile-topbar">
        <div className="brand">
          <Stethoscope size={20} />
          <span>MediGuide AI</span>
        </div>
        <button aria-label="Open menu" onClick={onMenuClick}>
          <Menu size={20} />
        </button>
      </div>
    </>
  );
}
