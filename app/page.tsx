import type { Metadata } from 'next'
import Link from 'next/link'
import {
  Train,
  HardHat,
  Leaf,
  Building2,
  Calendar,
  Mail,
} from 'lucide-react'

/**
 * ROOT LANDING PAGE
 * 
 * Purpose:
 * - Marketing-only entry surface
 * - Public access (no auth, no pricing checks)
 * - Modern layout with preserved verbiage
 */

const trustSignals = [
  'Built for regulated industries',
  'Audit-defensible by design',
  'Tamper-evident records',
  'Historical compliance state',
  'QR-based verification',
]

const industrySections = [
  {
    title: 'Rail & Transportation',
    challenge: 'FRA compliance, conductor certification, track safety',
    response: 'Immutable certification records and QR-based verification for inspectors, with historical state preservation for post-incident review.',
  },
  {
    title: 'Construction',
    challenge: 'OSHA requirements, safety training, equipment certification',
    response: 'Tamper-evident records that prove compliance status at time of work, not just current state—defensible in litigation.',
  },
  {
    title: 'Environmental Services',
    challenge: 'EPA permits, hazmat training, site authorization',
    response: 'Append-only audit logs with read-only inspector access and exportable evidence packages for regulatory review.',
  },
]

const coreCapabilities = [
  {
    name: 'Tamper-Evident Compliance Records',
    lines: [
      'Certification data is preserved as entered using append-only architecture.',
      'Corrections create new records; prior states remain intact.',
    ],
  },
  {
    name: 'Historical State Preservation',
    lines: [
      "The system can answer: 'What was this employee's certification status on a specific date?'",
      'QR codes resolve to records showing compliance status exactly as it existed at the time of issuance.',
    ],
  },
  {
    name: 'QR-Based Verification',
    lines: [
      'QR codes link to public, read-only verification pages—no login required.',
      'Displays employee certification status, issuer, and validity dates at time of issuance.',
    ],
  },
  {
    name: 'Regulator-Safe Access',
    lines: [
      'Read-only access for inspectors and regulators.',
      'Exportable evidence packages (PDF / ZIP) for regulatory review.',
    ],
  },
]

export const metadata: Metadata = {
  title: 'T-REX AI OS | Employee Certification & Compliance Record System',
  description:
    'Records employee certifications, preserves historical compliance state, and provides regulator-safe verification through tamper-evident, append-only records and QR-based evidence access.',
  alternates: {
    canonical: 'https://trexaios.com',
  },
  openGraph: {
    title: 'T-REX AI OS — Employee Certification & Compliance System',
    description: 'Tamper-evident compliance records for regulated work environments.',
    type: 'website',
    url: 'https://trexaios.com',
    images: [
      {
        url: '/android-icon-192x192.png',
        width: 192,
        height: 192,
        alt: 'T-REX AI OS system favicon',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'T-REX AI OS',
    description: 'Employee certification and compliance records for high-risk, regulated work.',
    images: ['/android-icon-192x192.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950">
      <main className="space-y-0">
        {/* HERO */}
        <section className="relative isolate overflow-hidden bg-slate-950 text-white">
          <div className="absolute inset-0 bg-[url('/useforhero.png')] bg-cover bg-center" aria-hidden />
          <div className="absolute inset-0 bg-slate-950/90" />
          <div className="relative mx-auto flex max-w-7xl flex-col gap-12 px-6 py-32">
            <div className="max-w-4xl space-y-8">
              <h1 className="text-5xl font-bold leading-[1.1] tracking-tight text-white md:text-7xl">
                Employee Certification & Compliance Record System for Regulated Work
              </h1>
              <p className="text-xl leading-relaxed text-slate-300 md:text-2xl">
                Records employee certifications, preserves historical compliance state, and provides regulator-safe verification through tamper-evident, append-only records and QR-based evidence access.
              </p>
              <div className="flex flex-col gap-4 pt-4 sm:flex-row">
                <Link
                  href="/create-account"
                  className="rounded-full bg-orange-500 px-8 py-4 text-center text-base font-semibold text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-600 hover:shadow-xl"
                >
                  Create Account
                </Link>
                <Link
                  href="/pricing"
                  className="rounded-full border-2 border-slate-600 px-8 py-4 text-center text-base font-semibold text-white transition hover:border-orange-500 hover:bg-slate-900/50"
                >
                  View Pricing
                </Link>
              </div>
            </div>
            <div className="grid gap-8 text-base text-slate-200 md:grid-cols-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-orange-500/80">Mandate</p>
                <p className="mt-3 text-lg font-semibold leading-snug text-slate-100">Tamper-evident compliance records with historical state preservation.</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-orange-500/80">Enforcement</p>
                <p className="mt-3 text-lg font-semibold leading-snug text-slate-100">Append-only audit logs and immutable verification events by default.</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-orange-500/80">Audience</p>
                <p className="mt-3 text-lg font-semibold leading-snug text-slate-100">Compliance teams, supervisors, inspectors, and regulatory agencies.</p>
              </div>
            </div>
          </div>
        </section>

        {/* TRUST SIGNALS */}
        <section className="border-b border-slate-800 bg-slate-900">
          <div className="mx-auto grid max-w-7xl gap-8 px-6 py-12 md:grid-cols-5">
            {trustSignals.map((item) => (
              <p key={item} className="text-base font-medium text-slate-300">
                {item}
              </p>
            ))}
          </div>
        </section>

        {/* WHO IT'S FOR */}
        <section className="bg-slate-950 py-24">
          <div className="mx-auto max-w-7xl space-y-16 px-6">
            <header className="max-w-4xl space-y-4">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-orange-400">Built for Regulated Industries</p>
              <h2 className="text-4xl font-bold leading-tight text-white md:text-5xl">Where compliance failures result in shutdowns, fines, litigation, or safety incidents.</h2>
            </header>
            <div className="grid gap-8 md:grid-cols-3">
              {industrySections.map((industry) => (
                <article key={industry.title} className="flex h-full flex-col rounded-2xl border border-slate-700/50 bg-slate-900/80 p-8 shadow-2xl shadow-black/40 backdrop-blur-sm">
                  <div className="text-sm font-bold uppercase tracking-[0.25em] text-orange-400">{industry.title}</div>
                  <p className="mt-6 text-lg font-semibold leading-snug text-white">{industry.challenge}</p>
                  <p className="mt-4 text-base leading-relaxed text-slate-400">{industry.response}</p>
                  <div className="mt-6 h-1 w-16 bg-orange-500/90" />
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* CORE CAPABILITIES */}
        <section className="bg-slate-950/60 py-24">
          <div className="mx-auto max-w-7xl space-y-16 px-6">
            <div className="rounded-3xl bg-slate-900/30 p-10 backdrop-blur-sm">
              <header className="max-w-4xl space-y-5">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-orange-400">Core Capabilities</p>
                <h2 className="text-4xl font-bold leading-tight text-white md:text-5xl">What This System Does</h2>
                <p className="text-lg leading-relaxed text-slate-400">Records and verifies employee certification compliance with tamper-evident, audit-defensible evidence.</p>
              </header>
              <div className="mt-16 grid gap-10 md:grid-cols-2 lg:grid-cols-4">
                {coreCapabilities.map((capability) => (
                  <article key={capability.name} className="space-y-4 border-b border-white/8 pb-8">
                    <h3 className="text-2xl font-bold text-orange-400">{capability.name}</h3>
                    {capability.lines.map((line) => (
                      <p key={line} className="text-base leading-relaxed text-slate-300">
                        {line}
                      </p>
                    ))}
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* SYSTEM ROLE & BOUNDARIES */}
        <section className="bg-slate-950 py-24">
          <div className="mx-auto max-w-7xl px-6">
            <div className="rounded-3xl border border-slate-700/50 bg-slate-900/50 p-12 shadow-2xl shadow-black/40">
              <header className="mb-12">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-orange-400">System Role & Boundaries</p>
                <h2 className="mt-4 text-3xl font-bold text-white md:text-4xl">
                  What This System Does NOT Replace
                </h2>
                <p className="mt-6 max-w-3xl text-xl leading-relaxed text-slate-300">
                  T-REX AI OS is a system of verification and evidence preservation. <strong className="text-white">Existing systems remain the system of record.</strong>
                </p>
              </header>
              
              <div className="grid gap-6 md:grid-cols-3 mb-12">
                <div className="rounded-xl border border-slate-700 bg-slate-900/60 p-6">
                  <h3 className="mb-3 text-lg font-bold text-white">HRIS</h3>
                  <p className="text-slate-300">Human Resource Information Systems — employment records remain in your existing HR system</p>
                </div>
                <div className="rounded-xl border border-slate-700 bg-slate-900/60 p-6">
                  <h3 className="mb-3 text-lg font-bold text-white">LMS</h3>
                  <p className="text-slate-300">Learning Management Systems — training delivery and completion tracking remain in your existing systems</p>
                </div>
                <div className="rounded-xl border border-slate-700 bg-slate-900/60 p-6">
                  <h3 className="mb-3 text-lg font-bold text-white">Access Control</h3>
                  <p className="text-slate-300">Badge systems — physical access control remains separate</p>
                </div>
              </div>

              <p className="text-lg leading-relaxed text-slate-400">
                The platform preserves evidence of compliance state without mutating source systems. T-REX AI OS records certification state, verification events, and historical status at the time of verification.
              </p>
            </div>
          </div>
        </section>

        {/* DATA ENTRY & INTEGRATIONS */}
        <section className="bg-slate-950/60 py-24">
          <div className="mx-auto max-w-7xl px-6">
            <div className="rounded-3xl bg-slate-900/30 p-10 backdrop-blur-sm">
              <header className="mb-12">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-orange-400">Data Entry & Integrations</p>
                <h2 className="mt-4 text-3xl font-bold text-white md:text-4xl">
                  How Certification Data Enters the System
                </h2>
                <p className="mt-6 max-w-3xl text-xl leading-relaxed text-slate-300">
                  Certification data is entered by authorized administrators. <strong className="text-white">Employees do not log into this system</strong> — they are records, not users.
                </p>
              </header>

              {/* EMPLOYEE CALLOUT */}
              <div className="mb-12 rounded-2xl border-2 border-blue-500/30 bg-blue-900/10 p-8">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-500/20">
                    <span className="text-2xl">👷</span>
                  </div>
                  <div>
                    <h4 className="mb-3 text-xl font-bold text-white">For Employees</h4>
                    <p className="text-lg leading-relaxed text-slate-300">
                      You do not need to create an account or log in. Your employer maintains compliance records 
                      about you using this system. QR codes may be provided for verification purposes, but you 
                      don't interact with the system directly.{' '}
                      <Link href="/for-employees" className="font-semibold text-blue-400 underline hover:text-blue-300">
                        Learn more about how this works →
                      </Link>
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid gap-8 md:grid-cols-2 mb-12">
                <div className="rounded-2xl border border-slate-700 bg-slate-900/50 p-8">
                  <h3 className="mb-6 text-2xl font-bold text-white">Supported Ingestion Methods</h3>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <span className="mt-1 text-xl font-bold text-orange-400">•</span>
                      <span className="text-lg text-slate-300">Manual administrative entry</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-1 text-xl font-bold text-amber-400">•</span>
                      <div>
                        <strong className="text-lg text-amber-300">Bulk upload for existing records:</strong>
                        <span className="text-lg text-slate-400"> Not available in production</span>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-1 text-xl font-bold text-orange-400">•</span>
                      <span className="text-lg text-slate-300">Integration from external systems (where configured)</span>
                    </li>
                  </ul>
                </div>

                <div className="rounded-2xl border border-slate-700 bg-slate-900/50 p-8">
                  <h3 className="mb-6 text-2xl font-bold text-white">Record Integrity</h3>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <span className="mt-1 text-xl font-bold text-orange-400">•</span>
                      <span className="text-lg text-slate-300">Corrections do not overwrite records</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-1 text-xl font-bold text-orange-400">•</span>
                      <span className="text-lg text-slate-300">Updates create new, time-stamped entries linked to prior records</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-1 text-xl font-bold text-orange-400">•</span>
                      <span className="text-lg text-slate-300">Original evidence is preserved for historical review</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="rounded-xl border border-slate-700/50 bg-slate-900/30 p-8">
                <h3 className="mb-4 text-xl font-bold text-white">API & Integration Capabilities</h3>
                <p className="mb-4 text-lg leading-relaxed text-slate-300">
                  The platform exposes controlled integration surfaces for certification data ingestion and verification event logging.
                </p>
                <p className="text-base text-slate-400">
                  API availability and documentation are provided during technical review. This system is designed to coexist with existing enterprise systems, not replace them.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* QR VERIFICATION & DAILY OPERATIONS */}
        <section className="bg-slate-950 py-24">
          <div className="mx-auto max-w-7xl px-6">
            <header className="mb-16">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-orange-400">QR Verification</p>
              <h2 className="mt-4 text-3xl font-bold text-white md:text-4xl">
                Daily Operations Workflow
              </h2>
              <p className="mt-6 max-w-4xl text-xl leading-relaxed text-slate-300">
                QR codes provide inspectors and regulators with immediate, read-only access to an employee&apos;s recorded compliance status at a specific point in time, preserved exactly as it existed and immune to later modification.
              </p>
            </header>

            <div className="grid gap-8 lg:grid-cols-2">
              {/* Who Scans */}
              <div className="rounded-2xl border border-slate-700 bg-slate-900/50 p-8">
                <h3 className="mb-6 text-2xl font-bold text-white">Who Scans QR Codes</h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <span className="mt-1 text-xl font-bold text-orange-400">•</span>
                    <div>
                      <strong className="text-white">Supervisors:</strong>
                      <span className="text-slate-300"> Verify crew compliance before shift start or job assignment</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1 text-xl font-bold text-orange-400">•</span>
                    <div>
                      <strong className="text-white">Inspectors/Regulators:</strong>
                      <span className="text-slate-300"> Verify employee authorization during site visits or audits</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1 text-xl font-bold text-orange-400">•</span>
                    <div>
                      <strong className="text-white">Gate/Site Security:</strong>
                      <span className="text-slate-300"> Optional verification at site entry points (if configured)</span>
                    </div>
                  </li>
                </ul>
                <p className="mt-6 text-sm italic text-slate-400">
                  <strong>Note:</strong> Employees do NOT log into this system or scan their own codes. They are 
                  subjects of verification, not system users.{' '}
                  <Link href="/for-employees/qr-explained" className="text-blue-400 underline hover:text-blue-300">
                    Learn how QR verification works for employees →
                  </Link>
                </p>
              </div>

              {/* When Scanning Happens */}
              <div className="rounded-2xl border border-slate-700 bg-slate-900/50 p-8">
                <h3 className="mb-6 text-2xl font-bold text-white">When Scanning Happens</h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <span className="mt-1 text-xl font-bold text-orange-400">•</span>
                    <div>
                      <strong className="text-white">Shift Start:</strong>
                      <span className="text-slate-300"> Supervisor verifies crew compliance before daily work begins</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1 text-xl font-bold text-orange-400">•</span>
                    <div>
                      <strong className="text-white">Job Assignment:</strong>
                      <span className="text-slate-300"> Verify specific certifications required for specialized tasks (e.g., confined space entry, crane operation)</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1 text-xl font-bold text-orange-400">•</span>
                    <div>
                      <strong className="text-white">Inspection Events:</strong>
                      <span className="text-slate-300"> Regulator or safety inspector scans to verify authorization during site audit</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1 text-xl font-bold text-orange-400">•</span>
                    <div>
                      <strong className="text-white">Post-Incident:</strong>
                      <span className="text-slate-300"> Verify employee certification status as of the time of incident</span>
                    </div>
                  </li>
                </ul>
                <p className="mt-6 text-sm text-slate-400">
                  <strong>Timing:</strong> A single QR scan takes approximately 3-5 seconds (scan + result display). Supervisor can verify an entire crew of 10 employees in under 1 minute.
                </p>
              </div>

              {/* Verification Results */}
              <div className="rounded-2xl border border-slate-700 bg-slate-900/50 p-8">
                <h3 className="mb-6 text-2xl font-bold text-white">What the Verification Result Shows</h3>
                <p className="mb-4 text-slate-300">After scanning, the supervisor sees a clear compliance status page:</p>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <span className="mt-1 text-xl font-bold text-emerald-400">✓</span>
                    <div>
                      <strong className="text-white">Compliant:</strong>
                      <span className="text-slate-300"> Green status indicator, list of valid certifications with expiration dates</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1 text-xl font-bold text-amber-400">⚠</span>
                    <div>
                      <strong className="text-white">Expiring Soon:</strong>
                      <span className="text-slate-300"> Yellow warning for certifications expiring within 30 days</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1 text-xl font-bold text-red-400">✗</span>
                    <div>
                      <strong className="text-white">Non-Compliant:</strong>
                      <span className="text-slate-300"> Red status indicator showing expired or missing certifications</span>
                    </div>
                  </li>
                </ul>
                <p className="mt-6 text-sm text-slate-400">
                  The scan result is read-only and shows the employee&apos;s exact certification state at the moment of verification. It does not change if certifications are later updated.
                </p>
              </div>

              {/* Non-Compliant Response */}
              <div className="rounded-2xl border-2 border-red-500/30 bg-slate-900/50 p-8">
                <h3 className="mb-6 text-2xl font-bold text-white">What Happens If Employee is Non-Compliant</h3>
                <p className="mb-6 text-slate-300">
                  <strong className="text-white">Important:</strong> This system records verification results. Work authorization decisions are made by supervisors according to organizational policy.
                </p>
                
                <div className="mb-6 space-y-4">
                  <h4 className="font-semibold text-white">System Behavior</h4>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="mt-1 text-orange-400">•</span>
                      <span className="text-sm text-slate-300">Scan result displays non-compliant status and identifies missing/expired certifications</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1 text-orange-400">•</span>
                      <span className="text-sm text-slate-300">Verification event is logged with timestamp, location (if provided), and scanner identity</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1 text-orange-400">•</span>
                      <span className="text-sm text-slate-300">System does NOT automatically block work — supervisor makes the authorization decision</span>
                    </li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-white">Supervisor Options</h4>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="mt-1 text-orange-400">•</span>
                      <span className="text-sm text-slate-300">Reassign employee to work that does not require the expired certification</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1 text-orange-400">•</span>
                      <span className="text-sm text-slate-300">Contact compliance team to verify renewal status</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1 text-orange-400">•</span>
                      <span className="text-sm text-slate-300">Document exception and proceed (if organizational policy permits and documented override is logged)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1 text-orange-400">•</span>
                      <span className="text-sm text-slate-300">Send employee home pending certification renewal</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* WHY IMMUTABILITY MATTERS */}
        <section className="bg-slate-950/80 py-24">
          <div className="mx-auto max-w-7xl px-6">
            <header className="mb-16 text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-orange-400">Why It Matters</p>
              <h2 className="mt-4 text-4xl font-bold text-white md:text-5xl">
                Why Immutable Records Matter
              </h2>
            </header>

            <div className="grid gap-8 md:grid-cols-2">
              <div className="rounded-2xl border border-slate-700 bg-slate-900/80 p-8 shadow-2xl shadow-black/40">
                <h3 className="mb-4 text-2xl font-bold text-white">
                  Editable Records Are Not Evidence
                </h3>
                <p className="leading-relaxed text-slate-300">
                  Systems that allow logs to be edited, certifications to be overwritten, or records to be deleted after the fact cannot provide reliable evidence during regulatory reviews or legal proceedings.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-700 bg-slate-900/80 p-8 shadow-2xl shadow-black/40">
                <h3 className="mb-4 text-2xl font-bold text-white">
                  Current Status Is Not Historical Proof
                </h3>
                <p className="leading-relaxed text-slate-300">
                  Regulators and courts require proof of compliance at the time work was performed—not what the status is today. Historical state preservation is mandatory for defensible compliance.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-700 bg-slate-900/80 p-8 shadow-2xl shadow-black/40">
                <h3 className="mb-4 text-2xl font-bold text-white">
                  User Accounts Are Not Employees
                </h3>
                <p className="leading-relaxed text-slate-300">
                  User-centric systems lose the connection between work and the individual who performed it. Employee-anchored records preserve attribution and accountability.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-700 bg-slate-900/80 p-8 shadow-2xl shadow-black/40">
                <h3 className="mb-4 text-2xl font-bold text-white">
                  Exports Are Not Audit Trails
                </h3>
                <p className="leading-relaxed text-slate-300">
                  Screenshots and spreadsheet exports lack tamper detection, verifiable timestamps, and audit continuity. Append-only systems maintain evidentiary integrity.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* REGULATORY DESIGN */}
        <section className="bg-slate-950 py-20">
          <div className="mx-auto max-w-5xl px-6">
            <div className="flex flex-col items-center gap-8 rounded-3xl border border-slate-700/50 bg-slate-900/80 p-12 text-center shadow-2xl shadow-black/40 backdrop-blur-sm">
              <div className="space-y-4">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-orange-400">System Design for Regulatory Environments</p>
                <ul className="space-y-3 text-left text-lg text-slate-300">
                  <li className="flex items-start gap-3">
                    <span className="mt-1 font-bold text-orange-400">•</span>
                    <span>Append-only audit logs</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1 font-bold text-orange-400">•</span>
                    <span>Time-stamped evidence retention</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1 font-bold text-orange-400">•</span>
                    <span>Official inspection interface (read-only)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1 font-bold text-orange-400">•</span>
                    <span>Exportable evidence packages (PDF / ZIP)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1 font-bold text-orange-400">•</span>
                    <span>Designed to support regulatory review (FRA, OSHA, EPA contexts)</span>
                  </li>
                </ul>
              </div>
              <Link
                href="/security"
                className="rounded-full border-2 border-slate-700/60 px-8 py-4 text-center text-base font-semibold text-white transition hover:border-orange-500 hover:bg-slate-900/50"
              >
                View Security & Governance
              </Link>
            </div>
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="bg-slate-950/80 py-20 text-white">
          <div className="mx-auto max-w-5xl px-6">
            <div className="flex flex-col items-center gap-8 rounded-3xl border border-slate-700/50 bg-slate-900/80 p-12 text-center shadow-2xl shadow-black/40 backdrop-blur-sm">
              <div className="space-y-4">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-orange-400">Get Started</p>
                <p className="text-2xl font-semibold text-slate-300">Questions or want to see it in action?</p>
              </div>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/request-demo"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-orange-500 px-8 py-4 font-semibold text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-600"
                >
                  <Calendar className="h-5 w-5" />
                  Request a Demo
                </Link>
                <Link
                  href="/contact-support"
                  className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-slate-700 px-8 py-4 font-semibold text-white transition hover:border-orange-500 hover:bg-slate-900/50"
                >
                  <Mail className="h-5 w-5" />
                  Contact Support
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
