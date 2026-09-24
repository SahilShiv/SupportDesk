export const STATUS_OPTIONS = [
  { value: 'Open', label: 'Open' },
  { value: 'In Progress', label: 'In Progress' },
  { value: 'Closed', label: 'Closed' },
];

export const PRIORITY_OPTIONS = [
  { value: 'Low', label: 'Low' },
  { value: 'Medium', label: 'Medium' },
  { value: 'High', label: 'High' },
];

export const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
];

export const STATUS_STYLES = {
  Open: {
    bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    dot: 'bg-emerald-500',
    badge: 'border border-emerald-200 bg-emerald-50 text-emerald-700',
  },
  'In Progress': {
    bg: 'bg-amber-50 text-amber-700 border-amber-200',
    dot: 'bg-amber-500',
    badge: 'border border-amber-200 bg-amber-50 text-amber-700',
  },
  Closed: {
    bg: 'bg-slate-100 text-slate-600 border-slate-200',
    dot: 'bg-slate-400',
    badge: 'border border-slate-200 bg-slate-100 text-slate-600',
  },
};

export const PRIORITY_STYLES = {
  Low: {
    badge: 'border border-slate-200 bg-slate-50 text-slate-600',
    iconColor: 'text-slate-400',
  },
  Medium: {
    badge: 'border border-blue-200 bg-blue-50 text-blue-700',
    iconColor: 'text-blue-500',
  },
  High: {
    badge: 'border border-rose-200 bg-rose-50 text-rose-700',
    iconColor: 'text-rose-500',
  },
};

export const NEEDS_ATTENTION_HOURS = 24;

