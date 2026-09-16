import { useState } from 'react';
import LanguageSelector from '../components/LanguageSelector';
import { useToast } from '../components/Toast';
import { Settings as SettingsIcon, Building2, Globe, Bell, Smartphone, User, Save, ShieldCheck } from 'lucide-react';

export default function Settings() {
  const [defaultLanguage, setDefaultLanguage] = useState('English');
  const [notifyEmail, setNotifyEmail] = useState(true);
  const [notifyWhatsapp, setNotifyWhatsapp] = useState(true);
  const showToast = useToast();

  const handleSave = (e) => {
    e.preventDefault();
    showToast('Portal settings and preferences saved', 'success');
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div className="page-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
            <SettingsIcon size={24} className="text-emerald" />
            <h1>Portal & System Settings</h1>
          </div>
          <div className="subtitle">Configure hospital profile, language defaults, and WhatsApp API endpoints</div>
        </div>
      </div>

      <form onSubmit={handleSave}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div className="card card-pad">
            <div className="section-title">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Building2 size={18} className="text-emerald" />
                <span>Hospital Center Profile</span>
              </div>
            </div>
            <div className="field">
              <label>Hospital Name</label>
              <input className="input" defaultValue="St. Jude Memorial Hospital" />
            </div>
            <div className="field">
              <label>Clinical Department Email</label>
              <input className="input" defaultValue="discharge@stjudehospital.org" type="email" />
            </div>
            <div className="field">
              <label>Department Phone Helpline</label>
              <input className="input" defaultValue="+1 (800) 555-0199" />
            </div>
          </div>

          <div className="card card-pad">
            <div className="section-title">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Globe size={18} className="text-emerald" />
                <span>Default Language Settings</span>
              </div>
            </div>
            <LanguageSelector value={defaultLanguage} onChange={setDefaultLanguage} label="Default Patient Communication Language" />
            <div style={{ fontSize: '12.5px', color: '#64748b', marginTop: '8px' }}>
              Used automatically whenever a patient record lacks an explicit language preference.
            </div>
          </div>

          <div className="card card-pad">
            <div className="section-title">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Bell size={18} className="text-emerald" />
                <span>Alerts & Notification Rules</span>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13.5, cursor: 'pointer' }}>
                <input type="checkbox" checked={notifyEmail} onChange={(e) => setNotifyEmail(e.target.checked)} />
                <span>Email clinician when AI summary processing completes</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13.5, cursor: 'pointer' }}>
                <input type="checkbox" checked={notifyWhatsapp} onChange={(e) => setNotifyWhatsapp(e.target.checked)} />
                <span>Alert on WhatsApp patient message delivery failure</span>
              </label>
            </div>
          </div>

          <div className="card card-pad">
            <div className="section-title">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Smartphone size={18} className="text-emerald" />
                <span>WhatsApp Gateway Config</span>
              </div>
            </div>
            <div className="field">
              <label>WhatsApp Business Account ID</label>
              <input className="input" placeholder="WABA-99482104" disabled />
            </div>
            <div className="field">
              <label>API Gateway Endpoint</label>
              <input className="input" placeholder="https://api.mediguide.ai/v1/whatsapp" disabled />
            </div>
            <div style={{ fontSize: '12px', color: '#64748b' }}>
              Connected via secure HIPAA-compliant AI messaging relay.
            </div>
          </div>
        </div>

        <div style={{ marginTop: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button type="submit" className="btn btn-primary" style={{ padding: '12px 24px', fontSize: '15px' }}>
            <Save size={16} />
            <span>Save System Settings</span>
          </button>
          <span style={{ fontSize: '12.5px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ShieldCheck size={14} color="#0d9488" />
            Changes apply across all hospital staff accounts.
          </span>
        </div>
      </form>
    </div>
  );
}
