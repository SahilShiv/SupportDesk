import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertCircle, Clock, ArrowRight, CheckCircle2 } from 'lucide-react';
import { PriorityBadge } from '../tickets/PriorityBadge';
import { formatTicketAge } from '../../utils/formatters';

export function NeedsAttentionSection({ tickets = [], loading = false, totalCount = 0 }) {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-card border border-amber-200/90 shadow-card overflow-hidden">
      <div className="p-5 border-b border-amber-100 bg-amber-50/40 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 border border-amber-200">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-semibold text-slate-900 tracking-tight">
                Needs Attention
              </h2>
              {totalCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
                  {totalCount}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Tickets waiting longer than 24 hours
            </p>
          </div>
        </div>

        {tickets.length > 0 && (
          <Link
            to="/tickets?needsAttention=true"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-800 hover:text-amber-900 bg-white hover:bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200 transition-colors shadow-subtle"
          >
            <span>View all</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>

      {loading ? (
        <div className="p-6 space-y-3">
          <div className="h-10 bg-slate-100 rounded-lg animate-pulse" />
          <div className="h-10 bg-slate-100 rounded-lg animate-pulse" />
          <div className="h-10 bg-slate-100 rounded-lg animate-pulse" />
        </div>
      ) : tickets.length === 0 ? (
        <div className="p-8 text-center bg-white flex flex-col items-center justify-center">
          <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2.5 border border-emerald-100">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-semibold text-slate-900 mb-0.5">All caught up</h3>
          <p className="text-xs text-slate-500 max-w-sm">
            No unresolved tickets currently need attention.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-slate-100">
          {tickets.slice(0, 5).map((ticket) => (
            <div
              key={ticket.ticket_id}
              onClick={() => navigate(`/tickets/${ticket.ticket_id}`)}
              className="p-4 sm:px-5 hover:bg-amber-50/30 cursor-pointer transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
            >
              <div className="flex items-start sm:items-center gap-3 min-w-0">
                <span className="font-mono text-xs font-bold text-slate-800 bg-slate-100 group-hover:bg-amber-100/60 px-2 py-0.5 rounded border border-slate-200 transition-colors shrink-0">
                  {ticket.ticket_id}
                </span>

                <div className="min-w-0">
                  <div className="text-sm font-semibold text-slate-900 truncate group-hover:text-amber-900 transition-colors">
                    {ticket.subject}
                  </div>
                  <div className="text-xs text-slate-500 truncate mt-0.5">
                    {ticket.customer_name}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
                <PriorityBadge priority={ticket.priority} />
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
                  <Clock className="w-3 h-3" />
                  <span>{formatTicketAge(ticket.created_at)}</span>
                </span>
                <span className="text-xs font-medium text-slate-400 group-hover:text-amber-700 transition-colors hidden sm:inline">
                  View →
                </span>
              </div>
            </div>
          ))}

          <div className="p-3 bg-slate-50/60 text-right px-5">
            <Link
              to="/tickets?needsAttention=true"
              className="inline-flex items-center gap-1 text-xs font-semibold text-amber-800 hover:text-amber-900 hover:underline"
            >
              <span>View all unresolved tickets waiting &gt; 24h</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
