import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PatientTable from '../components/PatientTable';
import { getPatients } from '../services/api';
import { LANGUAGES } from '../data/mockData';
import { Users, UserPlus, Search, Filter } from 'lucide-react';

export default function Patients() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [langFilter, setLangFilter] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    getPatients().then((data) => {
      setPatients(data);
      setLoading(false);
    });
  }, []);

  const filtered = useMemo(() => {
    return patients.filter((p) => {
      const matchesSearch =
        !search ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.id.toLowerCase().includes(search.toLowerCase()) ||
        p.phone.includes(search);
      const matchesLang = !langFilter || p.language === langFilter;
      return matchesSearch && matchesLang;
    });
  }, [patients, search, langFilter]);

  return (
    <div>
      <div className="page-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
            <Users size={24} className="text-emerald" />
            <h1>Patient Directory</h1>
          </div>
          <div className="subtitle">Comprehensive roster of registered patients for post-discharge education</div>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/patients/add')}>
          <UserPlus size={16} />
          <span>Register New Patient</span>
        </button>
      </div>

      <div className="card card-pad" style={{ marginBottom: 20 }}>
        <div className="toolbar" style={{ marginBottom: 0 }}>
          <div style={{ position: 'relative', flex: 1, maxWidth: '360px' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input
              className="input"
              style={{ paddingLeft: '38px' }}
              placeholder="Search by patient name, MRN, or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Filter size={16} color="#0d9488" />
            <select className="input" style={{ width: '180px' }} value={langFilter} onChange={(e) => setLangFilter(e.target.value)}>
              <option value="">All Languages</option>
              {LANGUAGES.map((l) => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="card card-pad">
        {loading ? (
          <div className="empty-state" style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
            Loading patient directory...
          </div>
        ) : (
          <PatientTable patients={filtered} />
        )}
      </div>
    </div>
  );
}
