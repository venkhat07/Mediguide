import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StatCard from '../components/StatCard';
import PatientTable from '../components/PatientTable';
import { getPatients, getDashboardStats } from '../services/api';
import { UserPlus, UploadCloud, Stethoscope, Sparkles, Activity, ShieldCheck, ChevronRight } from 'lucide-react';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const [statsData, patientsData] = await Promise.all([getDashboardStats(), getPatients()]);
      setStats(statsData);
      setPatients(patientsData.slice(0, 5));
      setLoading(false);
    })();
  }, []);

  return (
    <div>
      {/* Clinician Hero Welcome Banner */}
      <div className="clinician-hero-banner">
        <div className="hero-text-content">
          <h2>Welcome back, Dr. Sarah Jenkins</h2>
          <p>
            St. Jude Memorial Hospital • Clinical Discharge AI System is operating normally.
          </p>
          <div className="hero-badge-row">
            <div className="hero-pill-badge">
              <Activity size={13} />
              <span>AI Engine Active v2.4</span>
            </div>
            <div className="hero-pill-badge">
              <ShieldCheck size={13} />
              <span>EHR Auto-Sync Enabled</span>
            </div>
          </div>
        </div>

        <div className="hero-actions">
          <button className="btn btn-secondary" onClick={() => navigate('/patients/add')}>
            <UserPlus size={16} />
            <span>New Patient</span>
          </button>
          <button className="btn btn-primary" onClick={() => navigate('/upload')}>
            <UploadCloud size={16} />
            <span>Upload Summary</span>
          </button>
        </div>
      </div>

      <div className="page-header">
        <div>
          <h1>Clinical Activity Overview</h1>
          <div className="subtitle">Real-time metrics for patient summaries and post-discharge communications</div>
        </div>
      </div>

      {!loading && stats && (
        <div className="stat-grid">
          <StatCard label="Total Patients" value={stats.totalPatients} />
          <StatCard label="Summaries Processed" value={stats.summariesProcessed} />
          <StatCard label="Messages Sent" value={stats.messagesSent} />
          <StatCard label="Pending Processing" value={stats.pendingProcessing} />
        </div>
      )}

      <div className="card card-pad">
        <div className="section-title">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Stethoscope size={18} className="text-emerald" />
            <span>Recent Discharge Records</span>
          </div>
          <button 
            className="btn btn-secondary" 
            style={{ fontSize: '13px', padding: '6px 12px' }}
            onClick={() => navigate('/patients')}
          >
            <span>View All Patients</span>
            <ChevronRight size={14} />
          </button>
        </div>
        {loading ? (
          <div className="empty-state" style={{ padding: '32px', textAlign: 'center', color: '#64748b' }}>
            Loading hospital records...
          </div>
        ) : (
          <PatientTable patients={patients} />
        )}
      </div>
    </div>
  );
}
