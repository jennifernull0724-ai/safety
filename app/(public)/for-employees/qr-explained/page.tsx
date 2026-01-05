'use client';

import Link from 'next/link';
import { 
  QrCode, 
  Smartphone, 
  CheckCircle, 
  XCircle,
  AlertTriangle,
  Shield,
  Clock,
  MapPin,
  User,
  Info
} from 'lucide-react';
import { PublicLayout } from '@/components/PublicLayout';

/**
 * QR CODE EXPLANATION FOR EMPLOYEES
 * 
 * PURPOSE:
 * - Demystify QR verification process
 * - Show exactly what information is revealed
 * - Address privacy concerns
 * - Explain scan events and logging
 * 
 * CRITICAL MESSAGING:
 * - QR scans are NOT continuous tracking
 * - Only scanned when someone actively verifies you
 * - Shows limited information (certifications, not personal data)
 * - Protects you from wrongful blocking
 */

export default function QRExplainedPage() {
  return (
    <PublicLayout>
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-8 md:py-16">
        {/* Header */}
        <div className="mb-12 text-center">
          <QrCode className="w-16 h-16 text-blue-600 mx-auto mb-6" />
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            How QR Code Verification Works
          </h1>
          <p className="text-xl text-slate-600">
            A simple guide to what happens when your QR code is scanned
          </p>
        </div>

        {/* What Is a QR Code? */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">What Is a QR Code?</h2>
          <div className="p-6 bg-white border border-slate-200 rounded-lg">
            <p className="text-slate-700 mb-4">
              A QR code is a two-dimensional barcode that can be scanned with a smartphone camera or 
              scanner. It contains a unique identifier linked to your compliance record.
            </p>
            <p className="text-slate-700">
              <strong>Think of it like:</strong> A digital version of your certification wallet — instead 
              of carrying multiple physical documents, you carry one QR code that references all your records.
            </p>
          </div>
        </section>

        {/* How It Works - Step by Step */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">How Verification Works (Step-by-Step)</h2>
          
          <div className="space-y-6">
            {/* Step 1 */}
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                1
              </div>
              <div className="flex-1 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="font-bold text-slate-900 mb-2">Someone Scans Your QR Code</h3>
                <p className="text-slate-700">
                  A supervisor, inspector, or job site foreman uses their phone to scan your QR code. This 
                  might happen at the start of a shift, during an inspection, or when entering a restricted area.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <div className="flex-1 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="font-bold text-slate-900 mb-2">System Retrieves Your Current Status</h3>
                <p className="text-slate-700">
                  The QR code contains a unique token that looks up your compliance record in the system. It 
                  retrieves your current certification status as of <strong>this exact moment</strong> (not 
                  historical data).
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <div className="flex-1 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="font-bold text-slate-900 mb-2">Status Is Displayed</h3>
                <p className="text-slate-700">
                  The scanner sees a clear status indicator: VERIFIED (green), EXPIRING SOON (yellow), or 
                  NOT COMPLIANT (red). They can see which certifications you have and when they expire.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                4
              </div>
              <div className="flex-1 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="font-bold text-slate-900 mb-2">Scan Event Is Logged</h3>
                <p className="text-slate-700">
                  The system records that your QR code was scanned (timestamp, location if provided, scanner). 
                  This creates an audit trail for compliance purposes — it proves verification happened.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* What Information Is Shown */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">What Information Is Shown When Scanned</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-start gap-3 mb-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <h3 className="font-bold text-slate-900">Information That IS Shown</h3>
              </div>
              <ul className="space-y-2 text-sm text-slate-700">
                <li className="flex items-start gap-2">
                  <span className="text-green-600">✓</span>
                  <span>Your name</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600">✓</span>
                  <span>Employee ID</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600">✓</span>
                  <span>Current compliance status (VERIFIED / NOT COMPLIANT)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600">✓</span>
                  <span>List of certifications (OSHA 30, First Aid, etc.)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600">✓</span>
                  <span>Expiration dates for each certification</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600">✓</span>
                  <span>Trade/qualification (e.g., Welder, Electrician)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600">✓</span>
                  <span>Employer name</span>
                </li>
              </ul>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
              <div className="flex items-start gap-3 mb-3">
                <XCircle className="w-5 h-5 text-slate-600 flex-shrink-0 mt-0.5" />
                <h3 className="font-bold text-slate-900">Information That is NOT Shown</h3>
              </div>
              <ul className="space-y-2 text-sm text-slate-700">
                <li className="flex items-start gap-2">
                  <span className="text-slate-400">✗</span>
                  <span>Social Security Number</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-slate-400">✗</span>
                  <span>Date of birth</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-slate-400">✗</span>
                  <span>Home address</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-slate-400">✗</span>
                  <span>Phone number</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-slate-400">✗</span>
                  <span>Work performance reviews</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-slate-400">✗</span>
                  <span>Medical records</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-slate-400">✗</span>
                  <span>Your current location (unless scanner manually enters it)</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* What Gets Logged */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">What Gets Logged When You're Scanned</h2>
          
          <div className="p-6 bg-amber-50 border-2 border-amber-200 rounded-lg">
            <div className="flex items-start gap-4 mb-4">
              <Info className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-slate-900 mb-2">Scan Events Create an Audit Trail</h3>
                <p className="text-slate-700 mb-4">
                  Each QR scan is logged for compliance purposes. This protects both you and your employer 
                  by creating proof that verification occurred.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Timestamp</h4>
                  <p className="text-sm text-slate-700">Date and time of the scan (e.g., "Jan 5, 2026 8:15 AM")</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Location (Optional)</h4>
                  <p className="text-sm text-slate-700">
                    If the scanner enters a location (e.g., "Chicago Rail Yard"), it's recorded. This is 
                    <strong> NOT GPS tracking</strong> — it's manually entered by the scanner.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <User className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Scanner Identity</h4>
                  <p className="text-sm text-slate-700">
                    Who scanned your code (e.g., "John Smith - Safety Inspector"). This creates accountability 
                    for the verification.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Status at Time of Scan</h4>
                  <p className="text-sm text-slate-700">
                    Your compliance status at that exact moment (VERIFIED / NOT COMPLIANT). This creates proof 
                    of whether you were authorized to work.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* What Status Means */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">What Each Status Means</h2>
          
          <div className="space-y-4">
            <div className="p-4 bg-green-50 border-2 border-green-600 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <h3 className="font-bold text-green-900 text-lg">VERIFIED — Cleared to Work</h3>
              </div>
              <p className="text-slate-700">
                All required certifications are current and valid. You are authorized to work. The QR page 
                will display a large green banner with "CLEARED TO WORK."
              </p>
            </div>

            <div className="p-4 bg-yellow-50 border-2 border-yellow-600 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <AlertTriangle className="w-6 h-6 text-yellow-600" />
                <h3 className="font-bold text-yellow-900 text-lg">EXPIRING SOON — Action Required</h3>
              </div>
              <p className="text-slate-700">
                One or more certifications will expire within 30 days. You may still be cleared to work, but 
                you need to renew certifications soon. Contact your supervisor or training coordinator.
              </p>
            </div>

            <div className="p-4 bg-red-50 border-2 border-red-600 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <XCircle className="w-6 h-6 text-red-600" />
                <h3 className="font-bold text-red-900 text-lg">NOT COMPLIANT — Do Not Authorize</h3>
              </div>
              <p className="text-slate-700 mb-3">
                One or more required certifications are expired or missing. You are <strong>not authorized to 
                work</strong> until the issue is resolved. The QR page will display a large red banner with 
                "DO NOT AUTHORIZE WORK."
              </p>
              <p className="text-sm text-slate-600">
                <strong>If you believe this is an error:</strong> Contact your supervisor or compliance 
                administrator immediately with proof of current certifications.
              </p>
            </div>
          </div>
        </section>

        {/* Common Concerns */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Common Concerns Answered</h2>
          
          <div className="space-y-4">
            <div className="p-4 bg-white border border-slate-200 rounded-lg">
              <h3 className="font-bold text-slate-900 mb-2">Is this constant tracking of my location?</h3>
              <p className="text-slate-700">
                <strong>No.</strong> Your QR code does not broadcast your location or track you continuously. 
                A scan event is only recorded when someone actively scans your code. If a location is recorded, 
                it's because the scanner manually entered it (e.g., "Gate 5 Entrance") — not GPS tracking.
              </p>
            </div>

            <div className="p-4 bg-white border border-slate-200 rounded-lg">
              <h3 className="font-bold text-slate-900 mb-2">Can my employer see everywhere I've been?</h3>
              <p className="text-slate-700">
                Only if someone scanned your QR code at those locations. The system does not track you between 
                scans. You can think of it like a badge swipe system — it only records when you actively use it.
              </p>
            </div>

            <div className="p-4 bg-white border border-slate-200 rounded-lg">
              <h3 className="font-bold text-slate-900 mb-2">What if someone scans my code without permission?</h3>
              <p className="text-slate-700">
                QR scans should only be performed by authorized personnel (supervisors, inspectors, safety 
                officers). If you believe your code is being scanned inappropriately, report it to your employer's 
                compliance team. All scan events are logged with the scanner's identity for accountability.
              </p>
            </div>

            <div className="p-4 bg-white border border-slate-200 rounded-lg">
              <h3 className="font-bold text-slate-900 mb-2">Can I refuse to provide my QR code?</h3>
              <p className="text-slate-700">
                Your employer sets policies on when QR verification is required (e.g., entering job sites, 
                during inspections). If you have concerns about how it's being used, discuss them with your 
                supervisor or HR department.
              </p>
            </div>

            <div className="p-4 bg-white border border-slate-200 rounded-lg">
              <h3 className="font-bold text-slate-900 mb-2">How long are scan records kept?</h3>
              <p className="text-slate-700">
                Scan events are compliance records and may be kept indefinitely for audit purposes. They serve 
                as proof that verification occurred and can protect both you and your employer in disputes or 
                investigations.
              </p>
            </div>
          </div>
        </section>

        {/* Test Your Own QR Code */}
        <section className="p-6 bg-blue-900 text-white rounded-lg mb-8">
          <div className="flex items-start gap-4">
            <Smartphone className="w-8 h-8 text-blue-400 flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-xl font-bold mb-3">Want to See What Your QR Code Shows?</h2>
              <p className="mb-4">
                You have the right to scan your own QR code and see exactly what information is displayed. 
                Use your phone's camera or a QR scanner app to scan it.
              </p>
              <p className="text-sm text-blue-200">
                You'll see the same verification page that supervisors and inspectors see — including your 
                current status, certifications, and expiration dates.
              </p>
            </div>
          </div>
        </section>

        {/* Footer Links */}
        <div className="text-center text-sm text-slate-600">
          <Link href="/for-employees" className="hover:text-blue-600 underline">Back to Employee Information</Link>
          {' • '}
          <Link href="/privacy" className="hover:text-blue-600 underline">Privacy Policy</Link>
        </div>
      </div>
    </PublicLayout>
  );
}
