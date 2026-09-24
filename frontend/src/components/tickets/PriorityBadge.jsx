import React from 'react';
import { ArrowDown, Minus, ArrowUp } from 'lucide-react';
import { PRIORITY_STYLES } from '../../constants';

export function PriorityBadge({ priority = 'Medium', className = '' }) {
  const config = PRIORITY_STYLES[priority] || PRIORITY_STYLES.Medium;

  const renderIcon = () => {
    switch (priority) {
      case 'High':
        return <ArrowUp className="w-3.5 h-3.5 shrink-0 text-rose-600" />;
      case 'Medium':
        return <Minus className="w-3.5 h-3.5 shrink-0 text-blue-600" />;
      case 'Low':
        return <ArrowDown className="w-3.5 h-3.5 shrink-0 text-slate-500" />;
      default:
        return null;
    }
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium tracking-wide transition-colors ${config.badge} ${className}`}
    >
      {renderIcon()}
      <span>{priority}</span>
    </span>
  );
}
