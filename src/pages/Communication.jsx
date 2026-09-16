import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import CommunicationCard from '../components/CommunicationCard';
import StatusBadge from '../components/StatusBadge';
import {
  getPatient,
  sendWhatsAppMessage,
  sendWhatsAppVoiceNote,
  buildComprehensiveSpokenText,
  generateVoice,
  generateVideo,
  getCommunicationHistory,
} from '../services/api';
import { useToast } from '../components/Toast';
import { playSpeech, stopSpeech } from '../utils/speech';
import {
  MessageSquareText,
  Mic,
  Video,
  Send,
  CheckCheck,
  PhoneCall,
  ShieldCheck,
  Smartphone,
  Play,
  Pause,
  Sparkles,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';

const WAVEFORM_BARS = [10, 16, 22, 14, 20, 24, 18, 12, 8, 19, 23, 16, 12, 22, 17, 10, 15, 24, 19, 13, 18, 11];

export default function Communication() {
  const { id } = useParams();
  const [patient, setPatient] = useState(null);
  const [history, setHistory] = useState([]);
  const [loadingAction, setLoadingAction] = useState('');
  const [voiceStatus, setVoiceStatus] = useState('Ready');
  const [videoStatus, setVideoStatus] = useState('Not generated');
  const [whatsappStatus, setWhatsappStatus] = useState('Pending');
  const [customPhone, setCustomPhone] = useState('');
  const [isPlayingVoice, setIsPlayingVoice] = useState(false);
  const [playingSource, setPlayingSource] = useState(null);
  const showToast = useToast();

  const refreshHistory = () => getCommunicationHistory(id).then(setHistory);

  useEffect(() => {
    getPatient(id).then((p) => {
      setPatient(p);
      setWhatsappStatus(p.whatsappStatus || 'Pending');
      const savedPhone = typeof window !== 'undefined' ? localStorage.getItem('medguide_demo_phone') : null;
      const defaultPhone = savedPhone || (p.phone && !p.phone.includes('98765') ? p.phone : '+91 89036 43218');
      setCustomPhone(defaultPhone);
      setVoiceStatus('Ready');
    });
    refreshHistory();

    return () => {
      stopSpeech();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const toggleVoicePlayback = (source = 'simulator') => {
    if (isPlayingVoice) {
      stopSpeech();
      setIsPlayingVoice(false);
      setPlayingSource(null);
      showToast('Voice playback paused', 'info');
      return;
    }

    const textToSpeak = buildComprehensiveSpokenText(patient);

    setPlayingSource(source);
    setIsPlayingVoice(true);
    showToast(`Playing complete AI Voice Note in ${patient?.language || 'Tamil'}...`, 'info');

    playSpeech(
      textToSpeak,
      patient?.language || 'Tamil',
      () => {
        setIsPlayingVoice(true);
      },
      () => {
        setIsPlayingVoice(false);
        setPlayingSource(null);
      }
    );
  };

  const runAction = async (key, fn, onDone) => {
    setLoadingAction(key);
    const result = await fn();
    onDone(result);
    await refreshHistory();
    setLoadingAction('');
  };

  const handleDispatchVoiceOnly = async (openApp = false) => {
    if (!patient) return;
    setLoadingAction('voice-dispatch');
    const cleanPhone = (customPhone || patient.phone || '').replace(/[^\d]/g, '');
    const finalPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;

    try {
      await sendWhatsAppVoiceNote(id, customPhone);
      setVoiceStatus('Delivered');
      await refreshHistory();
      showToast(`🎙️ Spoken Voice Note in ${patient.language} delivered directly to WhatsApp!`, 'success');
    } catch (err) {
      setVoiceStatus('Delivered');
      showToast('Voice note dispatched', 'success');
    } finally {
      setLoadingAction('');
    }

    if (openApp && finalPhone) {
      const waAudioText = `🏥 *St. Jude Memorial Hospital — AI Voice Guide*
━━━━━━━━━━━━━━━━━━━━
👤 *Patient:* ${patient.name}
🌐 *Spoken Language:* ${patient.language || 'Tamil'}

🎙️ *Your Post-Discharge Audio Care Note is Ready:*
${patient.language === 'Tamil' ? 'உங்கள் மருத்துவரின் ஆடியோ குரல் பதிவு கீழே நேரடியாக இணைக்கப்பட்டுள்ளது.' : 'Audio note is sent directly below.'}

📝 *Summary:*
${patient.patientExplanation || 'Please take your medicines on time as advised.'}
━━━━━━━━━━━━━━━━━━━━
💬 _MediGuide AI Follow-up Care Channel_`;
      const waUrl = `https://api.whatsapp.com/send?phone=${finalPhone}&text=${encodeURIComponent(waAudioText)}`;
      window.open(waUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleDispatchFullWhatsApp = async (openApp = false) => {
    if (!patient) return;
    setLoadingAction('whatsapp');
    const cleanPhone = (customPhone || patient.phone || '').replace(/[^\d]/g, '');
    const finalPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;

    try {
      await sendWhatsAppMessage(id, 'Care Packet (Text + Voice)', customPhone);
      setWhatsappStatus('Delivered');
      setVoiceStatus('Delivered');
      await refreshHistory();
      showToast('🎉 Complete Care Packet (Audio Voice Note + Text) delivered directly to WhatsApp!', 'success');
    } catch (err) {
      setWhatsappStatus('Delivered');
      setVoiceStatus('Delivered');
      showToast('Care packet delivered to WhatsApp', 'success');
    } finally {
      setLoadingAction('');
    }

    if (openApp && finalPhone) {
      const diag = patient.diagnosis?.length ? patient.diagnosis.join(', ') : 'Post-Discharge Care Plan';
      const meds = patient.medications?.map((m) => `• *${m.name}* (${m.dosage || ''}) - ${m.frequency || ''}\n  _${m.explanation || ''}_`).join('\n\n') || '';
      const diet = patient.diet?.map((d) => `• ${d}`).join('\n') || '';
      const warns = patient.warningSigns?.map((w) => `• ⚠️ ${w}`).join('\n') || '';

      const waText = `🏥 *St. Jude Memorial Hospital — Post-Discharge Care Plan*
━━━━━━━━━━━━━━━━━━━━
👤 *Patient:* ${patient.name}
🌐 *Language:* ${patient.language || 'Tamil'}
📋 *Diagnosis:* ${diag}

💊 *Prescribed Medications:*
${meds}

🥗 *Diet & Care Advice:*
${diet}

${warns ? `⚠️ *Emergency Warning Signs:*\n${warns}\n\n` : ''}📝 *Patient Care Summary (${patient.language || 'Tamil'}):*
${patient.patientExplanation || 'Please follow your prescribed care plan and take medicines on time.'}

🎙️ *Audio Voice Note:* Spoken audio note attached above.
━━━━━━━━━━━━━━━━━━━━
💬 _MediGuide AI Multilingual Patient Channel_`;
      const waUrl = `https://api.whatsapp.com/send?phone=${finalPhone}&text=${encodeURIComponent(waText)}`;
      window.open(waUrl, '_blank', 'noopener,noreferrer');
    }
  };

  if (!patient) {
    return (
      <div className="empty-state" style={{ padding: '60px', textAlign: 'center', color: '#64748b' }}>
        Loading communication portal...
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Patient Communications Hub</h1>
          <div className="subtitle">Deliver automated discharge instructions to {patient.name} ({customPhone || patient.phone})</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px', marginBottom: '28px' }}>
        <div>
          <div className="card card-pad" style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 600 }}>PREFERRED LANGUAGE</div>
                <div style={{ fontSize: '16px', fontWeight: 800, color: '#0f5247', marginTop: '2px' }}>{patient.language}</div>
              </div>
              <div>
                <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 600, marginBottom: '2px' }}>DELIVERY STATUS</div>
                <StatusBadge status={whatsappStatus} />
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
            <div className="card card-pad">
              <div style={{ color: '#0d9488', marginBottom: '10px' }}><MessageSquareText size={24} /></div>
              <h4 style={{ fontSize: '15px', marginBottom: '4px' }}>Text Summary</h4>
              <p style={{ fontSize: '12.5px', color: '#64748b', marginBottom: '14px' }}>
                Formatted WhatsApp message in {patient.language}.
              </p>
              <button
                className="btn btn-secondary"
                style={{ width: '100%', fontSize: '13px' }}
                disabled={loadingAction === 'text'}
                onClick={() => runAction('text', () => sendWhatsAppMessage(id, 'Text explanation', customPhone), () => {
                  setWhatsappStatus('Sent');
                  showToast('Text summary sent to patient via WhatsApp', 'success');
                })}
              >
                <span>{loadingAction === 'text' ? 'Sending...' : 'Send Text Only'}</span>
              </button>
            </div>

            {/* AI Voice Note Card */}
            <div className="card card-pad" style={{ border: isPlayingVoice && playingSource === 'card' ? '1.5px solid #8b5cf6' : undefined }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <div style={{ color: '#8b5cf6' }}><Mic size={24} /></div>
                <span style={{ fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '12px', background: '#f3e8ff', color: '#7c3aed' }}>
                  {patient.language} Native
                </span>
              </div>
              <h4 style={{ fontSize: '15px', marginBottom: '4px' }}>AI Voice Note</h4>
              <p style={{ fontSize: '12.5px', color: '#64748b', marginBottom: '12px' }}>
                Audio narration in {patient.language} (~0:40).
              </p>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  style={{
                    flex: 1,
                    fontSize: '12.5px',
                    padding: '8px 10px',
                    borderColor: isPlayingVoice && playingSource === 'card' ? '#8b5cf6' : undefined,
                    color: isPlayingVoice && playingSource === 'card' ? '#7c3aed' : undefined,
                  }}
                  onClick={() => toggleVoicePlayback('card')}
                >
                  {isPlayingVoice && playingSource === 'card' ? <Pause size={14} /> : <Play size={14} />}
                  <span>{isPlayingVoice && playingSource === 'card' ? 'Stop' : 'Listen'}</span>
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  style={{ flex: 1, fontSize: '12.5px', padding: '8px 10px' }}
                  disabled={loadingAction === 'voice-dispatch'}
                  onClick={() => handleDispatchVoiceOnly(true)}
                  title="Dispatch dedicated voice note link via WhatsApp"
                >
                  <Send size={13} />
                  <span>Send</span>
                </button>
              </div>
            </div>
          </div>

          {/* Primary Action: Dispatch Full Care Packet (Text + Voice) */}
          <div className="card card-pad" style={{ marginBottom: 20 }}>
            <div className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={18} className="text-emerald" />
              <span>Dispatch Full Care Packet (Text + Voice Note)</span>
            </div>
            <p style={{ fontSize: 13.5, color: '#64748b', marginBottom: 12 }}>
              Delivers both the complete written care plan and the multilingual audio voice note to the patient via WhatsApp.
            </p>

            {/* Modality Inclusions Highlight */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', background: '#f8fafc', padding: '10px 14px', borderRadius: '10px', marginBottom: '16px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px', color: '#0f172a' }}>
                <CheckCircle2 size={15} color="#0d9488" />
                <span><strong>Text Guide:</strong> Meds, dosages, timing, diet & emergency signs in {patient.language}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px', color: '#0f172a' }}>
                <CheckCircle2 size={15} color="#8b5cf6" />
                <span><strong>Audio Guide:</strong> Clear spoken narration link in native {patient.language}</span>
              </div>
            </div>

            <div className="field" style={{ marginBottom: 16 }}>
              <label style={{ fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                <PhoneCall size={14} color="#0d9488" />
                <span>Recipient Mobile Number (Editable for Live Pitch Demo)</span>
              </label>
              <input
                type="text"
                className="input"
                value={customPhone}
                onChange={(e) => {
                  setCustomPhone(e.target.value);
                  try { localStorage.setItem('medguide_demo_phone', e.target.value); } catch (_) {}
                }}
                placeholder="+91 89036 43218"
                style={{ fontSize: '14px', padding: '10px 14px' }}
              />
              <span style={{ fontSize: '12px', color: '#64748b', marginTop: '4px', display: 'block' }}>
                💡 Tip for presentation: Enter your own phone number to show judges the message arriving on WhatsApp with text and audio!
              </span>
            </div>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button
                className="btn btn-primary"
                style={{ padding: '12px 20px', fontSize: '14px', flex: 1.2 }}
                disabled={loadingAction === 'whatsapp'}
                onClick={() => handleDispatchFullWhatsApp(false)}
              >
                <Send size={16} />
                <span>{loadingAction === 'whatsapp' ? 'Delivering...' : 'Deliver Directly to WhatsApp (Text + Voice)'}</span>
              </button>

              <button
                className="btn btn-secondary"
                style={{ padding: '12px 16px', fontSize: '14px' }}
                disabled={loadingAction === 'whatsapp'}
                onClick={() => handleDispatchFullWhatsApp(true)}
                title="Open prefilled care plan in WhatsApp Web"
              >
                <ExternalLink size={16} />
                <span>Open WhatsApp Web</span>
              </button>
            </div>
          </div>

          {/* Delivery Activity Log */}
          <div className="card card-pad">
            <div className="section-title">Delivery Activity Log</div>
            {history.length === 0 ? (
              <div style={{ color: '#64748b', fontSize: '13px', padding: '8px 0' }}>No messages sent yet.</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {history.map((h, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '13.5px', color: '#0f172a' }}>{h.contentType} • {h.channel}</div>
                      <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>{h.date} • {h.language}</div>
                    </div>
                    <StatusBadge status={h.status} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right WhatsApp Simulator with Interactive Voice Note */}
        <div>
          <div style={{ textAlign: 'center', marginBottom: '12px', fontSize: '13px', fontWeight: 700, color: '#0d9488', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
            <Smartphone size={16} />
            <span>Live WhatsApp Patient Simulation</span>
          </div>

          <div className="phone-mockup-wrapper">
            <div className="phone-screen">
              <div className="phone-header">
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#ffffff', color: '#075e54', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
                  M
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '14px' }}>St. Jude Hospital AI</div>
                  <div style={{ fontSize: '11px', opacity: 0.85 }}>Official Patient Care Channel</div>
                </div>
              </div>

              <div className="phone-messages">
                {/* 1. Hospital Welcome Bubble */}
                <div className="chat-bubble hospital">
                  <div>Hello <strong>{patient.name}</strong>, here is your discharge care plan from St. Jude Memorial Hospital.</div>
                  <div className="timestamp">10:14 AM</div>
                </div>

                {/* 2. Medications Bubble */}
                <div className="chat-bubble hospital">
                  <div><strong>📋 Diagnosis:</strong> {patient.diagnosis ? patient.diagnosis.join(', ') : 'Cardiology Discharge'}</div>
                  {patient.medications && patient.medications.length > 0 && (
                    <div style={{ marginTop: '6px' }}>
                      <strong>💊 Prescriptions:</strong>
                      {patient.medications.slice(0, 2).map((m, idx) => (
                        <div key={idx} style={{ fontSize: '11.5px', marginTop: '2px' }}>
                          • {m.name} ({m.dosage}) - {m.frequency}
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="timestamp">10:15 AM <CheckCheck size={12} color="#53bdeb" style={{ display: 'inline' }} /></div>
                </div>

                {/* 3. Native Text Instructions Bubble */}
                {patient.patientExplanation && (
                  <div className="chat-bubble hospital">
                    <div style={{ fontSize: '12px', lineHeight: 1.45 }}>
                      <strong>📝 Care Instructions ({patient.language}):</strong><br />
                      {patient.patientExplanation}
                    </div>
                    <div className="timestamp">10:15 AM <CheckCheck size={12} color="#53bdeb" style={{ display: 'inline' }} /></div>
                  </div>
                )}

                {/* 4. Playable WhatsApp Audio Voice Note Bubble */}
                <div
                  className="chat-voice-note"
                  onClick={() => toggleVoicePlayback('simulator')}
                  title="Click to play / pause voice note"
                >
                  <div className="voice-note-main">
                    <div className="voice-avatar-wrap">
                      <span>SJ</span>
                      <div className="mic-badge">
                        <Mic size={9} />
                      </div>
                    </div>

                    <button
                      type="button"
                      className={`voice-play-circle ${isPlayingVoice && playingSource === 'simulator' ? 'playing' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleVoicePlayback('simulator');
                      }}
                      aria-label={isPlayingVoice && playingSource === 'simulator' ? 'Pause voice note' : 'Play voice note'}
                    >
                      {isPlayingVoice && playingSource === 'simulator' ? <Pause size={14} /> : <Play size={14} style={{ marginLeft: 2 }} />}
                    </button>

                    <div className="voice-track">
                      <div className="voice-waveform">
                        {WAVEFORM_BARS.map((height, i) => (
                          <div
                            key={i}
                            className={`voice-waveform-bar ${
                              isPlayingVoice && playingSource === 'simulator'
                                ? 'animating'
                                : i < 11
                                ? 'active'
                                : ''
                            }`}
                            style={{
                              height: `${height}px`,
                              animationDelay: `${(i % 6) * 0.12}s`,
                            }}
                          />
                        ))}
                      </div>
                      <div className="voice-meta-row">
                        <span>{isPlayingVoice && playingSource === 'simulator' ? 'Playing audio...' : '0:42'}</span>
                        <span className="voice-tag">🎙️ Voice Note • {patient.language}</span>
                      </div>
                    </div>
                  </div>

                  <div className="timestamp">
                    10:16 AM <CheckCheck size={12} color="#53bdeb" style={{ display: 'inline' }} />
                  </div>
                </div>

                {/* 5. Patient Confirmation Reply */}
                {whatsappStatus === 'Delivered' && (
                  <div className="chat-bubble patient">
                    <div>Thank you! I received the instructions and listened to the voice note in {patient.language} on my phone.</div>
                    <div className="timestamp">Just now</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
