import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  colorScheme = 'indigo',
  to,
  onClick,
}) {
  const schemes = {
    indigo: {
      iconBg: 'bg-indigo-50 text-indigo-600 border border-indigo-100',
      hoverBorder: 'hover:border-indigo-300',
      hintColor: 'group-hover:text-indigo-600',
    },
    emerald: {
      iconBg: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
      hoverBorder: 'hover:border-emerald-300',
      hintColor: 'group-hover:text-emerald-600',
    },
    amber: {
      iconBg: 'bg-amber-50 text-amber-600 border border-amber-100',
      hoverBorder: 'hover:border-amber-300',
      hintColor: 'group-hover:text-amber-600',
    },
    slate: {
      iconBg: 'bg-slate-100 text-slate-600 border border-slate-200',
      hoverBorder: 'hover:border-slate-300',
      hintColor: 'group-hover:text-slate-700',
    },
    rose: {
      iconBg: 'bg-rose-50 text-rose-600 border border-rose-100',
      hoverBorder: 'hover:border-rose-300',
      hintColor: 'group-hover:text-rose-600',
    },
  };

  const scheme = schemes[colorScheme] || schemes.indigo;
  const isInteractive = Boolean(to || onClick);

  const cardContent = (
    <div
      className={`bg-white rounded-card border border-slate-200/90 p-5 shadow-card transition-all duration-200 flex flex-col justify-between h-full ${
        isInteractive
          ? `cursor-pointer hover:shadow-card-hover hover:-translate-y-0.5 hover:bg-slate-50/40 ${scheme.hoverBorder} focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus:outline-none`
          : ''
      }`}
    >
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            {title}
          </span>
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${scheme.iconBg}`}
          >
            <Icon className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            {value ?? 0}
          </span>
        </div>
        <p className="text-xs text-slate-500 font-medium">{description}</p>
      </div>

      {isInteractive && (
        <div className="mt-3.5 pt-2.5 border-t border-slate-100/90 flex items-center justify-between text-xs font-semibold text-slate-400 group-hover:text-slate-700 transition-colors">
          <span className={`inline-flex items-center gap-1 ${scheme.hintColor} transition-colors`}>
            View tickets
          </span>
          <ArrowRight className={`w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform ${scheme.hintColor}`} />
        </div>
      )}
    </div>
  );

  if (to) {
    return (
      <Link
        to={to}
        aria-label={`${title}: ${value ?? 0} tickets. ${description}. Click to view tickets.`}
        className="block group rounded-card focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus:outline-none"
      >
        {cardContent}
      </Link>
    );
  }

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-label={`${title}: ${value ?? 0} tickets. ${description}. Click to view tickets.`}
        className="w-full text-left group rounded-card focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus:outline-none"
      >
        {cardContent}
      </button>
    );
  }

  return cardContent;
}
