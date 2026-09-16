import { CheckCircle2, Loader2, Circle, Sparkles } from 'lucide-react';

const STEPS = [
  { key: 'uploading', title: 'Uploading Document', desc: 'Securely parsing clinical PDF notes into processing pipeline' },
  { key: 'extracting', title: 'Extracting Clinical Information', desc: 'Identifying discharge diagnoses, prescriptions, and follow-up care' },
  { key: 'understanding', title: 'MedGuide AI Reasoning Engine', desc: 'Simplifying complex clinical terminology into 6th-grade reading level' },
  { key: 'generating', title: 'Multi-Lingual Translation', desc: 'Adapting medical instructions into target patient language' },
  { key: 'preparing', title: 'WhatsApp & SMS Formatting', desc: 'Constructing structured, actionable patient message cards' },
];

export default function ProcessingSteps({ currentIndex }) {
  const percent = Math.min(100, Math.max(10, Math.round(((currentIndex + 1) / STEPS.length) * 100)));

  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#ccfbf1', color: '#0f5247', padding: '6px 14px', borderRadius: '9999px', fontSize: '13px', fontWeight: 700, marginBottom: '12px' }}>
          <Sparkles size={15} />
          <span>AI Clinical Processor Working</span>
        </div>
        <h3 style={{ fontSize: '20px', margin: '0 0 6px 0' }}>Analyzing Discharge Summary...</h3>
        <p style={{ color: '#64748b', fontSize: '13.5px' }}>
          Please wait while our medical AI extracts and simplifies post-care instructions.
        </p>

        <div className="progress-bar-bg">
          <div className="progress-bar-fill" style={{ width: `${percent}%` }} />
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {STEPS.map((step, i) => {
          const isDone = i < currentIndex;
          const isActive = i === currentIndex;
          return (
            <div 
              key={step.key} 
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '14px',
                padding: '12px 16px',
                borderRadius: '12px',
                background: isActive ? '#f0fdf4' : isDone ? '#f8fafc' : '#ffffff',
                border: `1px solid ${isActive ? '#a7f3d0' : isDone ? '#e2e8f0' : '#f1f5f9'}`,
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ marginTop: '2px', flexShrink: 0 }}>
                {isDone ? (
                  <CheckCircle2 size={20} color="#10b981" />
                ) : isActive ? (
                  <Loader2 size={20} color="#0d9488" className="spin" style={{ animation: 'spin 1s linear infinite' }} />
                ) : (
                  <Circle size={20} color="#cbd5e1" />
                )}
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '14px', color: isActive ? '#0f5247' : isDone ? '#0f172a' : '#64748b' }}>
                  {step.title}
                </div>
                <div style={{ fontSize: '12.5px', color: '#64748b', marginTop: '2px' }}>
                  {step.desc}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export { STEPS };
