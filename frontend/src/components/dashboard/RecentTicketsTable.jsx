import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { StatusBadge } from '../tickets/StatusBadge';
import { PriorityBadge } from '../tickets/PriorityBadge';
import { formatDate, getInitials, getAvatarColor } from '../../utils/formatters';

export function RecentTicketsTable({ tickets = [], loading = false }) {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-card border border-slate-200/90 shadow-card overflow-hidden">
      <div className="p-5 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-slate-900">Recent Tickets</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Latest 5 support requests across all channels
          </p>
        </div>
        <Link
          to="/tickets"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 hover:text-brand-700 transition-colors"
        >
          <span>View all tickets</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {tickets.length === 0 ? (
        <div className="p-8 text-center text-slate-500 text-sm">
          No recent tickets found.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50/75 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th className="py-3.5 px-5">Ticket</th>
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
                  <td className="py-3.5 px-5 font-mono text-xs font-semibold text-slate-800">
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
                  <td className="py-3.5 px-5 max-w-xs">
                    <span className="font-medium text-slate-900 block truncate">
                      {ticket.subject}
                    </span>
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
      )}
    </div>
  );
}
