import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, Link } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Send } from 'lucide-react';
import { createTicket } from '../services/api';
import { useToast } from '../components/common/Toast';
import { LoadingButton } from '../components/ui/LoadingButton';
import { PRIORITY_OPTIONS } from '../constants';

const ticketFormSchema = z.object({
  customer_name: z
    .string()
    .trim()
    .min(1, 'Customer name is required')
    .max(100, 'Customer name cannot exceed 100 characters'),
  customer_email: z
    .string()
    .trim()
    .min(1, 'Customer email is required')
    .email('Please enter a valid email address')
    .max(255, 'Email cannot exceed 255 characters'),
  subject: z
    .string()
    .trim()
    .min(1, 'Issue title is required')
    .max(200, 'Issue title cannot exceed 200 characters'),
  description: z
    .string()
    .trim()
    .min(5, 'Issue description must be at least 5 characters')
    .max(5000, 'Description cannot exceed 5000 characters'),
  priority: z.enum(['Low', 'Medium', 'High']).default('Medium'),
});

export function CreateTicket() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const toast = useToast();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(ticketFormSchema),
    defaultValues: {
      customer_name: '',
      customer_email: '',
      subject: '',
      description: '',
      priority: 'Medium',
    },
  });

  const descriptionValue = watch('description', '');

  const createMutation = useMutation({
    mutationFn: createTicket,
    onSuccess: (response) => {
      // Invalidate tickets list and dashboard stats
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
      queryClient.invalidateQueries({ queryKey: ['recentTickets'] });

      const newTicketId = response?.data?.ticket_id;
      toast.success(`Ticket ${newTicketId} created successfully.`);

      if (newTicketId) {
        navigate(`/tickets/${newTicketId}`);
      } else {
        navigate('/tickets');
      }
    },
    onError: (err) => {
      toast.error(err.message || 'Unable to create ticket.');
    },
  });

  const onSubmit = (data) => {
    createMutation.mutate(data);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Back button */}
      <div>
        <Link
          to="/tickets"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Tickets</span>
        </Link>
      </div>

      {/* Main Form Card */}
      <div className="bg-white rounded-card border border-slate-200/90 shadow-card p-6 sm:p-8">
        <div className="pb-6 mb-6 border-b border-slate-100">
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Create Support Ticket
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            File a new customer support ticket to track and resolve the inquiry.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Customer Name */}
          <div>
            <label
              htmlFor="customer_name"
              className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5"
            >
              Customer Name <span className="text-rose-500">*</span>
            </label>
            <input
              id="customer_name"
              type="text"
              placeholder="e.g. Rahul Sharma"
              disabled={createMutation.isPending}
              {...register('customer_name')}
              className={`w-full py-2.5 px-3.5 bg-white border rounded-xl text-sm text-slate-900 placeholder-slate-400 shadow-subtle transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 ${
                errors.customer_name
                  ? 'border-rose-300 bg-rose-50/20'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            />
            {errors.customer_name && (
              <p className="mt-1.5 text-xs text-rose-600 font-medium">
                {errors.customer_name.message}
              </p>
            )}
          </div>

          {/* Customer Email */}
          <div>
            <label
              htmlFor="customer_email"
              className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5"
            >
              Customer Email <span className="text-rose-500">*</span>
            </label>
            <input
              id="customer_email"
              type="email"
              placeholder="e.g. rahul@gmail.com"
              disabled={createMutation.isPending}
              {...register('customer_email')}
              className={`w-full py-2.5 px-3.5 bg-white border rounded-xl text-sm text-slate-900 placeholder-slate-400 shadow-subtle transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 ${
                errors.customer_email
                  ? 'border-rose-300 bg-rose-50/20'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            />
            {errors.customer_email && (
              <p className="mt-1.5 text-xs text-rose-600 font-medium">
                {errors.customer_email.message}
              </p>
            )}
          </div>

          {/* Issue Title / Subject */}
          <div>
            <label
              htmlFor="subject"
              className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5"
            >
              Issue Title <span className="text-rose-500">*</span>
            </label>
            <input
              id="subject"
              type="text"
              placeholder="Brief summary of the issue (e.g. Payment failed)"
              disabled={createMutation.isPending}
              {...register('subject')}
              className={`w-full py-2.5 px-3.5 bg-white border rounded-xl text-sm text-slate-900 placeholder-slate-400 shadow-subtle transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 ${
                errors.subject
                  ? 'border-rose-300 bg-rose-50/20'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            />
            {errors.subject && (
              <p className="mt-1.5 text-xs text-rose-600 font-medium">
                {errors.subject.message}
              </p>
            )}
          </div>

          {/* Priority Selection */}
          <div>
            <label
              htmlFor="priority"
              className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5"
            >
              Priority
            </label>
            <select
              id="priority"
              disabled={createMutation.isPending}
              {...register('priority')}
              className="w-full py-2.5 px-3.5 bg-white border border-slate-200 hover:border-slate-300 rounded-xl text-sm text-slate-900 shadow-subtle focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
            >
              {PRIORITY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label} Priority
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-slate-400">
              Default is Medium. Choose High for critical blockers.
            </p>
          </div>

          {/* Issue Description */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="description"
                className="block text-xs font-semibold text-slate-700 uppercase tracking-wider"
              >
                Issue Description <span className="text-rose-500">*</span>
              </label>
              <span className="text-xs text-slate-400">
                {descriptionValue.length} / 5000 characters
              </span>
            </div>
            <textarea
              id="description"
              rows={5}
              placeholder="Provide complete details about the customer's problem..."
              disabled={createMutation.isPending}
              {...register('description')}
              className={`w-full py-2.5 px-3.5 bg-white border rounded-xl text-sm text-slate-900 placeholder-slate-400 shadow-subtle resize-y transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 ${
                errors.description
                  ? 'border-rose-300 bg-rose-50/20'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            />
            {errors.description && (
              <p className="mt-1.5 text-xs text-rose-600 font-medium">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <Link to="/tickets">
              <LoadingButton
                type="button"
                variant="secondary"
                disabled={createMutation.isPending}
              >
                Cancel
              </LoadingButton>
            </Link>

            <LoadingButton
              type="submit"
              variant="primary"
              icon={Send}
              loading={createMutation.isPending}
              loadingText="Creating Ticket..."
            >
              Create Ticket
            </LoadingButton>
          </div>
        </form>
      </div>
    </div>
  );
}
