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
            Records employee certifications, preserves historical compliance state, and provides regulator-safe verification through immutable records and QR-based evidence access.
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
                Immutable Compliance Records
              </h3>
              <p className="text-base md:text-lg text-slate-300 leading-relaxed">
                Certification data is preserved as entered. Corrections create new records; prior states remain intact.
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

      {/* WHAT IT DOES NOT DO */}
      <section className="py-20 px-6 bg-slate-900/50">
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
              <span>Read-only regulator access</span>
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
