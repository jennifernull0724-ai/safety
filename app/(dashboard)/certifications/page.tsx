'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Award, Search, Plus, Calendar, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

export default function CertificationsPage() {
  const [certifications, setCertifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    loadCertifications();
  }, []);

  const loadCertifications = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/certifications');
      if (res.ok) setCertifications(await res.json());
    } catch (err) {
      console.error('Failed to load certifications');
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
