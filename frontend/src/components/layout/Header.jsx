import React from 'react';
import { Menu, Plus } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { LoadingButton } from '../ui/LoadingButton';

export function Header({ onMenuClick }) {
  const location = useLocation();
  const isCreatePage = location.pathname === '/tickets/new';

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 py-3.5 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 -ml-2 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center text-xs font-medium text-slate-500">
          <span>SupportDesk</span>
          <span className="mx-2 text-slate-300">/</span>
          <span className="text-slate-800 font-semibold capitalize">
            {location.pathname.startsWith('/tickets/new')
              ? 'Create Ticket'
              : location.pathname.startsWith('/tickets/')
              ? 'Ticket Details'
              : location.pathname.replace('/', '') || 'Dashboard'}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {!isCreatePage && (
          <Link to="/tickets/new">
            <LoadingButton
              variant="primary"
              icon={Plus}
              className="text-xs sm:text-sm py-2 px-3 sm:px-4"
            >
              <span>Create Ticket</span>
            </LoadingButton>
          </Link>
        )}
      </div>
    </header>
  );
}
