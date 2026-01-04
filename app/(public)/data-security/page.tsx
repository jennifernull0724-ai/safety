import React from 'react';
import { PublicLayout } from '@/components/PublicLayout';
import { Shield, Lock, Database, Eye, FileCheck, AlertCircle } from 'lucide-react';

export default function DataSecurity() {
  return (
    <PublicLayout>
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-8 md:py-16">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-6 md:mb-8">Data & Security</h1>
        
        <div className="prose prose-slate max-w-none space-y-6 md:space-y-8 text-slate-700">
          <section>
            <h2 className="text-xl md:text-2xl font-semibold text-slate-900 mb-3 md:mb-4">Overview</h2>
            <p>
              T-REX AI OS is designed with security and data integrity as core principles. This page outlines 
              our approach to protecting your data, maintaining system security, and ensuring compliance with 
              industry standards.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Database className="w-6 h-6 text-blue-600" />
              Data Storage and Infrastructure
            </h2>
            <p>
              T-REX AI OS operates on cloud-based infrastructure designed for high availability and reliability. 
              Data is stored in secure, geographically distributed data centers with redundancy to protect 
              against hardware failures and ensure business continuity.
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>Cloud-hosted infrastructure with automated backups</li>
              <li>Geographic redundancy for disaster recovery</li>
              <li>Database replication for high availability</li>
              <li>Regular infrastructure security updates</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Lock className="w-6 h-6 text-blue-600" />
              Encryption
            </h2>
            
            <h3 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Data in Transit</h3>
            <p>
              All data transmitted between your browser and our servers is encrypted using industry-standard 
              TLS (Transport Layer Security). This ensures that information cannot be intercepted or read by 
              unauthorized parties during transmission.
            </p>

            <h3 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Data at Rest</h3>
            <p>
              Sensitive data stored in our databases is encrypted at rest. Passwords and authentication credentials 
              are hashed using secure one-way encryption algorithms, ensuring they cannot be reverse-engineered 
              even in the unlikely event of a data breach.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Shield className="w-6 h-6 text-blue-600" />
              Access Control
            </h2>
            <p>
              Access to your organization's data is strictly controlled through role-based permissions:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>Role-based access control (RBAC) limits data visibility based on user permissions</li>
              <li>Multi-factor authentication (MFA) available for enhanced account security</li>
              <li>Session management with automatic timeout for inactive sessions</li>
              <li>Audit logging of all access and modification events</li>
              <li>No direct database access for any users — all interactions occur through the application</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <FileCheck className="w-6 h-6 text-blue-600" />
              Audit Logging and Immutability
            </h2>
            <p>
              T-REX AI OS maintains an append-only audit trail of all system events. This design ensures:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>All verification events are logged with timestamps</li>
              <li>User actions cannot be retroactively altered or deleted</li>
              <li>Complete traceability of compliance decisions</li>
              <li>Tamper-evident record keeping for regulatory and legal purposes</li>
            </ul>
            <p className="mt-4">
              Audit logs are retained indefinitely to preserve historical evidence and maintain system integrity.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Eye className="w-6 h-6 text-blue-600" />
              Public Verification Pages
            </h2>
            <p>
              QR code verification pages are publicly accessible by design to enable third-party verification 
              of employee certifications. These pages display:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>Certification status as of the time of scan</li>
              <li>Expiration dates and validity periods</li>
              <li>Verification outcomes (verified, expired, blocked, etc.)</li>
            </ul>
            <p className="mt-4">
              Public pages do not expose sensitive personal information beyond what is necessary for verification. 
              All QR scan events are logged in the audit trail.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">Backup and Disaster Recovery</h2>
            <p>
              We implement comprehensive backup and recovery procedures:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>Automated daily backups of all system data</li>
              <li>Geographically distributed backup storage</li>
              <li>Regular disaster recovery testing</li>
              <li>Documented recovery time objectives (RTO) and recovery point objectives (RPO)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">Application Security</h2>
            <p>
              We follow secure development practices to protect against common vulnerabilities:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>Input validation and sanitization to prevent injection attacks</li>
              <li>Protection against cross-site scripting (XSS) and cross-site request forgery (CSRF)</li>
              <li>Secure session management</li>
              <li>Regular security updates and dependency patching</li>
              <li>Code reviews and security testing</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">Incident Response</h2>
            <p>
              In the event of a security incident:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>We have documented incident response procedures</li>
              <li>Affected customers will be notified in accordance with applicable laws</li>
              <li>We will take immediate action to contain and remediate the issue</li>
              <li>Post-incident analysis and corrective measures will be implemented</li>
            </ul>
          </section>

          <section className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <AlertCircle className="w-6 h-6 text-blue-600" />
              Compliance and Certifications
            </h2>
            <p>
              T-REX AI OS is committed to meeting industry security standards. We are actively working toward 
              compliance with recognized frameworks and certifications, including:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>SOC 2 Type II (in progress)</li>
              <li>GDPR compliance for EU data protection</li>
              <li>Industry-specific regulatory requirements as applicable</li>
            </ul>
            <p className="mt-4 text-sm">
              <strong>Note:</strong> Certifications are targets and do not represent current certification status 
              unless explicitly stated. Contact us for the latest compliance documentation.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">Vendor and Third-Party Security</h2>
            <p>
              We carefully evaluate security practices of third-party service providers. Cloud infrastructure 
              and service partners are selected based on their security certifications and compliance with 
              industry standards.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">Your Responsibilities</h2>
            <p>
              While we implement robust security measures, security is a shared responsibility:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>Keep your account credentials secure and confidential</li>
              <li>Enable multi-factor authentication when available</li>
              <li>Report suspected security incidents immediately</li>
              <li>Ensure uploaded certification documents are authentic</li>
              <li>Follow your organization's internal security policies</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">Questions and Security Inquiries</h2>
            <p>
              For security-related questions, compliance documentation requests, or to report a security concern, 
              contact us at{' '}
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
