import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import PatientInfoCard from '../components/PatientInfoCard';
import StatusBadge from '../components/StatusBadge';
import Disclaimer from '../components/Disclaimer';
import { getPatient, getCommunicationHistory } from '../services/api';
import { ArrowLeft, FileText, Send, UploadCloud, Stethoscope, Pill, Calendar, Sparkles } from 'lucide-react';

export default function PatientDetail() {
  const { id } = useParams();
  const [patient, setPatient] = useState(null);
  const [history, setHistory] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getPatient(id).then(setPatient);
    getCommunicationHistory(id).then(setHistory);
  }, [id]);

  if (!patient) {
    return (
      <div className="empty-state" style={{ padding: '60px', textAlign: 'center', color: '#64748b' }}>
        Loading patient profile...
      </div>
    );
  }

  const hasSummary = patient.diagnosis && patient.diagnosis.length > 0;

  return (
    <div>
      <Link to="/patients" className="btn btn-secondary" style={{ marginBottom: '20px', padding: '6px 14px', fontSize: '13px' }}>
        <ArrowLeft size={15} />
        <span>Back to Patient Directory</span>
      </Link>

      <div className="page-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
            <h1>{patient.name}</h1>
            <span className="sample-chip" style={{ fontSize: '12px', padding: '2px 10px' }}>MRN-{patient.id}</span>
          </div>
          <div className="subtitle">Clinical summary, simplified instructions, and communication log</div>
        </div>
        <div className="toolbar" style={{ marginBottom: 0 }}>
          {hasSummary ? (
            <>
              <button className="btn btn-secondary" onClick={() => navigate(`/patients/${id}/summary`)}>
                <FileText size={16} />
                <span>View Full AI Summary</span>
              </button>
              <button className="btn btn-primary" onClick={() => navigate(`/patients/${id}/communication`)}>
                <Send size={16} />
                <span>Patient Messages</span>
              </button>
            </>
          ) : (
            <button className="btn btn-primary" onClick={() => navigate(`/upload?patientId=${id}`)}>
              <UploadCloud size={16} />
              <span>Upload Discharge Summary</span>
            </button>
          )}
        </div>
      </div>

      <div className="summary-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        <div>
          {hasSummary ? (
            <>
              <Disclaimer />
              
              <div className="card card-pad" style={{ marginBottom: 20 }}>
                <div className="section-title">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Stethoscope size={18} className="text-emerald" />
                    <span>Discharge Diagnosis</span>
                  </div>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {patient.diagnosis.map((d) => (
                    <span 
                      key={d} 
                      style={{ 
                        background: '#e0f2fe', 
                        color: '#0369a1', 
                        fontWeight: 700, 
                        fontSize: '13px', 
                        padding: '6px 14px', 
                        borderRadius: '9999px',
                        border: '1px solid #bae6fd'
                      }}
                    >
                      {d}
                    </span>
                  ))}
                </div>
              </div>

              <div className="card card-pad" style={{ marginBottom: 20 }}>
                <div className="section-title">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Pill size={18} className="text-emerald" />
                    <span>Medication Dosage & Schedule</span>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {patient.medications.map((m) => (
                    <div 
                      key={m.name} 
                      style={{ 
                        background: '#f8fafc', 
                        padding: '12px 16px', 
                        borderRadius: '10px', 
                        border: '1px solid #e2e8f0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                    >
                      <div style={{ fontWeight: 700, fontSize: '14.5px', color: '#0f172a' }}>{m.name}</div>
                      <div style={{ fontSize: '13px', color: '#0d9488', fontWeight: 600 }}>
                        {m.dosage} • {m.frequency} • {m.duration}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card card-pad" style={{ marginBottom: 20 }}>
                <div className="section-title">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Sparkles size={18} className="text-emerald" />
                    <span>Patient-Friendly AI Explanation ({patient.language})</span>
                  </div>
                </div>
                <div 
                  style={{ 
                    background: '#f0fdf4', 
                    border: '1px solid #a7f3d0', 
                    borderRadius: '12px', 
                    padding: '20px', 
                    lineHeight: '1.6', 
                    fontSize: '14.5px', 
                    color: '#0f5247' 
                  }}
                >
                  {patient.patientExplanation}
                </div>
              </div>
            </>
          ) : (
            <div className="card card-pad" style={{ textAlign: 'center', padding: '40px' }}>
              <div style={{ color: '#64748b', fontSize: '15px', marginBottom: '16px' }}>
                No discharge summary has been uploaded for this patient record yet.
              </div>
              <button className="btn btn-primary" onClick={() => navigate(`/upload?patientId=${id}`)}>
                <UploadCloud size={16} />
                <span>Upload Discharge Summary PDF</span>
              </button>
            </div>
          )}

          <div className="card card-pad" style={{ marginTop: '24px' }}>
            <div className="section-title">Patient Communication Log</div>
            {history.length === 0 ? (
              <div style={{ color: '#64748b', fontSize: '13.5px', padding: '12px 0' }}>
                No automated WhatsApp or SMS messages sent yet.
              </div>
            ) : (
              <div className="table-responsive">
                <table className="patient-table">
                  <thead>
                    <tr><th>Date</th><th>Channel</th><th>Language</th><th>Type</th><th>Status</th></tr>
                  </thead>
                  <tbody>
                    {history.map((h, i) => (
                      <tr key={i}>
                        <td>{h.date}</td>
                        <td><strong>{h.channel}</strong></td>
                        <td>{h.language}</td>
                        <td>{h.contentType}</td>
                        <td><StatusBadge status={h.status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        <div>
          <PatientInfoCard patient={patient} />
        </div>
      </div>
    </div>
  );
}
