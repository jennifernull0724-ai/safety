'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Calendar, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Clock,
  Users,
  Briefcase,
  Search,
  Filter,
  TrendingDown,
  Info
} from 'lucide-react';

/**
 * DISPATCHER / SCHEDULER DASHBOARD
 * 
 * PURPOSE:
 * - Pre-assignment planning and eligibility checking
 * - Avoid last-minute compliance failures
 * - Visibility into upcoming expirations
 * - Assignment readiness view
 * 
 * FOCUS:
 * - Who CAN be assigned to jobs
 * - Who is expiring soon (7, 14, 30 days)
 * - Hidden compliance issues surfaced early
 * - Read-only access (no editing)
 * 
 * USE CASES:
 * - "I'm scheduling next week's crew — who's eligible?"
 * - "Any certifications expiring this month?"
 * - "Can I assign this person to a job starting Monday?"
 */

interface EmployeeAssignmentStatus {
  id: string;
  employeeId: string;
  fullName: string;
  tradeRole: string;
  assignmentStatus: 'ready' | 'expiring-soon' | 'blocked' | 'pending';
  certifications: {
    type: string;
    expirationDate?: string;
    status: 'PASS' | 'FAIL' | 'INCOMPLETE';
    daysUntilExpiration?: number;
  }[];
  expiringIn7Days: number;
  expiringIn30Days: number;
  currentAssignments?: string[];
}

export default function DispatchDashboard() {
  const [employees, setEmployees] = useState<EmployeeAssignmentStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [tradeFilter, setTradeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [expirationView, setExpirationView] = useState<'all' | '7days' | '14days' | '30days'>('all');

  useEffect(() => {
    loadAssignmentReadiness();
  }, []);

  const loadAssignmentReadiness = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/dispatch/assignment-readiness');
      if (res.ok) {
        const data = await res.json();
        setEmployees(data);
      }
    } catch (err) {
      console.error('Failed to load assignment readiness');
    } finally {
      setLoading(false);
    }
  };

  const availableTrades = Array.from(new Set(employees.map(e => e.tradeRole)));

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = 
      searchQuery === '' ||
      emp.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.employeeId.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTrade = tradeFilter === 'all' || emp.tradeRole === tradeFilter;
    
    const matchesStatus = statusFilter === 'all' || emp.assignmentStatus === statusFilter;

    const matchesExpiration = 
      expirationView === 'all' ||
      (expirationView === '7days' && emp.expiringIn7Days > 0) ||
      (expirationView === '14days' && emp.expiringIn7Days + emp.expiringIn30Days > 0) ||
      (expirationView === '30days' && emp.expiringIn30Days > 0);

    return matchesSearch && matchesTrade && matchesStatus && matchesExpiration;
  });

  const stats = {
    total: employees.length,
    ready: employees.filter(e => e.assignmentStatus === 'ready').length,
    expiringSoon: employees.filter(e => e.assignmentStatus === 'expiring-soon').length,
    blocked: employees.filter(e => e.assignmentStatus === 'blocked').length,
    expiringIn7: employees.reduce((sum, e) => sum + e.expiringIn7Days, 0),
    expiringIn30: employees.reduce((sum, e) => sum + e.expiringIn30Days, 0),
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Calendar className="w-8 h-8 text-blue-400" />
          <h1 className="text-3xl font-bold">Dispatch & Scheduling</h1>
        </div>
        <p className="text-slate-400">Assignment readiness and crew eligibility planning</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="p-6 bg-slate-800/50 border border-slate-700 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-400">Total Workforce</span>
            <Users className="w-5 h-5 text-slate-400" />
          </div>
          <div className="text-3xl font-bold">{stats.total}</div>
        </div>

        <div className="p-6 bg-emerald-900/20 border border-emerald-800/50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-emerald-300">Ready to Assign</span>
            <CheckCircle className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="text-3xl font-bold text-emerald-400">{stats.ready}</div>
        </div>

        <div className="p-6 bg-amber-900/20 border border-amber-800/50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-amber-300">Expiring Soon</span>
            <Clock className="w-5 h-5 text-amber-400" />
          </div>
          <div className="text-3xl font-bold text-amber-400">{stats.expiringSoon}</div>
          <div className="text-xs text-amber-300 mt-1">
            {stats.expiringIn7} certs in 7 days
          </div>
        </div>

        <div className="p-6 bg-red-900/20 border border-red-800/50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-red-300">Not Assignable</span>
            <XCircle className="w-5 h-5 text-red-400" />
          </div>
          <div className="text-3xl font-bold text-red-400">{stats.blocked}</div>
        </div>
      </div>

      {/* Info Banner - Read-Only Access */}
      <div className="mb-6 p-4 bg-blue-900/20 border border-blue-800/50 rounded-lg">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
          <div className="flex-1 text-sm text-slate-300">
            <strong className="text-blue-300">Dispatcher View — Read-Only Access</strong>
            <p className="mt-1">
              This dashboard shows assignment eligibility only. To update certifications or resolve compliance issues, 
              contact your Compliance Administrator.
            </p>
          </div>
          <div className="flex gap-2">
            <Link href="/dispatch/job-planner">
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm font-medium whitespace-nowrap">
                Plan Job Assignment
              </button>
            </Link>
            <Link href="/dispatch/expiration-calendar">
              <button className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm font-medium whitespace-nowrap">
                Expiration Calendar
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search by name or employee ID..."
            className="w-full pl-10 px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-white"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <span className="text-sm text-slate-400">Status:</span>
          </div>
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
              statusFilter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setStatusFilter('ready')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
              statusFilter === 'ready'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Ready ({stats.ready})
          </button>
          <button
            onClick={() => setStatusFilter('expiring-soon')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
              statusFilter === 'expiring-soon'
                ? 'bg-amber-600 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Expiring Soon ({stats.expiringSoon})
          </button>
          <button
            onClick={() => setStatusFilter('blocked')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
              statusFilter === 'blocked'
                ? 'bg-red-600 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Blocked ({stats.blocked})
          </button>

          <div className="ml-4 flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-400" />
            <span className="text-sm text-slate-400">Expirations:</span>
          </div>
          <button
            onClick={() => setExpirationView('7days')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
              expirationView === '7days'
                ? 'bg-red-600 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Next 7 Days
          </button>
          <button
            onClick={() => setExpirationView('30days')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
              expirationView === '30days'
                ? 'bg-amber-600 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Next 30 Days
          </button>
        </div>

        {/* Trade Filter */}
        {availableTrades.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-slate-400 mr-2">Trade:</span>
            <button
              onClick={() => setTradeFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-sm ${
                tradeFilter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              All Trades
            </button>
            {availableTrades.map(trade => (
              <button
                key={trade}
                onClick={() => setTradeFilter(trade)}
                className={`px-3 py-1.5 rounded-lg text-sm ${
                  tradeFilter === trade
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {trade}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Employee List */}
      {loading ? (
        <div className="h-96 bg-slate-800/50 rounded-2xl animate-pulse" />
      ) : (
        <div className="bg-slate-800/50 rounded-2xl border border-slate-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-900/50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-slate-400">Assignment Status</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-slate-400">Employee</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-slate-400">Trade</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-slate-400">Expiration Alerts</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-slate-400">Current Jobs</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {filteredEmployees.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                      No employees match your filters
                    </td>
                  </tr>
                ) : (
                  filteredEmployees.map(emp => (
                    <tr key={emp.id} className="hover:bg-slate-800/30">
                      <td className="px-6 py-4">
                        {emp.assignmentStatus === 'ready' ? (
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-emerald-400" />
                            <span className="text-emerald-400 font-medium">READY</span>
                          </div>
                        ) : emp.assignmentStatus === 'blocked' ? (
                          <div className="flex items-center gap-2">
                            <XCircle className="w-5 h-5 text-red-400" />
                            <span className="text-red-400 font-medium">BLOCKED</span>
                          </div>
                        ) : emp.assignmentStatus === 'expiring-soon' ? (
                          <div className="flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5 text-amber-400" />
                            <span className="text-amber-400 font-medium">EXPIRING SOON</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <Clock className="w-5 h-5 text-blue-400" />
                            <span className="text-blue-400 font-medium">PENDING</span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-white">{emp.fullName}</div>
                          <div className="text-sm text-slate-400">ID: {emp.employeeId}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-300">{emp.tradeRole}</td>
                      <td className="px-6 py-4">
                        {emp.expiringIn7Days > 0 ? (
                          <div className="text-sm">
                            <div className="flex items-center gap-2 text-red-400 mb-1">
                              <TrendingDown className="w-4 h-4" />
                              <span className="font-medium">{emp.expiringIn7Days} expiring in 7 days</span>
                            </div>
                            <div className="text-slate-400">
                              {emp.certifications
                                .filter(c => c.daysUntilExpiration && c.daysUntilExpiration <= 7)
                                .map(c => c.type)
                                .join(', ')}
                            </div>
                          </div>
                        ) : emp.expiringIn30Days > 0 ? (
                          <div className="text-sm">
                            <div className="flex items-center gap-2 text-amber-400 mb-1">
                              <Clock className="w-4 h-4" />
                              <span className="font-medium">{emp.expiringIn30Days} expiring in 30 days</span>
                            </div>
                            <div className="text-slate-400 text-xs">
                              {emp.certifications
                                .filter(c => c.daysUntilExpiration && c.daysUntilExpiration <= 30 && c.daysUntilExpiration > 7)
                                .map(c => c.type)
                                .slice(0, 2)
                                .join(', ')}
                            </div>
                          </div>
                        ) : emp.assignmentStatus === 'blocked' ? (
                          <div className="text-sm text-red-400">
                            Missing/expired certifications
                          </div>
                        ) : (
                          <div className="text-sm text-emerald-400 flex items-center gap-1">
                            <CheckCircle className="w-4 h-4" />
                            All current
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {emp.currentAssignments && emp.currentAssignments.length > 0 ? (
                          <div className="text-sm">
                            <div className="flex items-center gap-2 text-blue-400 mb-1">
                              <Briefcase className="w-4 h-4" />
                              <span className="font-medium">{emp.currentAssignments.length} job(s)</span>
                            </div>
                            <div className="text-slate-400 text-xs">
                              {emp.currentAssignments.slice(0, 2).join(', ')}
                            </div>
                          </div>
                        ) : (
                          <span className="text-sm text-slate-500">Available</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
