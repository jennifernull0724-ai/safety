import React from 'react';
import Link from 'next/link';
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
 * PRICING PAGE — ORGANIZATION VERIFICATION LICENSE
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
 * - Pricing tiers, inclusions, exclusions, compliance note MUST match exactly
 */

export default function Pricing() {
  const tiers = [
    {
      name: 'Small Contractor',
      size: '≤ 25 employees',
      price: '$4,500 / year'
    },
    {
      name: 'Mid Contractor',
      size: '26–100 employees',
      price: '$9,500 / year'
    },
    {
      name: 'Large Contractor',
      size: '100–300 employees',
      price: '$18,000 / year'
    },
    {
      name: 'Railroad / Regulator',
      size: 'Enterprise',
      price: 'Custom ($25,000–$75,000 / year)'
    }
  ];

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
    'Fail-closed enforcement guarantees'
  ];

  const excluded = [
    'AI risk scoring or predictions',
    'Fatigue modeling',
    'Near-miss clustering',
    'Incident escalation analytics',
    'Financial or cost overrun modeling',
    'Blockchain anchoring'
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <header className="border-b border-slate-800/50 bg-slate-950/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center gap-4">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-semibold">Organization Verification License</h1>
            <p className="text-sm text-slate-400">
              Enterprise / Railroad Pricing
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-20 space-y-24">
        {/* Intro */}
        <section className="max-w-4xl mx-auto text-center">
          <h2
            className="text-4xl font-bold mb-6"
            style={{
              animation: 'fadeInUp 0.3s ease-out both'
            }}
          >
            Trusted Verification Authority
          </h2>
          <p className="text-xl text-slate-400">
            This license activates your organization as a trusted verification
            authority within the System of Proof.
          </p>
          <p className="text-lg text-slate-500 mt-4">
            It enables public, regulator-safe QR verification while preserving
            immutable evidence, audit history, and legal defensibility.
          </p>
        </section>

        {/* Pricing Table */}
        <section>
          <h3 className="text-2xl font-semibold mb-8 text-center">
            Annual License Tiers
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tiers.map((tier, i) => (
              <div
                key={i}
                className="p-6 rounded-3xl bg-slate-800/50 border border-slate-700/50"
                style={{
                  animation: `fadeInUp 0.3s ease-out ${i * 0.05}s both`
                }}
              >
                <h4 className="text-xl font-semibold mb-2">{tier.name}</h4>
                <p className="text-slate-400 text-sm mb-4">{tier.size}</p>
                <div className="text-2xl font-bold text-white">{tier.price}</div>
              </div>
            ))}
          </div>
          <p className="text-center text-slate-500 mt-6">
            Pricing scales with organizational exposure and verification volume —
            not feature gating.
          </p>
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

        {/* Compliance Notice */}
        <section className="rounded-3xl bg-red-500/10 border border-red-500/30 p-8 max-w-4xl mx-auto">
          <div className="flex items-start gap-4">
            <AlertTriangle className="w-8 h-8 text-red-400 flex-shrink-0" />
            <div>
              <h4 className="text-xl font-semibold text-red-300 mb-2">
                Important Compliance Notice
              </h4>
              <p className="text-slate-300">
                Verification is not a free feature. Free systems cannot be
                trusted in audits or court.
              </p>
              <p className="text-slate-400 mt-2">
                This license certifies your organization as a verified source of
                truth.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center space-y-6">
          <Link
            href="/activate-license"
            className="inline-flex items-center gap-2 px-10 py-6 rounded-lg bg-blue-600 hover:bg-blue-500 font-medium text-lg transition-colors"
          >
            Activate Organization Verification
            <ArrowRight className="w-5 h-5" />
          </Link>

          <div>
            <Link href="/enterprise-contact" className="text-blue-400 hover:underline">
              Request Enterprise / Regulator Access
            </Link>
          </div>

          <p className="text-sm text-slate-500 max-w-2xl mx-auto">
            Organizations without an active license may still generate QR codes,
            but public verification pages will display:
            <br />
            <span className="text-red-400 font-medium">
              "NOT VERIFIED — ORGANIZATION NOT SUBSCRIBED."
            </span>
          </p>
        </section>
      </main>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
