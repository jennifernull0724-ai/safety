'use client';

import Link from 'next/link';
import { FileText, Download, Info, CheckCircle, AlertCircle } from 'lucide-react';

/**
 * AUDIT & EXPORT DOCUMENTATION PAGE
 * 
 * PURPOSE:
 * - Explain audit package generation
 * - CSV export structure disclosure
 * - Chain of custody documentation
 * - Record inactivation policy
 */
export default function AuditExportDocs() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Audit Export & Data Structure</h1>
        <p className="text-slate-400">Documentation for compliance administrators and auditors</p>
      </div>

      {/* Audit Package Generation */}
      <section className="mb-12 p-6 bg-slate-800/50 border border-slate-700 rounded-lg">
        <div className="flex items-center gap-3 mb-4">
          <Download className="w-6 h-6 text-emerald-400" />
          <h2 className="text-2xl font-bold">Audit Package Generation</h2>
        </div>
        <div className="space-y-4 text-slate-300">
          <p>
            Audit packages provide complete, self-contained evidence bundles suitable for regulatory inspection or legal proceedings.
          </p>

          <div className="bg-slate-900/50 p-4 rounded border border-slate-700">
            <h3 className="font-semibold mb-3 text-white">How to Generate an Audit Package</h3>
            <ol className="list-decimal pl-6 space-y-2">
              <li>Navigate to the Certifications or Employees page</li>
              <li>Click "Generate Audit Package" button</li>
              <li>Select date range (optional)</li>
              <li>Select specific employees or certifications (or include all)</li>
              <li>Click "Generate" and download the ZIP file</li>
            </ol>
          </div>

          <div className="bg-slate-900/50 p-4 rounded border border-slate-700">
            <h3 className="font-semibold mb-3 text-white">Package Contents</h3>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                <div>
                  <strong>Certification versions:</strong> All versions of each certification, including corrections
                </div>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                <div>
                  <strong>Evidence files:</strong> All uploaded proof documents (images, PDFs)
                </div>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                <div>
                  <strong>QR verification logs:</strong> Scan history with timestamps and locations
                </div>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                <div>
                  <strong>Access logs:</strong> User actions and modifications (if enabled)
                </div>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                <div>
                  <strong>CSV index:</strong> Structured data for analysis
                </div>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                <div>
                  <strong>README.txt:</strong> Explanation of package contents and structure
                </div>
              </li>
            </ul>
          </div>

          <div className="bg-slate-900/50 p-4 rounded border border-slate-700">
            <h3 className="font-semibold mb-3 text-white">Output Formats</h3>
            <ul className="space-y-2">
              <li><strong>ZIP Package:</strong> Complete bundle with all files and metadata</li>
              <li><strong>PDFs:</strong> Individual certification and employee records</li>
              <li><strong>CSV:</strong> Structured data for Excel or database import</li>
              <li><strong>JSON:</strong> Machine-readable data for programmatic access</li>
            </ul>
          </div>
        </div>
      </section>

      {/* CSV Export Structure */}
      <section className="mb-12 p-6 bg-slate-800/50 border border-slate-700 rounded-lg">
        <div className="flex items-center gap-3 mb-4">
          <FileText className="w-6 h-6 text-blue-400" />
          <h2 className="text-2xl font-bold">CSV Export Structure</h2>
        </div>
        <div className="space-y-4 text-slate-300">
          <p>
            CSV exports provide structured data compatible with Excel, SQL databases, and custom reporting tools.
          </p>

          <div className="bg-slate-900/50 p-4 rounded border border-slate-700">
            <h3 className="font-semibold mb-3 text-white">Data Structure</h3>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <Info className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                <div>
                  <strong>Flat Structure:</strong> One row per certification version (not nested)
                </div>
              </li>
              <li className="flex items-start gap-2">
                <Info className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                <div>
                  <strong>Relational:</strong> Employee IDs link to certification records
                </div>
              </li>
              <li className="flex items-start gap-2">
                <Info className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                <div>
                  <strong>Version Tracking:</strong> Each row includes version number and previous version ID
                </div>
              </li>
              <li className="flex items-start gap-2">
                <Info className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                <div>
                  <strong>Evidence References:</strong> File paths included for uploaded evidence
                </div>
              </li>
            </ul>
          </div>

          <div className="bg-slate-900/50 p-4 rounded border border-slate-700">
            <h3 className="font-semibold mb-3 text-white">CSV Columns (Certifications)</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-800/50">
                  <tr>
                    <th className="px-3 py-2 text-left">Column Name</th>
                    <th className="px-3 py-2 text-left">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  <tr>
                    <td className="px-3 py-2 font-mono text-xs">certification_id</td>
                    <td className="px-3 py-2">Unique identifier</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 font-mono text-xs">version</td>
                    <td className="px-3 py-2">Version number (1, 2, 3...)</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 font-mono text-xs">previous_version_id</td>
                    <td className="px-3 py-2">Links to prior version if corrected</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 font-mono text-xs">employee_id</td>
                    <td className="px-3 py-2">References employee record</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 font-mono text-xs">certification_type</td>
                    <td className="px-3 py-2">Type (OSHA 30, FRA Track, etc.)</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 font-mono text-xs">issuing_authority</td>
                    <td className="px-3 py-2">Who issued the certification</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 font-mono text-xs">issue_date</td>
                    <td className="px-3 py-2">Date issued (ISO 8601)</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 font-mono text-xs">expiration_date</td>
                    <td className="px-3 py-2">Date expires (ISO 8601)</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 font-mono text-xs">status</td>
                    <td className="px-3 py-2">PASS, FAIL, INCOMPLETE</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 font-mono text-xs">created_at</td>
                    <td className="px-3 py-2">When this version was created</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 font-mono text-xs">created_by</td>
                    <td className="px-3 py-2">User who created this version</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 font-mono text-xs">correction_reason</td>
                    <td className="px-3 py-2">Why this correction was made</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 font-mono text-xs">evidence_file_path</td>
                    <td className="px-3 py-2">Path to evidence file in package</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-blue-900/20 border border-blue-800/50 rounded p-4">
            <div className="flex items-start gap-2">
              <Info className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <strong className="text-blue-300">Excel & SQL Compatible</strong>
                <p className="mt-1">
                  CSV files can be opened directly in Microsoft Excel or imported into SQL databases (PostgreSQL, MySQL, SQL Server).
                  Dates are in ISO 8601 format for proper sorting.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bulk CSV Import */}
      <section className="mb-12 p-6 bg-slate-800/50 border border-slate-700 rounded-lg">
        <div className="flex items-center gap-3 mb-4">
          <AlertCircle className="w-6 h-6 text-amber-400" />
          <h2 className="text-2xl font-bold">Bulk CSV Import</h2>
        </div>
        <div className="space-y-4 text-slate-300">
          <div className="bg-amber-900/20 border border-amber-800/50 rounded p-4">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <strong className="text-amber-300">Not Available in Current Production Release</strong>
                <p className="mt-1">
                  Bulk CSV import functionality is not available in the current production release. Manual entry is
                  required for certification and employee data.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/50 p-4 rounded border border-slate-700">
            <h3 className="font-semibold mb-3 text-white">Current Data Entry Options</h3>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                <div>
                  <strong>Manual Entry:</strong> Use dashboard forms to add employees and certifications individually
                </div>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                <div>
                  <strong>Support-Assisted Import:</strong> Contact support for assistance with large data migrations
                </div>
              </li>
            </ul>
          </div>

          <div className="bg-slate-900/50 p-4 rounded border border-slate-700">
            <h3 className="font-semibold mb-3 text-white">CSV Format Specification</h3>
            <p className="mb-2">
              Even though bulk import is not available, you can download the CSV format specification to prepare data
              for future import or support-assisted migration.
            </p>
            <Link href="/docs/csv-template.csv" download>
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg flex items-center gap-2 text-sm font-medium">
                <Download className="w-4 h-4" />
                Download CSV Template
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Record Inactivation */}
      <section className="mb-12 p-6 bg-slate-800/50 border border-slate-700 rounded-lg">
        <div className="flex items-center gap-3 mb-4">
          <AlertCircle className="w-6 h-6 text-red-400" />
          <h2 className="text-2xl font-bold">Record Inactivation</h2>
        </div>
        <div className="space-y-4 text-slate-300">
          <p>
            Records can be marked as inactive without deletion. This preserves audit trail integrity while indicating
            that a record is no longer current.
          </p>

          <div className="bg-slate-900/50 p-4 rounded border border-slate-700">
            <h3 className="font-semibold mb-3 text-white">When Records Become Inactive</h3>
            <ul className="space-y-2">
              <li><strong>Employee Termination:</strong> Employee records marked inactive (not deleted)</li>
              <li><strong>Superseded Certifications:</strong> Old versions remain but show as inactive</li>
              <li><strong>Administrative Review:</strong> Compliance officers can inactivate disputed records</li>
            </ul>
          </div>

          <div className="bg-slate-900/50 p-4 rounded border border-slate-700">
            <h3 className="font-semibold mb-3 text-white">Who Can Inactivate Records</h3>
            <ul className="space-y-2">
              <li><strong>Organization Admins:</strong> Full inactivation rights</li>
              <li><strong>Compliance Officers:</strong> Can inactivate certifications only</li>
              <li><strong>Supervisors:</strong> No inactivation rights</li>
            </ul>
          </div>

          <div className="bg-blue-900/20 border border-blue-800/50 rounded p-4">
            <div className="flex items-start gap-2">
              <Info className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <strong className="text-blue-300">Inactive ≠ Deleted</strong>
                <p className="mt-1">
                  Inactive records remain in the database and audit trail. They appear with an "Inactive — Not Deleted"
                  badge. All inactivation actions are recorded in the audit log.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Chain of Custody */}
      <section className="p-6 bg-slate-800/50 border border-slate-700 rounded-lg">
        <div className="flex items-center gap-3 mb-4">
          <FileText className="w-6 h-6 text-emerald-400" />
          <h2 className="text-2xl font-bold">Chain of Custody</h2>
        </div>
        <div className="space-y-4 text-slate-300">
          <p>Every certification and evidence file includes complete chain of custody information:</p>

          <div className="bg-slate-900/50 p-4 rounded border border-slate-700">
            <h3 className="font-semibold mb-3 text-white">Tracked Information</h3>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                <div>
                  <strong>Uploaded By:</strong> User name or system identifier
                </div>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                <div>
                  <strong>Upload Timestamp:</strong> Recorded in UTC (Coordinated Universal Time)
                </div>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                <div>
                  <strong>Original Filename:</strong> Preserved from upload
                </div>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                <div>
                  <strong>File Hash (SHA-256):</strong> Cryptographic checksum verifying file integrity
                </div>
              </li>
            </ul>
          </div>

          <div className="bg-blue-900/20 border border-blue-800/50 rounded p-4">
            <div className="flex items-start gap-2">
              <Info className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <strong className="text-blue-300">Displayed on Evidence Cards</strong>
                <p className="mt-1">
                  Chain of custody information is automatically displayed on evidence cards in employee detail pages and
                  audit packages. No additional configuration required.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
