'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Shield,
  Plus,
  Search,
  Users,
  QrCode,
  FileCheck,
  ArrowRight,
  RefreshCw
} from 'lucide-react';

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [industryFilter, setIndustryFilter] = useState('all');
  const [employees, setEmployees] = useState<any[]>([]);
  const [certifications, setCertifications] = useState<any[]>([]);
  const [verificationLogs, setVerificationLogs] = useState<any[]>([]);
  const [auditEvents, setAuditEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('activity');

  React.useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [empRes, certRes, verRes, auditRes] = await Promise.all([
        fetch('/api/employees'),
        fetch('/api/certifications'),
        fetch('/api/verifications'),
        fetch('/api/audit-events')
      ]);

      if (empRes.ok) setEmployees(await empRes.json());
      if (certRes.ok) setCertifications(await certRes.json());
      if (verRes.ok) setVerificationLogs(await verRes.json());
      if (auditRes.ok) setAuditEvents(await auditRes.json());
    } catch (err) {
      console.error('Failed to load dashboard data');
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
      e.employee_id?.toLowerCase().includes(q) ||
      e.employer?.toLowerCase().includes(q);

    const matchesStatus = statusFilter === 'all' || e.status === statusFilter;
    const matchesIndustry = industryFilter === 'all' || e.industry === industryFilter;

    return matchesSearch && matchesStatus && matchesIndustry;
  });

  const stats = {
    totalEmployees: employees.length,
    compliant: employees.filter(e => e.status === 'compliant' || e.status === 'active').length,
    pending: employees.filter(e => e.status === 'pending').length,
    nonCompliant: employees.filter(e => e.status === 'non_compliant' || e.status === 'inactive').length,
    totalCertifications: certifications.length,
    validCertifications: certifications.filter(c => c.status === 'valid' || c.status === 'PASS').length,
    recentVerifications: verificationLogs.filter((v: any) => {
      const created = new Date(v.created_at || v.timestamp);
      return created > new Date(Date.now() - 24 * 60 * 60 * 1000);
    }).length
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <div className="font-semibold">System of Proof</div>
              <div className="text-xs text-slate-500">Dashboard</div>
            </div>
          </Link>

          <div className="flex gap-2">
            <button
              onClick={loadData}
              className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-slate-800 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <Link href="/employees/create">
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg font-medium flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Add Employee
              </button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Overview */}
        <section className="mb-8">
          {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 rounded-2xl bg-slate-800/50 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-6 bg-slate-800/50 rounded-2xl border border-slate-700">
                <div className="text-sm text-slate-400 mb-2">Total Employees</div>
                <div className="text-3xl font-bold">{stats.totalEmployees}</div>
              </div>
              <div className="p-6 bg-slate-800/50 rounded-2xl border border-slate-700">
                <div className="text-sm text-slate-400 mb-2">Compliant</div>
                <div className="text-3xl font-bold text-green-400">{stats.compliant}</div>
              </div>
              <div className="p-6 bg-slate-800/50 rounded-2xl border border-slate-700">
                <div className="text-sm text-slate-400 mb-2">Valid Certifications</div>
                <div className="text-3xl font-bold text-blue-400">{stats.validCertifications}</div>
              </div>
              <div className="p-6 bg-slate-800/50 rounded-2xl border border-slate-700">
                <div className="text-sm text-slate-400 mb-2">Verifications (24h)</div>
                <div className="text-3xl font-bold text-purple-400">{stats.recentVerifications}</div>
              </div>
            </div>
          )}
        </section>

        {/* Quick Actions */}
        <section className="mb-8 grid sm:grid-cols-3 gap-4">
          <Link href="/employees/create">
            <div className="p-6 bg-slate-800/50 rounded-2xl border border-slate-700 hover:bg-slate-800 transition-colors cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Users className="w-8 h-8 text-blue-400" />
                  <h3 className="font-semibold">Add Employee</h3>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-500" />
              </div>
            </div>
          </Link>

          <Link href="/qr-scanner">
            <div className="p-6 bg-slate-800/50 rounded-2xl border border-slate-700 hover:bg-slate-800 transition-colors cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <QrCode className="w-8 h-8 text-green-400" />
                  <h3 className="font-semibold">Scan QR Code</h3>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-500" />
              </div>
            </div>
          </Link>

          <Link href="/audit-vault">
            <div className="p-6 bg-slate-800/50 rounded-2xl border border-slate-700 hover:bg-slate-800 transition-colors cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileCheck className="w-8 h-8 text-amber-400" />
                  <h3 className="font-semibold">Audit Vault</h3>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-500" />
              </div>
            </div>
          </Link>
        </section>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Employee List */}
          <div className="lg:col-span-2">
            <div className="mb-4 flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search employees..."
                  className="w-full pl-10 px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>

              <select
                className="px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white"
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="compliant">Compliant</option>
                <option value="active">Active</option>
                <option value="non_compliant">Non-Compliant</option>
                <option value="inactive">Inactive</option>
                <option value="pending">Pending</option>
                <option value="blocked">Blocked</option>
              </select>

              <select
                className="px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white"
                value={industryFilter}
                onChange={e => setIndustryFilter(e.target.value)}
              >
                <option value="all">All Industries</option>
                <option value="railroad">Railroad</option>
                <option value="construction">Construction</option>
                <option value="environmental">Environmental</option>
                <option value="general">General</option>
              </select>
            </div>

            {loading ? (
              <div className="h-64 bg-slate-800/50 rounded-2xl animate-pulse" />
            ) : (
              <div className="bg-slate-800/50 rounded-2xl border border-slate-700 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-900/50 border-b border-slate-700">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium text-slate-300">Employee</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-slate-300">Role</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-slate-300">Status</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-slate-300">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700">
                      {filteredEmployees.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="px-4 py-8 text-center text-slate-500">
                            No employees found
                          </td>
                        </tr>
                      ) : (
                        filteredEmployees.map((e: any) => (
                          <tr key={e.id} className="hover:bg-slate-800/50">
                            <td className="px-4 py-3">
                              <div className="font-medium">{e.full_name || `${e.firstName} ${e.lastName}`}</div>
                              <div className="text-sm text-slate-400">{e.employer || e.organization?.name}</div>
                            </td>
                            <td className="px-4 py-3 text-sm text-slate-300">{e.role || e.tradeRole}</td>
                            <td className="px-4 py-3">
                              <span className={`px-2 py-1 rounded text-xs font-medium ${
                                e.status === 'compliant' || e.status === 'active' ? 'bg-green-900/30 text-green-300' :
                                e.status === 'pending' ? 'bg-blue-900/30 text-blue-300' :
                                'bg-red-900/30 text-red-300'
                              }`}>
                                {e.status}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <Link href={`/people/employees/${e.id}`}>
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
              </div>
            )}
          </div>

          {/* Activity & Audit Sidebar */}
          <div>
            <div className="bg-slate-800/50 rounded-2xl border border-slate-700 overflow-hidden">
              <div className="flex border-b border-slate-700">
                <button
                  onClick={() => setActiveTab('activity')}
                  className={`flex-1 px-4 py-3 text-sm font-medium ${
                    activeTab === 'activity' ? 'bg-slate-900/50 text-white' : 'text-slate-400'
                  }`}
                >
                  Activity
                </button>
                <button
                  onClick={() => setActiveTab('audit')}
                  className={`flex-1 px-4 py-3 text-sm font-medium ${
                    activeTab === 'audit' ? 'bg-slate-900/50 text-white' : 'text-slate-400'
                  }`}
                >
                  Audit Trail
                </button>
              </div>

              <div className="p-4">
                {activeTab === 'activity' ? (
                  loading ? (
                    <div className="h-96 bg-slate-700/30 rounded-xl animate-pulse" />
                  ) : verificationLogs.length === 0 ? (
                    <div className="text-center py-12 text-slate-500">
                      No recent activity
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {verificationLogs.slice(0, 10).map((log: any, i: number) => (
                        <div key={i} className="p-3 bg-slate-700/30 rounded-lg">
                          <div className="text-sm font-medium">{log.result || 'Verification'}</div>
                          <div className="text-xs text-slate-400 mt-1">
                            {new Date(log.created_at || log.timestamp).toLocaleString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  )
                ) : (
                  loading ? (
                    <div className="h-96 bg-slate-700/30 rounded-xl animate-pulse" />
                  ) : auditEvents.length === 0 ? (
                    <div className="text-center py-12 text-slate-500">
                      No audit events
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {auditEvents.slice(0, 10).map((event: any, i: number) => (
                        <div key={i} className="p-3 bg-slate-700/30 rounded-lg">
                          <div className="text-sm font-medium">{event.action || event.type}</div>
                          <div className="text-xs text-slate-400 mt-1">
                            {new Date(event.created_at || event.timestamp).toLocaleString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
