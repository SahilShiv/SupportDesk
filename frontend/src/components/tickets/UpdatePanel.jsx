import React, { useState, useEffect } from 'react';
import { Save, Check } from 'lucide-react';
import { LoadingButton } from '../ui/LoadingButton';
import { STATUS_OPTIONS, PRIORITY_OPTIONS } from '../../constants';

export function UpdatePanel({
  ticket,
  onSave,
  isSaving = false,
}) {
  const [selectedStatus, setSelectedStatus] = useState(ticket?.status || 'Open');
  const [selectedPriority, setSelectedPriority] = useState(ticket?.priority || 'Medium');
  const [noteText, setNoteText] = useState('');

  // Sync state if ticket changes
  useEffect(() => {
    if (ticket) {
      setSelectedStatus(ticket.status);
      setSelectedPriority(ticket.priority);
    }
  }, [ticket?.ticket_id, ticket?.status, ticket?.priority]);

  // Check if any change has been made
  const hasStatusChanged = selectedStatus !== ticket?.status;
  const hasPriorityChanged = selectedPriority !== ticket?.priority;
  const hasNoteAdded = noteText.trim().length > 0;
  const isDirty = hasStatusChanged || hasPriorityChanged || hasNoteAdded;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isDirty || isSaving) return;

    const payload = {};
    if (hasStatusChanged) payload.status = selectedStatus;
    if (hasPriorityChanged) payload.priority = selectedPriority;
    if (hasNoteAdded) payload.notes = noteText.trim();

    onSave(payload, () => {
      // Clear note field on success
      setNoteText('');
    });
  };

  return (
    <div className="bg-white rounded-card border border-slate-200/90 shadow-card p-6">
      <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">
        Ticket Actions
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Status selection */}
        <div>
          <label htmlFor="update-status" className="block text-xs font-semibold text-slate-600 mb-1.5">
            Update Status
          </label>
          <select
            id="update-status"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            disabled={isSaving}
            className="w-full py-2 px-3 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-800 shadow-subtle hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Priority selection */}
        <div>
          <label htmlFor="update-priority" className="block text-xs font-semibold text-slate-600 mb-1.5">
            Update Priority
          </label>
          <select
            id="update-priority"
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            disabled={isSaving}
            className="w-full py-2 px-3 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-800 shadow-subtle hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
          >
            {PRIORITY_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Note textarea */}
        <div>
          <label htmlFor="update-note" className="block text-xs font-semibold text-slate-600 mb-1.5">
            Add Internal Note
          </label>
          <textarea
            id="update-note"
            rows={3}
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder="Add an internal note or progress update..."
            disabled={isSaving}
            className="w-full py-2.5 px-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 shadow-subtle resize-none hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
          />
        </div>

        {/* Save button */}
        <LoadingButton
          type="submit"
          variant="primary"
          icon={Save}
          loading={isSaving}
          loadingText="Saving..."
          disabled={!isDirty || isSaving}
          className="w-full py-2.5"
        >
          Save Changes
        </LoadingButton>
      </form>
    </div>
  );
}
