'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
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
  Eye
} from 'lucide-react';
import { ContactForm } from '@/components/ContactForm';
import { DemoRequestForm } from '@/components/DemoRequestForm';

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
    <div className="min-h-screen bg-slate-950 text-white">
      {/* NAV */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/trex-logo.png" alt="T-REX AI OS" className="h-10 w-auto" />
            <span className="text-xl font-semibold text-slate-900">T-REX AI OS</span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/pricing"
              className="text-slate-600 hover:text-slate-900 transition-colors font-medium"
            >
              Pricing
            </Link>
            <Link
              href="/create-account"
              className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors font-medium"
            >
              Create Account
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
            >
              Login
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="pt-32 pb-20 px-6 bg-slate-900">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 text-white">
            Employee Certification & Compliance Record System for Regulated Work
          </h1>
          
          <p className="text-xl text-slate-300 mb-10 max-w-3xl mx-auto leading-relaxed">
            Records employee certifications, preserves historical compliance state, and provides regulator-safe verification through immutable records and QR-based evidence access.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/create-account"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg transition-colors"
            >
              Create Account
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg border-2 border-slate-700 text-slate-300 hover:bg-slate-800 font-semibold text-lg transition-colors"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </section>

      {/* WHAT IT DOES */}
      <section className="py-20 px-6 bg-slate-950">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-white">
            What This System Does
          </h2>

          <ul className="space-y-4 text-lg text-slate-300">
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
      <section className="py-20 px-6 bg-slate-900/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-white">
            Core Capabilities
          </h2>

          <div className="space-y-10">
            <div>
              <h3 className="text-2xl font-bold mb-3 text-white">
                Immutable Compliance Records
              </h3>
              <p className="text-lg text-slate-300 leading-relaxed">
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

      {/* CONVERSION CTA */}
      <section className="py-20 px-6 bg-white border-t border-slate-200">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4 text-slate-900">
            Record What Matters. Preserve the Evidence.
          </h2>
          <p className="text-lg text-slate-600 mb-10">
            Pricing scales based on organizational size, verification volume, and risk profile.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/create-account"
              className="inline-flex items-center justify-center gap-2 px-10 py-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg transition-colors"
            >
              Create Account
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center gap-2 px-10 py-4 rounded-lg border-2 border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold text-lg transition-colors"
            >
              View Pricing Details
            </Link>
          </div>

          <div className="mt-8 text-sm text-slate-500">
            Already have an account? <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium">Login here</Link>
          </div>
        </div>
      </section>

      {/* CONTACT FORM */}
      <section className="py-20 px-6 bg-slate-950">
        <ContactForm />
      </section>

      {/* DEMO REQUEST */}
      <section className="py-20 px-6 bg-slate-900/50">
        <DemoRequestForm />
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 bg-white py-10 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} T-REX AI OS. All rights reserved.
      </footer>
    </div>
  );
}
