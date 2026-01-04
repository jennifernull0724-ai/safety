'use client';

import React from 'react';
import Link from 'next/link';
import { PublicLayout } from '@/components/PublicLayout';
import {
  Shield,
  CheckCircle2,
  XCircle,
  Scale,
  FileCheck,
  QrCode,
  Lock,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';

/**
 * PRICING PAGE — VERIFICATION LICENSE
 * 
 * HARD RULES:
 * - MARKETING-ONLY SURFACE
 * - NO Base44, NO entity reads, NO verification logic
 * - NO enforcement logic, NO pricing calculations
 * 
 * SEMANTIC LOCK:
 * - This page DESCRIBES licensing terms
 * - It does NOT activate licenses
 * - It does NOT validate subscription state
 * - It does NOT imply free verification
 * 
 * CONTENT LOCK:
 * - Flat pricing, inclusions, exclusions MUST match exactly
 */

export default function Pricing() {
  const flatPrice = '$9,500 / year';

  const included = [
    'Unlimited public QR verification pages',
    'Read-only, regulator-safe public access',
    'Verification state shown exactly as of scan time',
    'Immutable evidence retention',
    'Append-only verification ledger',
    'QR scan logging with timestamp and optional location',
    'Historical certification state preserved forever',
    'Regulator read-only access surfaces',
    'Audit-grade evidence timelines',
    'Exportable legal packages (PDF / ZIP)',
    'Court-defensible proof of compliance at time of work',
    'Fail-closed enforcement guarantees',
    'AI risk scoring and predictions',
    'Fatigue modeling and analytics',
    'Near-miss clustering',
    'Incident escalation analytics',
    'Advanced compliance dashboards'
  ];

  const excluded = [
    'Financial or cost overrun modeling',
    'Blockchain anchoring'
  ];

  return (
    <PublicLayout>
      <div className="min-h-screen bg-slate-950 text-white">
      <main className="max-w-7xl mx-auto px-4 md:px-6 pt-8 md:pt-12 pb-12 md:pb-20 space-y-12 md:space-y-24">
        {/* Intro */}
        <section className="max-w-4xl mx-auto text-center">
          <h2
            className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 md:mb-6"
            style={{
              animation: 'fadeInUp 0.3s ease-out both'
            }}
          >
            Trusted Verification Authority
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-slate-400">
            Get full access to the T-REX AI OS verification platform.
          </p>
          <p className="text-sm sm:text-base md:text-lg text-slate-500 mt-3 md:mt-4">
            It enables public, regulator-safe QR verification while preserving
            immutable evidence, audit history, and legal defensibility.
          </p>
        </section>

        {/* Pricing */}
        <section className="max-w-2xl mx-auto">
          <div
            className="p-6 md:p-12 rounded-2xl md:rounded-3xl bg-slate-800/50 border-2 border-blue-500/50 text-center"
            style={{
              animation: 'fadeInUp 0.3s ease-out both'
            }}
          >
            <h3 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4">Annual License</h3>
            <div className="text-4xl md:text-6xl font-bold text-white mb-4 md:mb-6">{flatPrice}</div>
            <p className="text-base md:text-xl text-slate-400 mb-6 md:mb-8">
              Pricing is per organization, billed annually.
            </p>
            <div className="text-left bg-slate-900/50 rounded-lg p-6 border border-slate-700">
              <h4 className="text-lg font-semibold mb-4 text-white">Included with $9,500/year</h4>
              <ul className="space-y-2 text-slate-300">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span>Up to 250 employees</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span>Unlimited QR verification events</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span>Unlimited historical audit retention</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span>Read-only regulator access</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span>No per-scan or per-user fees</span>
                </li>
              </ul>
              <p className="text-sm text-slate-400 mt-4 pt-4 border-t border-slate-700">
                Organizations exceeding 250 employees require enterprise pricing.
              </p>
            </div>
          </div>
        </section>

        {/* What Does NOT Affect Price */}
        <section className="max-w-4xl mx-auto">
          <h3 className="text-2xl font-semibold mb-6 text-center">What Does NOT Affect Price</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 rounded-lg bg-slate-800/50 border border-slate-700">
              <h4 className="font-semibold mb-2 text-white">Number of QR Scans</h4>
              <p className="text-sm text-slate-400">
                Unlimited verification events at no additional cost.
              </p>
            </div>
            <div className="p-6 rounded-lg bg-slate-800/50 border border-slate-700">
              <h4 className="font-semibold mb-2 text-white">Certifications per Employee</h4>
              <p className="text-sm text-slate-400">
                Track multiple certifications per employee without extra charges.
              </p>
            </div>
            <div className="p-6 rounded-lg bg-slate-800/50 border border-slate-700">
              <h4 className="font-semibold mb-2 text-white">Historical Data Retention</h4>
              <p className="text-sm text-slate-400">
                Permanent immutable record retention included.
              </p>
            </div>
            <div className="p-6 rounded-lg bg-slate-800/50 border border-slate-700">
              <h4 className="font-semibold mb-2 text-white">Regulator Access</h4>
              <p className="text-sm text-slate-400">
                Read-only access for regulators is always included.
              </p>
            </div>
          </div>
        </section>

        {/* Included / Excluded */}
        <section className="grid lg:grid-cols-2 gap-12">
          <div>
            <h3 className="text-2xl font-semibold mb-6 flex items-center gap-2">
              <CheckCircle2 className="w-6 h-6 text-emerald-400" />
              What This License Includes
            </h3>
            <ul className="space-y-3">
              {included.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-slate-300">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-2xl font-semibold mb-6 flex items-center gap-2">
              <XCircle className="w-6 h-6 text-red-400" />
              Explicitly Not Included
            </h3>
            <ul className="space-y-3">
              {excluded.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-slate-400">
                  <XCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="text-sm text-slate-500 mt-4">
              This license covers verification and proof — not analytics or
              advisory systems.
            </p>
          </div>
        </section>

        {/* Pricing FAQ */}
        <section className="max-w-4xl mx-auto">
          <h3 className="text-2xl font-semibold mb-8 text-center">Pricing FAQ</h3>
          <div className="space-y-6">
            <div className="p-6 rounded-lg bg-slate-800/50 border border-slate-700">
              <h4 className="font-semibold mb-2 text-white">Is pricing per organization or per employee?</h4>
              <p className="text-slate-400">
                Pricing is per organization. The $9,500/year fee covers your entire organization for up to 250 employees. Organizations with more than 250 employees require enterprise pricing.
              </p>
            </div>

            <div className="p-6 rounded-lg bg-slate-800/50 border border-slate-700">
              <h4 className="font-semibold mb-2 text-white">What happens if we grow mid-contract?</h4>
              <p className="text-slate-400">
                If your employee count exceeds 250 during your contract period, contact us at{' '}
                <a href="mailto:support@trexaios.com" className="text-blue-400 hover:text-blue-300">
                  support@trexaios.com
                </a>{' '}
                to discuss enterprise pricing. Pricing adjustments, if needed, are prorated and applied at renewal.
              </p>
            </div>

            <div className="p-6 rounded-lg bg-slate-800/50 border border-slate-700">
              <h4 className="font-semibold mb-2 text-white">Does pricing apply per location?</h4>
              <p className="text-slate-400">
                No. The annual fee covers all locations operated by your organization under a single account.
              </p>
            </div>

            <div className="p-6 rounded-lg bg-slate-800/50 border border-slate-700">
              <h4 className="font-semibold mb-2 text-white">Are there storage or usage caps?</h4>
              <p className="text-slate-400">
                No. The system includes unlimited QR scans, unlimited historical retention, and unlimited verification events. Employee count is the only limit.
              </p>
            </div>

            <div className="p-6 rounded-lg bg-slate-800/50 border border-slate-700">
              <h4 className="font-semibold mb-2 text-white">Can pricing be locked for multi-year terms?</h4>
              <p className="text-slate-400">
                Yes. Multi-year pricing agreements are available for organizations seeking cost predictability. Contact us to discuss terms.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center space-y-6">
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/create-account"
              className="inline-flex items-center justify-center gap-2 px-10 py-6 rounded-lg bg-blue-600 hover:bg-blue-500 font-medium text-lg transition-colors"
            >
              Create an Account
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/request-demo"
              className="inline-flex items-center justify-center gap-2 px-10 py-6 rounded-lg border-2 border-slate-600 text-slate-200 hover:bg-slate-800 font-medium text-lg transition-colors"
            >
              Request a Demo
            </Link>
          </div>
        </section>
      </main>
      </div>
    </PublicLayout>
  );
}
