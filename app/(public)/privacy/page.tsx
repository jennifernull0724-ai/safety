import React from 'react';
import { PublicLayout } from '@/components/PublicLayout';

export default function PrivacyPolicy() {
  return (
    <PublicLayout>
      <div className="max-w-4xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold text-slate-900 mb-8">Privacy Policy</h1>
        
        <div className="prose prose-slate max-w-none space-y-8 text-slate-700">
          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">1. Introduction</h2>
            <p>
              This Privacy Policy describes how T-REX AI OS collects, uses, stores, and protects your 
              information when you use our employee-anchored compliance and verification system.
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
            <p>You provide the following data as part of using the Service:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Employee names, contact information, and organizational assignments</li>
              <li>Certification documents, expiration dates, and proof images</li>
              <li>Training records and compliance status</li>
              <li>Job hazard analysis (JHA) assignments and acknowledgments</li>
            </ul>

            <h3 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Verification and Audit Data</h3>
            <p>The Service automatically logs:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>QR code scan events with timestamps</li>
              <li>Verification results and outcomes</li>
              <li>User actions within the system</li>
              <li>Enforcement decisions and blocking events</li>
              <li>Optional location data if provided during scans</li>
            </ul>

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
              <li>Maintain immutable audit trails</li>
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
            <p>
              Verification records and audit trails are retained indefinitely as part of the Service's 
              immutable ledger functionality. This ensures historical compliance evidence remains available 
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
            <p>Depending on your jurisdiction, you may have rights to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Access and review your personal data</li>
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
