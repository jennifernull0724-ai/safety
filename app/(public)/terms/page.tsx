import React from 'react';
import { PublicLayout } from '@/components/PublicLayout';

export default function TermsOfService() {
  return (
    <PublicLayout>
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-8 md:py-16">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-6 md:mb-8">Terms of Service</h1>
        
        <div className="prose prose-slate max-w-none space-y-6 md:space-y-8 text-slate-700">
          <section>
            <h2 className="text-xl md:text-2xl font-semibold text-slate-900 mb-3 md:mb-4">1. Acceptance of Terms</h2>
            <p>
              By accessing or using T-REX AI OS (the "Service"), you agree to be bound by these Terms of Service. 
              If you do not agree to these terms, you may not access or use the Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">2. Service Description</h2>
            <p>
              T-REX AI OS provides an employee-anchored compliance and verification system designed for 
              organizational certification management, QR-based verification, and audit trail maintenance. 
              The Service is provided on a subscription basis with a flat annual licensing fee.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">3. Service Access</h2>
            <p>
              Access to the Service requires an active organizational license. Upon payment and account creation, 
              your organization receives verification authority effective from the license activation timestamp. 
              Trust and verification capabilities apply only forward in time from activation.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">4. User Responsibilities</h2>
            <p>You agree to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide accurate employee and certification information</li>
              <li>Upload authentic certification documents and proof images</li>
              <li>Maintain the security of your account credentials</li>
              <li>Use the Service in compliance with applicable laws and regulations</li>
              <li>Not attempt to modify, tamper with, or circumvent audit logging mechanisms</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">5. Prohibited Use</h2>
            <p>You may not:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Upload false or fraudulent certification documents</li>
              <li>Attempt to forge or manipulate verification records</li>
              <li>Use the Service to violate any laws or regulations</li>
              <li>Reverse engineer, decompile, or extract source code from the Service</li>
              <li>Interfere with or disrupt the integrity or performance of the Service</li>
              <li>Access the Service through automated means without authorization</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">6. Data Ownership</h2>
            <p>
              You retain ownership of all data you submit to the Service, including employee records, 
              certification documents, and evidence images. T-REX AI OS maintains an immutable audit trail 
              of verification events and system actions as part of the Service's core functionality.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">7. Intellectual Property</h2>
            <p>
              The Service, including all software, content, trademarks, and materials, is the property of 
              T-REX AI OS and is protected by intellectual property laws. These Terms grant you a limited, 
              non-exclusive, non-transferable license to access and use the Service for its intended purpose.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">8. Service Availability</h2>
            <p>
              We strive to maintain high availability of the Service but do not guarantee uninterrupted access. 
              Scheduled maintenance, updates, and unforeseen technical issues may result in temporary service 
              disruptions. We will provide advance notice of planned maintenance when possible.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">9. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, T-REX AI OS shall not be liable for any indirect, 
              incidental, special, consequential, or punitive damages arising from your use of the Service. 
              Our total liability for any claims related to the Service shall not exceed the amount you paid 
              for the Service in the twelve months preceding the claim.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">10. Indemnification</h2>
            <p>
              You agree to indemnify and hold harmless T-REX AI OS from any claims, damages, or expenses 
              arising from your use of the Service, your violation of these Terms, or your violation of any 
              rights of another party.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">11. Termination</h2>
            <p>
              We reserve the right to suspend or terminate your access to the Service if you violate these 
              Terms or engage in prohibited conduct. Upon termination, your license to use the Service ends 
              immediately. Provisions relating to intellectual property, limitation of liability, and dispute 
              resolution shall survive termination.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">12. Modifications to Terms</h2>
            <p>
              We may modify these Terms at any time. Changes will be effective upon posting to this page. 
              Your continued use of the Service after changes are posted constitutes acceptance of the modified Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">13. Governing Law</h2>
            <p>
              These Terms are governed by and construed in accordance with the laws of the jurisdiction in 
              which T-REX AI OS operates, without regard to conflict of law principles.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">14. Dispute Resolution</h2>
            <p>
              Any disputes arising from these Terms or the Service shall be resolved through binding arbitration 
              in accordance with applicable arbitration rules, except where prohibited by law.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">15. Contact Information</h2>
            <p>
              For questions regarding these Terms of Service, contact us at{' '}
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
