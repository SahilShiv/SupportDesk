import React from 'react';
import { MessageSquare, Clock, ShieldCheck } from 'lucide-react';
import { formatDate } from '../../utils/formatters';

export function NotesTimeline({ notes = [] }) {
  return (
    <div className="bg-white rounded-card border border-slate-200/90 shadow-card p-6">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-base font-semibold text-slate-900">Activity History</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Internal notes and timeline updates
          </p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
          {notes.length} {notes.length === 1 ? 'note' : 'notes'}
        </span>
      </div>

      {notes.length === 0 ? (
        <div className="py-8 text-center bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
          <MessageSquare className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <h4 className="text-sm font-semibold text-slate-700">No notes yet</h4>
          <p className="text-xs text-slate-500 max-w-xs mx-auto mt-1">
            Add an internal note using the panel to keep the support history organized.
          </p>
        </div>
      ) : (
        <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
          {notes.map((note, index) => (
            <div key={note.id || index} className="relative group">
              {/* Timeline marker */}
              <div className="absolute -left-6 top-0.5 w-4 h-4 rounded-full bg-white border-2 border-brand-500 flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-brand-600"></div>
              </div>

              {/* Note Content */}
              <div className="bg-slate-50/80 rounded-xl p-4 border border-slate-200/70 hover:border-slate-300 transition-colors">
                <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                  <div className="flex items-center gap-1.5 font-medium text-slate-700">
                    <ShieldCheck className="w-3.5 h-3.5 text-brand-600" />
                    <span>Support Note</span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-slate-400">
                    <Clock className="w-3 h-3" />
                    <span>{formatDate(note.created_at, true)}</span>
                  </div>
                </div>
                <p className="text-sm text-slate-800 whitespace-pre-wrap leading-relaxed">
                  {note.note_text}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
