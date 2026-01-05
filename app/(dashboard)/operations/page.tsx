'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Users, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Search, 
  Download,
  QrCode,
  Clock,
  Shield,
  Phone,
  Info
} from 'lucide-react';

/**
 * OPERATIONS MANAGER DASHBOARD
 * 
 * PURPOSE:
 * - Field execution gatekeeper view
 * - Clear work authorization status
 * - Minimal friction, maximum clarity
 * - Mobile-optimized for job sites
 * 
 * FOCUS:
 * - Who can work TODAY
 * - Who is blocked and WHY
 * - What action is required
 * - Escalation path
 * 
 * READ-ONLY ROLE - NO EDITING
 */

interface EmployeeStatus {
  id: string;
  employeeId: string;
  fullName: string;
  tradeRole: string;
  status: 'cleared' | 'blocked' | 'pending';
  blockReason?: string;
  missingCertifications?: string[];
  expiredCertifications?: string[];
  expiringIn7Days?: string[];
  lastVerified?: string;
}

export default function OperationsDashboard() {
  const [employees, setEmployees] = useState<EmployeeStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'cleared' | 'blocked' | 'pending'>('all');

  useEffect(() => {
    loadEmployeeStatus();
  }, []);

  const loadEmployeeStatus = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/operations/employee-status');
      if (res.ok) {
        const data = await res.json();
        setEmployees(data);
      }
    } catch (err) {
      console.error('Failed to load employee status');
    } finally {
      setLoading(false);
    }
  };

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = 
      searchQuery === '' ||
      emp.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.tradeRole.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || emp.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: employees.length,
    cleared: employees.filter(e => e.status === 'cleared').length,
    blocked: employees.filter(e => e.status === 'blocked').length,
    pending: employees.filter(e => e.status === 'pending').length,
  };

  const exportCrewRoster = () => {
    // Generate CSV with current status
    const csv = [
      ['Employee ID', 'Name', 'Trade', 'Status', 'Block Reason', 'Action Required'].join(','),
      ...filteredEmployees.map(emp => [
        emp.employeeId,
        emp.fullName,
        emp.tradeRole,
        emp.status.toUpperCase(),
        emp.blockReason || '',
        emp.missingCertifications?.join('; ') || emp.expiredCertifications?.join('; ') || 'None'
      ].join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `crew-roster-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Users className="w-8 h-8 text-blue-400" />
          <h1 className="text-3xl font-bold">Operations Dashboard</h1>
        </div>
        <p className="text-slate-400">Work authorization status — who can work today</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="p-6 bg-slate-800/50 border border-slate-700 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-400">Total Crew</span>
            <Users className="w-5 h-5 text-slate-400" />
          </div>
          <div className="text-3xl font-bold">{stats.total}</div>
        </div>

        <div className="p-6 bg-emerald-900/20 border border-emerald-800/50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-emerald-300">Cleared to Work</span>
            <CheckCircle className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="text-3xl font-bold text-emerald-400">{stats.cleared}</div>
        </div>

        <div className="p-6 bg-red-900/20 border border-red-800/50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-red-300">Blocked</span>
            <XCircle className="w-5 h-5 text-red-400" />
          </div>
          <div className="text-3xl font-bold text-red-400">{stats.blocked}</div>
        </div>

        <div className="p-6 bg-amber-900/20 border border-amber-800/50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-amber-300">Pending Review</span>
            <AlertTriangle className="w-5 h-5 text-amber-400" />
          </div>
          <div className="text-3xl font-bold text-amber-400">{stats.pending}</div>
        </div>
      </div>

      {/* Info Banner - Escalation Path */}
      <div className="mb-6 p-4 bg-blue-900/20 border border-blue-800/50 rounded-lg">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
          <div className="flex-1 text-sm text-slate-300">
            <strong className="text-blue-300">Need to clear a blocked worker?</strong>
            <p className="mt-1">
              Contact your Compliance Administrator or Safety Officer. Operations Managers cannot modify certification records.
            </p>
            <div className="mt-2 flex items-center gap-2">
              <Phone className="w-4 h-4 text-blue-400" />
              <span className="text-blue-300">Support Hotline: 1-800-SAFETY-1</span>
            </div>
          </div>
          <Link href="/operations/blocked">
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm font-medium whitespace-nowrap">
              View All Blocked Workers
            </button>
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search by name, ID, or trade..."
            className="w-full pl-10 px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-white"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium ${
              statusFilter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            All ({stats.total})
          </button>
          <button
            onClick={() => setStatusFilter('cleared')}
            className={`px-4 py-2 rounded-lg font-medium ${
              statusFilter === 'cleared'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Cleared ({stats.cleared})
          </button>
          <button
            onClick={() => setStatusFilter('blocked')}
            className={`px-4 py-2 rounded-lg font-medium ${
              statusFilter === 'blocked'
                ? 'bg-red-600 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Blocked ({stats.blocked})
          </button>
          <button
            onClick={() => setStatusFilter('pending')}
            className={`px-4 py-2 rounded-lg font-medium ${
              statusFilter === 'pending'
                ? 'bg-amber-600 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Pending ({stats.pending})
          </button>
        </div>

        <button
          onClick={exportCrewRoster}
          className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg flex items-center gap-2 font-medium whitespace-nowrap"
        >
          <Download className="w-4 h-4" />
          Export Roster
        </button>
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
                  <th className="px-6 py-4 text-left text-sm font-medium text-slate-400">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-slate-400">Employee</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-slate-400">Trade</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-slate-400">Issue / Action Required</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-slate-400">QR Code</th>
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
                        {emp.status === 'cleared' ? (
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-emerald-400" />
                            <span className="text-emerald-400 font-medium">CLEARED</span>
                          </div>
                        ) : emp.status === 'blocked' ? (
                          <div className="flex items-center gap-2">
                            <XCircle className="w-5 h-5 text-red-400" />
                            <span className="text-red-400 font-medium">BLOCKED</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5 text-amber-400" />
                            <span className="text-amber-400 font-medium">PENDING</span>
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
                        {emp.status === 'cleared' && emp.expiringIn7Days && emp.expiringIn7Days.length > 0 ? (
                          <div className="text-sm">
                            <div className="flex items-center gap-2 text-amber-400 mb-1">
                              <Clock className="w-4 h-4" />
                              <span className="font-medium">Expiring Soon</span>
                            </div>
                            <div className="text-slate-400">
                              {emp.expiringIn7Days.join(', ')}
                            </div>
                          </div>
                        ) : emp.status === 'blocked' ? (
                          <div className="text-sm">
                            <div className="text-red-300 font-medium mb-1">{emp.blockReason}</div>
                            {emp.missingCertifications && emp.missingCertifications.length > 0 && (
                              <div className="text-slate-400">
                                Missing: {emp.missingCertifications.join(', ')}
                              </div>
                            )}
                            {emp.expiredCertifications && emp.expiredCertifications.length > 0 && (
                              <div className="text-slate-400">
                                Expired: {emp.expiredCertifications.join(', ')}
                              </div>
                            )}
                            <div className="mt-2">
                              <span className="text-xs text-slate-500">→ Contact Compliance Admin</span>
                            </div>
                          </div>
                        ) : emp.status === 'pending' ? (
                          <div className="text-sm text-slate-400">
                            Certification review in progress
                          </div>
                        ) : (
                          <div className="text-sm text-emerald-400 flex items-center gap-1">
                            <CheckCircle className="w-4 h-4" />
                            Ready to work
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <Link href={`/verify/employee/${emp.id}`} target="_blank">
                          <button className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 rounded flex items-center gap-2 text-sm">
                            <QrCode className="w-4 h-4" />
                            Verify
                          </button>
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Mobile Optimization Note */}
      <div className="mt-6 p-4 bg-slate-900/50 border border-slate-700 rounded-lg text-sm text-slate-400">
        <div className="flex items-start gap-2">
          <Shield className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <div>
            <strong className="text-slate-300">Field Operations Note:</strong> This page is optimized for mobile use. 
            Bookmark it for quick job site access. QR verification works offline-first when network is unavailable.
          </div>
        </div>
      </div>
    </div>
  );
}
