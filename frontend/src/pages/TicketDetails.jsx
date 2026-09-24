import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  ArrowLeft,
  Mail,
  Calendar,
  Clock,
  AlertCircle,
  FileText,
  Package,
} from 'lucide-react';
import { getTicket, updateTicket } from '../services/api';
import { StatusBadge } from '../components/tickets/StatusBadge';
import { PriorityBadge } from '../components/tickets/PriorityBadge';
import { UpdatePanel } from '../components/tickets/UpdatePanel';
import { NotesTimeline } from '../components/tickets/NotesTimeline';
import { DetailsPageSkeleton } from '../components/ui/Skeleton';
import { useToast } from '../components/common/Toast';
import { formatDate, getInitials, getAvatarColor } from '../utils/formatters';

export function TicketDetails() {
  const { ticketId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const toast = useToast();

  const {
    data,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['ticket', ticketId],
    queryFn: () => getTicket(ticketId),
    retry: 1,
  });

  const ticket = data?.data;

  const updateMutation = useMutation({
    mutationFn: (updateData) => updateTicket(ticketId, updateData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ticket', ticketId] });
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
      queryClient.invalidateQueries({ queryKey: ['recentTickets'] });

      toast.success('Ticket updated successfully.');
    },
    onError: (err) => {
      toast.error(err.message || 'Unable to update ticket.');
    },
  });

  const handleSave = (updatePayload, onSuccessCallback) => {
    updateMutation.mutate(updatePayload, {
      onSuccess: () => {
        if (onSuccessCallback) onSuccessCallback();
      },
    });
  };

  if (isLoading) {
    return <DetailsPageSkeleton />;
  }

  if (isError || !ticket) {
    return (
      <div className="max-w-md mx-auto text-center py-16">
        <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-rose-200">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Ticket Not Found</h2>
        <p className="text-sm text-slate-500 mb-6">
          The requested ticket "{ticketId}" does not exist or may have been deleted.
        </p>
        <Link
          to="/tickets"
          className="inline-flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold rounded-xl shadow-sm transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Tickets</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div className="flex items-center gap-3">
          <Link
            to="/tickets"
            className="p-2 text-slate-500 hover:text-slate-900 hover:bg-white rounded-xl border border-slate-200 shadow-subtle transition-colors"
            aria-label="Back to tickets list"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="font-mono text-sm font-bold text-slate-800 bg-slate-100 px-2.5 py-0.5 rounded-lg border border-slate-200">
                {ticket.ticket_id}
              </span>
              <PriorityBadge priority={ticket.priority} />
              <StatusBadge status={ticket.status} />
              {ticket.order_reference && (
                <span className="font-mono text-xs font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-lg border border-indigo-200 flex items-center gap-1 shadow-2xs">
                  <Package className="w-3 h-3 text-indigo-500" />
                  <span>{ticket.order_reference}</span>
                </span>
              )}
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-1.5">
              {ticket.subject}
            </h1>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-card border border-slate-200/90 shadow-card p-6">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 pb-3 border-b border-slate-100">
              <FileText className="w-4 h-4 text-slate-400" />
              <span>Issue Description</span>
            </div>
            <div className="text-sm text-slate-800 leading-relaxed whitespace-pre-wrap">
              {ticket.description}
            </div>
          </div>

          <NotesTimeline notes={ticket.notes || []} />
        </div>

        <div className="space-y-6">
          <UpdatePanel
            ticket={ticket}
            onSave={handleSave}
            isSaving={updateMutation.isPending}
          />

          <div className="bg-white rounded-card border border-slate-200/90 shadow-card p-6">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">
              Customer Information
            </h3>
            <div className="flex items-start gap-3.5 mb-4">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 shadow-sm ${getAvatarColor(
                  ticket.customer_name
                )}`}
              >
                {getInitials(ticket.customer_name)}
              </div>
              <div className="min-w-0">
                <div className="font-semibold text-slate-900 text-sm truncate">
                  {ticket.customer_name}
                </div>
                <div className="text-xs text-slate-500 truncate flex items-center gap-1.5 mt-0.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{ticket.customer_email}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-card border border-slate-200/90 shadow-card p-6 space-y-3">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
              Ticket Details
            </h3>

            {ticket.order_reference && (
              <div className="flex items-center justify-between text-xs py-1 border-b border-slate-100">
                <span className="text-slate-500 font-medium flex items-center gap-1.5">
                  <Package className="w-3.5 h-3.5 text-slate-400" />
                  Order Reference
                </span>
                <span className="font-mono font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                  {ticket.order_reference}
                </span>
              </div>
            )}

            <div className="flex items-center justify-between text-xs py-1 border-b border-slate-100">
              <span className="text-slate-500 font-medium flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                Created
              </span>
              <span className="text-slate-800 font-medium">
                {formatDate(ticket.created_at, true)}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs py-1">
              <span className="text-slate-500 font-medium flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                Last Updated
              </span>
              <span className="text-slate-800 font-medium">
                {formatDate(ticket.updated_at, true)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
