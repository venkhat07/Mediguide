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
  const [speaking, setSpeaking] = useState(false);
  const [translating, setTranslating] = useState(false);
  const navigate = useNavigate();
  const showToast = useToast();

  useEffect(() => {
    getPatient(id).then(setPatient);
  }, [id]);

  const handleLanguageChange = async (newLang) => {
    if (!newLang || newLang === patient.language) return;
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

  if (!patient) {
    return (
      <div className="empty-state" style={{ padding: '60px', textAlign: 'center', color: '#64748b' }}>
        Loading discharge summary analysis...
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
              {patient.diagnosis.map((d) => (
                <span 
                  key={d} 
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
                  {d}
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
              {patient.medications.map((m) => (
                <MedicationCard key={m.name} medicine={m} />
              ))}
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
              {patient.diet.map((d) => <li key={d} style={{ fontWeight: 500 }}>{d}</li>)}
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
              {patient.restrictions.map((d) => <li key={d} style={{ fontWeight: 500 }}>{d}</li>)}
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
              {patient.followUp.map((d) => <li key={d} style={{ fontWeight: 500 }}>{d}</li>)}
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
              {patient.warningSigns.map((d) => <li key={d} style={{ fontWeight: 600 }}>{d}</li>)}
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
              {patient.patientExplanation}
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
