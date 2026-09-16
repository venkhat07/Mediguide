export default function CommunicationCard({ icon, title, desc, actionLabel, onAction, loading, status }) {
  return (
    <div className="channel-card">
      <div className="channel-icon">{icon}</div>
      <div className="channel-title">{title}</div>
      <div className="channel-desc">{desc}</div>
      {status && <div style={{ fontSize: 12, color: 'var(--color-text-faint)' }}>Status: {status}</div>}
      <button className="btn btn-primary btn-sm" onClick={onAction} disabled={loading}>
        {loading ? <span className="spinner" /> : null}
        {actionLabel}
      </button>
    </div>
  );
}
