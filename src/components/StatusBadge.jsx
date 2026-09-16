import { CheckCircle2, Clock, AlertCircle, Send, CheckCheck } from 'lucide-react';
import { statusTone } from '../utils/helpers';

export default function StatusBadge({ status }) {
  const tone = statusTone(status);
  const normalized = (status || '').toLowerCase();

  let Icon = Clock;
  if (normalized.includes('completed') || normalized.includes('delivered') || normalized.includes('sent')) {
    Icon = CheckCircle2;
  } else if (normalized.includes('pending') || normalized.includes('processing')) {
    Icon = Clock;
  } else if (normalized.includes('failed') || normalized.includes('error')) {
    Icon = AlertCircle;
  } else if (normalized.includes('read')) {
    Icon = CheckCheck;
  }

  return (
    <span className={`status-badge badge-${tone}`}>
      <Icon size={13} />
      <span>{status}</span>
    </span>
  );
}
