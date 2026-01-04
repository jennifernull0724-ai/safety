'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  Shield,
  CheckCircle2,
  Building2,
  Users,
  ArrowRight,
  Loader2
} from 'lucide-react';

/**
 * POST-PAYMENT REDIRECT / ONBOARDING COMPLETE
 * 
 * Stripe success URL: /onboarding/complete?session_id={CHECKOUT_SESSION_ID}
 * 
 * Page Behavior:
 * - Confirms license active
 * - Confirms organization created
 * - Confirms role assigned
 * 
 * CTA: Enter Dashboard
 * 
 * NO Base44, NO verification logic
 */

export default function OnboardingComplete() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [licenseData, setLicenseData] = useState<any>(null);

  useEffect(() => {
    const verifyLicense = async () => {
      if (!sessionId) {
        setError('No session ID provided');
        setLoading(false);
        return;
      }

      try {
        // VERIFY LICENSE ACTIVATION
        // const response = await fetch(`/api/public/billing/verify-session?session_id=${sessionId}`);
        // const data = await response.json();
        
        // PLACEHOLDER: Mock successful activation
        await new Promise(res => setTimeout(res, 1500));
        
        setLicenseData({
          organizationName: 'Acme Construction LLC',
          tier: 'mid',
          status: 'active'
        });
        setLoading(false);
      } catch (err) {
        setError('Failed to verify license activation');
        setLoading(false);
      }
    };

    verifyLicense();
  }, [sessionId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Activating license...</p>
        </div>
      </div>
    );
  }

  if (error || !licenseData) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6">
        <div className="max-w-md text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-6">
            <Shield className="w-8 h-8 text-red-400" />
          </div>
          <h1 className="text-2xl font-bold mb-3">Activation Error</h1>
          <p className="text-slate-400 mb-6">{error || 'License activation failed'}</p>
          <Link
            href="/pricing/select"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 font-medium transition-colors"
          >
            Return to Pricing
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6">
      <div
        className="w-full max-w-2xl"
        style={{
          animation: 'fadeInUp 0.6s ease-out both'
        }}
      >
        {/* Success Icon */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center mb-6 relative">
            <Shield className="w-10 h-10 text-white" />
            <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-emerald-400 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-3">License Activated</h1>
          <p className="text-slate-400 text-lg">
            Your organization verification authority is now enabled
          </p>
        </div>

        {/* Confirmation Card */}
        <div className="p-8 rounded-3xl bg-slate-800/50 border border-slate-700/50 mb-6">
          <div className="space-y-6">
            {/* License Details */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-700/50">
                <div className="flex items-center gap-3 mb-2">
                  <Building2 className="w-5 h-5 text-blue-400" />
                  <span className="text-sm text-slate-400">Organization</span>
                </div>
                <p className="font-semibold">{licenseData.organizationName}</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-700/50">
                <div className="flex items-center gap-3 mb-2">
                  <Shield className="w-5 h-5 text-emerald-400" />
                  <span className="text-sm text-slate-400">License Status</span>
                </div>
                <p className="font-semibold text-emerald-400">Active</p>
              </div>
            </div>

            {/* What's Enabled */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                What's Enabled
              </h3>
              <ul className="space-y-3 text-slate-300">
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                  <span>Organization created with verification authority</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                  <span>You are assigned as Organization Owner/Admin</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                  <span>License record created with trust start timestamp</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                  <span>Access to dashboard and operational features</span>
                </li>
              </ul>
            </div>

            {/* Next Steps */}
            <div className="p-6 rounded-xl bg-blue-500/10 border border-blue-500/20">
              <h3 className="text-lg font-semibold text-blue-400 mb-4">Next Steps</h3>
              <ul className="space-y-3 text-sm text-blue-200/90">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0">
                    <span className="text-xs font-semibold text-blue-400">1</span>
                  </div>
                  <span>Add employees to your organization</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0">
                    <span className="text-xs font-semibold text-blue-400">2</span>
                  </div>
                  <span>Upload certification documents with proof images</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0">
                    <span className="text-xs font-semibold text-blue-400">3</span>
                  </div>
                  <span>QR codes become publicly verifiable</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0">
                    <span className="text-xs font-semibold text-blue-400">4</span>
                  </div>
                  <span>All actions create immutable audit trail</span>
                </li>
              </ul>
            </div>

            {/* Enter Dashboard */}
            <Link
              href="/login"
              className="flex items-center justify-center gap-2 w-full px-6 py-4 rounded-lg bg-blue-600 hover:bg-blue-500 font-semibold text-lg transition-colors"
            >
              <Users className="w-5 h-5" />
              Login to Dashboard
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>

        {/* Footer Note */}
        <div className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/30 text-center">
          <p className="text-sm text-slate-400">
            Your organization's verification authority is now permanently enabled.
            Trust applies only forward in time from this activation.
          </p>
        </div>
      </div>

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
