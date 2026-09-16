import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/api';
import { Stethoscope, ShieldCheck, HeartPulse, Sparkles, MessageSquare, ArrowRight } from 'lucide-react';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const session = await login(email || 'dr.jenkins@stjudehospital.org', password || 'demo123');
      onLogin(session);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Unable to sign in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePreset = (presetEmail, presetName) => {
    setEmail(presetEmail);
    setPassword('demo123');
  };

  return (
    <div className="login-screen">
      <div className="login-container">
        {/* Left Hero Column */}
        <div className="login-hero-side">
          <div className="hero-logo">
            <Stethoscope size={20} />
            <span style={{ fontWeight: 700, fontSize: '15px' }}>MediGuide AI Clinical Platform</span>
          </div>

          <h1>Transform Post-Discharge Patient Care with AI</h1>
          <p>
            Seamlessly translate complex medical discharge summaries into simple, multi-lingual patient instructions delivered via automated WhatsApp & SMS messaging.
          </p>

          <div className="login-feature-list">
            <div className="login-feature-item">
              <div className="login-feature-icon">
                <Sparkles size={18} />
              </div>
              <span>Automatic medical jargon simplification & multi-language translation</span>
            </div>
            <div className="login-feature-item">
              <div className="login-feature-icon">
                <MessageSquare size={18} />
              </div>
              <span>Direct SMS & WhatsApp message delivery with read receipts</span>
            </div>
            <div className="login-feature-item">
              <div className="login-feature-icon">
                <ShieldCheck size={18} />
              </div>
              <span>HIPAA-compliant, EHR-compatible clinical workflow platform</span>
            </div>
          </div>
        </div>

        {/* Right Form Card */}
        <div className="login-card-box">
          <div className="login-brand-header">
            <h2 className="title">Hospital Staff Portal</h2>
            <div className="subtitle">Sign in to manage patient discharge summaries</div>
          </div>

          <div className="preset-login-bar">
            <div className="hint-txt">Quick Demo Sign-In Presets</div>
            <div className="preset-btns">
              <button 
                type="button" 
                className="preset-btn"
                onClick={() => handlePreset('dr.jenkins@stjudehospital.org', 'Dr. Sarah Jenkins')}
              >
                Chief Clinician
              </button>
              <button 
                type="button" 
                className="preset-btn"
                onClick={() => handlePreset('nursery.lead@stjudehospital.org', 'Head Nurse Marcus')}
              >
                Discharge Nurse
              </button>
            </div>
          </div>

          {error && (
            <div className="status-badge badge-danger" style={{ width: '100%', padding: '10px', marginBottom: '16px', borderRadius: '8px' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="field">
              <label>Hospital Email Address</label>
              <input
                className="input"
                type="email"
                placeholder="clinician@hospital.org"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="field">
              <label>Security Password</label>
              <input
                className="input"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary btn-block" style={{ padding: '12px', fontSize: '15px' }} disabled={loading}>
              <span>{loading ? 'Authenticating...' : 'Sign In to Hospital Portal'}</span>
              {!loading && <ArrowRight size={16} />}
            </button>
          </form>

          <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#64748b', fontSize: '12px' }}>
            <ShieldCheck size={14} color="#0d9488" />
            <span>256-Bit Encrypted • HIPAA Validated • EHR Sync</span>
          </div>
        </div>
      </div>
    </div>
  );
}
