import React from 'react';
import { CircleDot, Clock, CheckCircle } from 'lucide-react';
import { STATUS_STYLES } from '../../constants';

export function StatusBadge({ status = 'Open', className = '' }) {
  const config = STATUS_STYLES[status] || STATUS_STYLES.Open;

  const renderIcon = () => {
    switch (status) {
      case 'Open':
        return <CircleDot className="w-3.5 h-3.5 shrink-0 text-emerald-600" />;
      case 'In Progress':
        return <Clock className="w-3.5 h-3.5 shrink-0 text-amber-600" />;
      case 'Closed':
        return <CheckCircle className="w-3.5 h-3.5 shrink-0 text-slate-500" />;
      default:
        return null;
    }
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium tracking-wide transition-colors ${config.badge} ${className}`}
    >
      {renderIcon()}
      <span>{status}</span>
    </span>
  );
}
