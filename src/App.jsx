import { useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ToastProvider } from './components/Toast';
import Layout from './components/Layout';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Patients from './pages/Patients';
import AddPatient from './pages/AddPatient';
import UploadSummary from './pages/UploadSummary';
import SummaryResult from './pages/SummaryResult';
import Communication from './pages/Communication';
import CommunicationsHub from './pages/CommunicationsHub';
import PatientDetail from './pages/PatientDetail';
import QnA from './pages/QnA';
import Settings from './pages/Settings';

function App() {
  const [session, setSession] = useState(null);

  const handleLogin = (data) => {
    setSession({ hospital: data.hospital, staffName: 'Hospital Staff', email: data.email });
  };
  const handleLogout = () => setSession(null);

  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path="/login"
            element={session ? <Navigate to="/dashboard" /> : <Login onLogin={handleLogin} />}
          />

          {session ? (
            <Route
              path="/*"
              element={
                <Layout session={session} onLogout={handleLogout}>
                  <Routes>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/patients" element={<Patients />} />
                    <Route path="/patients/add" element={<AddPatient />} />
                    <Route path="/patients/:id" element={<PatientDetail />} />
                    <Route path="/patients/:id/summary" element={<SummaryResult />} />
                    <Route path="/patients/:id/communication" element={<Communication />} />
                    <Route path="/upload" element={<UploadSummary />} />
                    <Route path="/communications" element={<CommunicationsHub />} />
                    <Route path="/qna" element={<QnA />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="*" element={<Navigate to="/dashboard" />} />
                  </Routes>
                </Layout>
              }
            />
          ) : (
            <Route path="/*" element={<Navigate to="/login" />} />
          )}
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  );
}

export default App;
