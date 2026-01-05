'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  XCircle, 
  AlertTriangle, 
  Phone, 
  Mail, 
  Clock,
  FileText,
  User,
  ArrowLeft,
  Download,
  Shield
} from 'lucide-react';

/**
 * BLOCKED WORKERS VIEW
 * 
 * PURPOSE:
 * - Show all workers blocked from working
 * - Clear explanation of WHY blocked
 * - What certifications are missing/expired
 * - Escalation path to resolve
 * - Urgency indicators
 * 
 * OPERATIONS MANAGER USE CASE:
 * - "I need to staff a job tomorrow — who can't work and why?"
 * - "How do I get this person cleared?"
 * - "Who should I call?"
 */

interface BlockedWorker {
  id: string;
  employeeId: string;
  fullName: string;
  tradeRole: string;
  blockReason: string;
  missingCertifications: string[];
  expiredCertifications: string[];
  daysBlocked: number;
  lastWorkedDate?: string;
  assignedJobs?: string[];
}

export default function BlockedWorkersPage() {
  const [blockedWorkers, setBlockedWorkers] = useState<BlockedWorker[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBlockedWorkers();
  }, []);

  const loadBlockedWorkers = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/operations/blocked-workers');
      if (res.ok) {
        const data = await res.json();
        setBlockedWorkers(data);
      }
    } catch (err) {
      console.error('Failed to load blocked workers');
    } finally {
      setLoading(false);
    }
  };

  const exportBlockedList = () => {
    const csv = [
      ['Employee ID', 'Name', 'Trade', 'Block Reason', 'Missing Certs', 'Expired Certs', 'Days Blocked'].join(','),
      ...blockedWorkers.map(worker => [
        worker.employeeId,
        worker.fullName,
        worker.tradeRole,
        worker.blockReason,
        worker.missingCertifications.join('; '),
        worker.expiredCertifications.join('; '),
        worker.daysBlocked
      ].join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `blocked-workers-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link href="/operations">
          <button className="mb-4 flex items-center gap-2 text-slate-400 hover:text-white">
            <ArrowLeft className="w-4 h-4" />
            Back to Operations Dashboard
          </button>
        </Link>
        <div className="flex items-center gap-3 mb-2">
          <XCircle className="w-8 h-8 text-red-400" />
          <h1 className="text-3xl font-bold">Blocked Workers</h1>
        </div>
        <p className="text-slate-400">Workers who cannot be authorized for work — and how to resolve</p>
      </div>

      {/* Escalation Banner */}
      <div className="mb-6 p-6 bg-red-900/20 border border-red-800/50 rounded-lg">
        <div className="flex items-start gap-4">
          <Shield className="w-6 h-6 text-red-400 mt-1 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="text-lg font-bold text-red-300 mb-2">How to Clear a Blocked Worker</h3>
            <p className="text-slate-300 mb-4">
              Operations Managers <strong>cannot</strong> modify certification records. To resolve blocks:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-900/50 border border-slate-700 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Phone className="w-5 h-5 text-blue-400" />
                  <span className="font-medium text-white">Contact Compliance Admin</span>
                </div>
                <p className="text-sm text-slate-400">
                  Your Compliance Administrator can upload missing certifications or correct expired records.
                </p>
                <div className="mt-2 text-sm text-blue-300">
                  Phone: 1-800-SAFETY-1
                </div>
              </div>

              <div className="p-4 bg-slate-900/50 border border-slate-700 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Mail className="w-5 h-5 text-blue-400" />
                  <span className="font-medium text-white">Submit Documentation</span>
                </div>
                <p className="text-sm text-slate-400">
                  If you have proof of certification, forward it to your Safety Officer or upload via the portal.
                </p>
                <div className="mt-2 text-sm text-blue-300">
                  compliance@yourcompany.com
                </div>
              </div>
            </div>
          </div>
          <button
            onClick={exportBlockedList}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg flex items-center gap-2 text-sm font-medium whitespace-nowrap"
          >
            <Download className="w-4 h-4" />
            Export List
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="p-6 bg-slate-800/50 border border-slate-700 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-400">Total Blocked</span>
            <XCircle className="w-5 h-5 text-red-400" />
          </div>
          <div className="text-3xl font-bold text-red-400">{blockedWorkers.length}</div>
        </div>

        <div className="p-6 bg-slate-800/50 border border-slate-700 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-400">Missing Certifications</span>
            <FileText className="w-5 h-5 text-amber-400" />
          </div>
          <div className="text-3xl font-bold text-amber-400">
            {blockedWorkers.filter(w => w.missingCertifications.length > 0).length}
          </div>
        </div>

        <div className="p-6 bg-slate-800/50 border border-slate-700 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-400">Expired Certifications</span>
            <Clock className="w-5 h-5 text-orange-400" />
          </div>
          <div className="text-3xl font-bold text-orange-400">
            {blockedWorkers.filter(w => w.expiredCertifications.length > 0).length}
          </div>
        </div>
      </div>

      {/* Blocked Workers List */}
      {loading ? (
        <div className="h-96 bg-slate-800/50 rounded-2xl animate-pulse" />
      ) : blockedWorkers.length === 0 ? (
        <div className="p-12 bg-slate-800/50 rounded-2xl border border-slate-700 text-center">
          <XCircle className="w-16 h-16 text-emerald-400 mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-bold text-emerald-400 mb-2">No Blocked Workers</h3>
          <p className="text-slate-400">All crew members are cleared to work</p>
        </div>
      ) : (
        <div className="space-y-4">
          {blockedWorkers.map(worker => {
            const isUrgent = worker.daysBlocked > 7 || (worker.assignedJobs && worker.assignedJobs.length > 0);
            
            return (
              <div
                key={worker.id}
                className={`p-6 rounded-lg border ${
                  isUrgent
                    ? 'bg-red-900/20 border-red-800/50'
                    : 'bg-slate-800/50 border-slate-700'
                }`}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-red-900/30 rounded-lg">
                      <User className="w-6 h-6 text-red-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-xl font-bold text-white">{worker.fullName}</h3>
                        {isUrgent && (
                          <span className="px-2 py-1 bg-red-600 text-white text-xs font-bold rounded">
                            URGENT
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-slate-400">
                        <span>ID: {worker.employeeId}</span>
                        <span>Trade: {worker.tradeRole}</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          Blocked for {worker.daysBlocked} days
                        </span>
                      </div>
                    </div>
                  </div>
                  <Link href={`/employees/${worker.id}`}>
                    <button className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm">
                      View Details
                    </button>
                  </Link>
                </div>

                {/* Block Reason */}
                <div className="mb-4 p-4 bg-slate-900/50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <XCircle className="w-5 h-5 text-red-400" />
                    <span className="font-semibold text-red-300">Block Reason</span>
                  </div>
                  <p className="text-slate-300">{worker.blockReason}</p>
                </div>

                {/* Missing/Expired Certifications */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {worker.missingCertifications.length > 0 && (
                    <div className="p-4 bg-amber-900/20 border border-amber-800/50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="w-5 h-5 text-amber-400" />
                        <span className="font-semibold text-amber-300">Missing Certifications</span>
                      </div>
                      <ul className="space-y-1">
                        {worker.missingCertifications.map((cert, idx) => (
                          <li key={idx} className="text-sm text-slate-300 flex items-start gap-2">
                            <span className="text-amber-400 mt-1">•</span>
                            <span>{cert}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {worker.expiredCertifications.length > 0 && (
                    <div className="p-4 bg-orange-900/20 border border-orange-800/50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="w-5 h-5 text-orange-400" />
                        <span className="font-semibold text-orange-300">Expired Certifications</span>
                      </div>
                      <ul className="space-y-1">
                        {worker.expiredCertifications.map((cert, idx) => (
                          <li key={idx} className="text-sm text-slate-300 flex items-start gap-2">
                            <span className="text-orange-400 mt-1">•</span>
                            <span>{cert}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Job Assignments (if applicable) */}
                {worker.assignedJobs && worker.assignedJobs.length > 0 && (
                  <div className="p-4 bg-red-900/30 border border-red-700/50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="w-5 h-5 text-red-400" />
                      <span className="font-semibold text-red-300">Assigned to Active Jobs</span>
                    </div>
                    <div className="text-sm text-slate-300">
                      This worker is scheduled for: {worker.assignedJobs.join(', ')}
                    </div>
                    <div className="mt-2 text-xs text-red-300">
                      → <strong>Action Required:</strong> Find replacement or clear certifications immediately
                    </div>
                  </div>
                )}

                {/* Action Steps */}
                <div className="mt-4 p-4 bg-blue-900/20 border border-blue-800/50 rounded-lg">
                  <div className="text-sm">
                    <strong className="text-blue-300">To Resolve:</strong>
                    <ol className="mt-2 space-y-1 text-slate-300 ml-4 list-decimal">
                      <li>Contact Compliance Admin (1-800-SAFETY-1)</li>
                      <li>Provide employee ID: <span className="font-mono text-blue-300">{worker.employeeId}</span></li>
                      <li>Reference required certifications listed above</li>
                      <li>Submit proof of certification if available</li>
                    </ol>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
