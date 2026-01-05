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
              T-REX AI OS provides a Compliance Verification and Record System designed for 
              organizational certification management, QR-based verification, and audit trail maintenance. 
              The Service is provided on a subscription basis with a flat annual licensing fee.
            </p>
            <p className="mt-3">
              The Service utilizes tamper-evident, append-only record structures designed for regulatory inspection.
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
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">6. Data Ownership and Portability</h2>
            <p>
              You retain full ownership of all data you submit to the Service, including employee records, 
              certification documents, and evidence images. T-REX AI OS maintains a tamper-evident, append-only 
              audit trail of verification events and system actions as part of the Service's core functionality.
            </p>
            <p className="mt-3">
              <strong>Data Portability Upon Termination:</strong> Upon termination or non-renewal of your license, 
              you will receive a complete export of all your data within 30 days. Data exports include:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Employee records, certification data, and verification history</li>
              <li>Audit logs and verification event timelines</li>
              <li>Evidence files (images, documents)</li>
              <li>Formats provided: CSV, JSON, and PDF</li>
            </ul>
            <p className="mt-3">
              Read-only access to your data remains available during the 30-day export window following termination.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">7. Service Availability and Reliability</h2>
            <p>
              <strong>Service Level Commitment:</strong> We commit to maintaining 99.5% monthly uptime availability 
              for the Service, measured on a calendar month basis. Scheduled maintenance windows will be announced 
              with at least 72 hours advance notice whenever possible.
            </p>
            <p className="mt-3">
              <strong>Service Credits:</strong> If monthly uptime falls below 99.5%, you may be eligible for 
              pro-rata service credits calculated as follows:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>99.0% - 99.49% uptime: 5% monthly credit</li>
              <li>98.0% - 98.99% uptime: 10% monthly credit</li>
              <li>Below 98.0% uptime: 15% monthly credit</li>
            </ul>
            <p className="mt-3">
              Service outages occurring during regulatory inspections or audits qualify for SLA credit consideration. 
              Credits must be requested within 30 days of the incident with supporting documentation.
            </p>
            <p className="mt-3">
              Scheduled maintenance and events beyond our reasonable control (force majeure) are excluded from 
              uptime calculations.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">8. Intellectual Property</h2>
            <p>
              The Service, including all software, content, trademarks, and materials, is the property of 
              T-REX AI OS and is protected by intellectual property laws. These Terms grant you a limited, 
              non-exclusive license to access and use the Service for its intended purpose during your 
              active subscription period.
            </p>
            <p className="mt-3">
              <strong>License Transferability:</strong> Your license may be assigned to an acquiring entity 
              in the event of merger, acquisition, or asset sale, subject to written notice to T-REX AI OS 
              and the acquiring entity's acceptance of these Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">9. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, T-REX AI OS shall not be liable for any indirect, 
              incidental, special, consequential, or punitive damages arising from your use of the Service.
            </p>
            <p className="mt-3">
              <strong>Liability Cap:</strong> Our total liability for any claims related to the Service 
              (including but not limited to breach of contract, service outages, or platform defects) shall 
              not exceed the amount you paid for the Service in the twelve months preceding the claim.
            </p>
            <p className="mt-3">
              T-REX AI OS remains responsible for platform defects, service outages, and system errors 
              attributable to the Service itself. Customer remains responsible for the accuracy and 
              completeness of data entered into the Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">10. Indemnification</h2>
            <p>
              <strong>Customer Indemnification:</strong> Customer agrees to indemnify and hold harmless 
              T-REX AI OS from claims, damages, or expenses arising from:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Customer-provided data, including inaccurate or fraudulent certification records</li>
              <li>Customer's misuse of the Service or violation of these Terms</li>
              <li>Customer's violation of any rights of another party</li>
              <li>Customer's negligence in data entry or record maintenance</li>
            </ul>
            <p className="mt-3">
              <strong>Vendor Responsibility:</strong> T-REX AI OS remains responsible for claims arising from 
              platform defects, service outages, system errors, or other failures attributable to the Service itself.
            </p>
            <p className="mt-3">
              <strong>Indemnification Cap:</strong> Customer's total indemnification liability under this section 
              shall not exceed two (2) times the annual license fee paid in the year the claim arises.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">11. Termination and Data Retention</h2>
            <p>
              We reserve the right to suspend or terminate your access to the Service if you violate these 
              Terms or engage in prohibited conduct. You may terminate your subscription at any time with 
              written notice, effective at the end of your current billing period.
            </p>
            <p className="mt-3">
              <strong>Upon Termination:</strong> Your license to use the Service ends at the conclusion of 
              your paid term. You will retain access to read-only data export functionality for 30 days 
              following termination. All data will be provided in exportable formats (CSV, JSON, PDF) as 
              described in Section 6.
            </p>
            <p className="mt-3">
              Provisions relating to data ownership, intellectual property, limitation of liability, 
              indemnification, and dispute resolution shall survive termination.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">12. Modifications to Terms</h2>
            <p>
              We may modify these Terms from time to time with at least 30 days advance written notice 
              for material changes. Material changes include modifications to:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Pricing or payment terms</li>
              <li>Limitation of liability provisions</li>
              <li>Indemnification obligations</li>
              <li>Service availability commitments</li>
              <li>Data ownership or export rights</li>
            </ul>
            <p className="mt-3">
              <strong>Your Rights Upon Modification:</strong> If we make material changes that are adverse 
              to you, you may elect to terminate your subscription without penalty within 30 days of 
              receiving notice of the changes. Termination will be effective at the end of your current 
              billing period, with a pro-rata refund for unused service time.
            </p>
            <p className="mt-3">
              <strong>During Active Contract:</strong> No changes to pricing, indemnification, or liability 
              caps will be applied during your active contract term. Such changes, if any, apply only upon 
              renewal.
            </p>
            <p className="mt-3">
              Non-material changes (such as clarifications, formatting, or administrative updates) may be 
              posted without advance notice. Your continued use of the Service after non-material changes 
              constitutes acceptance.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">13. Security and Compliance Assurance</h2>
            <p>
              T-REX AI OS maintains third-party security audits and compliance assessments appropriate 
              to the nature of the Service. We are working toward SOC 2 Type II certification.
            </p>
            <p className="mt-3">
              Customers may request summary security reports under mutual non-disclosure agreement (NDA). 
              Direct infrastructure audits or penetration testing require advance written approval.
            </p>
            <p className="mt-3">
              All customer data is stored in redundant cloud infrastructure with documented backup and 
              recovery procedures. Encryption is applied to data in transit and at rest.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">14. Insurance Coverage</h2>
            <p>
              T-REX AI OS maintains commercial general liability, errors & omissions (professional liability), 
              and cyber liability insurance appropriate to the nature and scale of the Service.
            </p>
            <p className="mt-3">
              Certificate of insurance may be provided upon request for commercial purposes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">15. Business Continuity and Service Cessation</h2>
            <p>
              In the event of vendor insolvency, business failure, or permanent service cessation, 
              T-REX AI OS will provide customers with access to a complete data export as described 
              in Section 6.
            </p>
            <p className="mt-3">
              Customer records are stored in redundant, geographically distributed cloud infrastructure 
              operated by reputable third-party providers (AWS, Google Cloud, or Azure). Documented 
              recovery procedures ensure data accessibility independent of T-REX AI OS operational status.
            </p>
            <p className="mt-3">
              In the unlikely event of service cessation, customers will receive at least 60 days advance 
              notice (if feasible) and instructions for data retrieval.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">16. Usage Limits and Fair Use Policy</h2>
            <p>
              <strong>Core Verification Features:</strong> QR verification scans, historical record retention, 
              and regulator access are unlimited under normal business operations.
            </p>
            <p className="mt-3">
              <strong>Automated Scanning Limits:</strong> Automated or programmatic QR scanning exceeding 
              100,000 scans per day may trigger a review for system optimization to ensure service quality 
              for all customers. No service suspension or termination will occur without:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Written notice with at least 14 days to respond</li>
              <li>Good-faith consultation to identify optimization solutions</li>
              <li>Opportunity to adjust usage patterns or upgrade service tier</li>
            </ul>
            <p className="mt-3">
              <strong>AI Feature Caps:</strong> AI-powered features (risk scoring, fatigue modeling, near-miss 
              clustering) have fair use caps disclosed in pricing documentation. Caps are set generously to 
              accommodate normal business use. Customers approaching or exceeding caps will receive advance 
              notice and options for optimization or upgraded capacity.
            </p>
            <p className="mt-3">
              <strong>No Retroactive Billing:</strong> Usage above stated thresholds will not result in 
              mid-term invoicing or retroactive charges. Any pricing adjustments apply only at renewal.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">17. Pricing and Renewal Terms</h2>
            <p>
              <strong>Annual Pricing Adjustments:</strong> Pricing is locked for your initial contract term. 
              Upon renewal, pricing may be adjusted based on your current employee count and applicable tier.
            </p>
            <p className="mt-3">
              Annual price increases at renewal are capped at 8% per renewal cycle. This cap applies to the 
              base license fee and does not compound cumulatively beyond a single renewal period. For example, 
              if your Year 1 rate is $9,500, your Year 2 rate cannot exceed $10,260 (8% increase), and your 
              Year 3 rate cannot exceed $11,081 (8% of Year 2 rate).
            </p>
            <p className="mt-3">
              <strong>Multi-Year Price Lock:</strong> Customers may elect multi-year commitments with locked 
              pricing and discounted rates (as disclosed in pricing documentation). Multi-year pricing is 
              offered on a non-binding, case-by-case basis and requires mutual written agreement.
            </p>
            <p className="mt-3">
              <strong>Renewal Notice:</strong> You will receive renewal pricing information at least 60 days 
              prior to your contract renewal date.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">18. Multi-Entity Organizations</h2>
            <p>
              <strong>Organization Definition:</strong> For licensing purposes, "Organization" means a single 
              legal entity identified by a unique tax identification number (e.g., U.S. EIN, or equivalent).
            </p>
            <p className="mt-3">
              All physical locations, divisions, and operations conducted under the same legal entity are 
              covered by a single license at no additional charge.
            </p>
            <p className="mt-3">
              <strong>Multi-Entity and Holding Company Structures:</strong> Separate legal entities (e.g., 
              subsidiaries, affiliates, or entities under a holding company structure) require separate licenses 
              unless consolidated under a single negotiated agreement.
            </p>
            <p className="mt-3">
              Multi-entity consolidation is available by written agreement and may qualify for volume discounts. 
              Contact sales for multi-entity licensing options.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">19. Governing Law</h2>
            <p>
              These Terms are governed by and construed in accordance with the laws of the jurisdiction in 
              which T-REX AI OS operates, without regard to conflict of law principles.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">20. Dispute Resolution</h2>
            <p>
              Any disputes arising from these Terms or the Service shall be resolved through binding arbitration 
              in accordance with applicable arbitration rules, except where prohibited by law.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">21. Contact Information</h2>
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
