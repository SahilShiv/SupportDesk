import React from 'react';
import { Search, X, Loader2 } from 'lucide-react';

export function SearchBar({
  value,
  onChange,
  onClear,
  isLoading = false,
  resultCount = null,
}) {
  return (
    <div className="relative w-full">
      <div className="relative flex items-center">
        <Search className="w-4 h-4 absolute left-3.5 text-slate-400 pointer-events-none" />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search by ticket ID, customer, email or issue..."
          className="w-full pl-10 pr-24 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 shadow-subtle transition-all duration-150 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 focus:outline-none"
        />
        <div className="absolute right-3 flex items-center gap-2">
          {isLoading && (
            <Loader2 className="w-4 h-4 text-brand-500 animate-spin" />
          )}

          {value && (
            <button
              onClick={onClear}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-100 transition-colors"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          {resultCount !== null && (
            <span className="hidden sm:inline-block text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
              {resultCount} {resultCount === 1 ? 'ticket' : 'tickets'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
