import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StatusBadge from '../components/StatusBadge';
import { getPatients } from '../services/api';
import { formatDate } from '../utils/helpers';

export default function CommunicationsHub() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getPatients().then((data) => {
      setPatients(data);
      setLoading(false);
    });
  }, []);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Communications</h1>
          <div className="subtitle">Manage WhatsApp text, voice and video delivery for each patient</div>
        </div>
      </div>

      <div className="card card-pad">
        {loading ? (
          <div className="empty-state">Loading…</div>
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Language</th>
                  <th>Discharge Date</th>
                  <th>Processing Status</th>
                  <th>WhatsApp Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {patients.map((p) => (
                  <tr key={p.id}>
                    <td data-label="Patient" className="cell-primary">{p.name}</td>
                    <td data-label="Language" className="cell-muted">{p.language}</td>
                    <td data-label="Discharge Date" className="cell-muted">{formatDate(p.dischargeDate)}</td>
                    <td data-label="Processing Status"><StatusBadge status={p.processingStatus} /></td>
                    <td data-label="WhatsApp Status"><StatusBadge status={p.whatsappStatus} /></td>
                    <td data-label="Actions">
                      <button
                        className="btn btn-outline btn-sm"
                        disabled={p.processingStatus !== 'Completed'}
                        onClick={() => navigate(`/patients/${p.id}/communication`)}
                      >
                        Manage
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
