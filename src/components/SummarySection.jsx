export default function SummarySection({ title, icon, children, tone }) {
  return (
    <div className="card card-pad" style={{ marginBottom: 18 }}>
      <div className="section-title">
        {icon && <span>{icon}</span>}
        {title}
      </div>
      <div className={tone === 'warning' ? 'warning-box' : ''}>{children}</div>
    </div>
  );
}
