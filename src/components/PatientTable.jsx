import { useNavigate } from 'react-router-dom';
import StatusBadge from './StatusBadge';
import { formatDate, initials } from '../utils/helpers';
import { Eye, MessageSquare, ChevronRight } from 'lucide-react';

export default function PatientTable({ patients }) {
  const navigate = useNavigate();

  if (!patients || !patients.length) {
    return (
      <div className="empty-state" style={{ padding: '32px', textAlign: 'center', color: '#64748b' }}>
        No patient records available yet.
      </div>
    );
  }

  return (
    <div className="table-responsive">
      <table className="patient-table">
        <thead>
          <tr>
            <th>Patient Details</th>
            <th>Discharge Date</th>
            <th>Language</th>
            <th>AI Summary Status</th>
            <th>Delivery Status</th>
            <th style={{ textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((p) => (
            <tr key={p.id}>
              <td>
                <div className="patient-cell-profile">
                  <div className="patient-cell-avatar">
                    {initials(p.name)}
                  </div>
                  <div className="patient-cell-info">
                    <div className="patient-cell-name">{p.name}</div>
                    <div className="patient-cell-mrn">MRN-{p.id}</div>
                  </div>
                </div>
              </td>
              <td>{formatDate(p.dischargeDate)}</td>
              <td>
                <span className="sample-chip" style={{ fontSize: '11.5px', padding: '2px 8px' }}>
                  {p.language || 'English'}
                </span>
              </td>
              <td>
                <StatusBadge status={p.processingStatus} />
              </td>
              <td>
                <StatusBadge status={p.whatsappStatus} />
              </td>
              <td style={{ textAlign: 'right' }}>
                <div style={{ display: 'inline-flex', gap: '6px' }}>
                  <button 
                    className="btn btn-secondary" 
                    style={{ padding: '6px 12px', fontSize: '12.5px' }}
                    onClick={() => navigate(`/patients/${p.id}`)}
                    title="View Patient Record"
                  >
                    <Eye size={14} />
                    <span>View Record</span>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
