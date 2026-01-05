'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Download, 
  FileCheck, 
  Package,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Clock,
  User,
  FileText
} from 'lucide-react';
import { PublicLayout } from '@/components/PublicLayout';

/**
 * EVIDENCE PACKAGE DOWNLOAD FOR REGULATORS
 * 
 * PURPOSE:
 * - Public access (NO LOGIN REQUIRED)
 * - Download complete compliance evidence packages
 * - PDF exports, CSV exports, certification documents
 * - Simple request form with instant download
 * 
 * CRITICAL FEATURES:
 * - No authentication required
 * - Select what to include in package
 * - Instant download (no email/request queue)
 * - Includes verification logs, certification docs, audit trails
 */

interface PackageContents {
  certificationDocuments: boolean;
  verificationLogs: boolean;
  auditTrail: boolean;
  complianceTimeline: boolean;
  pointInTimeReports: boolean;
}

export default function EvidencePackagePage() {
  const [employeeId, setEmployeeId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [packageFormat, setPackageFormat] = useState<'pdf' | 'zip'>('pdf');
  const [contents, setContents] = useState<PackageContents>({
    certificationDocuments: true,
    verificationLogs: true,
    auditTrail: true,
    complianceTimeline: true,
    pointInTimeReports: false
  });
  const [loading, setLoading] = useState(false);
  const [downloadReady, setDownloadReady] = useState(false);

  const toggleContent = (key: keyof PackageContents) => {
    setContents({ ...contents, [key]: !contents[key] });
  };

  const generatePackage = async () => {
    if (!employeeId) return;
    
    setLoading(true);
    setDownloadReady(false);

    try {
      // PLACEHOLDER: API call to generate evidence package
      // In production:
      // const response = await fetch('/api/regulator/evidence-package', {
      //   method: 'POST',
      //   body: JSON.stringify({ employeeId, startDate, endDate, format: packageFormat, contents })
      // });
      // const blob = await response.blob();
      // const url = window.URL.createObjectURL(blob);
      // const a = document.createElement('a');
      // a.href = url;
      // a.download = `evidence-package-${employeeId}-${Date.now()}.${packageFormat === 'pdf' ? 'pdf' : 'zip'}`;
      // a.click();
      
      // Simulate delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      setDownloadReady(true);
    } catch (error) {
      console.error('Failed to generate evidence package:', error);
      alert('Failed to generate evidence package. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const downloadNow = () => {
    // PLACEHOLDER: Trigger actual download
    alert(`Would download ${packageFormat.toUpperCase()} evidence package for employee ${employeeId}`);
  };

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
            <Package className="w-12 h-12 text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                Evidence Package Download
              </h1>
              <p className="text-lg text-slate-600 mt-1">
                Request complete compliance evidence packages — No login required
              </p>
            </div>
          </div>
        </div>

        {/* No Login Required Banner */}
        <div className="mb-8 p-4 bg-green-50 border-2 border-green-600 rounded-lg">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-green-900 mb-1">Instant Download - No Account Required</h3>
              <p className="text-sm text-slate-700">
                Evidence packages are publicly accessible for regulatory review. Fill out the form below 
                and download immediately.
              </p>
            </div>
          </div>
        </div>

        {/* Request Form */}
        <section className="mb-8 p-6 bg-white border border-slate-200 rounded-lg">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Request Evidence Package</h2>
          
          <div className="space-y-6">
            {/* Employee ID */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Employee ID or Name <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                placeholder="Enter employee ID (e.g., EMP-12345) or name"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Start Date (Optional)
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  End Date (Optional)
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <p className="text-sm text-slate-600">
              Leave dates blank to include all historical records
            </p>

            {/* Package Format */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-3">
                Package Format
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                  packageFormat === 'pdf' ? 'border-blue-600 bg-blue-50' : 'border-slate-200 bg-white'
                }`}>
                  <input
                    type="radio"
                    name="format"
                    value="pdf"
                    checked={packageFormat === 'pdf'}
                    onChange={() => setPackageFormat('pdf')}
                    className="mr-3"
                  />
                  <span className="font-semibold text-slate-900">Single PDF Document</span>
                  <p className="text-sm text-slate-600 mt-1 ml-6">
                    All records compiled into one PDF file (recommended for simple audits)
                  </p>
                </label>

                <label className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                  packageFormat === 'zip' ? 'border-blue-600 bg-blue-50' : 'border-slate-200 bg-white'
                }`}>
                  <input
                    type="radio"
                    name="format"
                    value="zip"
                    checked={packageFormat === 'zip'}
                    onChange={() => setPackageFormat('zip')}
                    className="mr-3"
                  />
                  <span className="font-semibold text-slate-900">ZIP Archive</span>
                  <p className="text-sm text-slate-600 mt-1 ml-6">
                    Individual files organized by type (recommended for detailed review)
                  </p>
                </label>
              </div>
            </div>

            {/* Package Contents */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-3">
                What to Include
              </label>
              <div className="space-y-3">
                <label className="flex items-start gap-3 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={contents.certificationDocuments}
                    onChange={() => toggleContent('certificationDocuments')}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="font-semibold text-slate-900">Certification Documents</div>
                    <div className="text-sm text-slate-600">
                      PDF copies of all uploaded certificates, training records, and licenses
                    </div>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={contents.verificationLogs}
                    onChange={() => toggleContent('verificationLogs')}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="font-semibold text-slate-900">Verification Logs</div>
                    <div className="text-sm text-slate-600">
                      All QR code scans with timestamps, scanner identity, and verification results
                    </div>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={contents.auditTrail}
                    onChange={() => toggleContent('auditTrail')}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="font-semibold text-slate-900">Audit Trail</div>
                    <div className="text-sm text-slate-600">
                      Complete change history with who made changes, when, and why (tamper-evident)
                    </div>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={contents.complianceTimeline}
                    onChange={() => toggleContent('complianceTimeline')}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="font-semibold text-slate-900">Compliance Timeline</div>
                    <div className="text-sm text-slate-600">
                      Chronological view of all compliance events and status changes
                    </div>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={contents.pointInTimeReports}
                    onChange={() => toggleContent('pointInTimeReports')}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="font-semibold text-slate-900">Point-in-Time Compliance Reports</div>
                    <div className="text-sm text-slate-600">
                      Generate reports showing compliance status on specific dates (useful for incident investigations)
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={generatePackage}
              disabled={!employeeId || loading}
              className="w-full px-6 py-4 bg-blue-600 text-white font-bold text-lg rounded-lg hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-3"
            >
              {loading ? (
                <>
                  <Clock className="w-6 h-6 animate-spin" />
                  Generating Package...
                </>
              ) : (
                <>
                  <Package className="w-6 h-6" />
                  Generate Evidence Package
                </>
              )}
            </button>
          </div>
        </section>

        {/* Download Ready */}
        {downloadReady && (
          <section className="mb-8 p-6 bg-green-50 border-2 border-green-600 rounded-lg animate-pulse">
            <div className="flex items-start gap-4">
              <CheckCircle className="w-10 h-10 text-green-600 flex-shrink-0" />
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-green-900 mb-2">
                  Evidence Package Ready
                </h2>
                <p className="text-slate-700 mb-4">
                  Your evidence package has been generated and is ready for download.
                </p>
                <button
                  onClick={downloadNow}
                  className="px-6 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 flex items-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  Download Now ({packageFormat.toUpperCase()})
                </button>
              </div>
            </div>
          </section>
        )}

        {/* What's Included */}
        <section className="mb-8 p-6 bg-slate-50 border border-slate-200 rounded-lg">
          <h3 className="text-lg font-bold text-slate-900 mb-4">What's Included in Evidence Packages</h3>
          
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <FileText className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-slate-900">Cover Page</h4>
                <p className="text-sm text-slate-700">
                  Package generation date, employee information, date range, and package contents summary
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <FileCheck className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-slate-900">Certification Documents</h4>
                <p className="text-sm text-slate-700">
                  Original uploaded PDFs/images of certificates, organized by certification type and date
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-slate-900">Verification Logs (CSV + PDF)</h4>
                <p className="text-sm text-slate-700">
                  Timestamped list of all QR scans: date/time, scanner name, location, result
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <User className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-slate-900">Audit Trail (CSV + PDF)</h4>
                <p className="text-sm text-slate-700">
                  Complete change history: who, what, when, why — tamper-evident with original timestamps
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-slate-900">Compliance Timeline (Visual PDF)</h4>
                <p className="text-sm text-slate-700">
                  Graphical representation of compliance state over time, with key events highlighted
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Help Section */}
        <section className="p-6 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="text-lg font-bold text-blue-900 mb-3">Common Use Cases</h3>
          <ul className="space-y-2 text-sm text-slate-700">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">•</span>
              <span>
                <strong>Incident Investigation:</strong> Generate evidence package for employee involved 
                in workplace accident to verify certification status at time of incident
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">•</span>
              <span>
                <strong>Compliance Audit:</strong> Download evidence for multiple employees during scheduled 
                safety audit or regulatory inspection
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">•</span>
              <span>
                <strong>Enforcement Action:</strong> Compile complete evidence package for citation, 
                violation notice, or legal proceedings
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">•</span>
              <span>
                <strong>Historical Verification:</strong> Confirm employee certifications were valid during 
                specific time period (e.g., "Was employee compliant during Q4 2025?")
              </span>
            </li>
          </ul>
        </section>
      </div>
    </PublicLayout>
  );
}
