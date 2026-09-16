import { formatDate, initials } from '../utils/helpers';
import { User, Phone, Globe, Calendar, ShieldCheck } from 'lucide-react';

export default function PatientInfoCard({ patient }) {
  if (!patient) return null;
  return (
    <div className="card card-pad" style={{ position: 'sticky', top: '90px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid #e2e8f0' }}>
        <div 
          style={{ 
            width: '48px', 
            height: '48px', 
            borderRadius: '50%', 
            background: 'linear-gradient(135deg, #0f5247 0%, #0d9488 100%)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: '16px'
          }}
        >
          {initials(patient.name)}
        </div>
        <div>
          <h3 style={{ fontSize: '18px', marginBottom: '2px', color: '#0f172a' }}>{patient.name}</h3>
          <div style={{ color: '#0d9488', fontSize: '12.5px', fontWeight: 600 }}>
            MRN: {patient.id}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '13.5px' }}>
          <span style={{ color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Phone size={14} /> Phone
          </span>
          <span style={{ fontWeight: 700, color: '#0f172a' }}>{patient.phone}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '13.5px' }}>
          <span style={{ color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Globe size={14} /> Language
          </span>
          <span className="sample-chip" style={{ fontSize: '12px', padding: '2px 10px' }}>{patient.language}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '13.5px' }}>
          <span style={{ color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Calendar size={14} /> Discharge Date
          </span>
          <span style={{ fontWeight: 600, color: '#0f172a' }}>{formatDate(patient.dischargeDate)}</span>
        </div>
      </div>

      <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '8px', color: '#0d9488', fontSize: '12px', fontWeight: 600 }}>
        <ShieldCheck size={15} />
        <span>Verified Hospital Patient Record</span>
      </div>
    </div>
  );
}
