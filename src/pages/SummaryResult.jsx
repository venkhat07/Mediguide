import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PatientInfoCard from '../components/PatientInfoCard';
import Disclaimer from '../components/Disclaimer';
import MedicationCard from '../components/MedicationCard';
import SummarySection from '../components/SummarySection';
import { getPatient, translatePatientRecord } from '../services/api';
import { LANGUAGES } from '../data/mockData';
import { playSpeech, stopSpeech } from '../utils/speech';
import { FileText, Send, Sparkles, Volume2, Pill, Stethoscope, Utensils, Activity, AlertTriangle, Calendar, ShieldAlert, Globe, Loader2 } from 'lucide-react';
import { useToast } from '../components/Toast';

export default function SummaryResult() {
  const { id } = useParams();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [speaking, setSpeaking] = useState(false);
  const [translating, setTranslating] = useState(false);
  const navigate = useNavigate();
  const showToast = useToast();

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);
    getPatient(id)
      .then((data) => {
        if (!isMounted) return;
        if (data) {
          setPatient(data);
        } else {
          setError(`No clinical record found for patient MRN-${id}. Please check the ID or upload a discharge summary.`);
        }
      })
      .catch((err) => {
        if (!isMounted) return;
        console.error('Error fetching patient record:', err);
        setError(err.message || 'Failed to load discharge summary analysis.');
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleLanguageChange = async (newLang) => {
    if (!newLang || newLang === patient?.language) return;
    setTranslating(true);
    showToast(`Translating care summary to ${newLang}...`, 'info');
    try {
      const updated = await translatePatientRecord(id, newLang);
      setPatient({ ...updated });
      showToast(`Summary translated to ${newLang}!`, 'success');
    } catch (err) {
      showToast('Translation error: ' + err.message, 'error');
    } finally {
      setTranslating(false);
    }
  };

  useEffect(() => {
    return () => {
      stopSpeech();
    };
  }, []);

  if (loading) {
    return (
      <div className="empty-state" style={{ padding: '80px 20px', textAlign: 'center', color: '#0d9488' }}>
        <Loader2 size={36} className="spin" style={{ animation: 'spin 1s linear infinite', margin: '0 auto 16px auto' }} />
        <div style={{ fontWeight: 600, fontSize: '16px' }}>Loading discharge summary analysis...</div>
      </div>
    );
  }

  if (error || !patient) {
    return (
      <div className="card card-pad" style={{ maxWidth: '580px', margin: '60px auto', textAlign: 'center', padding: '40px 24px', border: '1px solid #fee2e2' }}>
        <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: '#fef2f2', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
          <AlertTriangle size={26} />
        </div>
        <h2 style={{ fontSize: '19px', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>
          Clinical Summary Unavailable
        </h2>
        <p style={{ color: '#64748b', fontSize: '14px', lineHeight: 1.6, marginBottom: '24px' }}>
          {error || `Unable to locate clinical record for patient MRN-${id}.`}
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <button className="btn btn-primary" onClick={() => navigate('/upload')}>
            Upload Discharge Summary
          </button>
          <button className="btn btn-secondary" onClick={() => navigate('/dashboard')}>
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const handleReadAloud = () => {
    if (speaking) {
      stopSpeech();
      setSpeaking(false);
      showToast('Audio paused', 'info');
      return;
    }

    if (!patient.patientExplanation) {
      showToast('No patient explanation text to read', 'warning');
      return;
    }

    playSpeech(
      patient.patientExplanation,
      patient.language || 'Tamil',
      () => {
        setSpeaking(true);
        showToast(`Playing clear native audio in ${patient.language || 'Tamil'}...`, 'info');
      },
      () => {
        setSpeaking(false);
      }
    );
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <Sparkles size={20} className="text-emerald" />
            <h1>Simplified Patient Summary</h1>
          </div>
          <div className="subtitle">AI-generated post-discharge care guide • Language: {patient.language}</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#f8fafc', padding: '6px 12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <Globe size={16} className="text-emerald" />
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
          <button 
            className="btn btn-secondary" 
            onClick={handleReadAloud}
            style={{ borderColor: speaking ? '#0d9488' : undefined }}
          >
            <Volume2 size={16} className={speaking ? 'text-emerald' : ''} />
            <span>{speaking ? 'Stop Audio' : 'Listen to Audio'}</span>
          </button>
          <button className="btn btn-primary" onClick={() => navigate(`/patients/${id}/communication`)}>
            <Send size={16} />
            <span>Send to Patient</span>
          </button>
        </div>
      </div>

      <Disclaimer />

      <div className="summary-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        <div>
          <div className="card card-pad" style={{ marginBottom: 20 }}>
            <div className="section-title">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Stethoscope size={18} className="text-emerald" />
                <span>Diagnosis / Conditions</span>
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
                    fontSize: '13.5px', 
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
                <span>Prescribed Medications</span>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {Array.isArray(patient.medications) && patient.medications.length > 0 ? (
                patient.medications.map((m, idx) => (
                  <MedicationCard key={m?.name || idx} medicine={m} />
                ))
              ) : (
                <div style={{ padding: '12px 16px', background: '#f8fafc', borderRadius: '8px', color: '#64748b', fontSize: '13.5px', fontStyle: 'italic' }}>
                  No specific discharge medications documented. Follow standard hospital discharge care.
                </div>
              )}
            </div>
          </div>

          <div className="card card-pad" style={{ marginBottom: 20 }}>
            <div className="section-title">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Utensils size={18} className="text-emerald" />
                <span>Dietary Guidelines</span>
              </div>
            </div>
            <ul style={{ margin: 0, paddingLeft: '20px', lineHeight: '1.7', color: '#334155' }}>
              {(Array.isArray(patient.diet) ? patient.diet : (patient.diet ? [patient.diet] : ['Standard balanced diet as tolerated'])).map((d, idx) => (
                <li key={typeof d === 'string' ? d : idx} style={{ fontWeight: 500 }}>
                  {typeof d === 'string' ? d : JSON.stringify(d)}
                </li>
              ))}
            </ul>
          </div>

          <div className="card card-pad" style={{ marginBottom: 20 }}>
            <div className="section-title">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Activity size={18} className="text-emerald" />
                <span>Activity & Physical Restrictions</span>
              </div>
            </div>
            <ul style={{ margin: 0, paddingLeft: '20px', lineHeight: '1.7', color: '#334155' }}>
              {(Array.isArray(patient.restrictions) ? patient.restrictions : (patient.restrictions ? [patient.restrictions] : ['Adequate rest; avoid strenuous physical exertion'])).map((d, idx) => (
                <li key={typeof d === 'string' ? d : idx} style={{ fontWeight: 500 }}>
                  {typeof d === 'string' ? d : JSON.stringify(d)}
                </li>
              ))}
            </ul>
          </div>

          <div className="card card-pad" style={{ marginBottom: 20 }}>
            <div className="section-title">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Calendar size={18} className="text-emerald" />
                <span>Follow-up Appointment Schedule</span>
              </div>
            </div>
            <ul style={{ margin: 0, paddingLeft: '20px', lineHeight: '1.7', color: '#334155' }}>
              {(Array.isArray(patient.followUp) ? patient.followUp : (patient.followUp ? [patient.followUp] : ['Routine follow-up at the outpatient clinic as scheduled'])).map((d, idx) => (
                <li key={typeof d === 'string' ? d : idx} style={{ fontWeight: 500 }}>
                  {typeof d === 'string' ? d : JSON.stringify(d)}
                </li>
              ))}
            </ul>
          </div>

          <div className="card card-pad" style={{ marginBottom: 20, borderColor: '#fde68a', background: '#fffbeb' }}>
            <div className="section-title">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#b45309' }}>
                <AlertTriangle size={18} />
                <span>Warning Signs (When to Contact Hospital)</span>
              </div>
            </div>
            <ul style={{ margin: 0, paddingLeft: '20px', lineHeight: '1.7', color: '#92400e' }}>
              {(Array.isArray(patient.warningSigns) ? patient.warningSigns : (patient.warningSigns ? [patient.warningSigns] : ['Seek emergency care if you experience severe breathlessness, high fever, or severe sudden pain.'])).map((d, idx) => (
                <li key={typeof d === 'string' ? d : idx} style={{ fontWeight: 600 }}>
                  {typeof d === 'string' ? d : JSON.stringify(d)}
                </li>
              ))}
            </ul>
          </div>

          <div className="card card-pad" style={{ marginBottom: 20 }}>
            <div className="section-title">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={18} className="text-emerald" />
                <span>Patient-Friendly Explanation</span>
              </div>
            </div>
            <div className="explanation-box" style={{ background: '#f0fdf4', border: '1px solid #a7f3d0', padding: '20px', borderRadius: '12px', color: '#0f5247', lineHeight: '1.6', fontSize: '15px' }}>
              {patient.patientExplanation || 'Your clinical summary has been processed. Please review your discharge guidelines and adhere to prescribed recovery steps.'}
            </div>
          </div>
        </div>

        <div>
          <PatientInfoCard patient={patient} />
        </div>
      </div>
    </div>
  );
}
