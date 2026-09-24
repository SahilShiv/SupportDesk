import React from 'react';
import { Inbox, Plus } from 'lucide-react';
import { LoadingButton } from './LoadingButton';

export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
  className = '',
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center p-8 sm:p-12 text-center bg-white rounded-card border border-slate-200/90 shadow-subtle ${className}`}
    >
      <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mb-4">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-base font-semibold text-slate-900 mb-1.5">{title}</h3>
      <p className="text-sm text-slate-500 max-w-sm mb-6 leading-relaxed">
        {description}
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        {actionLabel && onAction && (
          <LoadingButton variant="primary" onClick={onAction}>
            {actionLabel}
          </LoadingButton>
        )}
        {secondaryActionLabel && onSecondaryAction && (
          <LoadingButton
            variant="secondary"
            icon={Plus}
            onClick={onSecondaryAction}
          >
            {secondaryActionLabel}
          </LoadingButton>
        )}
      </div>
    </div>
  );
}
