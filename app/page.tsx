'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { PublicLayout } from '@/components/PublicLayout';
import {
  Shield,
  QrCode,
  Lock,
  FileCheck,
  Users,
  ArrowRight,
  AlertTriangle,
  Building2,
  HardHat,
  Train,
  Leaf,
  Scale,
  Eye,
  Calendar,
  Mail
} from 'lucide-react';

/**
 * ROOT LANDING PAGE
 * 
 * Purpose:
 * - Marketing-only entry surface
 * - Public access (no auth, no pricing checks)
 * - Smart CTA routing based on state
 * 
 * NO Base44, NO React Router, NO Framer Motion
 */

export default function Page() {
  const [dashboardLink, setDashboardLink] = useState('/login');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthState = async () => {
      try {
        // CHECK AUTH AND LICENSE STATE
        // In production:
        // const session = await getSession();
        // if (!session) { setDashboardLink('/login'); return; }
        // const user = await getUser(session.userId);
        // if (!user.organizationId) { setDashboardLink('/pricing/select'); return; }
        // const license = await getLicense(user.organizationId);
        // if (license?.status === 'active') { setDashboardLink('/dashboard'); return; }
        // setDashboardLink('/pricing/select');

        // PLACEHOLDER: Default to login for unauthenticated
        setDashboardLink('/login');
      } catch (error) {
        setDashboardLink('/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuthState();
  }, []);

  return (
    <PublicLayout>
      <div className="bg-slate-950 text-white">
      {/* HERO */}
      <section className="pt-8 md:pt-12 pb-12 md:pb-20 px-4 md:px-6 bg-slate-900">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 md:mb-6 text-white">
            Employee Certification & Compliance Record System for Regulated Work
          </h1>
          
          <p className="text-base sm:text-lg md:text-xl text-slate-300 mb-8 md:mb-10 max-w-3xl mx-auto leading-relaxed">
            Records employee certifications, preserves historical compliance state, and provides regulator-safe verification through tamper-evident, append-only records and QR-based evidence access.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-3 md:gap-4">
            <Link
              href="/create-account"
              className="inline-flex items-center justify-center gap-2 px-6 md:px-8 py-3 md:py-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-base md:text-lg transition-colors min-h-[44px]"
            >
              Create Account
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center gap-2 px-6 md:px-8 py-3 md:py-4 rounded-lg border-2 border-slate-700 text-slate-300 hover:bg-slate-800 font-semibold text-base md:text-lg transition-colors min-h-[44px]"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </section>

      {/* SYSTEM ROLE & BOUNDARIES */}
      <section className="py-12 md:py-20 px-4 md:px-6 bg-slate-900/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-white">
            System Role & Boundaries
          </h2>

          <div className="space-y-4 text-base md:text-lg text-slate-300">
            <p>
              T-REX AI OS is a system of verification and evidence preservation.
            </p>

            <div className="p-6 bg-slate-800/50 rounded-lg border border-slate-700">
              <h3 className="text-lg font-semibold text-white mb-3">What This System Does NOT Replace</h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-3">
                  <span className="text-blue-400 font-bold mt-1">•</span>
                  <span>HRIS (Human Resource Information Systems) — employment records remain in your existing HR system</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-400 font-bold mt-1">•</span>
                  <span>LMS (Learning Management Systems) — training delivery and completion tracking remain in your existing systems</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-400 font-bold mt-1">•</span>
                  <span>Access control or badge systems — physical access control remains separate</span>
                </li>
              </ul>
            </div>

            <p>
              <strong>Existing systems remain the system of record.</strong> T-REX AI OS records certification state, verification events, and historical status at the time of verification.
            </p>

            <p>
              The platform preserves evidence of compliance state without mutating source systems.
            </p>
          </div>
        </div>
      </section>

      {/* INTEGRATIONS & APIS */}
      <section className="py-12 md:py-20 px-4 md:px-6 bg-slate-950">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-white">
            Integrations & APIs
          </h2>

          <div className="space-y-4 text-base md:text-lg text-slate-300">
            <p>
              This system can integrate with existing HR, training, and compliance systems.
            </p>

            <div className="p-6 bg-slate-800/50 rounded-lg border border-slate-700">
              <h3 className="text-lg font-semibold text-white mb-3">How Data Can Enter the System</h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-3">
                  <span className="text-blue-400 font-bold mt-1">•</span>
                  <span>Manual administrative entry</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-400 font-bold mt-1">•</span>
                  <span>Bulk import (CSV or structured upload)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-400 font-bold mt-1">•</span>
                  <span>API-based ingestion (where enabled)</span>
                </li>
              </ul>
            </div>

            <p>
              The platform exposes controlled integration surfaces for certification data ingestion and verification event logging.
            </p>

            <p>
              API availability and documentation are provided during technical review. This system is designed to coexist with existing enterprise systems, not replace them.
            </p>
          </div>
        </div>
      </section>

      {/* HOW CERTIFICATION DATA ENTERS THE SYSTEM */}
      <section className="py-12 md:py-20 px-4 md:px-6 bg-slate-900/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-white">
            How Certification Data Enters the System
          </h2>

          <div className="space-y-4 text-base md:text-lg text-slate-300">
            <p>
              Certification data is entered by authorized administrators. <strong>Employees do not log into this system</strong> — they are records, not users.
            </p>

            <div className="mb-6 p-4 bg-blue-900/30 border border-blue-700 rounded-lg">
              <div className="flex items-start gap-3">
                <Users className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="text-white font-semibold mb-2">For Employees</h4>
                  <p className="text-slate-300 text-base">
                    You do not need to create an account or log in. Your employer maintains compliance records 
                    about you using this system. QR codes may be provided for verification purposes, but you 
                    don't interact with the system directly.{' '}
                    <Link href="/for-employees" className="text-blue-400 hover:text-blue-300 underline">
                      Learn more about how this works →
                    </Link>
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 bg-slate-800/50 rounded-lg border border-slate-700">
              <h3 className="text-lg font-semibold text-white mb-3">Supported Ingestion Methods</h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-3">
                  <span className="text-blue-400 font-bold mt-1">•</span>
                  <span>Manual administrative entry</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-400 font-bold mt-1">•</span>
                  <span>Bulk upload for existing records</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-400 font-bold mt-1">•</span>
                  <span>Integration from external systems (where configured)</span>
                </li>
              </ul>
            </div>

            <div className="p-6 bg-slate-800/50 rounded-lg border border-slate-700">
              <h3 className="text-lg font-semibold text-white mb-3">Record Integrity</h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-3">
                  <span className="text-blue-400 font-bold mt-1">•</span>
                  <span>Corrections do not overwrite records</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-400 font-bold mt-1">•</span>
                  <span>Updates create new, time-stamped entries linked to prior records</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-400 font-bold mt-1">•</span>
                  <span>Original evidence is preserved for historical review</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT IT DOES */}
      <section className="py-12 md:py-20 px-4 md:px-6 bg-slate-950">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-white">
            What This System Does
          </h2>

          <ul className="space-y-3 md:space-y-4 text-base md:text-lg text-slate-300">
            <li className="flex items-start gap-3">
              <span className="text-blue-400 font-bold mt-1">•</span>
              <span>Records employee certification data and supporting documents</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-400 font-bold mt-1">•</span>
              <span>Preserves the exact compliance state of each employee at any point in time</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-400 font-bold mt-1">•</span>
              <span>Prevents silent edits, overwrites, or retroactive changes</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-400 font-bold mt-1">•</span>
              <span>Creates an append-only audit history of all certification events</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-400 font-bold mt-1">•</span>
              <span>Provides read-only access for inspectors and regulators</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-400 font-bold mt-1">•</span>
              <span>Supports public QR-based verification of historical compliance status</span>
            </li>
          </ul>
        </div>
      </section>

      {/* CORE CAPABILITIES */}
      <section className="py-12 md:py-20 px-4 md:px-6 bg-slate-900/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 md:mb-12 text-white">
            Core Capabilities
          </h2>

          <div className="space-y-6 md:space-y-10">
            <div>
              <h3 className="text-xl md:text-2xl font-bold mb-2 md:mb-3 text-white">
                Tamper-Evident Compliance Records
              </h3>
              <p className="text-base md:text-lg text-slate-300 leading-relaxed">
                Certification data is preserved as entered using append-only architecture. Corrections create new records; prior states remain intact.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-bold mb-3 text-white">
                Employee-Anchored Historical State
              </h3>
              <p className="text-lg text-slate-300 leading-relaxed">
                The system can answer: "What was this employee's certification status on a specific date?"
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-bold mb-3 text-white">
                QR-Based Verification for Audits & Inspections
              </h3>
              <p className="text-lg text-slate-300 leading-relaxed">
                QR codes resolve to read-only records showing compliance status exactly as it existed at the time of issuance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* QR VERIFICATION */}
      <section className="py-20 px-6 bg-slate-950">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-white">
            QR Verification (How It Works)
          </h2>

          <div className="mb-8">
            <p className="text-lg text-slate-300 leading-relaxed mb-6">
              QR codes provide inspectors and regulators with immediate, read-only access to an employee's recorded compliance status at a specific point in time, preserved exactly as it existed and immune to later modification.
            </p>
          </div>

          <ul className="space-y-3 text-lg text-slate-300">
            <li className="flex items-start gap-3">
              <span className="text-blue-400 font-bold mt-1">•</span>
              <span>QR codes link to public, read-only verification pages</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-400 font-bold mt-1">•</span>
              <span>No login required</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-400 font-bold mt-1">•</span>
              <span>Displays employee certification status, issuer, and validity dates</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-400 font-bold mt-1">•</span>
              <span>Reflects the recorded state at the time of issuance</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-400 font-bold mt-1">•</span>
              <span>Does not update when certifications change</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-400 font-bold mt-1">•</span>
              <span>Does not grant access or permissions</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-400 font-bold mt-1">•</span>
              <span>Does not authenticate users</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-400 font-bold mt-1">•</span>
              <span>Exists solely for inspection, audit, and post-incident verification</span>
            </li>
          </ul>
        </div>
      </section>

      {/* DAILY OPERATIONS WORKFLOW */}
      <section className="py-20 px-6 bg-slate-900/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-white">
            Daily Operations Workflow
          </h2>

          <div className="space-y-6 text-slate-300">
            <p className="text-lg leading-relaxed">
              This section explains how QR verification fits into daily field operations, including who scans codes, when scanning happens, and what occurs when compliance issues are identified.
            </p>

            {/* Who Scans QR Codes */}
            <div className="p-6 bg-slate-800/50 rounded-lg border border-slate-700">
              <h3 className="text-xl font-semibold text-white mb-4">Who Scans QR Codes</h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-3">
                  <span className="text-blue-400 font-bold mt-1">•</span>
                  <span><strong>Supervisors:</strong> Verify crew compliance before shift start or job assignment</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-400 font-bold mt-1">•</span>
                  <span><strong>Inspectors/Regulators:</strong> Verify employee authorization during site visits or audits</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-400 font-bold mt-1">•</span>
                  <span><strong>Gate/Site Security:</strong> Optional verification at site entry points (if configured)</span>
                </li>
              </ul>
              <p className="mt-4 text-sm text-slate-400 italic">
                <strong>Note:</strong> Employees do NOT log into this system or scan their own codes. They are 
                subjects of verification, not system users.{' '}
                <Link href="/for-employees/qr-explained" className="text-blue-400 hover:text-blue-300 underline">
                  Learn how QR verification works for employees →
                </Link>
              </p>
            </div>

            {/* When Scanning Happens */}
            <div className="p-6 bg-slate-800/50 rounded-lg border border-slate-700">
              <h3 className="text-xl font-semibold text-white mb-4">When Scanning Happens</h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-3">
                  <span className="text-blue-400 font-bold mt-1">•</span>
                  <span><strong>Shift Start:</strong> Supervisor verifies crew compliance before daily work begins</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-400 font-bold mt-1">•</span>
                  <span><strong>Job Assignment:</strong> Verify specific certifications required for specialized tasks (e.g., confined space entry, crane operation)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-400 font-bold mt-1">•</span>
                  <span><strong>Inspection Events:</strong> Regulator or safety inspector scans to verify authorization during site audit</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-400 font-bold mt-1">•</span>
                  <span><strong>Post-Incident:</strong> Verify employee certification status as of the time of incident</span>
                </li>
              </ul>
              <p className="text-sm text-slate-400 mt-4">
                <strong>Timing:</strong> A single QR scan takes approximately 3-5 seconds (scan + result display). Supervisor can verify an entire crew of 10 employees in under 1 minute.
              </p>
            </div>

            {/* What the Verification Result Shows */}
            <div className="p-6 bg-slate-800/50 rounded-lg border border-slate-700">
              <h3 className="text-xl font-semibold text-white mb-4">What the Verification Result Shows</h3>
              <p className="mb-3">After scanning, the supervisor sees a clear compliance status page:</p>
              <ul className="space-y-2">
                <li className="flex items-start gap-3">
                  <span className="text-emerald-400 font-bold mt-1">✓</span>
                  <span><strong>Compliant:</strong> Green status indicator, list of valid certifications with expiration dates</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-amber-400 font-bold mt-1">⚠</span>
                  <span><strong>Expiring Soon:</strong> Yellow warning for certifications expiring within 30 days</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-400 font-bold mt-1">✗</span>
                  <span><strong>Non-Compliant:</strong> Red status indicator showing expired or missing certifications</span>
                </li>
              </ul>
              <p className="text-sm text-slate-400 mt-4">
                The scan result is read-only and shows the employee's exact certification state at the moment of verification. It does not change if certifications are later updated.
              </p>
            </div>

            {/* What Happens If Non-Compliant */}
            <div className="p-6 bg-slate-800/50 rounded-lg border border-red-500/30">
              <h3 className="text-xl font-semibold text-white mb-4">What Happens If Employee is Non-Compliant</h3>
              <p className="mb-3">
                <strong>Important:</strong> This system records verification results. Work authorization decisions are made by supervisors according to organizational policy.
              </p>
              <div className="space-y-3 mt-4">
                <div className="p-4 bg-slate-900/50 rounded border border-slate-600">
                  <h4 className="font-semibold text-white mb-2">System Behavior</h4>
                  <ul className="space-y-1 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-400 mt-1">•</span>
                      <span>Scan result displays non-compliant status and identifies missing/expired certifications</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-400 mt-1">•</span>
                      <span>Verification event is logged with timestamp, location (if provided), and scanner identity</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-400 mt-1">•</span>
                      <span>System does NOT automatically block work — supervisor makes the authorization decision</span>
                    </li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-900/50 rounded border border-slate-600">
                  <h4 className="font-semibold text-white mb-2">Supervisor Options</h4>
                  <ul className="space-y-1 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-400 mt-1">•</span>
                      <span>Reassign employee to work that does not require the expired certification</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-400 mt-1">•</span>
                      <span>Contact compliance team to verify renewal status</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-400 mt-1">•</span>
                      <span>Document exception and proceed (if organizational policy permits and documented override is logged)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-400 mt-1">•</span>
                      <span>Send employee home pending certification renewal</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Mobile & Field Use */}
            <div className="p-6 bg-slate-800/50 rounded-lg border border-slate-700">
              <h3 className="text-xl font-semibold text-white mb-4">Mobile & Field Use</h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-3">
                  <span className="text-blue-400 font-bold mt-1">•</span>
                  <span><strong>Mobile Access:</strong> QR verification works on any smartphone with camera and internet connection (no app required — uses standard web browser)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-400 font-bold mt-1">•</span>
                  <span><strong>Offline Capability:</strong> Limited offline support — QR codes scanned without connectivity will show cached status with "last verified" timestamp and alert user to verify online when connection available</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-400 font-bold mt-1">•</span>
                  <span><strong>No Special Hardware:</strong> Works with existing smartphones — no dedicated scanners required</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-400 font-bold mt-1">•</span>
                  <span><strong>QR Badge Format:</strong> Employees receive printed QR code badges (laminated cards or hard hat stickers) generated by compliance administrators</span>
                </li>
              </ul>
            </div>

            {/* Proactive Compliance Checking */}
            <div className="p-6 bg-slate-800/50 rounded-lg border border-slate-700">
              <h3 className="text-xl font-semibold text-white mb-4">Proactive Compliance Checking</h3>
              <p className="mb-3">Supervisors can check compliance status BEFORE deploying crews to avoid surprises:</p>
              <ul className="space-y-2">
                <li className="flex items-start gap-3">
                  <span className="text-blue-400 font-bold mt-1">•</span>
                  <span><strong>Dashboard View:</strong> Supervisors can view crew compliance status from desktop or mobile dashboard before shift assignment</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-400 font-bold mt-1">•</span>
                  <span><strong>Expiration Alerts:</strong> Automated notifications for certifications expiring within 30 days</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-400 font-bold mt-1">•</span>
                  <span><strong>Crew Compliance Summary:</strong> At-a-glance view of entire crew certification status</span>
                </li>
              </ul>
            </div>

            {/* Exception Handling */}
            <div className="p-6 bg-slate-800/50 rounded-lg border border-amber-500/30">
              <h3 className="text-xl font-semibold text-white mb-4">Exception Handling & Documented Overrides</h3>
              <p className="mb-3">
                Real-world operations require flexibility. The system supports documented exceptions when work must proceed despite compliance gaps:
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-3">
                  <span className="text-blue-400 font-bold mt-1">•</span>
                  <span><strong>Documented Override:</strong> Authorized supervisors can document reason for proceeding with non-compliant employee (e.g., "Renewal appointment scheduled for tomorrow, emergency repair work required")</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-400 font-bold mt-1">•</span>
                  <span><strong>Audit Trail:</strong> All overrides are logged with supervisor identity, timestamp, and written justification</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-400 font-bold mt-1">•</span>
                  <span><strong>Grace Periods:</strong> Configurable warning periods (e.g., 7-day grace for certifications pending renewal)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-400 font-bold mt-1">•</span>
                  <span><strong>Temporary Authorizations:</strong> Compliance team can issue time-limited temporary certifications while awaiting paperwork</span>
                </li>
              </ul>
              <p className="text-sm text-slate-400 mt-4">
                <strong>Note:</strong> Override capability is role-restricted. Not all users can override compliance requirements. Configuration is set during system setup based on organizational policy.
              </p>
            </div>

            {/* Employee Experience */}
            <div className="p-6 bg-slate-800/50 rounded-lg border border-slate-700">
              <h3 className="text-xl font-semibold text-white mb-4">Employee Experience</h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-3">
                  <span className="text-blue-400 font-bold mt-1">•</span>
                  <span><strong>QR Badge Issuance:</strong> Employees receive physical QR code badge (card or sticker) from compliance office after certification entry</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-400 font-bold mt-1">•</span>
                  <span><strong>No Employee Login:</strong> Employees do not log in or manage their own records — they simply carry their QR badge</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-400 font-bold mt-1">•</span>
                  <span><strong>Expiration Notifications:</strong> Employees receive email/SMS notifications at 30 days and 7 days before certification expiration (if configured)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-400 font-bold mt-1">•</span>
                  <span><strong>No Surprise Lockouts:</strong> Proactive notifications and supervisor dashboard views prevent employees from arriving to work only to discover expired certifications</span>
                </li>
              </ul>
            </div>

            {/* System Outages & Fail-Closed Behavior */}
            <div className="p-6 bg-slate-800/50 rounded-lg border border-amber-500/30">
              <h3 className="text-xl font-semibold text-white mb-4">System Outages & Fail-Closed Behavior</h3>
              <p className="mb-3">
                <strong>Fail-Closed Policy:</strong> If verification services are unavailable, the system defaults to requiring manual verification rather than allowing unverified access.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-3">
                  <span className="text-blue-400 font-bold mt-1">•</span>
                  <span><strong>Database Outage:</strong> QR scans will fail with clear error message. Supervisor must verify compliance manually using backup records (printed cert lists, etc.)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-400 font-bold mt-1">•</span>
                  <span><strong>Network Outage (Field):</strong> Cached verification data available for recently scanned employees with "Last verified [timestamp]" indicator</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-400 font-bold mt-1">•</span>
                  <span><strong>Mitigation:</strong> Supervisors should verify crew compliance at shift start (when connectivity is typically available) rather than relying on field verification</span>
                </li>
              </ul>
              <p className="text-sm text-slate-400 mt-4">
                <strong>Important:</strong> System outages do not automatically block work. Supervisors retain authority to proceed using manual verification processes during service disruptions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT IT DOES NOT DO */}
      <section className="py-20 px-6 bg-slate-950">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-white">
            What This System Does Not Do
          </h2>

          <ul className="space-y-4 text-lg text-slate-300">
            <li className="flex items-start gap-3">
              <span className="text-blue-400 font-bold mt-1">•</span>
              <span>This system records and verifies compliance; it does not assign work</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-400 font-bold mt-1">•</span>
              <span>Enforcement decisions occur outside the verification layer</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-400 font-bold mt-1">•</span>
              <span>QR verification is evidence, not access control</span>
            </li>
          </ul>
        </div>
      </section>

      {/* WHO IT'S FOR */}
      <section className="py-20 px-6 bg-slate-950">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-4 text-white text-center">
            Built for High-Risk, Regulated Environments
          </h2>
          <p className="text-lg text-slate-300 mb-12 text-center max-w-3xl mx-auto">
            Industries where compliance failures result in shutdowns, fines, litigation, or safety incidents.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Train, label: 'Rail & Transportation', desc: 'FRA compliance, conductor certification, track safety' },
              { icon: HardHat, label: 'Construction', desc: 'OSHA requirements, safety training, equipment certification' },
              { icon: Leaf, label: 'Environmental Services', desc: 'EPA permits, hazmat training, site authorization' },
              { icon: Building2, label: 'Enterprise & Regulators', desc: 'Multi-site operations, inspection agencies, compliance teams' }
            ].map((item, i) => (
              <div key={i} className="p-6 bg-slate-800/40 rounded-lg border border-slate-700/50">
                <item.icon className="w-10 h-10 text-blue-400 mb-3" />
                <h3 className="font-bold text-white mb-2">{item.label}</h3>
                <p className="text-sm text-slate-300">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY IT MATTERS */}
      <section className="py-20 px-6 bg-slate-950">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-white text-center">
            Why Immutable Records Matter
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-8 bg-slate-800/50 rounded-lg border border-slate-700">
              <h3 className="text-xl font-bold mb-4 text-white">
                Editable Records Are Not Evidence
              </h3>
              <p className="text-slate-300 leading-relaxed">
                Systems that allow logs to be edited, certifications to be overwritten, or records to be deleted after the fact cannot provide reliable evidence during regulatory reviews or legal proceedings.
              </p>
            </div>

            <div className="p-8 bg-slate-800/50 rounded-lg border border-slate-700">
              <h3 className="text-xl font-bold mb-4 text-white">
                Current Status Is Not Historical Proof
              </h3>
              <p className="text-slate-300 leading-relaxed">
                Regulators and courts require proof of compliance at the time work was performed—not what the status is today. Historical state preservation is mandatory for defensible compliance.
              </p>
            </div>

            <div className="p-8 bg-slate-800/50 rounded-lg border border-slate-700">
              <h3 className="text-xl font-bold mb-4 text-white">
                User Accounts Are Not Employees
              </h3>
              <p className="text-slate-300 leading-relaxed">
                User-centric systems lose the connection between work and the individual who performed it. Employee-anchored records preserve attribution and accountability.
              </p>
            </div>

            <div className="p-8 bg-slate-800/50 rounded-lg border border-slate-700">
              <h3 className="text-xl font-bold mb-4 text-white">
                Exports Are Not Audit Trails
              </h3>
              <p className="text-slate-300 leading-relaxed">
                Screenshots and spreadsheet exports lack tamper detection, verifiable timestamps, and audit continuity. Append-only systems maintain evidentiary integrity.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* REGULATORY & TRUST */}
      <section className="py-20 px-6 bg-slate-900/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-white">
            System Design for Regulatory Environments
          </h2>

          <ul className="space-y-4 text-lg text-slate-300">
            <li className="flex items-start gap-3">
              <span className="text-blue-400 font-bold mt-1">•</span>
              <span>Append-only audit logs</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-400 font-bold mt-1">•</span>
              <span>Time-stamped evidence retention</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-400 font-bold mt-1">•</span>
              <span>Official inspection interface (read-only)</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-400 font-bold mt-1">•</span>
              <span>Exportable evidence packages (PDF / ZIP)</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-400 font-bold mt-1">•</span>
              <span>Designed to support regulatory review (FRA, OSHA, EPA contexts)</span>
            </li>
          </ul>
        </div>
      </section>

      {/* CTA BUTTONS */}
      <section className="py-8 md:py-12 px-4 md:px-6 bg-slate-950 border-t border-slate-800">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-lg md:text-xl font-semibold text-white mb-4 md:mb-6">
            Questions or want to see it in action?
          </h2>
          <div className="flex flex-col sm:flex-row justify-center gap-3 md:gap-4">
            <Link
              href="/request-demo"
              className="inline-flex items-center justify-center gap-2 px-6 md:px-8 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors min-h-[44px]"
            >
              <Calendar className="w-4 h-4" />
              Request a Demo
            </Link>
            <Link
              href="/contact-support"
              className="inline-flex items-center justify-center gap-2 px-6 md:px-8 py-3 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800/50 font-medium transition-colors min-h-[44px]"
            >
              <Mail className="w-4 h-4" />
              Contact Support
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-300 bg-slate-50 py-8 md:py-12 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mb-6 md:mb-8">
            {/* Product ID */}
            <div>
              <div className="font-semibold text-slate-900 mb-2">T-REX AI OS</div>
              <p className="text-xs text-slate-600">
                Employee-anchored compliance and verification system
              </p>
            </div>

            {/* Legal */}
            <div>
              <div className="text-sm font-medium text-slate-900 mb-3">Legal</div>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/terms" className="text-slate-600 hover:text-slate-900">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-slate-600 hover:text-slate-900">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/security" className="text-slate-600 hover:text-slate-900">
                    Data & Security
                  </Link>
                </li>
                <li>
                  <Link href="/technical-overview" className="text-slate-600 hover:text-slate-900">
                    Technical Overview
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <div className="text-sm font-medium text-slate-900 mb-3">Support</div>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/request-demo" className="text-slate-600 hover:text-slate-900">
                    Request a Demo
                  </Link>
                </li>
                <li>
                  <a href="mailto:jennnull4@gmail.com" className="text-slate-600 hover:text-slate-900">
                    Contact Support
                  </a>
                </li>
              </ul>
            </div>

            {/* Access */}
            <div>
              <div className="text-sm font-medium text-slate-900 mb-3">Access</div>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/login" className="text-slate-600 hover:text-slate-900">
                    Login
                  </Link>
                </li>
                <li>
                  <Link href="/create-account" className="text-slate-600 hover:text-slate-900">
                    Create Account
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div className="pt-8 border-t border-slate-300 text-center text-xs text-slate-500">
            © {new Date().getFullYear()} T-REX AI OS. All rights reserved.
          </div>
        </div>
      </footer>
      </div>
    </PublicLayout>
  );
}
