'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Award, Search, Plus, Calendar, AlertTriangle, CheckCircle, XCircle, Clock, Info, Download, FileText } from 'lucide-react';

export default function CertificationsPage() {
  const [certifications, setCertifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [snapshotDate, setSnapshotDate] = useState<string>('');
  const [isSnapshotMode, setIsSnapshotMode] = useState(false);

  const loadCertifications = async () => {
    try {
      setLoading(true);
      const url = isSnapshotMode && snapshotDate
        ? `/api/certifications?asOfDate=${snapshotDate}`
        : '/api/certifications';
      const res = await fetch(url);
      if (res.ok) setCertifications(await res.json());
    } catch (err) {
      console.error('Failed to load certifications');
    } finally {
      setLoading(false);
    }
  };

  const applySnapshot = () => {
    if (!snapshotDate) {
      alert('Please select a date for the snapshot');
      return;
    }
    setIsSnapshotMode(true);
    loadCertifications();
  };

  const clearSnapshot = () => {
    setIsSnapshotMode(false);
    setSnapshotDate('');
    loadCertifications();
  };

  useEffect(() => {
    loadCertifications();
  }, [isSnapshotMode, snapshotDate]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Certifications</h1>
        <p className="text-slate-400">Organization-wide certification registry with proof documents</p>
      </div>

      {/* Point-in-Time Snapshot Controls */}
      <div className="mb-6 p-4 bg-slate-800/50 border border-slate-700 rounded-lg">
        <div className="flex items-start gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-2 flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-400" />
              View Compliance As Of Date (Historical Snapshot)
              <div className="group relative">
                <Info className="w-4 h-4 text-slate-500 cursor-help" />
                <div className="absolute left-0 top-6 w-96 p-4 bg-slate-900 border border-slate-600 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                  <div className="text-sm text-slate-300">
                    <strong className="text-white">Historical Snapshot Query</strong>
                    <p className="mt-2">
                      Snapshots show compliance state as recorded at the selected date. Later corrections do not alter
                      historical snapshots.
                    </p>
                    <p className="mt-2">
                      This is a read-only view that reflects what was known and valid at that specific point in time.
                    </p>
                  </div>
                </div>
              </div>
            </label>
            <div className="flex gap-3">
              <input
                type="date"
                className="px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-white"
                value={snapshotDate}
                onChange={e => setSnapshotDate(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
              />
              <button
                onClick={applySnapshot}
                disabled={!snapshotDate}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:text-slate-500 rounded-lg font-medium"
              >
                Apply Snapshot
              </button>
              {isSnapshotMode && (
                <button onClick={clearSnapshot} className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg">
                  Clear Snapshot (View Current)
                </button>
              )}
            </div>
          </div>
          <button
            onClick={generateAuditPackage}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg flex items-center gap-2 font-medium"
          >
            <Download className="w-4 h-4" />
            Generate Audit Package
          </button>
        </div>
      </div>

      {/* Snapshot Mode Banner */}
      {isSnapshotMode && (
        <div className="mb-6 p-4 bg-amber-900/20 border border-amber-800/50 rounded-lg">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-amber-400" />
            <div>
              <strong className="text-amber-300">Historical Snapshot — Read-Only View</strong>
              <p className="text-sm text-slate-400 mt-1">
                Viewing compliance state as of {new Date(snapshotDate).toLocaleDateString()}. This snapshot reflects
                data as it existed at that time.
              </p>
            </div>
          </div>
        </div>
      )}res = await fetch('/api/audit/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          includeAll: true,
          format: 'zip',
        }),
      });
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `audit-package-${new Date().toISOString()}.zip`;
        a.click();
      } else {
        alert('Failed to generate audit package');
      }
    } catch (err) {
      alert('Error generating audit package'ailed to load certifications');
    } finally {
      setLoading(false);
    }
  };

  const filteredCertifications = certifications.filter((c: any) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = !q || c.type?.toLowerCase().includes(q) || c.issuing_authority?.toLowerCase().includes(q);
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: certifications.length,
    valid: certifications.filter(c => c.status === 'PASS' || c.status === 'valid').length,
    expiring: certifications.filter(c => c.status === 'expiring').length,
    expired: certifications.filter(c => c.status === 'FAIL' || c.status === 'expired').length,
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Certifications</h1>
        <p className="text-slate-400">Organization-wide certification registry with proof documents</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="p-6 bg-slate-800/50 rounded-2xl border border-slate-700">
          <div className="text-sm text-slate-400 mb-2">Total</div>
          <div className="text-3xl font-bold">{stats.total}</div>
        </div>
        <div className="p-6 bg-slate-800/50 rounded-2xl border border-slate-700">
          <div className="text-sm text-slate-400 mb-2">Valid</div>
          <div className="text-3xl font-bold text-green-400">{stats.valid}</div>
        </div>
        <div className="p-6 bg-slate-800/50 rounded-2xl border border-slate-700">
          <div className="text-sm text-slate-400 mb-2">Expiring Soon</div>
          <div className="text-3xl font-bold text-amber-400">{stats.expiring}</div>
        </div>
        <div className="p-6 bg-slate-800/50 rounded-2xl border border-slate-700">
          <div className="text-sm text-slate-400 mb-2">Expired</div>
          <div className="text-3xl font-bold text-red-400">{stats.expired}</div>
        </div>
      </div>

      <div className="mb-6 flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input type="text" placeholder="Search certifications..." className="w-full pl-10 px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-white" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
        </div>
        <select className="px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="all">All Status</option>
          <option value="PASS">Valid</option>
          <option value="expiring">Expiring</option>
          <option value="FAIL">Expired</option>
        </select>
      </div>

      {loading ? (
        <div className="h-96 bg-slate-800/50 rounded-2xl animate-pulse" />
      ) : (
        <div className="bg-slate-800/50 rounded-2xl border border-slate-700 overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-900/50 border-b border-slate-700">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">Type</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">Employee</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">Authority</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">Expiration</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {filteredCertifications.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-500">No certifications found</td></tr>
              ) : (
                filteredCertifications.map((cert: any) => (
                  <tr key={cert.id} className="hover:bg-slate-800/50">
                    <td className="px-6 py-4 font-medium">{cert.type}</td>
                    <td className="px-6 py-4"><Link href={`/employees/${cert.employee_id}`} className="text-blue-400 hover:text-blue-300">View Employee</Link></td>
                    <td className="px-6 py-4 text-sm text-slate-300">{cert.issuing_authority || 'N/A'}</td>
                    <td className="px-6 py-4 text-sm">{cert.expiration_date ? new Date(cert.expiration_date).toLocaleDateString() : 'No expiration'}</td>
                    <td className="px-6 py-4">
                      {cert.status === 'PASS' ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-900/30 text-green-300 rounded-full text-xs font-medium"><CheckCircle className="w-3 h-3" />Valid</span>
                      ) : cert.status === 'expiring' ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-900/30 text-amber-300 rounded-full text-xs font-medium"><AlertTriangle className="w-3 h-3" />Expiring</span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-900/30 text-red-300 rounded-full text-xs font-medium"><XCircle className="w-3 h-3" />Expired</span>
                      )}
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
