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

  const coreFeatures = [
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
    'Advanced compliance dashboards'
  ];

  const aiFeatures = [
    'AI risk scoring and predictions (up to 50,000 events/year)',
    'Fatigue modeling and analytics (up to 10,000 employee-days/year)',
    'Near-miss clustering (up to 5,000 incidents/year)',
    'Incident escalation analytics'
  ];

  const excluded = [
    'Financial or cost overrun modeling',
    'Blockchain anchoring',
    'Third-party training integrations (available as add-on)',
    'Custom regulatory report templates (available as add-on)'
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
        <section className="max-w-4xl mx-auto">
          <h3 className="text-2xl md:text-3xl font-bold mb-8 text-center">Pricing Tiers</h3>
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {/* Standard Tier */}
            <div className="p-6 rounded-xl bg-slate-800/50 border-2 border-blue-500/50">
              <h4 className="text-xl font-bold mb-2 text-white">Standard</h4>
              <div className="text-3xl font-bold text-white mb-2">$9,500</div>
              <p className="text-sm text-slate-400 mb-4">per year</p>
              <ul className="space-y-2 text-sm text-slate-300">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span>1-250 active employees</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span>All core features</span>
                </li>
              </ul>
            </div>

            {/* Enterprise Tier 1 */}
            <div className="p-6 rounded-xl bg-slate-800/50 border border-slate-700">
              <h4 className="text-xl font-bold mb-2 text-white">Enterprise</h4>
              <div className="text-3xl font-bold text-white mb-2">$18,000</div>
              <p className="text-sm text-slate-400 mb-4">per year</p>
              <ul className="space-y-2 text-sm text-slate-300">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span>251-500 active employees</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span>All core features</span>
                </li>
              </ul>
            </div>

            {/* Enterprise Tier 2 */}
            <div className="p-6 rounded-xl bg-slate-800/50 border border-slate-700">
              <h4 className="text-xl font-bold mb-2 text-white">Enterprise Plus</h4>
              <div className="text-3xl font-bold text-white mb-2">Custom</div>
              <p className="text-sm text-slate-400 mb-4">contact sales</p>
              <ul className="space-y-2 text-sm text-slate-300">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span>500+ active employees</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span>Volume discounts available</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Pricing Terms */}
          <div className="p-6 rounded-lg bg-slate-900/50 border border-slate-700">
            <h4 className="text-lg font-semibold mb-4 text-white">Pricing Terms</h4>
            <ul className="space-y-2 text-sm text-slate-300">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span><strong>Billing:</strong> Annual payment in advance, Net 30 terms available</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span><strong>Employee Definition:</strong> Active employees with certification records as of annual billing date, excluding terminated employees with historical-only records</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span><strong>Organization:</strong> Single legal entity under one U.S. EIN or equivalent tax ID, all locations included</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span><strong>Mid-Contract Growth:</strong> Service continues uninterrupted if employee count exceeds tier during contract term. Pricing adjustment applies at renewal only.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span><strong>Renewal:</strong> Pricing locked for initial term. Annual adjustments capped at 8% with 60-day notice.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span><strong>Multi-Year:</strong> 3-year commitment: 5% discount | 5-year commitment: 10% discount</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span><strong>Payment Methods:</strong> ACH, wire transfer, credit card, or invoice/PO (Net 30)</span>
              </li>
            </ul>
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
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                Core Features (All Tiers)
              </h3>
              <ul className="space-y-3">
                {coreFeatures.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-300">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-6 h-6 text-blue-400" />
                AI Features (Fair Use Caps)
              </h3>
              <ul className="space-y-3">
                {aiFeatures.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-300">
                    <CheckCircle2 className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="text-sm text-slate-400 mt-4 p-3 bg-slate-900/50 rounded border border-slate-700">
                <strong>Fair Use Policy:</strong> AI features process data in batch mode (nightly). Caps prevent abuse while accommodating normal business use. Enterprise customers exceeding caps should contact support for optimization review.
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-semibold mb-6 flex items-center gap-2">
              <XCircle className="w-6 h-6 text-red-400" />
              Not Included
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
              This license covers verification and compliance proof. Additional integrations and custom reporting available as add-ons.
            </p>
          </div>
        </section>

        {/* Pricing FAQ */}
        <section className="max-w-4xl mx-auto">
          <h3 className="text-2xl font-semibold mb-8 text-center">Pricing FAQ</h3>
          <div className="space-y-6">
            <div className="p-6 rounded-lg bg-slate-800/50 border border-slate-700">
              <h4 className="font-semibold mb-2 text-white">How is "employee" defined for billing?</h4>
              <p className="text-slate-400">
                Active employees with certification records as of the annual billing date. Terminated employees with historical-only records do not count toward your employee limit. Contractors and temporary workers with certification records do count.
              </p>
            </div>

            <div className="p-6 rounded-lg bg-slate-800/50 border border-slate-700">
              <h4 className="font-semibold mb-2 text-white">What happens if we grow mid-contract?</h4>
              <p className="text-slate-400">
                Service continues uninterrupted. No mid-contract invoicing. If your employee count exceeds your tier during the contract period, pricing adjustment applies at renewal only. You will not be locked out or charged overage fees.
              </p>
            </div>

            <div className="p-6 rounded-lg bg-slate-800/50 border border-slate-700">
              <h4 className="font-semibold mb-2 text-white">What defines "one organization"?</h4>
              <p className="text-slate-400">
                A single legal entity under one U.S. EIN (or equivalent tax ID). All physical locations operated by that entity are included. Separate subsidiaries or legal entities require separate licenses.
              </p>
            </div>

            <div className="p-6 rounded-lg bg-slate-800/50 border border-slate-700">
              <h4 className="font-semibold mb-2 text-white">Are there usage caps beyond employee count?</h4>
              <p className="text-slate-400">
                Core verification features (QR scans, historical retention, regulator access) are unlimited under normal business use. AI features have fair use caps (see above) to prevent abuse. Excessive automated scanning (&gt;100,000 scans/day) may require optimization review.
              </p>
            </div>

            <div className="p-6 rounded-lg bg-slate-800/50 border border-slate-700">
              <h4 className="font-semibold mb-2 text-white">Can we lock pricing for multiple years?</h4>
              <p className="text-slate-400">
                Yes. 3-year commitments receive 5% discount. 5-year commitments receive 10% discount. Pricing is locked for the commitment term with no annual adjustments.
              </p>
            </div>

            <div className="p-6 rounded-lg bg-slate-800/50 border border-slate-700">
              <h4 className="font-semibold mb-2 text-white">What are your payment terms?</h4>
              <p className="text-slate-400">
                Annual payment in advance. Net 30 terms available for invoice/PO customers. We accept ACH, wire transfer, credit card, or traditional invoicing. No setup fees or implementation charges.
              </p>
            </div>

            <div className="p-6 rounded-lg bg-slate-800/50 border border-slate-700">
              <h4 className="font-semibold mb-2 text-white">What happens at renewal?</h4>
              <p className="text-slate-400">
                Pricing is locked for your initial term. At renewal, your rate may be adjusted based on current employee count and tier. Annual adjustments are capped at 8% with 60-day advance notice. No surprise price increases.
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
