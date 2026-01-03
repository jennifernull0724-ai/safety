'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Shield,
  QrCode,
  Lock,
  FileCheck,
  Users,
  CheckCircle2,
  ArrowRight,
  Fingerprint,
  Eye,
  AlertTriangle,
  Building2,
  HardHat,
  Train,
  Leaf,
  Scale
} from 'lucide-react';

/**
 * ROOT LANDING PAGE
 * 
 * Purpose:
 * - Marketing-only entry surface
 * - Public access (no auth, no pricing checks)
 * - Smart CTA routing based on state
 * 
 * CTA Logic:
 * - Not authenticated → Login
 * - Authenticated + has license → Dashboard
 * - Authenticated + no license → Pricing Select
 * 
 * NO Base44, NO React Router, NO Framer Motion
 */

export default function Landing() {
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
    <div className="min-h-screen bg-slate-950 text-white overflow-hidden">
      {/* NAV */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-semibold">System of Proof</span>
          </div>
          <Link
            href={dashboardLink}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 font-medium transition-colors"
          >
            Enter Dashboard
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative pt-36 pb-28 px-6">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem]" />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-950/80 to-slate-950" />
        </div>

        <div className="relative max-w-5xl mx-auto text-center">
          <div
            style={{
              animation: 'fadeInUp 0.8s ease-out both'
            }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700/50 mb-8">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-sm text-slate-300">
                Employee-Anchored · QR-Verified · Audit-Defensible
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent">
              System of Proof
            </h1>

            <p className="text-xl md:text-2xl text-slate-400 mb-6">
              Compliance verification built for industries where proof matters.
            </p>

            <p className="text-lg text-slate-500 max-w-3xl mx-auto mb-12">
              Not checklists. Not spreadsheets.  
              Immutable, verifiable evidence — tied to people, time, and place.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href={dashboardLink}
                className="inline-flex items-center justify-center gap-2 px-10 py-6 rounded-lg bg-blue-600 hover:bg-blue-500 font-medium text-lg transition-colors"
              >
                Enter Dashboard
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center gap-2 px-10 py-6 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800 font-medium text-lg transition-colors"
              >
                View Licensing
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* WHY */}
      <section className="py-24 px-6 bg-slate-900/50">
        <div className="max-w-6xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Why System of Proof Exists
          </h2>
          <p className="text-xl text-slate-400">
            Regulators don't ask what you intended.  
            They ask what you can prove.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {[
            { icon: AlertTriangle, text: 'Editable after the fact' },
            { icon: Users, text: 'User-centric instead of employee-centric' },
            { icon: Eye, text: 'Missing verification history' },
            { icon: FileCheck, text: 'No immutable evidence' }
          ].map((item, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl bg-slate-800/40 border border-slate-700/50"
              style={{
                animation: `fadeInUp 0.3s ease-out ${i * 0.1}s both`
              }}
            >
              <item.icon className="w-8 h-8 text-red-400 mb-4" />
              <p className="text-slate-300">
                Most systems fail because they are:
              </p>
              <p className="text-white font-medium mt-2">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CORE PRINCIPLES */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-10">
          {[
            {
              icon: Lock,
              title: 'Immutable Evidence',
              desc: 'Nothing is overwritten. Nothing is deleted. Ever.'
            },
            {
              icon: QrCode,
              title: 'QR-Based Verification',
              desc: 'Every scan resolves to identity, status, and timestamp.'
            },
            {
              icon: Scale,
              title: 'Audit-Defensible',
              desc: 'Designed to survive inspections, investigations, and court.'
            }
          ].map((item, i) => (
            <div
              key={i}
              className="p-8 rounded-3xl bg-slate-800/40 border border-slate-700/50"
              style={{
                animation: `fadeInUp 0.3s ease-out ${i * 0.1}s both`
              }}
            >
              <item.icon className="w-10 h-10 text-blue-400 mb-6" />
              <h3 className="text-2xl font-semibold mb-3">{item.title}</h3>
              <p className="text-slate-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* WHO IT'S FOR */}
      <section className="py-24 px-6 bg-slate-900/50">
        <div className="max-w-6xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Built for High-Risk Industries
          </h2>
          <p className="text-slate-400 text-lg">
            Where compliance failure has real consequences.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {[
            { icon: Train, label: 'Railroads' },
            { icon: HardHat, label: 'Construction' },
            { icon: Leaf, label: 'Environmental' },
            { icon: Building2, label: 'Enterprise / Regulators' }
          ].map((item, i) => (
            <div
              key={i}
              className="p-8 rounded-2xl bg-slate-800/40 border border-slate-700/50 text-center"
            >
              <item.icon className="w-10 h-10 text-blue-400 mx-auto mb-4" />
              <p className="text-lg font-medium">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Proof Is the Product
        </h2>
        <p className="text-slate-400 text-lg mb-10">
          If it cannot be proven later, it did not happen.
        </p>
        <Link
          href="/pricing"
          className="inline-flex items-center gap-2 px-12 py-6 rounded-lg bg-blue-600 hover:bg-blue-500 font-medium text-lg transition-colors"
        >
          View Organization Licensing
          <ArrowRight className="w-5 h-5" />
        </Link>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-800 py-10 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} System of Proof. All rights reserved.
      </footer>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(40px);
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
