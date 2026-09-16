export default function ConversationMessage({ message }) {
  const isAI = message.from === 'ai';
  return (
    <div className={`chat-bubble-row ${isAI ? 'from-ai' : 'from-patient'}`}>
      <div style={{ maxWidth: '70%' }}>
        {isAI && <div className="ai-label">AI-assisted response</div>}
        <div className="chat-bubble">{message.text}</div>
        <div className="chat-meta" style={{ textAlign: isAI ? 'right' : 'left' }}>
          {message.time}{message.status ? ` · ${message.status}` : ''}
        </div>
      </div>
    </div>
  );
}
