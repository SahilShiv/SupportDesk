import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import {
  Inbox,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Flame,
} from 'lucide-react';
import { getDashboardStats, getTickets } from '../services/api';
import { StatCard } from '../components/dashboard/StatCard';
import { NeedsAttentionSection } from '../components/dashboard/NeedsAttentionSection';
import { RecentTicketsTable } from '../components/dashboard/RecentTicketsTable';
import { StatCardSkeleton } from '../components/ui/Skeleton';

export function Dashboard() {
  const {
    data: statsData,
    isLoading: statsLoading,
    error: statsError,
  } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: getDashboardStats,
    refetchInterval: 30000,
  });

  const {
    data: recentTicketsData,
    isLoading: recentLoading,
  } = useQuery({
    queryKey: ['recentTickets'],
    queryFn: () => getTickets({ page: 1, limit: 5, sort: 'newest' }),
  });

  const stats = statsData?.data || {
    total: 0,
    open: 0,
    inProgress: 0,
    closed: 0,
    highPriority: 0,
    needsAttention: 0,
    needsAttentionTickets: [],
  };

  const recentTickets = recentTicketsData?.data || [];

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      <div className="pb-2 border-b border-slate-200/60">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          Support Dashboard
        </h1>
        <p className="text-sm text-slate-500 mt-1 max-w-2xl">
          Track customer issues, manage ticket status, and keep support operations organized.
        </p>
      </div>

      {statsError && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-sm text-rose-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>Unable to load live dashboard statistics. Please ensure the backend is connected.</span>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {statsLoading ? (
            <>
              <StatCardSkeleton />
              <StatCardSkeleton />
              <StatCardSkeleton />
              <StatCardSkeleton />
            </>
          ) : (
            <>
              <StatCard
                title="Total Tickets"
                value={stats.total}
                description="All support requests"
                icon={Inbox}
                colorScheme="indigo"
                to="/tickets"
              />
              <StatCard
                title="Open"
                value={stats.open}
                description="Awaiting action"
                icon={AlertTriangle}
                colorScheme="emerald"
                to="/tickets?status=Open"
              />
              <StatCard
                title="In Progress"
                value={stats.inProgress}
                description="Currently being handled"
                icon={Clock}
                colorScheme="amber"
                to="/tickets?status=In%20Progress"
              />
              <StatCard
                title="Closed"
                value={stats.closed}
                description="Resolved requests"
                icon={CheckCircle2}
                colorScheme="slate"
                to="/tickets?status=Closed"
              />
            </>
          )}
        </div>

        <div className="bg-gradient-to-r from-rose-50 to-orange-50/50 rounded-card border border-rose-200/80 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-subtle">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 border border-rose-200">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-semibold text-rose-900">
                  High Priority Queue
                </h2>
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-rose-600 text-white shadow-xs">
                  {stats.highPriority}
                </span>
              </div>
              <p className="text-xs text-rose-700/80 mt-0.5">
                Urgent customer requests requiring immediate operational attention
              </p>
            </div>
          </div>
          <Link
            to="/tickets?priority=High"
            className="text-xs font-semibold text-rose-700 hover:text-rose-800 bg-white px-3.5 py-2 rounded-lg border border-rose-200 shadow-subtle self-start sm:self-auto hover:bg-rose-50 transition-colors focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:outline-none"
          >
            View High Priority
          </Link>
        </div>
      </div>

      <section aria-labelledby="needs-attention-heading">
        <NeedsAttentionSection
          tickets={stats.needsAttentionTickets || []}
          loading={statsLoading}
          totalCount={stats.needsAttention || 0}
        />
      </section>

      <section aria-labelledby="recent-tickets-heading">
        <RecentTicketsTable
          tickets={recentTickets}
          loading={recentLoading}
        />
      </section>
    </div>
  );
}
