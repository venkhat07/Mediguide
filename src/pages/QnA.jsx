import { useEffect, useState } from 'react';
import ConversationMessage from '../components/ConversationMessage';
import { getPatients, getConversation, askPatientQuestion } from '../services/api';
import { HelpCircle, Send, Sparkles, User, MessageSquare } from 'lucide-react';

const SAMPLE_PROMPTS = [
  'Can I take aspirin with my prescribed blood pressure medicine?',
  'When can I resume driving or light exercise after discharge?',
  'What should I do if I experience mild dizziness in the evening?'
];

export default function QnA() {
  const [patients, setPatients] = useState([]);
  const [patientId, setPatientId] = useState('');
  const [messages, setMessages] = useState([]);
  const [question, setQuestion] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    getPatients().then((data) => {
      setPatients(data);
      if (data.length) setPatientId(data[0].id);
    });
  }, []);

  useEffect(() => {
    if (patientId) getConversation(patientId).then(setMessages);
  }, [patientId]);

  const selectedPatient = patients.find((p) => p.id === patientId);

  const handleAskPrompt = (text) => {
    setQuestion(text);
  };

  const handleAsk = async (e) => {
    e?.preventDefault();
    if (!question.trim()) return;
    setSending(true);
    const q = question;
    setQuestion('');
    setMessages((prev) => [...prev, { from: 'patient', text: q, time: 'Just now' }]);
    const aiMsg = await askPatientQuestion(patientId, q);
    setMessages((prev) => [...prev, aiMsg]);
    setSending(false);
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <div className="page-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
            <HelpCircle size={24} className="text-emerald" />
            <h1>Clinical AI Assistant Q&A</h1>
          </div>
          <div className="subtitle">Simulate real-time post-discharge AI conversations with patients</div>
        </div>
      </div>

      <div className="card card-pad" style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="stat-icon-wrapper stat-icon-emerald">
              <User size={20} />
            </div>
            <div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: '#64748b' }}>SELECT PATIENT PROFILE</div>
              <select 
                className="input" 
                style={{ minWidth: '240px', fontWeight: 700, padding: '8px 12px' }} 
                value={patientId} 
                onChange={(e) => setPatientId(e.target.value)}
              >
                {patients.map((p) => (
                  <option key={p.id} value={p.id}>{p.name} (MRN-{p.id})</option>
                ))}
              </select>
            </div>
          </div>

          {selectedPatient && (
            <div style={{ fontSize: '13px', color: '#64748b' }}>
              Language: <strong className="text-emerald">{selectedPatient.language}</strong> • EHR Sync Active
            </div>
          )}
        </div>
      </div>

      <div className="card card-pad">
        <div className="section-title">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MessageSquare size={18} className="text-emerald" />
            <span>Interactive AI Patient Conversation Thread</span>
          </div>
        </div>

        {messages.length === 0 ? (
          <div className="empty-state" style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
            No questions asked by this patient yet. Use the simulation box below to ask a question.
          </div>
        ) : (
          <div className="chat-thread" style={{ padding: '12px 0' }}>
            {messages.map((m, i) => <ConversationMessage message={m} key={i} />)}
          </div>
        )}

        <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', marginBottom: '8px' }}>
            QUICK SAMPLE PATIENT QUESTIONS
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
            {SAMPLE_PROMPTS.map((promptText, idx) => (
              <button 
                key={idx}
                className="sample-chip"
                onClick={() => handleAskPrompt(promptText)}
              >
                <Sparkles size={13} />
                <span>"{promptText}"</span>
              </button>
            ))}
          </div>

          <form onSubmit={handleAsk} style={{ display: 'flex', gap: 12 }}>
            <input
              className="input"
              style={{ fontSize: '14.5px', padding: '12px 16px' }}
              placeholder="Type a patient question to test the AI clinical response engine..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
            <button className="btn btn-primary" style={{ padding: '0 20px' }} disabled={sending}>
              <Send size={16} />
              <span>{sending ? 'Processing...' : 'Ask AI'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
