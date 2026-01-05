'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Search,
  CheckCircle,
  AlertTriangle,
  FileText,
  Database,
  GitBranch,
  Shield,
  Clock,
  Eye,
  TrendingUp,
  XCircle
} from 'lucide-react';

/**
 * SUPPORT / INTERNAL REVIEWER DASHBOARD
 * 
 * PURPOSE:
 * - Review system logs and audit trails
 * - Validate data integrity
 * - Assist with audit preparation
 * - Trace events through the system
 * 
 * AUTHORITY:
 * - Read-only access to all compliance data
 * - Cannot edit employee records
 * - Cannot override enforcement logic
 * - Can export evidence packages for review
 * 
 * WHAT THEY CARE ABOUT:
 * - Traceability (can I trace every event?)
 * - Evidence consistency (does data match across views?)
 * - Reproducibility (do queries return same results?)
 */

interface SystemHealth {
  dataIntegrity: 'healthy' | 'warning' | 'critical';
  auditTrailGaps: number;
  inconsistentRecords: number;
  untracedEvents: number;
}

interface RecentActivity {
  id: string;
  timestamp: string;
  type: string;
  description: string;
  user: string;
  traceable: boolean;
}

export default function SupportDashboardPage() {
  const [systemHealth] = useState<SystemHealth>({
    dataIntegrity: 'healthy',
    auditTrailGaps: 0,
    inconsistentRecords: 2,
    untracedEvents: 0
  });

  const [recentActivity] = useState<RecentActivity[]>([
    {
      id: '1',
      timestamp: '2026-01-05T10:30:00Z',
      type: 'certification_added',
      description: 'OSHA 10 certification added for EMP-2401',
      user: 'admin@company.com',
      traceable: true
    },
    {
      id: '2',
      timestamp: '2026-01-05T09:15:00Z',
      type: 'employee_blocked',
      description: 'EMP-3201 blocked due to expired First Aid certification',
      user: 'system (automated)',
      traceable: true
    },
    {
      id: '3',
      timestamp: '2026-01-05T08:45:00Z',
      type: 'qr_verified',
      description: 'QR verification for EMP-1501 at Site Alpha',
      user: 'field-user@company.com',
      traceable: true
    },
    {
      id: '4',
      timestamp: '2026-01-05T07:30:00Z',
      type: 'correction_submitted',
      description: 'Correction request for EMP-2401 certification date',
      user: 'compliance@company.com',
      traceable: true
    }
  ]);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Search className="w-8 h-8 text-purple-600" />
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Support & Internal Review</h1>
              <p className="text-sm text-slate-600">Data validation, traceability, and audit preparation</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/support/traceability"
              className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-900 font-semibold rounded-lg transition-colors"
            >
              <GitBranch className="w-4 h-4" />
              Trace Event
            </Link>
            <Link
              href="/support/consistency-check"
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors"
            >
              <Database className="w-4 h-4" />
              Check Integrity
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Authority Notice */}
        <div className="mb-8 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
          <div className="flex items-start gap-3">
            <Eye className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-blue-900 mb-1">Support/Reviewer Authority</h3>
              <p className="text-sm text-blue-800">
                You have <strong>read-only access</strong> to all compliance data for review and validation. 
                You <strong>cannot edit</strong> employee records or override enforcement logic, but you can 
                trace events, validate data integrity, and prepare audit evidence packages.
              </p>
            </div>
          </div>
        </div>

        {/* System Health Overview */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Data Integrity Status</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Overall Status */}
            <div className="p-6 bg-white border border-slate-200 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-slate-700">Overall Status</span>
                {systemHealth.dataIntegrity === 'healthy' ? (
                  <CheckCircle className="w-6 h-6 text-green-600" />
                ) : systemHealth.dataIntegrity === 'warning' ? (
                  <AlertTriangle className="w-6 h-6 text-yellow-600" />
                ) : (
                  <XCircle className="w-6 h-6 text-red-600" />
                )}
              </div>
              <p className={`text-2xl font-bold ${
                systemHealth.dataIntegrity === 'healthy' ? 'text-green-600' :
                systemHealth.dataIntegrity === 'warning' ? 'text-yellow-600' :
                'text-red-600'
              }`}>
                {systemHealth.dataIntegrity.toUpperCase()}
              </p>
            </div>

            {/* Audit Trail Gaps */}
            <div className="p-6 bg-white border border-slate-200 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-slate-700">Audit Trail Gaps</span>
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <p className={`text-2xl font-bold ${
                systemHealth.auditTrailGaps === 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {systemHealth.auditTrailGaps}
              </p>
              <p className="text-xs text-slate-600 mt-1">Missing audit entries</p>
            </div>

            {/* Inconsistent Records */}
            <div className="p-6 bg-white border border-slate-200 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-slate-700">Inconsistencies</span>
                <AlertTriangle className="w-6 h-6 text-amber-600" />
              </div>
              <p className={`text-2xl font-bold ${
                systemHealth.inconsistentRecords === 0 ? 'text-green-600' : 'text-amber-600'
              }`}>
                {systemHealth.inconsistentRecords}
              </p>
              <p className="text-xs text-slate-600 mt-1">
                {systemHealth.inconsistentRecords > 0 ? (
                  <Link href="/support/consistency-check" className="text-blue-600 hover:underline">
                    Review now →
                  </Link>
                ) : (
                  'All data consistent'
                )}
              </p>
            </div>

            {/* Untraced Events */}
            <div className="p-6 bg-white border border-slate-200 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-slate-700">Untraced Events</span>
                <GitBranch className="w-6 h-6 text-green-600" />
              </div>
              <p className={`text-2xl font-bold ${
                systemHealth.untracedEvents === 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {systemHealth.untracedEvents}
              </p>
              <p className="text-xs text-slate-600 mt-1">Events without audit trail</p>
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Quick Actions</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/support/traceability"
              className="p-6 bg-white border border-slate-200 rounded-lg hover:border-purple-300 transition-colors"
            >
              <GitBranch className="w-8 h-8 text-purple-600 mb-3" />
              <h3 className="text-lg font-bold text-slate-900 mb-2">Event Traceability</h3>
              <p className="text-sm text-slate-600">
                Trace any event through the system from origin to current state
              </p>
            </Link>

            <Link
              href="/support/consistency-check"
              className="p-6 bg-white border border-slate-200 rounded-lg hover:border-purple-300 transition-colors"
            >
              <Database className="w-8 h-8 text-blue-600 mb-3" />
              <h3 className="text-lg font-bold text-slate-900 mb-2">Consistency Checker</h3>
              <p className="text-sm text-slate-600">
                Validate that data matches across all views and exports
              </p>
            </Link>

            <Link
              href="/support/audit-prep"
              className="p-6 bg-white border border-slate-200 rounded-lg hover:border-purple-300 transition-colors"
            >
              <Shield className="w-8 h-8 text-green-600 mb-3" />
              <h3 className="text-lg font-bold text-slate-900 mb-2">Audit Preparation</h3>
              <p className="text-sm text-slate-600">
                Prepare evidence packages and verify audit readiness
              </p>
            </Link>

            <Link
              href="/support/data-validation"
              className="p-6 bg-white border border-slate-200 rounded-lg hover:border-purple-300 transition-colors"
            >
              <CheckCircle className="w-8 h-8 text-green-600 mb-3" />
              <h3 className="text-lg font-bold text-slate-900 mb-2">Data Validation</h3>
              <p className="text-sm text-slate-600">
                Run integrity checks on employee and certification records
              </p>
            </Link>

            <Link
              href="/support/reproducibility"
              className="p-6 bg-white border border-slate-200 rounded-lg hover:border-purple-300 transition-colors"
            >
              <TrendingUp className="w-8 h-8 text-blue-600 mb-3" />
              <h3 className="text-lg font-bold text-slate-900 mb-2">Reproducibility Test</h3>
              <p className="text-sm text-slate-600">
                Verify that queries return consistent results over time
              </p>
            </Link>

            <Link
              href="/support/evidence-export"
              className="p-6 bg-white border border-slate-200 rounded-lg hover:border-purple-300 transition-colors"
            >
              <FileText className="w-8 h-8 text-purple-600 mb-3" />
              <h3 className="text-lg font-bold text-slate-900 mb-2">Evidence Export</h3>
              <p className="text-sm text-slate-600">
                Export complete evidence packages for internal review
              </p>
            </Link>
          </div>
        </section>

        {/* Recent Activity */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-900">Recent System Activity</h2>
            <Link
              href="/support/activity-log"
              className="text-sm text-blue-600 hover:underline font-semibold"
            >
              View Full Log →
            </Link>
          </div>

          <div className="space-y-3">
            {recentActivity.map((activity) => (
              <div 
                key={activity.id}
                className="p-4 bg-white border border-slate-200 rounded-lg hover:border-purple-300 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded ${
                      activity.type.includes('blocked') ? 'bg-red-100' :
                      activity.type.includes('added') ? 'bg-green-100' :
                      activity.type.includes('verified') ? 'bg-blue-100' :
                      'bg-amber-100'
                    }`}>
                      {activity.type.includes('blocked') ? (
                        <XCircle className="w-5 h-5 text-red-600" />
                      ) : activity.type.includes('added') ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : activity.type.includes('verified') ? (
                        <Shield className="w-5 h-5 text-blue-600" />
                      ) : (
                        <FileText className="w-5 h-5 text-amber-600" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">{activity.description}</h3>
                      <div className="flex items-center gap-4 mt-1 text-xs text-slate-600">
                        <span>👤 {activity.user}</span>
                        <span>🕐 {new Date(activity.timestamp).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {activity.traceable && (
                      <div className="px-2 py-1 bg-green-100 text-green-900 text-xs font-bold rounded-full flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        TRACEABLE
                      </div>
                    )}
                    <Link
                      href={`/support/traceability?event=${activity.id}`}
                      className="px-3 py-1 bg-purple-100 hover:bg-purple-200 text-purple-900 font-semibold rounded text-xs transition-colors"
                    >
                      Trace
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Support Resources */}
        <section className="p-6 bg-slate-100 rounded-lg">
          <h3 className="font-bold text-slate-900 mb-3">Support Resources</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold text-slate-900 mb-2">Common Tasks</h4>
              <ul className="space-y-1 text-slate-700">
                <li>• <Link href="/support/traceability" className="text-blue-600 hover:underline">Trace a compliance event</Link></li>
                <li>• <Link href="/support/consistency-check" className="text-blue-600 hover:underline">Check data consistency</Link></li>
                <li>• <Link href="/support/audit-prep" className="text-blue-600 hover:underline">Prepare for external audit</Link></li>
                <li>• <Link href="/support/data-validation" className="text-blue-600 hover:underline">Validate employee records</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 mb-2">Need Help?</h4>
              <p className="text-slate-700 mb-2">
                <strong>Internal Support:</strong> <a href="mailto:support@company.com" className="text-blue-600 hover:underline">support@company.com</a>
              </p>
              <p className="text-slate-700">
                <strong>Documentation:</strong> <Link href="/support/docs" className="text-blue-600 hover:underline">Support Knowledge Base →</Link>
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
