import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { StatusBadge } from './StatusBadge';
import { PriorityBadge } from './PriorityBadge';
import { TableRowSkeleton } from '../ui/Skeleton';
import { EmptyState } from '../ui/EmptyState';
import { formatDate, getInitials, getAvatarColor } from '../../utils/formatters';

export function TicketTable({
  tickets = [],
  loading = false,
  emptyStateTitle = 'No tickets found',
  emptyStateDescription = 'Create your first support ticket to get started.',
  onEmptyAction,
  emptyActionLabel,
  secondaryActionLabel,
  onSecondaryAction,
}) {
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="bg-white rounded-card border border-slate-200/90 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50/75 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th className="py-3.5 px-5">Ticket ID</th>
                <th className="py-3.5 px-5">Customer</th>
                <th className="py-3.5 px-5">Issue</th>
                <th className="py-3.5 px-5">Priority</th>
                <th className="py-3.5 px-5">Status</th>
                <th className="py-3.5 px-5">Created</th>
                <th className="py-3.5 px-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 5 }).map((_, i) => (
                <TableRowSkeleton key={i} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (tickets.length === 0) {
    return (
      <EmptyState
        title={emptyStateTitle}
        description={emptyStateDescription}
        actionLabel={emptyActionLabel}
        onAction={onEmptyAction}
        secondaryActionLabel={secondaryActionLabel}
        onSecondaryAction={onSecondaryAction}
      />
    );
  }

  return (
    <div className="bg-white rounded-card border border-slate-200/90 shadow-card overflow-hidden">
      <div className="sm:hidden divide-y divide-slate-100">
        {tickets.map((ticket) => (
          <div
            key={ticket.ticket_id}
            onClick={() => navigate(`/tickets/${ticket.ticket_id}`)}
            className="p-4 hover:bg-slate-50 active:bg-slate-100 cursor-pointer transition-colors space-y-2.5"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                {ticket.ticket_id}
              </span>
              <div className="flex items-center gap-1.5">
                <PriorityBadge priority={ticket.priority} />
                <StatusBadge status={ticket.status} />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <h4 className="text-sm font-semibold text-slate-900 line-clamp-1">
                  {ticket.subject}
                </h4>
                {ticket.order_reference && (
                  <span className="font-mono text-[10px] font-semibold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100">
                    {ticket.order_reference}
                  </span>
                )}
              </div>
              <p
                className="text-xs text-slate-500 line-clamp-2 mt-0.5"
                title={ticket.description}
              >
                {ticket.description}
              </p>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
              <div className="flex items-center gap-2">
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${getAvatarColor(
                    ticket.customer_name
                  )}`}
                >
                  {getInitials(ticket.customer_name)}
                </div>
                <span className="font-medium truncate max-w-[130px]">
                  {ticket.customer_name}
                </span>
              </div>
              <span>{formatDate(ticket.created_at)}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50/75 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-100">
            <tr>
              <th className="py-3.5 px-5">Ticket ID</th>
              <th className="py-3.5 px-5">Customer</th>
              <th className="py-3.5 px-5">Issue</th>
              <th className="py-3.5 px-5">Priority</th>
              <th className="py-3.5 px-5">Status</th>
              <th className="py-3.5 px-5">Created</th>
              <th className="py-3.5 px-5 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {tickets.map((ticket) => (
              <tr
                key={ticket.ticket_id}
                onClick={() => navigate(`/tickets/${ticket.ticket_id}`)}
                className="hover:bg-slate-50/80 cursor-pointer transition-colors group"
              >
                <td className="py-3.5 px-5 font-mono text-xs font-semibold text-slate-800 whitespace-nowrap">
                  {ticket.ticket_id}
                </td>
                <td className="py-3.5 px-5">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${getAvatarColor(
                        ticket.customer_name
                      )}`}
                    >
                      {getInitials(ticket.customer_name)}
                    </div>
                    <div className="min-w-0">
                      <div className="font-medium text-slate-900 truncate">
                        {ticket.customer_name}
                      </div>
                      <div className="text-xs text-slate-400 truncate">
                        {ticket.customer_email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="py-3.5 px-5 max-w-sm">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-slate-900 truncate">
                      {ticket.subject}
                    </span>
                    {ticket.order_reference && (
                      <span className="font-mono text-[10px] font-semibold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100 shrink-0">
                        {ticket.order_reference}
                      </span>
                    )}
                  </div>
                  <div
                    className="text-xs text-slate-400 truncate mt-0.5"
                    title={ticket.description}
                  >
                    {ticket.description}
                  </div>
                </td>
                <td className="py-3.5 px-5 whitespace-nowrap">
                  <PriorityBadge priority={ticket.priority} />
                </td>
                <td className="py-3.5 px-5 whitespace-nowrap">
                  <StatusBadge status={ticket.status} />
                </td>
                <td className="py-3.5 px-5 whitespace-nowrap text-xs text-slate-500">
                  {formatDate(ticket.created_at)}
                </td>
                <td className="py-3.5 px-5 text-right whitespace-nowrap">
                  <span className="inline-flex items-center text-xs font-medium text-slate-400 group-hover:text-brand-600 transition-colors">
                    <span>View</span>
                    <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
