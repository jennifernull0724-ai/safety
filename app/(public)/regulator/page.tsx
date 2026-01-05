'use client';

import Link from 'next/link';
import { 
  Shield, 
  FileCheck, 
  Clock,
  Download,
  Eye,
  Lock,
  CheckCircle,
  Search,
  QrCode
} from 'lucide-react';
import { PublicLayout } from '@/components/PublicLayout';

/**
 * REGULATOR / AUDITOR ACCESS PAGE
 * 
 * PURPOSE:
 * - Public access (NO LOGIN REQUIRED)
 * - Read-only verification and evidence review
 * - Focus on timestamp accuracy, tamper resistance, historical state
 * - Simple, non-technical interface
 * 
 * CRITICAL REQUIREMENTS:
 * - NO login required
 * - NO editable interfaces
 * - Clear evidence integrity indicators
 * - Simple language (not technical jargon)
 * - Focused on verification results, dates, evidence
 * 
 * AUDIENCE:
 * - FRA Inspectors
 * - OSHA Auditors
 * - EPA Reviewers
 * - State Safety Regulators
 */

export default function RegulatorAccessPage() {
  return (
    <PublicLayout>
      <div className="max-w-5xl mx-auto px-4 md:px-6 py-8 md:py-16">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-6">
            <Shield className="w-16 h-16 text-blue-600" />
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
                Regulator & Auditor Access
              </h1>
              <p className="text-lg text-slate-600 mt-2">
                Public verification and evidence review — No login required
              </p>
            </div>
          </div>
        </div>

        {/* No Login Required Banner */}
        <div className="mb-12 p-6 bg-green-50 border-2 border-green-600 rounded-lg">
          <div className="flex items-start gap-4">
            <CheckCircle className="w-8 h-8 text-green-600 flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-xl font-bold text-green-900 mb-2">
                No Login or Account Required
              </h2>
              <p className="text-slate-700">
                All verification records, audit timelines, and evidence packages are publicly accessible 
                for regulatory review. You do not need to create an account, request access, or log in. 
                Simply use the tools below to access compliance evidence.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Access Tools */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Quick Access Tools</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* QR Code Verification */}
            <div className="p-6 bg-white border-2 border-slate-200 rounded-lg hover:border-blue-600 transition-colors">
              <div className="flex items-start gap-4 mb-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <QrCode className="w-8 h-8 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">
                    QR Code Verification
                  </h3>
                  <p className="text-slate-700 mb-4">
                    Scan an employee's QR code to instantly verify their current compliance status, 
                    certifications, and work authorization.
                  </p>
                  <Link 
                    href="/verify" 
                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold"
                  >
                    Scan QR Code →
                  </Link>
                </div>
              </div>
              <div className="p-3 bg-slate-50 rounded text-sm text-slate-600">
                <strong>Use when:</strong> Conducting field inspections, verifying worker authorization 
                at job sites, or confirming certifications during audits
              </div>
            </div>

            {/* Employee Search */}
            <div className="p-6 bg-white border-2 border-slate-200 rounded-lg hover:border-blue-600 transition-colors">
              <div className="flex items-start gap-4 mb-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Search className="w-8 h-8 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">
                    Employee Record Search
                  </h3>
                  <p className="text-slate-700 mb-4">
                    Look up an employee's compliance record by name or ID to review their certification 
                    history and verification events.
                  </p>
                  <Link 
                    href="/regulator/search" 
                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold"
                  >
                    Search Records →
                  </Link>
                </div>
              </div>
              <div className="p-3 bg-slate-50 rounded text-sm text-slate-600">
                <strong>Use when:</strong> Investigating specific incidents, reviewing historical compliance, 
                or auditing certification records
              </div>
            </div>

            {/* Audit Timeline */}
            <div className="p-6 bg-white border-2 border-slate-200 rounded-lg hover:border-blue-600 transition-colors">
              <div className="flex items-start gap-4 mb-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Clock className="w-8 h-8 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">
                    Audit Timeline Viewer
                  </h3>
                  <p className="text-slate-700 mb-4">
                    View a chronological, tamper-evident timeline of all certification changes, verification 
                    events, and compliance state transitions.
                  </p>
                  <Link 
                    href="/regulator/audit-timeline" 
                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold"
                  >
                    View Timeline →
                  </Link>
                </div>
              </div>
              <div className="p-3 bg-slate-50 rounded text-sm text-slate-600">
                <strong>Use when:</strong> Reconstructing events, verifying historical compliance state, 
                or investigating timeline discrepancies
              </div>
            </div>

            {/* Evidence Package Download */}
            <div className="p-6 bg-white border-2 border-slate-200 rounded-lg hover:border-blue-600 transition-colors">
              <div className="flex items-start gap-4 mb-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Download className="w-8 h-8 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">
                    Evidence Package Download
                  </h3>
                  <p className="text-slate-700 mb-4">
                    Download complete compliance evidence packages including certification documents, 
                    verification logs, and audit trails.
                  </p>
                  <Link 
                    href="/regulator/evidence-package" 
                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold"
                  >
                    Request Package →
                  </Link>
                </div>
              </div>
              <div className="p-3 bg-slate-50 rounded text-sm text-slate-600">
                <strong>Use when:</strong> Compiling evidence for enforcement actions, formal audits, 
                or legal proceedings
              </div>
            </div>
          </div>
        </section>

        {/* What You Can Access */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">What You Can Access</h2>
          
          <div className="space-y-4">
            <div className="p-4 bg-white border border-slate-200 rounded-lg">
              <div className="flex items-start gap-3">
                <FileCheck className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">Current Certification Status</h3>
                  <p className="text-slate-700">
                    View whether an employee is currently compliant, what certifications they hold, 
                    expiration dates, and work authorization status.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-white border border-slate-200 rounded-lg">
              <div className="flex items-start gap-3">
                <Clock className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">Historical Compliance State</h3>
                  <p className="text-slate-700">
                    Reconstruct an employee's compliance status at any point in time. See exactly what 
                    certifications were valid on a specific date (critical for incident investigations).
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-white border border-slate-200 rounded-lg">
              <div className="flex items-start gap-3">
                <Eye className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">Verification Event Logs</h3>
                  <p className="text-slate-700">
                    Review all QR code scans and verification events: when they occurred, who performed 
                    them, where they happened, and what status was shown.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-white border border-slate-200 rounded-lg">
              <div className="flex items-start gap-3">
                <Lock className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">Tamper-Evident Audit Trail</h3>
                  <p className="text-slate-700">
                    Every record includes cryptographic evidence of when it was created and whether it 
                    has been modified. Changes are logged with timestamps, reasons, and administrator identity.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-white border border-slate-200 rounded-lg">
              <div className="flex items-start gap-3">
                <Download className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">Certification Documents</h3>
                  <p className="text-slate-700">
                    Download PDF copies of uploaded certification documents, training records, and 
                    supporting evidence files.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Tamper Resistance Guarantees */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Tamper Resistance & Evidence Integrity</h2>
          
          <div className="p-6 bg-blue-50 border-2 border-blue-200 rounded-lg">
            <h3 className="text-lg font-bold text-blue-900 mb-4">How the System Prevents Record Tampering</h3>
            
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Append-Only Logging</h4>
                  <p className="text-sm text-slate-700">
                    Records cannot be deleted or overwritten. All changes create new entries with timestamps, 
                    preserving the full history.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Immutable Timestamps</h4>
                  <p className="text-sm text-slate-700">
                    All events include server-generated timestamps that cannot be backdated or altered. 
                    Timestamps are in UTC for consistency.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Change Attribution</h4>
                  <p className="text-sm text-slate-700">
                    Every modification records WHO made the change, WHEN it happened, and WHY (reason required). 
                    Administrators cannot make anonymous changes.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Historical State Reconstruction</h4>
                  <p className="text-sm text-slate-700">
                    You can query "Was employee X compliant on June 15, 2025?" and get the exact state 
                    as it existed at that time — even if certifications have since changed.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Common Regulator Questions */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Common Questions</h2>
          
          <div className="space-y-4">
            <div className="p-4 bg-white border border-slate-200 rounded-lg">
              <h3 className="font-bold text-slate-900 mb-2">Do I need to create an account?</h3>
              <p className="text-slate-700">
                <strong>No.</strong> All verification records, audit timelines, and evidence packages are 
                publicly accessible. You can access everything without logging in or creating an account.
              </p>
            </div>

            <div className="p-4 bg-white border border-slate-200 rounded-lg">
              <h3 className="font-bold text-slate-900 mb-2">Can I download evidence for my files?</h3>
              <p className="text-slate-700">
                <strong>Yes.</strong> All certification documents, verification logs, and audit trails can 
                be exported as PDF or CSV files for inclusion in your investigation or audit reports.
              </p>
            </div>

            <div className="p-4 bg-white border border-slate-200 rounded-lg">
              <h3 className="font-bold text-slate-900 mb-2">How do I know the records haven't been altered?</h3>
              <p className="text-slate-700">
                Every record includes creation timestamps and modification history. Changes are logged with 
                the administrator's identity, timestamp, and reason. You can see the full audit trail to 
                verify authenticity.
              </p>
            </div>

            <div className="p-4 bg-white border border-slate-200 rounded-lg">
              <h3 className="font-bold text-slate-900 mb-2">Can I see if an employee was compliant on a specific past date?</h3>
              <p className="text-slate-700">
                <strong>Yes.</strong> Use the Audit Timeline Viewer to reconstruct historical compliance 
                state. Enter a date and employee ID to see exactly what certifications were valid at that time.
              </p>
            </div>

            <div className="p-4 bg-white border border-slate-200 rounded-lg">
              <h3 className="font-bold text-slate-900 mb-2">What if I need records that aren't publicly accessible?</h3>
              <p className="text-slate-700">
                All compliance verification records are public by design. If you require additional records 
                (e.g., internal training materials, employee personnel files), contact the employer directly 
                with your regulatory authority credentials.
              </p>
            </div>

            <div className="p-4 bg-white border border-slate-200 rounded-lg">
              <h3 className="font-bold text-slate-900 mb-2">Can I edit or correct records?</h3>
              <p className="text-slate-700">
                <strong>No.</strong> Regulators have read-only access. If you identify an error, notify the 
                employer's compliance administrator. They can submit corrections, which will be logged in 
                the audit trail.
              </p>
            </div>
          </div>
        </section>

        {/* Contact for Regulatory Inquiries */}
        <section className="p-6 bg-slate-900 text-white rounded-lg">
          <h2 className="text-xl font-bold mb-4">Technical Support for Regulators</h2>
          <p className="mb-4">
            If you encounter technical issues accessing records or need assistance with evidence export:
          </p>
          <ul className="space-y-2 mb-4">
            <li className="flex items-start gap-2">
              <span className="text-blue-400">•</span>
              <span>Email: <strong>regulator-support@trexaios.com</strong></span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400">•</span>
              <span>Include your agency name and investigation/audit reference number</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400">•</span>
              <span>Typical response time: 4 business hours</span>
            </li>
          </ul>
          <p className="text-sm text-slate-400">
            For questions about specific employer compliance, contact the employer directly. For questions 
            about the T-REX AI OS platform itself, use the support email above.
          </p>
        </section>

        {/* Footer Links */}
        <div className="mt-8 text-center text-sm text-slate-600">
          <Link href="/regulator/help" className="hover:text-blue-600 underline">Regulator Help Guide</Link>
          {' • '}
          <Link href="/privacy" className="hover:text-blue-600 underline">Privacy Policy</Link>
          {' • '}
          <Link href="/terms" className="hover:text-blue-600 underline">Terms of Service</Link>
        </div>
      </div>
    </PublicLayout>
  );
}
