'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Plus, User, CheckCircle, XCircle, Clock, Info, FileText } from 'lucide-react';

/**
 * EMPLOYEES PAGE
 * 
 * Purpose:
 * - Employee roster (employee-anchored system)
 * - Certification status per employee
 * - Expirations, deficiencies
 * - Evidence attached to people
 * 
 * Rules:
 * - No estimating
 * - No CRM behavior
 * - Employee-centric view
 */

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/employees');
      if (res.ok) {
        const data = await res.json();
        setEmployees(data);
      }
    } catch (err) {
      console.error('Failed to load employees');
    } finally {
      setLoading(false);
    }
  };

  const filteredEmployees = employees.filter((e: any) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      e.full_name?.toLowerCase().includes(q) ||
      `${e.firstName} ${e.lastName}`.toLowerCase().includes(q) ||
      e.employee_id?.toLowerCase().includes(q);

    const matchesStatus = statusFilter === 'all' || e.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Employees</h1>
        <p className="text-slate-400">
          Employee roster with certification status and evidence
        </p>
      </div>

      {/* Info Banner */}
      <div className="mb-6 p-4 bg-blue-900/20 border border-blue-800/50 rounded-lg">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-slate-300">
            <strong className="text-blue-300">Click "View Details" to see complete certification history</strong>
            <p className="mt-1">
              Employee detail pages show all certification versions, correction history, and chain of custody. 
              Earlier versions are preserved and retrievable.{' '}
              <Link href="/docs/audit-export" className="text-blue-400 hover:text-blue-300 underline inline-flex items-center gap-1">
                <FileText className="w-3 h-3" />
                Learn about audit exports
              </Link>
            </p>
          </div>
        </div>
      </div>

      <div className="mb-6 flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search employees..."
            className="w-full pl-10 px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>

        <select
          className="px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-white"
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="compliant">Compliant</option>
          <option value="non_compliant">Non-Compliant</option>
          <option value="pending">Pending</option>
        </select>

        <Link href="/employees/create">
          <button className="px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg font-medium flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Employee
          </button>
        </Link>
      </div>

      {loading ? (
        <div className="h-64 bg-slate-800/50 rounded-2xl animate-pulse" />
      ) : (
        <div className="bg-slate-800/50 rounded-2xl border border-slate-700 overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-900/50 border-b border-slate-700">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">Employee</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">Role</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">Certifications</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">Status</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {filteredEmployees.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    No employees found
                  </td>
                </tr>
              ) : (
                filteredEmployees.map((e: any) => (
                  <tr key={e.id} className="hover:bg-slate-800/50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-slate-400" />
                        </div>
                        <div>
                          <div className="font-medium">{e.full_name || `${e.firstName} ${e.lastName}`}</div>
                          <div className="text-sm text-slate-400">{e.employee_id || e.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-300">{e.role || e.tradeRole || 'N/A'}</td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <div className="text-green-400">{e.valid_certs || 0} valid</div>
                        <div className="text-red-400">{e.expired_certs || 0} expired</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {e.status === 'compliant' || e.status === 'active' ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-900/30 text-green-300 rounded-full text-xs font-medium">
                          <CheckCircle className="w-3 h-3" />
                          Compliant
                        </span>
                      ) : e.status === 'pending' ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-900/30 text-blue-300 rounded-full text-xs font-medium">
                          <Clock className="w-3 h-3" />
                          Pending
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-900/30 text-red-300 rounded-full text-xs font-medium">
                          <XCircle className="w-3 h-3" />
                          Non-Compliant
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <Link href={`/employees/${e.id}`}>
                        <button className="text-sm text-blue-400 hover:text-blue-300">
                          View Details
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
