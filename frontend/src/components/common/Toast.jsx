import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success', duration = 4000) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = {
    success: (msg) => addToast(msg, 'success'),
    error: (msg) => addToast(msg, 'error'),
    info: (msg) => addToast(msg, 'info'),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div
        className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none"
        aria-live="polite"
      >
        {toasts.map((item) => (
          <div
            key={item.id}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl shadow-lg border text-sm transition-all transform duration-200 ease-out animate-in slide-in-from-bottom-2 ${
              item.type === 'success'
                ? 'bg-white border-emerald-200 text-slate-800'
                : item.type === 'error'
                ? 'bg-white border-rose-200 text-slate-800'
                : 'bg-white border-indigo-200 text-slate-800'
            }`}
          >
            <div className="shrink-0 mt-0.5">
              {item.type === 'success' && (
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              )}
              {item.type === 'error' && (
                <AlertCircle className="w-5 h-5 text-rose-600" />
              )}
              {item.type === 'info' && (
                <Info className="w-5 h-5 text-indigo-600" />
              )}
            </div>

            <div className="flex-1 font-medium text-slate-700 leading-snug">
              {item.message}
            </div>

            <button
              onClick={() => removeToast(item.id)}
              className="shrink-0 p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
              aria-label="Close notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
