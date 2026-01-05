'use client';

import Link from 'next/link';
import { 
  User, 
  Shield, 
  QrCode, 
  FileCheck, 
  Lock,
  Info,
  CheckCircle,
  Eye,
  AlertCircle
} from 'lucide-react';
import { PublicLayout } from '@/components/PublicLayout';

/**
 * FOR EMPLOYEES PAGE
 * 
 * PURPOSE:
 * - Explain to employees that they are RECORDS, not USERS
 * - Clarify NO LOGIN required or available
 * - Transparency about what's tracked and why
 * - Address surveillance concerns
 * - Explain QR verification process
 * 
 * CRITICAL MESSAGING:
 * - You don't need to log in
 * - This is not surveillance
 * - This protects YOUR ability to work
 * - Records are kept BY your employer, not by you
 */

export default function ForEmployeesPage() {
  return (
    <PublicLayout>
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-8 md:py-16">
        {/* Header */}
        <div className="mb-12 text-center">
          <User className="w-16 h-16 text-blue-600 mx-auto mb-6" />
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            For Employees: Understanding Your Compliance Record
          </h1>
          <p className="text-xl text-slate-600">
            You don't need to log in or create an account. This page explains what's tracked and why.
          </p>
        </div>

        {/* Critical Distinction */}
        <div className="mb-12 p-6 bg-blue-50 border-2 border-blue-200 rounded-lg">
          <div className="flex items-start gap-4">
            <Info className="w-8 h-8 text-blue-600 flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-xl font-bold text-blue-900 mb-2">
                You Are a Record, Not a User
              </h2>
              <p className="text-slate-700 mb-4">
                This system maintains <strong>compliance records</strong> about employees. It is not a system 
                employees log into or use directly. Your employer maintains these records to track required 
                certifications and work authorization.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-700">
                    <strong>NO login required</strong> — You don't create an account
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-700">
                    <strong>NO password needed</strong> — Nothing to remember
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-700">
                    <strong>NO app to download</strong> — Your employer manages records
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-700">
                    <strong>NO tracking of location</strong> — Only QR scans when verified
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* What This System Does */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">What This System Does</h2>
          
          <div className="space-y-6">
            <div className="p-6 bg-white border border-slate-200 rounded-lg">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <FileCheck className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-2">Stores Your Certifications</h3>
                  <p className="text-slate-700">
                    Your employer uploads copies of your safety certifications, training records, and licenses. 
                    This creates a digital record that can be verified by inspectors, clients, or job site 
                    supervisors.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 bg-white border border-slate-200 rounded-lg">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <QrCode className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-2">Provides QR Code Verification</h3>
                  <p className="text-slate-700 mb-3">
                    You may receive a QR code (printed card, badge, or digital) that others can scan to instantly 
                    verify your current certification status. This is similar to scanning a driver's license or 
                    passport.
                  </p>
                  <p className="text-sm text-slate-600">
                    <strong>Who scans it:</strong> Job site supervisors, safety inspectors, railroad officials, 
                    or emergency responders may scan your QR code to confirm you're authorized to work.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 bg-white border border-slate-200 rounded-lg">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Shield className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-2">Protects Your Ability to Work</h3>
                  <p className="text-slate-700">
                    By maintaining accurate, tamper-evident records, the system prevents you from being 
                    wrongly blocked or questioned about your certifications. If a certification is current, 
                    the QR code will show "VERIFIED."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* What This System Does NOT Do */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">What This System Does NOT Do</h2>
          
          <div className="space-y-4">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-slate-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">Does NOT Track Your Location</h3>
                  <p className="text-sm text-slate-700">
                    The system does not track where you are or monitor your movements. QR scans may record 
                    the location of the scan (e.g., "Chicago Yard"), but this is only recorded when someone 
                    actively scans your code — it is not continuous tracking.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-slate-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">Does NOT Monitor Your Performance</h3>
                  <p className="text-sm text-slate-700">
                    This is a compliance verification system, not a performance monitoring tool. It tracks 
                    whether you have required certifications, not how well you perform your job.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-slate-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">Does NOT Replace Your Physical Certifications</h3>
                  <p className="text-sm text-slate-700">
                    You should still carry physical copies of required certifications as backup. The QR code 
                    is a convenience tool, not a replacement for official documents.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-slate-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">Does NOT Require You to Log In</h3>
                  <p className="text-sm text-slate-700">
                    Employees do not create accounts, set passwords, or log into this system. Your employer's 
                    compliance team maintains the records on your behalf.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Your Rights */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Your Rights</h2>
          
          <div className="space-y-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-start gap-3">
                <Eye className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">Right to View Your Records</h3>
                  <p className="text-sm text-slate-700">
                    You can request to see your certification records at any time by asking your employer's 
                    compliance administrator. They can print or show you exactly what information is stored.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-start gap-3">
                <FileCheck className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">Right to Correct Errors</h3>
                  <p className="text-sm text-slate-700">
                    If you believe your record contains an error (wrong expiration date, missing certification), 
                    notify your supervisor or compliance team immediately. They can submit corrections with 
                    documented proof.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-start gap-3">
                <Lock className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">Right to Privacy</h3>
                  <p className="text-sm text-slate-700">
                    Your certification records are used only for compliance verification purposes. They are 
                    not sold, shared with third parties for marketing, or used for purposes unrelated to 
                    work authorization.
                  </p>
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
              <h3 className="font-bold text-slate-900 mb-2">Why was I given a QR code?</h3>
              <p className="text-slate-700">
                Your employer provided it to streamline compliance verification. Instead of showing multiple 
                physical documents to inspectors or supervisors, they can scan your QR code to instantly 
                verify your current status.
              </p>
            </div>

            <div className="p-4 bg-white border border-slate-200 rounded-lg">
              <h3 className="font-bold text-slate-900 mb-2">Can I see what information the QR code shows?</h3>
              <p className="text-slate-700">
                Yes. You can scan your own QR code (or ask someone to scan it for you) to see exactly what 
                information is displayed. It typically shows your name, certifications, expiration dates, 
                and current status.
              </p>
            </div>

            <div className="p-4 bg-white border border-slate-200 rounded-lg">
              <h3 className="font-bold text-slate-900 mb-2">What happens if my certification is about to expire?</h3>
              <p className="text-slate-700">
                Your employer's system tracks expiration dates and should notify the compliance team in 
                advance. You may receive a reminder to renew your certification. If a certification expires, 
                the QR code will show "NOT COMPLIANT" until it is renewed.
              </p>
            </div>

            <div className="p-4 bg-white border border-slate-200 rounded-lg">
              <h3 className="font-bold text-slate-900 mb-2">What if I'm blocked from working and it's wrong?</h3>
              <p className="text-slate-700">
                Contact your supervisor or compliance administrator immediately. They can review your record, 
                correct any errors, and update your status. All corrections are documented with reasons and 
                timestamps.
              </p>
            </div>

            <div className="p-4 bg-white border border-slate-200 rounded-lg">
              <h3 className="font-bold text-slate-900 mb-2">Who can see my records?</h3>
              <p className="text-slate-700">
                Only authorized personnel: your employer's compliance team, supervisors who need to verify 
                work authorization, safety inspectors, and regulators conducting compliance audits. Public 
                QR verification shows limited information (name, status, certifications) — it does not show 
                sensitive personal data.
              </p>
            </div>

            <div className="p-4 bg-white border border-slate-200 rounded-lg">
              <h3 className="font-bold text-slate-900 mb-2">Do I need to download an app or create a password?</h3>
              <p className="text-slate-700">
                <strong>No.</strong> Employees do not log in, create accounts, or use this system directly. 
                Your employer maintains your records. You don't need to remember a password or download anything.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Information */}
        <section className="p-6 bg-slate-900 text-white rounded-lg">
          <h2 className="text-xl font-bold mb-4">Questions or Concerns?</h2>
          <p className="mb-4">
            If you have questions about your compliance record, contact your employer's compliance team:
          </p>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-blue-400">•</span>
              <span>Ask your direct supervisor</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400">•</span>
              <span>Contact your Safety Officer or Compliance Administrator</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400">•</span>
              <span>Refer to your employee handbook for compliance policies</span>
            </li>
          </ul>
          <p className="mt-4 text-sm text-slate-400">
            For technical support with the T-REX AI OS system itself, your employer can contact: 
            <strong className="text-white"> support@trexaios.com</strong>
          </p>
        </section>

        {/* Footer Links */}
        <div className="mt-8 text-center text-sm text-slate-600">
          <Link href="/privacy" className="hover:text-blue-600 underline">Privacy Policy</Link>
          {' • '}
          <Link href="/for-employees/qr-explained" className="hover:text-blue-600 underline">How QR Verification Works</Link>
        </div>
      </div>
    </PublicLayout>
  );
}
