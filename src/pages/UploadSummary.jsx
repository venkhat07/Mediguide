import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import FileUpload from '../components/FileUpload';
import ProcessingSteps, { STEPS } from '../components/ProcessingSteps';
import { getPatients, uploadDischargeSummary, processDischargeSummary } from '../services/api';
import { useToast } from '../components/Toast';
import { LANGUAGES } from '../data/mockData';
import { FileUp, User, Globe, Calendar, Sparkles, ArrowRight, AlertTriangle, RefreshCw } from 'lucide-react';

export default function UploadSummary() {
  const [patients, setPatients] = useState([]);
  const [patientId, setPatientId] = useState('');
  const [targetLang, setTargetLang] = useState('');
  const [file, setFile] = useState(null);
  const [stepIndex, setStepIndex] = useState(-1);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const showToast = useToast();

  useEffect(() => {
    getPatients().then((data) => {
      setPatients(data);
      const preselect = params.get('patientId');
      if (preselect) {
        setPatientId(preselect);
      } else {
        setPatientId('__new__');
      }
    });
  }, [params]);

  const selectedPatient = patients.find((p) => p.id === patientId);

  useEffect(() => {
    if (selectedPatient?.language) {
      setTargetLang(selectedPatient.language);
    } else if (!targetLang) {
      setTargetLang('Tamil');
    }
  }, [selectedPatient]);

  const handleSelectSample = (sampleType) => {
    setError(null);
    const isCardio = sampleType === 'cardiology';
    const fileName = isCardio ? 'Cardiology_Discharge_Report.pdf' : 'Orthopedic_Surgery_Notes.pdf';
    const sampleContent = isCardio
      ? `ST. JUDE MEMORIAL HOSPITAL — CARDIOLOGY DISCHARGE SUMMARY
Patient Name: Rajesh Verma | Age: 52 | Diagnosis: Coronary Artery Stent Placement & Recovery
Prescribed Medications:
1. Aspirin 75 mg - Once daily with lunch for 30 days. Prevents blood clot formation.
2. Atorvastatin 20 mg - Once daily at bedtime for 30 days. Regulates blood lipids and stabilizes arteries.
Dietary Advice: Low sodium and heart-friendly balanced diet. Avoid deep-fried foods and refined sugars.
Restrictions: No heavy weight lifting for 2 weeks. Light gentle walking 20 minutes daily.
Follow-up: Cardiology clinic review in 2 weeks with repeat ECG report.
Warning Signs: Sudden chest tightness, shortness of breath, unexplained dizziness or sweating.`
      : `ST. JUDE MEMORIAL HOSPITAL — ORTHOPEDIC DISCHARGE SUMMARY
Patient Name: Arun Raj | Age: 38 | Diagnosis: Right Knee Meniscal Arthroscopy & Recovery
Prescribed Medications:
1. Paracetamol 650 mg - Take every 6 hours as needed for pain for 5 days.
2. Pantoprazole 40 mg - Take once daily before breakfast for 5 days to protect stomach.
Dietary Advice: High protein diet with fresh vegetables and plenty of water.
Restrictions: No heavy lifting for 4 weeks. Use crutches for 2 weeks. Avoid strenuous exercise.
Follow-up: Suture removal in 7 days at Orthopedic Clinic.
Warning Signs: Incision redness or swelling, high fever (>101°F), severe calf pain.`;

    const sampleFile = new File([sampleContent], fileName, {
      type: 'application/pdf',
      lastModified: Date.now(),
    });
    setFile(sampleFile);
    showToast(`Loaded ${isCardio ? 'Cardiology (Rajesh Verma)' : 'Orthopedic (Arun Raj)'} sample document`, 'info');
  };

  const runProcessing = async (forceOffline = false) => {
    if (!patientId || !file) return;
    setError(null);
    const finalLang = targetLang || selectedPatient?.language || 'Tamil';
    setProcessing(true);

    try {
      if (patientId !== '__new__') {
        await uploadDischargeSummary(patientId, file);
      }
      for (let i = 0; i < 3; i += 1) {
        setStepIndex(i);
        // eslint-disable-next-line no-await-in-loop
        await new Promise((r) => setTimeout(r, 450));
      }

      const result = await processDischargeSummary(patientId, file, finalLang, forceOffline);

      for (let i = 3; i < STEPS.length; i += 1) {
        setStepIndex(i);
        // eslint-disable-next-line no-await-in-loop
        await new Promise((r) => setTimeout(r, 250));
      }

      setStepIndex(STEPS.length);
      showToast(`Discharge summary successfully processed in ${finalLang}`, 'success');
      const finalId = result?.patient?.id || patientId;
      setTimeout(() => navigate(`/patients/${finalId}/summary`), 500);
    } catch (err) {
      console.error('[UploadSummary] Clinical processing error:', err);
      setProcessing(false);
      setStepIndex(-1);

      const msg = err?.message || 'Processing failed';
      const isWorkflowInactive = msg.includes('404') || msg.toLowerCase().includes('inactive') || msg.toLowerCase().includes('not found');

      setError({
        title: isWorkflowInactive ? 'SNS Workbench Workflow Not Deployed' : 'Workflow Execution Issue',
        message: isWorkflowInactive
          ? 'Your SNS Workbench workflow is currently in draft mode. To allow the frontend to connect, please click the "Deploy" button (or toggle Active) in the top-right corner of SNS Workbench, then click Try Again.'
          : `${msg}. Please verify your workflow in SNS Workbench and try again.`,
      });

      showToast(isWorkflowInactive ? 'Please click Deploy in SNS Workbench' : 'Processing error: ' + msg, 'error');
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="page-header">
        <div>
          <h1>Upload Discharge Summary</h1>
          <div className="subtitle">Transform clinical PDFs into simplified multi-lingual patient instructions</div>
        </div>
      </div>

      <div className="card card-pad">
        {error && (
          <div style={{
            background: '#fff1f2',
            border: '1px solid #fecdd3',
            borderRadius: '12px',
            padding: '18px 20px',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '14px',
            boxShadow: '0 4px 6px -1px rgba(225, 29, 72, 0.05)'
          }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              background: '#ffe4e6',
              color: '#e11d48',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              marginTop: '2px'
            }}>
              <AlertTriangle size={22} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: '15px', color: '#9f1239', marginBottom: '4px' }}>
                {error.title}
              </div>
              <div style={{ fontSize: '13.5px', color: '#881337', lineHeight: '1.5', marginBottom: '14px' }}>
                {error.message}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                <button
                  onClick={() => runProcessing(false)}
                  className="btn btn-primary"
                  style={{ padding: '8px 16px', fontSize: '13px', background: '#0d9488', borderColor: '#0d9488' }}
                >
                  <RefreshCw size={14} />
                  <span>Try Again</span>
                </button>
                <button
                  onClick={() => setError(null)}
                  className="btn btn-secondary"
                  style={{ padding: '8px 14px', fontSize: '13px' }}
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        )}

        {!processing ? (
          <>
            <div className="field">
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <User size={16} className="text-emerald" />
                <span>Select Target Patient Record</span>
              </label>
              <select 
                className="input" 
                value={patientId} 
                onChange={(e) => setPatientId(e.target.value)}
                style={{ fontSize: '15px', padding: '12px' }}
              >
                <option value="__new__">✨ Auto-detect & Create New Patient from Document</option>
                {patients.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} (MRN-{p.id}) — {p.language} Target
                  </option>
                ))}
              </select>
            </div>

            <div 
              style={{ 
                display: 'grid',
                gridTemplateColumns: selectedPatient ? '1fr 1fr' : '1fr',
                gap: '16px',
                marginBottom: '20px',
                background: patientId === '__new__' ? '#f0fdf4' : 'var(--color-bg)', 
                padding: '16px', 
                borderRadius: 'var(--radius-md)', 
                border: patientId === '__new__' ? '1px solid #bbf7d0' : '1px solid var(--color-border)',
              }}
            >
              <div className="field" style={{ margin: 0 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
                  <Globe size={15} color="#0d9488" />
                  <span>Target Output Language</span>
                </label>
                <select
                  className="input"
                  value={targetLang || selectedPatient?.language || 'Tamil'}
                  onChange={(e) => setTargetLang(e.target.value)}
                  style={{ fontSize: '14px', padding: '8px 12px', background: '#fff' }}
                >
                  {LANGUAGES.map((lang) => (
                    <option key={lang} value={lang}>
                      {lang}
                    </option>
                  ))}
                </select>
              </div>

              {selectedPatient ? (
                <div className="field" style={{ margin: 0 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
                    <Calendar size={15} color="#0d9488" />
                    <span>Discharge Date</span>
                  </label>
                  <div
                    style={{
                      fontSize: '14px',
                      padding: '9px 12px',
                      background: '#fff',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-sm)',
                      color: 'var(--color-text)',
                      fontWeight: 500,
                    }}
                  >
                    {selectedPatient.dischargeDate || 'N/A'}
                  </div>
                </div>
              ) : (
                <div style={{ fontSize: '12.5px', color: '#166534', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Sparkles size={16} className="text-emerald" />
                  <span>AI Multimodal Engine will extract the patient's name, conditions, and prescriptions from your uploaded document.</span>
                </div>
              )}
            </div>

            <div className="field">
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                <FileUp size={16} className="text-emerald" />
                <span>Patient PDF Discharge Summary</span>
              </label>
              <FileUpload 
                file={file} 
                onFileSelect={setFile} 
                onRemove={() => setFile(null)}
                onSelectSample={handleSelectSample}
              />
            </div>

            <div style={{ marginTop: '28px' }}>
              <button
                className="btn btn-primary btn-block"
                style={{ padding: '14px', fontSize: '15px' }}
                disabled={!patientId || !file}
                onClick={() => runProcessing(false)}
              >
                <Sparkles size={18} />
                <span>Run AI Medical Simplification & Translation</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </>
        ) : (
          <div style={{ padding: '12px 0' }}>
            <ProcessingSteps currentIndex={stepIndex} />
          </div>
        )}
      </div>
    </div>
  );
}
