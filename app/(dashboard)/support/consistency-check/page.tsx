'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Database, CheckCircle, XCircle, AlertTriangle, RefreshCw, FileText } from 'lucide-react';

/**
 * DATA CONSISTENCY CHECKER
 * 
 * PURPOSE:
 * - Verify data matches across all system views
 * - Detect inconsistencies between UI and database
 * - Validate export accuracy
 * - Support audit preparation
 * 
 * WHAT REVIEWERS NEED:
 * - "Does the dashboard show the same data as the export?"
 * - "Is the QR verification result consistent with the employee record?"
 * - "Do all views of this employee show the same status?"
 */

interface ConsistencyCheck {
  id: string;
  checkType: string;
  description: string;
  status: 'pass' | 'fail' | 'warning';
  details: string;
  affectedRecords?: string[];
}

interface ConsistencyReport {
  timestamp: string;
  totalChecks: number;
  passed: number;
  failed: number;
  warnings: number;
  checks: ConsistencyCheck[];
}

export default function ConsistencyCheckerPage() {
  const [selectedScope, setSelectedScope] = useState<'all' | 'employee' | 'certification' | 'audit'>('all');
  const [employeeId, setEmployeeId] = useState('');
  const [report, setReport] = useState<ConsistencyReport | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const runConsistencyCheck = async () => {
    setIsRunning(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Mock consistency report
    const mockReport: ConsistencyReport = {
      timestamp: new Date().toISOString(),
      totalChecks: 15,
      passed: 12,
      failed: 1,
      warnings: 2,
      checks: [
        {
          id: 'check-1',
          checkType: 'Employee Status Consistency',
          description: 'Verify employee status matches across dashboard, API, and QR verification',
          status: 'pass',
          details: 'Employee EMP-2401 status is COMPLIANT in all views (dashboard, API endpoint /api/v1/employees/EMP-2401, QR verification page)'
        },
        {
          id: 'check-2',
          checkType: 'Certification Count Match',
          description: 'Verify certification count matches between employee record and certification table',
          status: 'pass',
          details: 'Employee has 3 certifications in employee record, 3 certifications in certification table. Counts match.'
        },
        {
          id: 'check-3',
          checkType: 'Audit Trail Completeness',
          description: 'Verify every employee action has corresponding audit entry',
          status: 'pass',
          details: 'All 47 employee actions have audit entries. No gaps detected.'
        },
        {
          id: 'check-4',
          checkType: 'Export Data Accuracy',
          description: 'Verify CSV export matches current database state',
          status: 'pass',
          details: 'CSV export generated at 2026-01-05 10:30:00 contains same data as database query at same timestamp'
        },
        {
          id: 'check-5',
          checkType: 'QR Verification Sync',
          description: 'Verify QR verification results match employee compliance status',
          status: 'pass',
          details: 'All 12 QR verifications for EMP-2401 returned COMPLIANT, matching employee status at verification time'
        },
        {
          id: 'check-6',
          checkType: 'Point-in-Time Accuracy',
          description: 'Verify point-in-time query returns consistent historical state',
          status: 'pass',
          details: 'Query for 2025-08-15 returns same result on multiple runs. Reproducible.'
        },
        {
          id: 'check-7',
          checkType: 'Blocking Reason Match',
          description: 'Verify blocking reason shown in UI matches database reason',
          status: 'warning',
          details: 'Employee EMP-3201 shows "First Aid Expired" in dashboard but database has "First Aid, CPR Expired" (2 certifications). UI shows only first reason.',
          affectedRecords: ['EMP-3201']
        },
        {
          id: 'check-8',
          checkType: 'Expiration Date Consistency',
          description: 'Verify expiration dates match between certification record and employee summary',
          status: 'pass',
          details: 'All certification expiration dates in employee summary match certification table exactly'
        },
        {
          id: 'check-9',
          checkType: 'Correction Workflow Integrity',
          description: 'Verify all approved corrections have corresponding data updates',
          status: 'pass',
          details: 'All 3 approved corrections have matching update entries. No orphaned corrections.'
        },
        {
          id: 'check-10',
          checkType: 'API Response Consistency',
          description: 'Verify API responses match database queries',
          status: 'pass',
          details: 'GET /api/v1/employees/EMP-2401 returns same data as direct database query'
        },
        {
          id: 'check-11',
          checkType: 'Timestamp Accuracy',
          description: 'Verify audit entry timestamps are in chronological order',
          status: 'pass',
          details: 'All audit entries are in strict chronological order. No timestamp anomalies.'
        },
        {
          id: 'check-12',
          checkType: 'User Attribution Match',
          description: 'Verify audit trail user matches action performer in UI',
          status: 'pass',
          details: 'All displayed actions match audit trail user attribution exactly'
        },
        {
          id: 'check-13',
          checkType: 'Certification Type Preset Validation',
          description: 'Verify all certifications use valid preset types',
          status: 'pass',
          details: 'All 1,247 employee certifications match preset certification types. No invalid types.'
        },
        {
          id: 'check-14',
          checkType: 'Dashboard Count Accuracy',
          description: 'Verify dashboard statistics match database aggregations',
          status: 'warning',
          details: 'Dashboard shows "1,245 employees" but database count is 1,247. Possible caching issue.',
          affectedRecords: ['DASHBOARD-STATS']
        },
        {
          id: 'check-15',
          checkType: 'Evidence Package Completeness',
          description: 'Verify evidence package contains all referenced documents',
          status: 'fail',
          details: 'Evidence package for EMP-2401 missing 1 certification document (OSHA 10 certificate PDF). Document referenced in metadata but file not found in package.',
          affectedRecords: ['EMP-2401', 'CERT-9876']
        }
      ]
    };

    setReport(mockReport);
    setIsRunning(false);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="flex items-center gap-4">
          <Link href="/support" className="text-slate-600 hover:text-slate-900">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Data Consistency Checker</h1>
            <p className="text-sm text-slate-600">Verify data integrity across all system views</p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Info Banner */}
        <div className="mb-8 p-6 bg-blue-50 border-2 border-blue-200 rounded-lg">
          <div className="flex items-start gap-3">
            <Database className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h2 className="text-lg font-bold text-blue-900 mb-2">What This Checks</h2>
              <p className="text-sm text-blue-800 mb-3">
                This tool verifies that compliance data is <strong>consistent across all views</strong>: 
                dashboard UI, API responses, QR verification pages, CSV exports, and evidence packages.
              </p>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• <strong>UI vs Database:</strong> Dashboard shows same data as database queries</li>
                <li>• <strong>API vs UI:</strong> API endpoints return same data as UI displays</li>
                <li>• <strong>Export vs Live:</strong> CSV/PDF exports match current database state</li>
                <li>• <strong>Historical vs Current:</strong> Point-in-time queries are reproducible</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Run Check */}
        <section className="mb-8">
          <div className="p-6 bg-white border border-slate-200 rounded-lg">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Run Consistency Check</h2>
            
            <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Check Scope</label>
                <select
                  value={selectedScope}
                  onChange={(e) => setSelectedScope(e.target.value as any)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Records (Full System Check)</option>
                  <option value="employee">Specific Employee</option>
                  <option value="certification">Certification Records Only</option>
                  <option value="audit">Audit Trail Integrity Only</option>
                </select>
              </div>

              {selectedScope === 'employee' && (
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Employee ID</label>
                  <input
                    type="text"
                    value={employeeId}
                    onChange={(e) => setEmployeeId(e.target.value)}
                    placeholder="e.g., EMP-2401"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              )}
            </div>

            <button
              onClick={runConsistencyCheck}
              disabled={isRunning || (selectedScope === 'employee' && !employeeId.trim())}
              className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <RefreshCw className={`w-5 h-5 ${isRunning ? 'animate-spin' : ''}`} />
              {isRunning ? 'Running Checks...' : 'Run Consistency Check'}
            </button>

            <p className="mt-3 text-sm text-slate-600">
              This will verify data consistency across {selectedScope === 'all' ? 'all system components' : selectedScope} 
              and generate a detailed report. Typical runtime: 10-30 seconds.
            </p>
          </div>
        </section>

        {/* Results */}
        {report && (
          <>
            {/* Summary */}
            <section className="mb-8">
              <div className="p-6 bg-white border border-slate-200 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-slate-900">Consistency Report</h2>
                  <p className="text-sm text-slate-600">
                    Generated: {new Date(report.timestamp).toLocaleString()}
                  </p>
                </div>

                <div className="grid grid-cols-4 gap-4">
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <p className="text-xs text-slate-600 mb-1">Total Checks</p>
                    <p className="text-3xl font-bold text-slate-900">{report.totalChecks}</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <p className="text-xs text-green-700">Passed</p>
                    </div>
                    <p className="text-3xl font-bold text-green-600">{report.passed}</p>
                  </div>
                  <div className="p-4 bg-amber-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                      <p className="text-xs text-amber-700">Warnings</p>
                    </div>
                    <p className="text-3xl font-bold text-amber-600">{report.warnings}</p>
                  </div>
                  <div className="p-4 bg-red-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <XCircle className="w-4 h-4 text-red-600" />
                      <p className="text-xs text-red-700">Failed</p>
                    </div>
                    <p className="text-3xl font-bold text-red-600">{report.failed}</p>
                  </div>
                </div>

                {report.failed > 0 && (
                  <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-red-900 mb-1">Action Required</p>
                        <p className="text-sm text-red-800">
                          {report.failed} consistency check{report.failed > 1 ? 's' : ''} failed. 
                          Review details below and resolve inconsistencies before external audit.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* Detailed Checks */}
            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-4">Detailed Results</h2>
              
              <div className="space-y-4">
                {/* Failed Checks First */}
                {report.checks.filter(c => c.status === 'fail').map((check) => (
                  <div 
                    key={check.id}
                    className="p-6 bg-red-50 border-2 border-red-200 rounded-lg"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start gap-3">
                        <XCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <h3 className="text-lg font-bold text-red-900">{check.checkType}</h3>
                          <p className="text-sm text-red-700">{check.description}</p>
                        </div>
                      </div>
                      <span className="px-3 py-1 bg-red-100 text-red-900 text-xs font-bold rounded-full">
                        FAILED
                      </span>
                    </div>
                    <div className="p-4 bg-white border border-red-200 rounded">
                      <p className="text-sm text-slate-900">{check.details}</p>
                      {check.affectedRecords && check.affectedRecords.length > 0 && (
                        <div className="mt-3 p-3 bg-red-50 rounded">
                          <p className="text-xs font-bold text-red-900 mb-1">Affected Records</p>
                          <p className="text-sm font-mono text-red-800">
                            {check.affectedRecords.join(', ')}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {/* Warnings */}
                {report.checks.filter(c => c.status === 'warning').map((check) => (
                  <div 
                    key={check.id}
                    className="p-6 bg-amber-50 border border-amber-200 rounded-lg"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <h3 className="text-lg font-bold text-amber-900">{check.checkType}</h3>
                          <p className="text-sm text-amber-700">{check.description}</p>
                        </div>
                      </div>
                      <span className="px-3 py-1 bg-amber-100 text-amber-900 text-xs font-bold rounded-full">
                        WARNING
                      </span>
                    </div>
                    <div className="p-4 bg-white border border-amber-200 rounded">
                      <p className="text-sm text-slate-900">{check.details}</p>
                      {check.affectedRecords && check.affectedRecords.length > 0 && (
                        <div className="mt-3 p-3 bg-amber-50 rounded">
                          <p className="text-xs font-bold text-amber-900 mb-1">Affected Records</p>
                          <p className="text-sm font-mono text-amber-800">
                            {check.affectedRecords.join(', ')}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {/* Passed Checks (Collapsed) */}
                <details className="p-6 bg-white border border-slate-200 rounded-lg">
                  <summary className="cursor-pointer font-bold text-slate-900 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    Passed Checks ({report.passed})
                  </summary>
                  <div className="mt-4 space-y-3">
                    {report.checks.filter(c => c.status === 'pass').map((check) => (
                      <div key={check.id} className="p-4 bg-green-50 border border-green-200 rounded">
                        <div className="flex items-start gap-2 mb-2">
                          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <h4 className="font-bold text-green-900">{check.checkType}</h4>
                            <p className="text-sm text-green-700">{check.description}</p>
                          </div>
                        </div>
                        <p className="text-sm text-slate-700 ml-7">{check.details}</p>
                      </div>
                    ))}
                  </div>
                </details>
              </div>
            </section>

            {/* Export Report */}
            <div className="mt-8 flex justify-end">
              <button className="px-6 py-2 bg-slate-600 hover:bg-slate-700 text-white font-semibold rounded-lg transition-colors flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Export Full Report (PDF)
              </button>
            </div>
          </>
        )}

        {/* No Results */}
        {!report && !isRunning && (
          <div className="p-12 bg-white border border-slate-200 rounded-lg text-center">
            <Database className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-600">Configure check parameters and click "Run Consistency Check" to begin</p>
          </div>
        )}
      </div>
    </div>
  );
}
