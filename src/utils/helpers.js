export function initials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('');
}

export function formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function formatFileSize(bytes) {
  if (!bytes) return '0 KB';
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  return `${(kb / 1024).toFixed(1)} MB`;
}

// Maps a status string to a badge tone used by StatusBadge.
export function statusTone(status) {
  const s = (status || '').toLowerCase();
  if (['completed', 'delivered', 'sent', 'active'].includes(s)) return 'success';
  if (['processing', 'in progress'].includes(s)) return 'info';
  if (['pending', 'not sent'].includes(s)) return 'pending';
  if (['failed', 'error'].includes(s)) return 'danger';
  if (['queued', 'waiting'].includes(s)) return 'warning';
  return 'pending';
}
