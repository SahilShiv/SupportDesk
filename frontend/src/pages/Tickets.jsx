import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { getTickets } from '../services/api';
import { useDebounce } from '../hooks/useDebounce';
import { SearchBar } from '../components/tickets/SearchBar';
import { FilterBar } from '../components/tickets/FilterBar';
import { TicketTable } from '../components/tickets/TicketTable';
import { Pagination } from '../components/tickets/Pagination';
import { LoadingButton } from '../components/ui/LoadingButton';

export function Tickets() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const urlSearch = searchParams.get('search') || '';
  const urlStatus = searchParams.get('status') || '';
  const urlPriority = searchParams.get('priority') || '';
  const urlSort = searchParams.get('sort') || 'newest';
  const urlPage = parseInt(searchParams.get('page') || '1', 10);
  const urlNeedsAttention = searchParams.get('needsAttention') === 'true';

  const [searchInput, setSearchInput] = useState(urlSearch);
  const debouncedSearch = useDebounce(searchInput, 350);

  useEffect(() => {
    const newParams = new URLSearchParams(searchParams);
    if (debouncedSearch) {
      newParams.set('search', debouncedSearch);
    } else {
      newParams.delete('search');
    }
    if (debouncedSearch !== urlSearch) {
      newParams.set('page', '1');
    }
    setSearchParams(newParams, { replace: true });
  }, [debouncedSearch]);

  useEffect(() => {
    if (urlSearch !== searchInput && urlSearch !== debouncedSearch) {
      setSearchInput(urlSearch);
    }
  }, [urlSearch]);

  const handleStatusChange = (status) => {
    const newParams = new URLSearchParams(searchParams);
    if (status) {
      newParams.set('status', status);
    } else {
      newParams.delete('status');
    }
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const handlePriorityChange = (priority) => {
    const newParams = new URLSearchParams(searchParams);
    if (priority) {
      newParams.set('priority', priority);
    } else {
      newParams.delete('priority');
    }
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const handleSortChange = (sort) => {
    const newParams = new URLSearchParams(searchParams);
    if (sort && sort !== 'newest') {
      newParams.set('sort', sort);
    } else {
      newParams.delete('sort');
    }
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const handleClearNeedsAttention = () => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('needsAttention');
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const handlePageChange = (page) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', String(page));
    setSearchParams(newParams);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResetFilters = () => {
    setSearchInput('');
    setSearchParams({});
  };

  const hasActiveFilters = Boolean(
    urlStatus ||
      urlPriority ||
      (urlSort && urlSort !== 'newest') ||
      urlSearch ||
      urlNeedsAttention
  );

  const { data, isLoading, isFetching } = useQuery({
    queryKey: [
      'tickets',
      urlPage,
      debouncedSearch,
      urlStatus,
      urlPriority,
      urlSort,
      urlNeedsAttention,
    ],
    queryFn: () =>
      getTickets({
        page: urlPage,
        limit: 10,
        search: debouncedSearch,
        status: urlStatus,
        priority: urlPriority,
        sort: urlSort,
        needsAttention: urlNeedsAttention ? 'true' : undefined,
      }),
    keepPreviousData: true,
  });

  const tickets = data?.data || [];
  const pagination = data?.pagination || {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/60">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Tickets
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            View, search, and manage customer support requests.
          </p>
        </div>

        <Link to="/tickets/new">
          <LoadingButton
            variant="primary"
            icon={Plus}
            className="w-full sm:w-auto shadow-sm"
          >
            Create Ticket
          </LoadingButton>
        </Link>
      </div>

      <div className="space-y-3">
        <SearchBar
          value={searchInput}
          onChange={setSearchInput}
          onClear={() => setSearchInput('')}
          isLoading={isFetching && !isLoading}
          resultCount={pagination.total}
        />

        <FilterBar
          status={urlStatus}
          onStatusChange={handleStatusChange}
          priority={urlPriority}
          onPriorityChange={handlePriorityChange}
          sort={urlSort}
          onSortChange={handleSortChange}
          needsAttention={urlNeedsAttention}
          onClearNeedsAttention={handleClearNeedsAttention}
          onResetFilters={handleResetFilters}
          hasActiveFilters={hasActiveFilters}
        />
      </div>

      <div className="space-y-0">
        <TicketTable
          tickets={tickets}
          loading={isLoading}
          emptyStateTitle="No tickets found"
          emptyStateDescription={
            hasActiveFilters
              ? 'No tickets match your current search or filters.'
              : 'Create your first support ticket to get started.'
          }
          emptyActionLabel={
            hasActiveFilters ? 'Clear Filters' : 'Create Ticket'
          }
          onEmptyAction={
            hasActiveFilters
              ? handleResetFilters
              : () => navigate('/tickets/new')
          }
          secondaryActionLabel={hasActiveFilters ? 'Create Ticket' : undefined}
          onSecondaryAction={
            hasActiveFilters ? () => navigate('/tickets/new') : undefined
          }
        />

        {!isLoading && tickets.length > 0 && (
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            totalItems={pagination.total}
            pageSize={pagination.limit}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
}
