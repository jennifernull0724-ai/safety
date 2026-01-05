'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Users, 
  Download, 
  Printer,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ArrowLeft,
  Calendar,
  Briefcase,
  QrCode
} from 'lucide-react';

/**
 * CREW ROSTER EXPORT VIEW
 * 
 * PURPOSE:
 * - Operations manager crew planning
 * - Printable roster for field use
 * - Status-at-a-glance for job assignments
 * - Export for offline use
 * 
 * USE CASES:
 * - "I need a printable roster for tomorrow's job"
 * - "Show me who's cleared for the weekend crew"
 * - "Export status for payroll/scheduling system"
 */

interface CrewMember {
  id: string;
  employeeId: string;
  fullName: string;
  tradeRole: string;
  status: 'cleared' | 'blocked' | 'pending';
  certifications: {
    type: string;
    expirationDate?: string;
    status: 'PASS' | 'FAIL' | 'INCOMPLETE';
  }[];
  phoneNumber?: string;
  emergencyContact?: string;
}

export default function CrewRosterPage() {
  const [crewMembers, setCrewMembers] = useState<CrewMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTrades, setSelectedTrades] = useState<string[]>([]);
  const [jobName, setJobName] = useState('');
  const [jobDate, setJobDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    loadCrewData();
  }, []);

  const loadCrewData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/operations/crew-roster');
      if (res.ok) {
        const data = await res.json();
        setCrewMembers(data);
      }
    } catch (err) {
      console.error('Failed to load crew data');
    } finally {
      setLoading(false);
    }
  };

  const availableTrades = Array.from(new Set(crewMembers.map(m => m.tradeRole)));

  const toggleTrade = (trade: string) => {
    setSelectedTrades(prev => 
      prev.includes(trade) 
        ? prev.filter(t => t !== trade)
        : [...prev, trade]
    );
  };

  const filteredCrew = selectedTrades.length === 0 
    ? crewMembers 
    : crewMembers.filter(m => selectedTrades.includes(m.tradeRole));

  const exportCSV = () => {
    const csv = [
      ['Job', 'Date', 'Employee ID', 'Name', 'Trade', 'Status', 'Certifications', 'Phone', 'Emergency Contact'].join(','),
      ...filteredCrew.map(member => [
        jobName || 'N/A',
        jobDate,
        member.employeeId,
        member.fullName,
        member.tradeRole,
        member.status.toUpperCase(),
        member.certifications.map(c => `${c.type} (${c.status})`).join('; '),
        member.phoneNumber || 'N/A',
        member.emergencyContact || 'N/A'
      ].join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `crew-roster-${jobDate}.csv`;
    a.click();
  };

  const printRoster = () => {
    window.print();
  };

  const stats = {
    total: filteredCrew.length,
    cleared: filteredCrew.filter(m => m.status === 'cleared').length,
    blocked: filteredCrew.filter(m => m.status === 'blocked').length,
    pending: filteredCrew.filter(m => m.status === 'pending').length,
  };

  return (
    <div className="max-w-7xl mx-auto print:max-w-full">
      {/* Header - Hidden when printing */}
      <div className="mb-8 print:hidden">
        <Link href="/operations">
          <button className="mb-4 flex items-center gap-2 text-slate-400 hover:text-white">
            <ArrowLeft className="w-4 h-4" />
            Back to Operations Dashboard
          </button>
        </Link>
        <div className="flex items-center gap-3 mb-2">
          <Users className="w-8 h-8 text-blue-400" />
          <h1 className="text-3xl font-bold">Crew Roster</h1>
        </div>
        <p className="text-slate-400">Printable crew status roster for field operations</p>
      </div>

      {/* Job Details */}
      <div className="mb-6 p-6 bg-slate-800/50 border border-slate-700 rounded-lg print:bg-white print:border-black">
        <h2 className="text-lg font-bold mb-4 print:text-black">Job Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-slate-400 print:text-black">
              <Briefcase className="w-4 h-4 inline mr-2" />
              Job Name/Site
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white print:bg-white print:border-black print:text-black"
              placeholder="Enter job name or site location"
              value={jobName}
              onChange={e => setJobName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-slate-400 print:text-black">
              <Calendar className="w-4 h-4 inline mr-2" />
              Job Date
            </label>
            <input
              type="date"
              className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white print:bg-white print:border-black print:text-black"
              value={jobDate}
              onChange={e => setJobDate(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Trade Filters - Hidden when printing */}
      <div className="mb-6 print:hidden">
        <h3 className="text-sm font-medium mb-3 text-slate-400">Filter by Trade</h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedTrades([])}
            className={`px-4 py-2 rounded-lg font-medium ${
              selectedTrades.length === 0
                ? 'bg-blue-600 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            All Trades
          </button>
          {availableTrades.map(trade => (
            <button
              key={trade}
              onClick={() => toggleTrade(trade)}
              className={`px-4 py-2 rounded-lg font-medium ${
                selectedTrades.includes(trade)
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {trade}
            </button>
          ))}
        </div>
      </div>

      {/* Stats - Hidden when printing */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 print:hidden">
        <div className="p-4 bg-slate-800/50 border border-slate-700 rounded-lg">
          <div className="text-2xl font-bold">{stats.total}</div>
          <div className="text-sm text-slate-400">Total Crew</div>
        </div>
        <div className="p-4 bg-emerald-900/20 border border-emerald-800/50 rounded-lg">
          <div className="text-2xl font-bold text-emerald-400">{stats.cleared}</div>
          <div className="text-sm text-emerald-300">Cleared</div>
        </div>
        <div className="p-4 bg-red-900/20 border border-red-800/50 rounded-lg">
          <div className="text-2xl font-bold text-red-400">{stats.blocked}</div>
          <div className="text-sm text-red-300">Blocked</div>
        </div>
        <div className="p-4 bg-amber-900/20 border border-amber-800/50 rounded-lg">
          <div className="text-2xl font-bold text-amber-400">{stats.pending}</div>
          <div className="text-sm text-amber-300">Pending</div>
        </div>
      </div>

      {/* Action Buttons - Hidden when printing */}
      <div className="mb-6 flex gap-3 print:hidden">
        <button
          onClick={printRoster}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg flex items-center gap-2 font-medium"
        >
          <Printer className="w-5 h-5" />
          Print Roster
        </button>
        <button
          onClick={exportCSV}
          className="px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg flex items-center gap-2 font-medium"
        >
          <Download className="w-5 h-5" />
          Export CSV
        </button>
      </div>

      {/* Print Header - Visible only when printing */}
      <div className="hidden print:block mb-6 border-b-2 border-black pb-4">
        <h1 className="text-2xl font-bold mb-2">CREW ROSTER</h1>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <strong>Job:</strong> {jobName || '________________'}
          </div>
          <div>
            <strong>Date:</strong> {new Date(jobDate).toLocaleDateString()}
          </div>
          <div>
            <strong>Total Crew:</strong> {stats.total}
          </div>
          <div>
            <strong>Cleared:</strong> {stats.cleared} | <strong>Blocked:</strong> {stats.blocked}
          </div>
        </div>
        <div className="mt-2 text-xs text-gray-600">
          Generated: {new Date().toLocaleString()} | T-REX AI OS Compliance Verification System
        </div>
      </div>

      {/* Roster Table */}
      {loading ? (
        <div className="h-96 bg-slate-800/50 rounded-2xl animate-pulse print:hidden" />
      ) : (
        <div className="bg-slate-800/50 rounded-2xl border border-slate-700 overflow-hidden print:bg-white print:border-black">
          <table className="w-full">
            <thead className="bg-slate-900/50 print:bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-400 print:text-black print:border print:border-black">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-400 print:text-black print:border print:border-black">
                  Employee
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-400 print:text-black print:border print:border-black">
                  Trade
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-400 print:text-black print:border print:border-black">
                  Certifications
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-400 print:hidden">
                  QR
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700 print:divide-black">
              {filteredCrew.map(member => (
                <tr key={member.id} className="print:border print:border-black">
                  <td className="px-4 py-3 print:border print:border-black">
                    {member.status === 'cleared' ? (
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-emerald-400 print:hidden" />
                        <span className="text-emerald-400 font-medium text-sm print:text-black">✓ CLEARED</span>
                      </div>
                    ) : member.status === 'blocked' ? (
                      <div className="flex items-center gap-2">
                        <XCircle className="w-5 h-5 text-red-400 print:hidden" />
                        <span className="text-red-400 font-medium text-sm print:text-black">✗ BLOCKED</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-amber-400 print:hidden" />
                        <span className="text-amber-400 font-medium text-sm print:text-black">⚠ PENDING</span>
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 print:border print:border-black">
                    <div className="font-medium text-white print:text-black">{member.fullName}</div>
                    <div className="text-sm text-slate-400 print:text-gray-600">ID: {member.employeeId}</div>
                  </td>
                  <td className="px-4 py-3 text-slate-300 print:text-black print:border print:border-black">
                    {member.tradeRole}
                  </td>
                  <td className="px-4 py-3 print:border print:border-black">
                    <div className="space-y-1">
                      {member.certifications.map((cert, idx) => (
                        <div key={idx} className="text-sm">
                          <span className="text-slate-300 print:text-black">{cert.type}</span>
                          {cert.expirationDate && (
                            <span className="text-slate-500 print:text-gray-600 ml-2">
                              Exp: {new Date(cert.expirationDate).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 print:hidden">
                    <Link href={`/verify/employee/${member.id}`} target="_blank">
                      <button className="p-2 bg-blue-600 hover:bg-blue-500 rounded">
                        <QrCode className="w-4 h-4" />
                      </button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Print Footer - Visible only when printing */}
      <div className="hidden print:block mt-6 border-t-2 border-black pt-4 text-xs text-gray-600">
        <div className="flex justify-between">
          <div>
            <strong>Supervisor Signature:</strong> _______________________________
          </div>
          <div>
            <strong>Date:</strong> _______________________________
          </div>
        </div>
        <div className="mt-4">
          <strong>Notes:</strong>
          <div className="mt-2 border border-black h-20"></div>
        </div>
      </div>
    </div>
  );
}
