import React from 'react';
import { RotateCcw, ArrowUpDown, X, AlertCircle } from 'lucide-react';
import { STATUS_OPTIONS, PRIORITY_OPTIONS, SORT_OPTIONS } from '../../constants';

export function FilterBar({
  status,
  onStatusChange,
  priority,
  onPriorityChange,
  sort,
  onSortChange,
  needsAttention,
  onClearNeedsAttention,
  onResetFilters,
  hasActiveFilters,
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        {/* Status Filter */}
        <div className="flex items-center gap-1.5">
          <label htmlFor="status-filter" className="text-xs font-medium text-slate-500 hidden sm:inline">
            Status:
          </label>
          <select
            id="status-filter"
            value={status}
            onChange={(e) => onStatusChange(e.target.value)}
            className="py-1.5 px-3 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 shadow-subtle hover:border-slate-300 focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500"
          >
            <option value="">All Statuses</option>
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Priority Filter */}
        <div className="flex items-center gap-1.5">
          <label htmlFor="priority-filter" className="text-xs font-medium text-slate-500 hidden sm:inline">
            Priority:
          </label>
          <select
            id="priority-filter"
            value={priority}
            onChange={(e) => onPriorityChange(e.target.value)}
            className="py-1.5 px-3 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 shadow-subtle hover:border-slate-300 focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500"
          >
            <option value="">All Priorities</option>
            {PRIORITY_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Active Needs Attention chip */}
        {needsAttention && (
          <span className="inline-flex items-center gap-1.5 py-1 px-2.5 rounded-lg text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200 shadow-xs">
            <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
            <span>Needs Attention (&gt;24h)</span>
            {onClearNeedsAttention && (
              <button
                type="button"
                onClick={onClearNeedsAttention}
                className="hover:text-amber-950 p-0.5 rounded transition-colors"
                title="Remove Needs Attention filter"
                aria-label="Remove Needs Attention filter"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </span>
        )}

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <button
            onClick={onResetFilters}
            className="inline-flex items-center gap-1.5 py-1.5 px-2.5 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition-colors focus-visible:ring-2 focus-visible:ring-brand-500 focus:outline-none"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear Filters</span>
          </button>
        )}
      </div>

      {/* Sort Select */}
      <div className="flex items-center gap-1.5 ml-auto">
        <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
        <label htmlFor="sort-select" className="text-xs font-medium text-slate-500 hidden sm:inline">
          Sort:
        </label>
        <select
          id="sort-select"
          value={sort}
          onChange={(e) => onSortChange(e.target.value)}
          className="py-1.5 px-3 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 shadow-subtle hover:border-slate-300 focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
