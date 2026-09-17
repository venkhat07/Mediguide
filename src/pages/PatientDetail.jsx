import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import PatientInfoCard from '../components/PatientInfoCard';
import StatusBadge from '../components/StatusBadge';
import Disclaimer from '../components/Disclaimer';
import { useToast } from '../components/Toast';
import { getPatient, getCommunicationHistory, translatePatientRecord } from '../services/api';
import { LANGUAGES } from '../data/mockData';
import { ArrowLeft, FileText, Send, UploadCloud, Stethoscope, Pill, Calendar, Sparkles, Globe, Loader2 } from 'lucide-react';

export default function PatientDetail() {
  const { id } = useParams();
  const [patient, setPatient] = useState(null);
  const [history, setHistory] = useState([]);
  const [translating, setTranslating] = useState(false);
  const navigate = useNavigate();
  const showToast = useToast();

  useEffect(() => {
    getPatient(id).then(setPatient);
    getCommunicationHistory(id).then(setHistory);
  }, [id]);

  const handleLanguageChange = async (newLang) => {
    if (!newLang || newLang === patient.language) return;
    setTranslating(true);
    showToast(`Translating care instructions into ${newLang}...`, 'info');
    try {
      const updated = await translatePatientRecord(id, newLang);
      setPatient({ ...updated });
      showToast(`Care plan successfully translated into ${newLang}!`, 'success');
    } catch (err) {
      showToast('Translation error: ' + err.message, 'error');
    } finally {
      setTranslating(false);
    }
  };

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
        <div className="toolbar" style={{ marginBottom: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
          {hasSummary && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#f8fafc', padding: '4px 10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <Globe size={15} className="text-emerald" />
              <select
                style={{ background: 'transparent', border: 'none', fontWeight: 600, fontSize: '13px', color: '#0f172a', outline: 'none', cursor: 'pointer' }}
                value={patient.language || 'Tamil'}
                disabled={translating}
                onChange={(e) => handleLanguageChange(e.target.value)}
              >
                {LANGUAGES.map((l) => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
              {translating && <Loader2 size={14} className="spin text-emerald" style={{ animation: 'spin 1s linear infinite' }} />}
            </div>
          )}
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
                  {(Array.isArray(patient.diagnosis) ? patient.diagnosis : (patient.diagnosis ? [patient.diagnosis] : ['General Clinical Care'])).map((d, idx) => (
                    <span 
                      key={typeof d === 'string' ? d : idx} 
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
                      {typeof d === 'string' ? d : (d?.name || JSON.stringify(d))}
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
                  {Array.isArray(patient.medications) && patient.medications.length > 0 ? (
                    patient.medications.map((m, idx) => (
                      <div 
                        key={m?.name || idx} 
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
                        <div style={{ fontWeight: 700, fontSize: '14.5px', color: '#0f172a' }}>{m?.name || 'Prescribed Medicine'}</div>
                        <div style={{ fontSize: '13px', color: '#0d9488', fontWeight: 600 }}>
                          {m?.dosage || 'As directed'} • {m?.frequency || 'Standard'} • {m?.duration || 'Course'}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div style={{ padding: '12px 16px', background: '#f8fafc', borderRadius: '8px', color: '#64748b', fontSize: '13px', fontStyle: 'italic' }}>
                      No discharge medications documented.
                    </div>
                  )}
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
