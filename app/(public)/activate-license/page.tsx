'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Shield,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Loader2,
  Lock
} from 'lucide-react';

/**
 * ORGANIZATION LICENSE ACTIVATION
 * 
 * Purpose:
 * - Organization exists, user is Owner/Admin, but organization is not trusted
 * - This is a HARD GATE before trust is established
 * - No operational permissions granted until activated
 * 
 * Enforcement:
 * - No operational permissions granted
 * - No public trust enabled
 * - No retroactive authority
 * 
 * Success Result:
 * organization.verificationAuthority = "enabled"
 * organization.trustStartAt = now()
 * 
 * This creates the legal start-of-trust timestamp.
 * 
 * NO Base44, NO React Router, NO Framer Motion, NO custom components
 */

export default function ActivateOrganizationLicense() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [billingName, setBillingName] = useState('');

  const handleActivate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // PAYMENT PROCESSING HOOK GOES HERE
      // await processPayment({ cardNumber, expiryDate, cvv, billingName, amount: 9500 })
      // await activateOrganizationLicense()
      // Sets: organization.verificationAuthority = "enabled"
      // Sets: organization.trustStartAt = now()
      
      await new Promise(res => setTimeout(res, 1500)); // placeholder
      
      // Redirect to confirmation page
      window.location.href = '/verification-authority-enabled';
    } catch (err) {
      setError('Unable to process payment. Please check your card details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6">
      <div
        className="w-full max-w-2xl"
        style={{
          animation: 'fadeInUp 0.6s ease-out both'
        }}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-6">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-3">Activate Organization Verification License</h1>
          <p className="text-slate-400 text-lg">
           form onSubmit={handleActivate} className="space-y-6">
            {/* Error */}
            {error && (
              <div className="flex items-center gap-3 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                <AlertTriangle className="w-5 h-5" />
                {error}
              </div>
            )}

            {/* Price Display */}
            <div className="p-6 rounded-xl bg-blue-500/10 border border-blue-500/30 text-center">
              <div className="text-sm text-slate-400 mb-2">Annual License Fee</div>
              <div className="text-4xl font-bold text-white">$9,500</div>
              <div className="text-sm text-slate-400 mt-2">Billed annually</div>
            </div>

            {/* Payment Information */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Payment Information</h3>
              
              <div className="space-y-4">
                {/* Billing Name */}
                <div className="space-y-2">
                  <label htmlFor="billingName" className="block text-sm font-medium text-slate-300">
                    Name on Card
                  </label>
                  <input
                    id="billingName"
                    type="text"
                    required
                    value={billingName}
                    onChange={e => setBillingName(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-slate-900/50 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Jane Doe"
                  />
                </div>

                {/* Card Number */}
                <div className="space-y-2">
                  <label htmlFor="cardNumber" className="block text-sm font-medium text-slate-300">
                    Card Number
                  </label>
                  <input
                    id="cardNumber"
                    type="text"
                    required
                    maxLength={19}
                    value={cardNumber}
                    onChange={e => setCardNumber(e.target.value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim())}
                    className="w-full px-4 py-3 rounded-lg bg-slate-900/50 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="1234 5678 9012 3456"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Expiry Date */}
                  <div className="space-y-2">
                    <label htmlFor="expiryDate" className="block text-sm font-medium text-slate-300">
                      Expiry Date
                    </label>
                    <input
                      id="expiryDate"
                      type="text"
                      required
                      maxLength={5}
                      value={expiryDate}
                      onChange={e => {
                        let val = e.target.value.replace(/\D/g, '');
                        if (val.length >= 2) val = val.slice(0, 2) + '/' + val.slice(2, 4);
                        setExpiryDate(val);
                      }}
                      className="w-full px-4 py-3 rounded-lg bg-slate-900/50 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="MM/YY"
                    />
                  </div>

                  {/* CVV */}
                  <div className="space-y-2">
                    <label htmlFor="cvv" className="block text-sm font-medium text-slate-300">
                      CVV
                    </label>
                    <input
                      id="cvv"
                      type="text"
                      required
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-lg bg-blue-600 hover:bg-blue-500 font-semibold text-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Shield className="w-5 h-5" />
              )}
              {loading ? 'Processing Payment...' : 'Pay $9,500 & Activate License'}
            </button>

            <p className="text-xs text-center text-slate-500">
              Secure payment processing. Your card will be charged $9,500 annually.
            </p>
          </formdiv className="flex items-center gap-3 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                <AlertTriangle className="w-5 h-5" />
                {error}
              </div>
            )}

            {/* What This Does */}
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                What This License Enables
              </h2>
              <ul className="space-y-3 text-slate-300">
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                  <span>Public QR code verification pages</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                  <span>Immutable evidence retention and audit trail</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                  <span>Append-only verification ledger</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                  <span>Employee certification tracking</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                  <span>Regulator-grade compliance reporting</span>
                </li>
              </ul>
            </div>

            {/* Critical Understanding */}
            <div className="p-6 rounded-xl bg-amber-500/10 border border-amber-500/20">
              <h3 className="text-lg font-semibold text-amber-400 mb-3 flex items-center gap-2">
                <Lock className="w-5 h-5" />
                Critical Understanding
              </h3>
              <ul className="space-y-3 text-sm text-amber-200/90">
                <li className="flex items-start gap-3">
                  <div className="w-1 h-1 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                  <span>This establishes your organization as a <strong>trusted source of verification</strong></span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1 h-1 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                  <span>All verification events are <strong>immutable and append-only</strong></span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1 h-1 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                  <span>Trust applies <strong>only forward in time</strong> from activation</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1 h-1 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                  <span>Events prior to this moment are <strong>NOT authoritative</strong></span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1 h-1 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                  <span>There is <strong>NO retroactive authority</strong></span>
                </li>
              </ul>
            </div>

            {/* Pricing Reference */}
            <div className="p-4 rounded-lg bg-slate-900/50 border border-slate-700/50">
              <p className="text-sm text-slate-400">
                See <Link href="/pricing" className="text-blue-400 hover:text-blue-300 underline">pricing details</Link> for license tiers.
                This activation establishes the legal start-of-trust timestamp.
              </p>
            </div>

            {/* Activate Button */}
            <button
              onClick={handleActivate}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-lg bg-blue-600 hover:bg-blue-500 font-semibold text-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Shield className="w-5 h-5" />
              )}
              {loading ? 'Activating License...' : 'Activate Organization Verification License'}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-slate-500">
          Questions about licensing?{' '}
          <Link
            href="/pricing"
            className="text-blue-400 hover:text-blue-300 transition-colors"
          >
            View Pricing
          </Link>
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
