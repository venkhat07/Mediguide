import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  FileUp, 
  MessageSquareText, 
  HelpCircle, 
  Settings, 
  LogOut, 
  Stethoscope,
  ShieldCheck
} from 'lucide-react';
import { initials } from '../utils/helpers';

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/patients', label: 'Patient Directory', icon: Users },
  { to: '/upload', label: 'Upload Summary', icon: FileUp },
  { to: '/communications', label: 'Patient Messages', icon: MessageSquareText },
  { to: '/qna', label: 'Clinical Assistant Q&A', icon: HelpCircle },
  { to: '/settings', label: 'Portal Settings', icon: Settings },
];

export default function Sidebar({ open, onClose, hospitalName, staffName, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    onClose?.();
    onLogout();
    navigate('/login');
  };

  return (
    <>
      <aside className={`sidebar ${open ? 'open' : ''}`}>
        <div className="sidebar-brand">
          <div className="logo-icon">
            <Stethoscope size={22} strokeWidth={2.5} />
          </div>
          <div className="brand-text">
            <div className="name">MediGuide AI</div>
            <div className="tag">Clinical Portal</div>
          </div>
        </div>

        <div className="sidebar-section-title">Main Navigation</div>

        <nav className="sidebar-nav">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              >
                <div className="nav-icon">
                  <Icon size={18} />
                </div>
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="avatar">
              {initials(staffName || 'Dr. Sarah Jenkins')}
            </div>
            <div className="who">
              <div className="name-txt">{staffName || 'Dr. Sarah Jenkins'}</div>
              <div className="role">{hospitalName || 'St. Jude Memorial Hospital'}</div>
            </div>
          </div>
          <button className="sidebar-logout" onClick={handleLogout}>
            <LogOut size={15} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
      <div className={`sidebar-scrim ${open ? 'show' : ''}`} onClick={onClose} />
    </>
  );
}
