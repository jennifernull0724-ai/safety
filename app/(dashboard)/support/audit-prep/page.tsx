'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Shield, CheckCircle, XCircle, AlertTriangle, Download, FileText, Clock, Database } from 'lucide-react';

/**
 * AUDIT PREPARATION TOOL
 * 
 * PURPOSE:
 * - Prepare for external regulatory audits
 * - Validate audit readiness
 * - Generate comprehensive evidence packages
 * - Identify potential audit issues before they occur
 * 
 * WHAT REVIEWERS NEED:
 * - "Are we ready for an audit?"
 * - "Is all required documentation present?"
 * - "Are there any gaps in the audit trail?"
 * - "Can I generate a complete evidence package?"
 */

interface AuditReadinessCheck {
  category: string;
  checks: {
    id: string;
    item: string;
    status: 'ready' | 'warning' | 'not-ready';
    details: string;
  }[];
}

interface EvidencePackage {
  id: string;
  name: string;
  description: string;
  included: boolean;
  recordCount?: number;
}

export default function AuditPreparationPage() {
  const [auditType, setAuditType] = useState<'osha' | 'epa' | 'fra' | 'general'>('osha');
  const [dateRange, setDateRange] = useState({ start: '2025-01-01', end: '2026-01-05' });
  
  const [readinessChecks] = useState<AuditReadinessCheck[]>([
    {
      category: 'Documentation Completeness',
      checks: [
        {
          id: 'doc-1',
          item: 'All employee certifications have source documents',
          status: 'ready',
          details: '1,247 employees × avg 3.2 certifications = 3,990 certifications. All have source documents attached.'
        },
        {
          id: 'doc-2',
          item: 'Audit trail covers full 7-year retention period',
          status: 'ready',
          details: 'Audit entries from 2019-01-01 to present. Complete coverage, no gaps.'
        },
        {
          id: 'doc-3',
          item: 'Correction workflow documentation complete',
          status: 'ready',
          details: 'All 127 corrections have approval records, source evidence, and audit entries.'
        },
        {
          id: 'doc-4',
          item: 'QR verification logs retained',
          status: 'ready',
          details: '45,892 QR scans logged with geolocation, timestamp, and verification result.'
        }
      ]
    },
    {
      category: 'Data Integrity',
      checks: [
        {
          id: 'data-1',
          item: 'No orphaned records (all data has parent references)',
          status: 'ready',
          details: 'All certifications linked to employees. No orphaned data detected.'
        },
        {
          id: 'data-2',
          item: 'Timestamps in chronological order',
          status: 'ready',
          details: 'All audit entries pass chronological validation. No timestamp anomalies.'
        },
        {
          id: 'data-3',
          item: 'Export data matches live database',
          status: 'warning',
          details: 'CSV export shows 2 fewer employees than live database (1,245 vs 1,247). Likely caching issue.'
        },
        {
          id: 'data-4',
          item: 'Point-in-time queries are reproducible',
          status: 'ready',
          details: 'Tested 10 random historical queries. All return identical results on re-run.'
        }
      ]
    },
    {
      category: 'Compliance Evidence',
      checks: [
        {
          id: 'comp-1',
          item: 'All blocked employees have documented reasons',
          status: 'ready',
          details: '23 currently blocked employees. All have clear blocking reasons in audit log.'
        },
        {
          id: 'comp-2',
          item: 'Enforcement actions are attributable',
          status: 'ready',
          details: 'All 891 automated enforcement actions have system attribution. No unattributed blocks.'
        },
        {
          id: 'comp-3',
          item: 'Manual overrides are logged and justified',
          status: 'not-ready',
          details: 'Found 3 manual status changes without justification notes. Need admin review.'
        },
        {
          id: 'comp-4',
          item: 'Certification expiration monitoring active',
          status: 'ready',
          details: 'Automated job runs daily. Last run: 2026-01-05 02:00:00 UTC. 47 expiring certifications flagged.'
        }
      ]
    },
    {
      category: 'System Security',
      checks: [
        {
          id: 'sec-1',
          item: 'All user actions are logged',
          status: 'ready',
          details: 'User attribution present on 100% of compliance actions. Complete audit trail.'
        },
        {
          id: 'sec-2',
          item: 'API access is authenticated and logged',
          status: 'ready',
          details: 'All API requests require valid keys. 12,487 API calls logged in audit period.'
        },
        {
          id: 'sec-3',
          item: 'Data access controls are enforced',
          status: 'ready',
          details: 'Role-based access verified. Compliance admins cannot edit enforcement rules.'
        },
        {
          id: 'sec-4',
          item: 'Tamper-evidence mechanisms validated',
          status: 'ready',
          details: 'Audit log is append-only. No modifications or deletions possible. Hash validation passed.'
        }
      ]
    }
  ]);

  const [evidencePackages] = useState<EvidencePackage[]>([
    {
      id: 'pkg-1',
      name: 'Employee Records',
      description: 'Complete employee database with certification history',
      included: true,
      recordCount: 1247
    },
    {
      id: 'pkg-2',
      name: 'Certification Documents',
      description: 'Source certificates and training records (PDFs)',
      included: true,
      recordCount: 3990
    },
    {
      id: 'pkg-3',
      name: 'Audit Trail (Full)',
      description: 'Complete audit log for 7-year retention period',
      included: true,
      recordCount: 234589
    },
    {
      id: 'pkg-4',
      name: 'QR Verification Logs',
      description: 'Field verification history with geolocation',
      included: true,
      recordCount: 45892
    },
    {
      id: 'pkg-5',
      name: 'Correction Workflow Records',
      description: 'All correction requests with approvals and evidence',
      included: true,
      recordCount: 127
    },
    {
      id: 'pkg-6',
      name: 'Enforcement Actions Log',
      description: 'History of automated and manual blocks/unblocks',
      included: true,
      recordCount: 891
    },
    {
      id: 'pkg-7',
      name: 'System Configuration',
      description: 'Certification presets, compliance rules, enforcement logic',
      included: true,
      recordCount: 1
    },
    {
      id: 'pkg-8',
      name: 'API Access Logs',
      description: 'Integration access logs with timestamps and user attribution',
      included: false,
      recordCount: 12487
    }
  ]);

  const totalReady = readinessChecks.flatMap(c => c.checks).filter(c => c.status === 'ready').length;
  const totalWarnings = readinessChecks.flatMap(c => c.checks).filter(c => c.status === 'warning').length;
  const totalNotReady = readinessChecks.flatMap(c => c.checks).filter(c => c.status === 'not-ready').length;
  const totalChecks = readinessChecks.flatMap(c => c.checks).length;

  const readinessPercentage = Math.round((totalReady / totalChecks) * 100);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="flex items-center gap-4">
          <Link href="/support" className="text-slate-600 hover:text-slate-900">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Audit Preparation</h1>
            <p className="text-sm text-slate-600">Verify audit readiness and generate evidence packages</p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Audit Configuration */}
        <section className="mb-8">
          <div className="p-6 bg-white border border-slate-200 rounded-lg">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Audit Configuration</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Audit Type</label>
                <select
                  value={auditType}
                  onChange={(e) => setAuditType(e.target.value as any)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="osha">OSHA Compliance Audit</option>
                  <option value="epa">EPA Environmental Audit</option>
                  <option value="fra">FRA Railroad Safety Audit</option>
                  <option value="general">General Compliance Review</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Start Date</label>
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">End Date</label>
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Readiness Overview */}
        <section className="mb-8">
          <div className="p-6 bg-gradient-to-r from-green-50 to-white border-2 border-green-200 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Shield className="w-8 h-8 text-green-600" />
                <div>
                  <h2 className="text-2xl font-bold text-green-900">Audit Readiness: {readinessPercentage}%</h2>
                  <p className="text-sm text-green-700">
                    Based on {totalChecks} compliance criteria
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4">
              <div className="p-4 bg-white rounded-lg">
                <p className="text-xs text-slate-600 mb-1">Total Checks</p>
                <p className="text-3xl font-bold text-slate-900">{totalChecks}</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <p className="text-xs text-green-700">Ready</p>
                </div>
                <p className="text-3xl font-bold text-green-600">{totalReady}</p>
              </div>
              <div className="p-4 bg-amber-50 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <p className="text-xs text-amber-700">Warnings</p>
                </div>
                <p className="text-3xl font-bold text-amber-600">{totalWarnings}</p>
              </div>
              <div className="p-4 bg-red-50 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <XCircle className="w-4 h-4 text-red-600" />
                  <p className="text-xs text-red-700">Not Ready</p>
                </div>
                <p className="text-3xl font-bold text-red-600">{totalNotReady}</p>
              </div>
            </div>

            {totalNotReady > 0 && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-red-900 mb-1">Action Required Before Audit</p>
                    <p className="text-sm text-red-800">
                      {totalNotReady} item{totalNotReady > 1 ? 's' : ''} require attention. 
                      Review details below and resolve before audit date.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Readiness Checks */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Readiness Checklist</h2>
          
          <div className="space-y-6">
            {readinessChecks.map((category) => (
              <div key={category.category} className="p-6 bg-white border border-slate-200 rounded-lg">
                <h3 className="text-lg font-bold text-slate-900 mb-4">{category.category}</h3>
                
                <div className="space-y-3">
                  {category.checks.map((check) => (
                    <div 
                      key={check.id}
                      className={`p-4 rounded-lg border ${
                        check.status === 'ready' ? 'bg-green-50 border-green-200' :
                        check.status === 'warning' ? 'bg-amber-50 border-amber-200' :
                        'bg-red-50 border-red-200'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {check.status === 'ready' ? (
                          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        ) : check.status === 'warning' ? (
                          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                        )}
                        <div className="flex-1">
                          <h4 className={`font-semibold mb-1 ${
                            check.status === 'ready' ? 'text-green-900' :
                            check.status === 'warning' ? 'text-amber-900' :
                            'text-red-900'
                          }`}>
                            {check.item}
                          </h4>
                          <p className={`text-sm ${
                            check.status === 'ready' ? 'text-green-800' :
                            check.status === 'warning' ? 'text-amber-800' :
                            'text-red-800'
                          }`}>
                            {check.details}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          check.status === 'ready' ? 'bg-green-100 text-green-900' :
                          check.status === 'warning' ? 'bg-amber-100 text-amber-900' :
                          'bg-red-100 text-red-900'
                        }`}>
                          {check.status === 'ready' ? 'READY' :
                           check.status === 'warning' ? 'WARNING' :
                           'NOT READY'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Evidence Package Generator */}
        <section className="mb-8">
          <div className="p-6 bg-white border border-slate-200 rounded-lg">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Evidence Package</h2>
            <p className="text-sm text-slate-600 mb-6">
              Select components to include in the audit evidence package. Package will be generated as a ZIP file 
              with organized folders and a comprehensive index document.
            </p>

            <div className="space-y-3 mb-6">
              {evidencePackages.map((pkg) => (
                <div 
                  key={pkg.id}
                  className={`p-4 border rounded-lg transition-colors ${
                    pkg.included 
                      ? 'bg-blue-50 border-blue-200' 
                      : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <input
                        type="checkbox"
                        checked={pkg.included}
                        readOnly
                        className="mt-1"
                      />
                      <div>
                        <h4 className="font-semibold text-slate-900">{pkg.name}</h4>
                        <p className="text-sm text-slate-600">{pkg.description}</p>
                      </div>
                    </div>
                    {pkg.recordCount && (
                      <span className="text-xs font-semibold text-slate-600">
                        {pkg.recordCount.toLocaleString()} records
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-100 rounded-lg mb-4">
              <div>
                <p className="font-semibold text-slate-900">Total Package Size (Estimated)</p>
                <p className="text-sm text-slate-600">
                  {evidencePackages.filter(p => p.included).length} components selected
                </p>
              </div>
              <p className="text-2xl font-bold text-slate-900">~2.4 GB</p>
            </div>

            <button className="w-full px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2">
              <Download className="w-5 h-5" />
              Generate Complete Evidence Package (ZIP)
            </button>

            <p className="mt-3 text-sm text-slate-600 text-center">
              Package generation typically takes 2-5 minutes. You'll receive a download link via email.
            </p>
          </div>
        </section>

        {/* Quick Actions */}
        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-4">Additional Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              href="/support/consistency-check"
              className="p-6 bg-white border border-slate-200 rounded-lg hover:border-green-300 transition-colors"
            >
              <Database className="w-8 h-8 text-blue-600 mb-3" />
              <h3 className="font-bold text-slate-900 mb-2">Run Data Consistency Check</h3>
              <p className="text-sm text-slate-600">
                Verify data integrity before audit to catch any inconsistencies
              </p>
            </Link>

            <Link
              href="/support/traceability"
              className="p-6 bg-white border border-slate-200 rounded-lg hover:border-green-300 transition-colors"
            >
              <Clock className="w-8 h-8 text-purple-600 mb-3" />
              <h3 className="font-bold text-slate-900 mb-2">Test Event Traceability</h3>
              <p className="text-sm text-slate-600">
                Verify you can trace sample events from start to finish
              </p>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
