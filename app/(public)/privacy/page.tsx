'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Lock, 
  Eye, 
  Shield, 
  Database,
  FileText,
  UserX,
  Clock,
  Globe,
  AlertCircle,
  CheckCircle,
  User
} from 'lucide-react';
import { PublicLayout } from '@/components/PublicLayout';

export default function PrivacyPolicy() {
  return (
    <PublicLayout>
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-8 md:py-16">
        {/* Header */}
        <div className="mb-12">
          <Lock className="w-16 h-16 text-blue-600 mb-6" />
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Privacy Policy
          </h1>
          <p className="text-lg text-slate-600 mb-4">
            Last Updated: January 5, 2026
          </p>
          <p className="text-slate-700">
            This privacy policy explains how T-REX AI OS handles employee compliance records and data.
          </p>
        </div>

        {/* Critical Understanding for Employees */}
        <div className="mb-12 p-6 bg-blue-50 border-2 border-blue-200 rounded-lg">
          <div className="flex items-start gap-4">
            <AlertCircle className="w-8 h-8 text-blue-600 flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-xl font-bold text-blue-900 mb-2">
                For Employees: You Are a Record, Not a User
              </h2>
              <p className="text-slate-700 mb-3">
                <strong>Employees do not log into this system.</strong> You are a record maintained by your 
                employer for compliance purposes. This section explains what information is collected about 
                you and your rights.
              </p>
              <Link 
                href="/for-employees" 
                className="text-blue-600 hover:text-blue-800 underline font-semibold"
              >
                Read Employee-Specific Privacy Information →
              </Link>
            </div>
          </div>
        </div>
        
        <div className="prose prose-slate max-w-none space-y-6 md:space-y-8 text-slate-700">
          <section>
            <h2 className="text-xl md:text-2xl font-semibold text-slate-900 mb-3 md:mb-4">1. Introduction</h2>
            <p>
              This Privacy Policy describes how T-REX AI OS collects, uses, stores, and protects 
              information when organizations use our employee-anchored compliance and verification system. 
              This policy applies to both <strong>organizational users</strong> (administrators, compliance 
              officers, supervisors) and <strong>employees</strong> (who are subjects of records, not system users).
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">2. Information We Collect</h2>
            
            <h3 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Account Information</h3>
            <p>When you create an account, we collect:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Organization name and contact details</li>
              <li>User name and email address</li>
              <li>Account credentials (passwords are encrypted)</li>
              <li>Role and permission assignments</li>
            </ul>

            <h3 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Employee and Certification Data</h3>
            <p>Organizations provide the following data about employees as part of using the Service:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Employee names, employee IDs, and organizational assignments</li>
              <li>Certification documents, expiration dates, and proof images</li>
              <li>Training records and compliance status</li>
              <li>Job hazard analysis (JHA) assignments and acknowledgments</li>
            </ul>
            <p className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded text-sm">
              <strong>For employees:</strong> You do not provide this data directly. Your employer uploads 
              and maintains these records. See the{' '}
              <Link href="/for-employees" className="text-blue-600 hover:text-blue-800 underline">
                Employee Information Page
              </Link>{' '}
              for details on your rights and what information is collected about you.
            </p>

            <h3 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Verification and Audit Data</h3>
            <p>The Service automatically logs:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>QR code scan events with timestamps</li>
              <li>Verification results and outcomes</li>
              <li>User actions within the system (for organizational users)</li>
              <li>Enforcement decisions and blocking events</li>
              <li>Optional location data if manually provided by scanner (NOT GPS tracking)</li>
            </ul>
            <p className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded text-sm">
              <strong>Important:</strong> The system does NOT track employee locations continuously. Location 
              data is only recorded if someone scanning a QR code manually enters it (e.g., "Gate 5 Entrance"). 
              This is not GPS tracking or surveillance.
            </p>

            <h3 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Technical Information</h3>
            <p>We collect standard technical data:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>IP addresses and browser information</li>
              <li>Device type and operating system</li>
              <li>Session duration and access patterns</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">3. How We Use Your Information</h2>
            <p>We use collected information to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide and maintain the compliance verification Service</li>
              <li>Generate public QR verification pages</li>
              <li>Maintain tamper-evident audit trails</li>
              <li>Enforce compliance rules and blocking mechanisms</li>
              <li>Provide analytics and risk scoring features</li>
              <li>Respond to support requests</li>
              <li>Improve Service functionality and security</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">4. Data Ownership</h2>
            <p>
              <strong>You retain full ownership of all data you submit to the Service.</strong> This includes 
              employee records, certification documents, evidence images, and organizational information. 
              T-REX AI OS acts as a data processor to store and manage your data on your behalf.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">5. Data Sharing and Disclosure</h2>
            
            <h3 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Public Verification Pages</h3>
            <p>
              QR code verification pages are publicly accessible and display verification status as of scan time. 
              These pages show certification validity, expiration status, and verification outcomes but do not 
              expose personally identifiable information beyond what is necessary for verification purposes.
            </p>

            <h3 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Regulator Access</h3>
            <p>
              The Service provides read-only access surfaces for authorized regulators to review compliance 
              records and audit trails. This access is logged and does not permit data modification.
            </p>

            <h3 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Legal Requirements</h3>
            <p>
              We may disclose information if required by law, court order, or government request, or to 
              protect the rights, property, or safety of T-REX AI OS, our users, or the public.
            </p>

            <h3 className="text-xl font-semibold text-slate-900 mt-6 mb-3">No Third-Party Sales</h3>
            <p>
              We do not sell, rent, or share your data with third parties for marketing purposes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">6. Data Retention</h2>
            
            <h3 className="text-xl font-semibold text-slate-900 mt-4 mb-3">Record Retention</h3>
            <p>
              All compliance records and verification logs are retained for a minimum of 10 years unless 
              a longer period is required by applicable regulation or legal hold. This retention period 
              ensures records remain available for regulatory review, legal proceedings, and audit purposes.
            </p>
            
            <p className="mt-4">
              Verification records and audit trails are retained as part of the Service's tamper-evident, 
              append-only ledger functionality. This ensures historical compliance evidence remains available 
              for legal and regulatory purposes.
            </p>
            <p className="mt-4">
              If you terminate your account, employee and certification data will be archived but verification 
              history will remain accessible to maintain audit integrity. You may request data export or 
              deletion subject to legal and regulatory retention requirements.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">7. Data Security</h2>
            <p>We implement security measures to protect your data, including:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Encryption of data in transit using HTTPS/TLS</li>
              <li>Secure storage of credentials and sensitive information</li>
              <li>Role-based access controls</li>
              <li>Append-only audit logging to prevent tampering</li>
              <li>Regular security reviews and updates</li>
            </ul>
            <p className="mt-4">
              While we take reasonable precautions, no system is completely secure. You are responsible for 
              maintaining the confidentiality of your account credentials.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">8. Your Rights</h2>
            
            <h3 className="text-xl font-semibold text-slate-900 mt-6 mb-3">For Organizational Users (Administrators, Compliance Officers)</h3>
            <p>Depending on your jurisdiction, you may have rights to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Access and review your account and organizational data</li>
              <li>Request correction of inaccurate information</li>
              <li>Request deletion of data (subject to retention requirements)</li>
              <li>Export your data in a portable format</li>
              <li>Restrict or object to certain processing activities</li>
            </ul>
            <p className="mt-4">
              To exercise these rights, contact us at{' '}
              <a href="mailto:support@trexaios.com" className="text-blue-600 hover:text-blue-700">
                support@trexaios.com
              </a>.
            </p>

            <h3 className="text-xl font-semibold text-slate-900 mt-6 mb-3">For Employees (Records Subjects)</h3>
            <p>Employees whose records are maintained in the system have the right to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Access:</strong> Request to view your compliance record at any time</li>
              <li><strong>Correction:</strong> Request correction of errors with documented proof</li>
              <li><strong>Explanation:</strong> Ask why your status changed or why you're blocked</li>
              <li><strong>Portability (Limited):</strong> Request a copy of your certification records</li>
            </ul>
            <p className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded text-sm">
              <strong>Employees:</strong> To exercise your rights, first contact your employer's compliance 
              administrator or HR department. They are the data controller for your records. If unresolved, 
              contact privacy@trexaios.com.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">9. Children's Privacy</h2>
            <p>
              The Service is not intended for individuals under the age of 18. We do not knowingly collect 
              personal information from children. If we become aware that a child has provided us with personal 
              data, we will take steps to delete such information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">10. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. Changes will be posted on this page with 
              an updated revision date. Continued use of the Service after changes are posted constitutes 
              acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">11. Contact for Privacy Inquiries</h2>
            <p>
              For questions or concerns about this Privacy Policy or our data practices, contact us at{' '}
              <a href="mailto:support@trexaios.com" className="text-blue-600 hover:text-blue-700">
                support@trexaios.com
              </a>.
            </p>
          </section>

          <p className="text-sm text-slate-500 mt-12">
            Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
      </div>
    </PublicLayout>
  );
}
