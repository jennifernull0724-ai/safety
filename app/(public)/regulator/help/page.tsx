'use client';

import Link from 'next/link';
import { 
  Shield, 
  QrCode,
  Search,
  Clock,
  Download,
  HelpCircle,
  CheckCircle,
  FileText,
  ArrowLeft
} from 'lucide-react';
import { PublicLayout } from '@/components/PublicLayout';

/**
 * REGULATOR HELP GUIDE
 * 
 * PURPOSE:
 * - Simple, non-technical explanations
 * - Step-by-step instructions
 * - FAQs for regulators
 * - No jargon, clear language
 */

export default function RegulatorHelpPage() {
  return (
    <PublicLayout>
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-8 md:py-16">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/regulator" 
            className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Regulator Access
          </Link>
          <div className="flex items-center gap-4">
            <HelpCircle className="w-12 h-12 text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                Regulator Help Guide
              </h1>
              <p className="text-lg text-slate-600 mt-1">
                How to use T-REX AI OS verification tools
              </p>
            </div>
          </div>
        </div>

        {/* Quick Start */}
        <section className="mb-12 p-6 bg-blue-50 border-2 border-blue-200 rounded-lg">
          <h2 className="text-2xl font-bold text-blue-900 mb-4">Quick Start (30 Seconds)</h2>
          <ol className="space-y-3">
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">1</span>
              <div>
                <h3 className="font-bold text-slate-900">Scan QR Code</h3>
                <p className="text-slate-700">
                  Use your phone camera to scan an employee's QR code badge. This instantly shows their 
                  current compliance status.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">2</span>
              <div>
                <h3 className="font-bold text-slate-900">Verify Status</h3>
                <p className="text-slate-700">
                  Look for "VERIFIED" (green) or "NOT COMPLIANT" (red) banner at the top of the page. 
                  This tells you if the worker is authorized.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">3</span>
              <div>
                <h3 className="font-bold text-slate-900">Download Evidence (If Needed)</h3>
                <p className="text-slate-700">
                  If conducting an audit or investigation, click "Access Regulator Tools" to download 
                  complete evidence packages.
                </p>
              </div>
            </li>
          </ol>
        </section>

        {/* How to Use Each Tool */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">How to Use Each Tool</h2>
          
          <div className="space-y-6">
            {/* QR Code Verification */}
            <div className="p-6 bg-white border border-slate-200 rounded-lg">
              <div className="flex items-start gap-4 mb-4">
                <QrCode className="w-8 h-8 text-blue-600 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">QR Code Verification</h3>
                  <p className="text-slate-700 mb-4">
                    <strong>Use for:</strong> Field inspections, site access verification, quick status checks
                  </p>
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong>Step 1:</strong> Point your phone camera at the employee's QR code 
                    (on badge, card, or printed sheet)
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong>Step 2:</strong> Your phone will open a web page automatically — no app needed
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong>Step 3:</strong> Look at the top banner: Green "VERIFIED" = authorized to work. 
                    Red "NOT COMPLIANT" = do not authorize
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong>Step 4:</strong> Scroll down to see specific certifications and expiration dates
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong>Step 5:</strong> (Optional) Click "Print Official Verification" to save a copy 
                    for your records
                  </div>
                </div>
              </div>
            </div>

            {/* Audit Timeline */}
            <div className="p-6 bg-white border border-slate-200 rounded-lg">
              <div className="flex items-start gap-4 mb-4">
                <Clock className="w-8 h-8 text-blue-600 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Audit Timeline Viewer</h3>
                  <p className="text-slate-700 mb-4">
                    <strong>Use for:</strong> Incident investigations, historical compliance verification, 
                    timeline reconstruction
                  </p>
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong>Step 1:</strong> Go to{' '}
                    <Link href="/regulator/audit-timeline" className="text-blue-600 hover:text-blue-800 underline">
                      /regulator/audit-timeline
                    </Link>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong>Step 2:</strong> Enter the employee's ID or name in the search box
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong>Step 3:</strong> Click "View Timeline" to see all compliance events in chronological order
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong>Step 4:</strong> Use "Point-in-Time Query" to see exactly what certifications were 
                    valid on a specific past date (critical for incident investigations)
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong>Step 5:</strong> Click "Export Timeline" to download a PDF or CSV for your files
                  </div>
                </div>
              </div>

              <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded text-sm">
                <strong>Example use case:</strong> "On June 15, 2025, there was a confined space incident. 
                Was employee #12345 certified for confined space entry on that date?" Use point-in-time query 
                to get the exact answer.
              </div>
            </div>

            {/* Evidence Package */}
            <div className="p-6 bg-white border border-slate-200 rounded-lg">
              <div className="flex items-start gap-4 mb-4">
                <Download className="w-8 h-8 text-blue-600 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Evidence Package Download</h3>
                  <p className="text-slate-700 mb-4">
                    <strong>Use for:</strong> Formal audits, enforcement actions, legal proceedings, 
                    comprehensive evidence compilation
                  </p>
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong>Step 1:</strong> Go to{' '}
                    <Link href="/regulator/evidence-package" className="text-blue-600 hover:text-blue-800 underline">
                      /regulator/evidence-package
                    </Link>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong>Step 2:</strong> Enter the employee ID and optionally a date range 
                    (leave blank for all records)
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong>Step 3:</strong> Choose format: PDF (single document) or ZIP (multiple files)
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong>Step 4:</strong> Select what to include: certification documents, verification logs, 
                    audit trail, timeline
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong>Step 5:</strong> Click "Generate Evidence Package" and download immediately 
                    (no waiting, no email)
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Common Questions */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Common Questions</h2>
          
          <div className="space-y-4">
            <div className="p-4 bg-white border border-slate-200 rounded-lg">
              <h3 className="font-bold text-slate-900 mb-2">Do I need to log in or create an account?</h3>
              <p className="text-slate-700">
                No. All verification tools are publicly accessible without login. Just navigate to the page 
                and start using it.
              </p>
            </div>

            <div className="p-4 bg-white border border-slate-200 rounded-lg">
              <h3 className="font-bold text-slate-900 mb-2">What if the QR code won't scan?</h3>
              <p className="text-slate-700 mb-2">
                Try these solutions:
              </p>
              <ul className="text-sm text-slate-700 space-y-1 ml-4">
                <li>• Make sure your camera lens is clean</li>
                <li>• Hold the phone steady 6-8 inches from the code</li>
                <li>• Ensure good lighting (not too bright, not too dark)</li>
                <li>• If the code is damaged, ask the employer for a replacement</li>
                <li>• Use the Audit Timeline tool to search by employee ID instead</li>
              </ul>
            </div>

            <div className="p-4 bg-white border border-slate-200 rounded-lg">
              <h3 className="font-bold text-slate-900 mb-2">How do I know the records are authentic?</h3>
              <p className="text-slate-700">
                Check that the URL shows <strong>trexaios.com</strong> with a padlock icon (HTTPS). 
                All records include creation timestamps and change history. You can see if a record was 
                modified, who modified it, when, and why.
              </p>
            </div>

            <div className="p-4 bg-white border border-slate-200 rounded-lg">
              <h3 className="font-bold text-slate-900 mb-2">Can I edit or correct records?</h3>
              <p className="text-slate-700">
                No. Regulators have read-only access. If you identify an error, notify the employer's 
                compliance administrator. They can submit corrections, which will be logged in the audit trail.
              </p>
            </div>

            <div className="p-4 bg-white border border-slate-200 rounded-lg">
              <h3 className="font-bold text-slate-900 mb-2">What does "tamper-evident" mean?</h3>
              <p className="text-slate-700">
                It means records cannot be deleted or secretly changed. All modifications create new entries 
                with timestamps showing WHO changed WHAT and WHY. You can see the full history — nothing can 
                be hidden or erased.
              </p>
            </div>

            <div className="p-4 bg-white border border-slate-200 rounded-lg">
              <h3 className="font-bold text-slate-900 mb-2">Can I use this on my phone?</h3>
              <p className="text-slate-700">
                Yes. All tools work on smartphones, tablets, and desktop computers. QR code scanning is 
                easiest on phones.
              </p>
            </div>

            <div className="p-4 bg-white border border-slate-200 rounded-lg">
              <h3 className="font-bold text-slate-900 mb-2">How long are records kept?</h3>
              <p className="text-slate-700">
                All compliance records and verification logs are kept indefinitely for regulatory compliance. 
                You can access historical records from years ago if needed.
              </p>
            </div>

            <div className="p-4 bg-white border border-slate-200 rounded-lg">
              <h3 className="font-bold text-slate-900 mb-2">What if I need help during an inspection?</h3>
              <p className="text-slate-700">
                Email <strong>regulator-support@trexaios.com</strong> with your agency name and case number. 
                Response time is typically within 4 business hours.
              </p>
            </div>
          </div>
        </section>

        {/* Glossary */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Simple Glossary</h2>
          
          <div className="space-y-3">
            <div className="p-3 bg-slate-50 rounded-lg">
              <h3 className="font-semibold text-slate-900 text-sm">QR Code</h3>
              <p className="text-sm text-slate-700">
                A square barcode that links to an employee's verification page. Scan it with your phone camera.
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg">
              <h3 className="font-semibold text-slate-900 text-sm">Compliance Status</h3>
              <p className="text-sm text-slate-700">
                Whether an employee has all required certifications: "VERIFIED" (yes) or "NOT COMPLIANT" (no).
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg">
              <h3 className="font-semibold text-slate-900 text-sm">Audit Trail</h3>
              <p className="text-sm text-slate-700">
                A complete record of all changes showing who made them, when, and why. Cannot be deleted or hidden.
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg">
              <h3 className="font-semibold text-slate-900 text-sm">Point-in-Time Query</h3>
              <p className="text-sm text-slate-700">
                Looking up what an employee's status was on a specific past date (e.g., "Were they compliant 
                on June 15?").
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg">
              <h3 className="font-semibold text-slate-900 text-sm">Evidence Package</h3>
              <p className="text-sm text-slate-700">
                A downloadable file containing all compliance records, documents, and logs for an employee. 
                Used for audits and investigations.
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg">
              <h3 className="font-semibold text-slate-900 text-sm">Tamper-Evident</h3>
              <p className="text-sm text-slate-700">
                Records that show if they've been changed. You can see the full history — no secret edits or deletions.
              </p>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="p-6 bg-slate-900 text-white rounded-lg">
          <h2 className="text-xl font-bold mb-4">Need More Help?</h2>
          <p className="mb-4">
            Technical support for regulators and auditors:
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
              <span>Response time: 4 business hours</span>
            </li>
          </ul>
        </section>
      </div>
    </PublicLayout>
  );
}
