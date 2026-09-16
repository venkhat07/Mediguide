import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LanguageSelector from '../components/LanguageSelector';
import { createPatient } from '../services/api';
import { useToast } from '../components/Toast';

export default function AddPatient() {
  const [form, setForm] = useState({ name: '', patientId: '', phone: '', language: '', dischargeDate: '' });
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const showToast = useToast();

  const update = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const patient = await createPatient(form);
      showToast('Patient created successfully', 'success');
      navigate(`/upload?patientId=${patient.id}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Add Patient</h1>
          <div className="subtitle">Register a patient to begin post-discharge education</div>
        </div>
      </div>

      <div className="card card-pad" style={{ maxWidth: 560 }}>
        <form onSubmit={handleSubmit}>
          <div className="two-col-form">
            <div className="field">
              <label>Patient Name</label>
              <input className="input" required value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="e.g. Alex Kumar" />
            </div>
            <div className="field">
              <label>Patient ID</label>
              <input className="input" value={form.patientId} onChange={(e) => update('patientId', e.target.value)} placeholder="Auto-generated if left blank" />
            </div>
          </div>

          <div className="two-col-form">
            <div className="field">
              <label>Phone Number</label>
              <input className="input" required value={form.phone} onChange={(e) => update('phone', e.target.value)} placeholder="+91 XXXXX XXXXX" />
            </div>
            <div className="field">
              <label>Discharge Date</label>
              <input className="input" type="date" required value={form.dischargeDate} onChange={(e) => update('dischargeDate', e.target.value)} />
            </div>
          </div>

          <LanguageSelector value={form.language} onChange={(v) => update('language', v)} />

          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? <span className="spinner" /> : null}
            Create Patient
          </button>
        </form>
      </div>
    </div>
  );
}
