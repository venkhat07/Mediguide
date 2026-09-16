import { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

export default function Layout({ children, session, onLogout }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-shell">
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        hospitalName={session?.hospital}
        staffName={session?.staffName}
        onLogout={onLogout}
      />
      <div className="main-area">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <div className="page-content">{children}</div>
      </div>
    </div>
  );
}
