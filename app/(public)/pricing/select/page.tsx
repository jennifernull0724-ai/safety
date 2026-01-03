'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Shield,
  CheckCircle2,
  ArrowRight,
  Loader2,
  Building2
} from 'lucide-react';

/**
 * PRICING / SELECT LICENSE TIER
 * 
 * Purpose:
 * - Shows Organization Verification License
 * - Lists tiers
 * - Explains scope
 * - NO dashboard access yet
 * 
 * User Action:
 * - Selects tier → creates Stripe checkout session → redirects to Stripe
 * 
 * NO Base44, NO verification logic, NO authority grants
 */

const tiers = [
  {
    id: 'small',
    label: 'Small Contractor',
    employeeRange: '≤25 employees',
    price: 4500,
    priceDisplay: '$4,500 / year'
  },
  {
    id: 'mid',
    label: 'Mid Contractor',
    employeeRange: '26–100 employees',
    price: 9500,
    priceDisplay: '$9,500 / year'
  },
  {
    id: 'large',
    label: 'Large Contractor',
    employeeRange: '100–300 employees',
    price: 18000,
    priceDisplay: '$18,000 / year'
  },
  {
    id: 'enterprise',
    label: 'Railroad / Regulator',
    employeeRange: 'Enterprise',
    price: 'custom',
    priceDisplay: 'Custom ($25K–$75K / year)'
  }
];

const includedFeatures = [
  'Unlimited public QR verification pages',
  'Immutable evidence retention',
  'Append-only verification ledger',
  'Employee certification tracking',
  'Regulator-grade compliance reporting',
  'Role-based access control',
  'Audit vault with tamper resistance',
  'Mobile QR scanning',
  'PDF certification proof storage',
  'JHA (Job Hazard Analysis) tracking',
  'Incident reporting and tracking',
  'Executive compliance dashboard'
];

export default function SelectLicenseTier() {
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSelectTier = async (tierId: string) => {
    if (tierId === 'enterprise') {
      // Enterprise requires custom quote
      window.location.href = '/enterprise-contact';
      return;
    }

    setSelectedTier(tierId);
    setLoading(true);

    try {
      // CREATE STRIPE CHECKOUT SESSION
      const response = await fetch('/api/public/billing/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tier: tierId,
          userId: 'user_123' // Replace with actual authenticated user ID
        })
      });

      const data = await response.json();

      if (data.checkoutUrl) {
        // Redirect to Stripe checkout
        window.location.href = data.checkoutUrl;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (error) {
      console.error('Failed to create checkout session:', error);
      setLoading(false);
      setSelectedTier(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white py-16 px-6">
      <div
        className="max-w-6xl mx-auto"
        style={{
          animation: 'fadeInUp 0.6s ease-out both'
        }}
      >
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-6">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Select License Tier</h1>
          <p className="text-xl text-slate-400">
            Organization Verification License — Annual Billing
          </p>
        </div>

        {/* Tier Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {tiers.map((tier) => (
            <div
              key={tier.id}
              className={`p-6 rounded-2xl border transition-all ${
                selectedTier === tier.id
                  ? 'bg-blue-500/10 border-blue-500'
                  : 'bg-slate-800/50 border-slate-700/50 hover:border-slate-600'
              }`}
            >
              <h3 className="text-lg font-semibold mb-2">{tier.label}</h3>
              <p className="text-sm text-slate-400 mb-4">{tier.employeeRange}</p>
              <p className="text-2xl font-bold mb-6">{tier.priceDisplay}</p>
              
              <button
                onClick={() => handleSelectTier(tier.id)}
                disabled={loading && selectedTier === tier.id}
                className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-colors ${
                  tier.id === 'enterprise'
                    ? 'bg-slate-700 hover:bg-slate-600'
                    : 'bg-blue-600 hover:bg-blue-500'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {loading && selectedTier === tier.id ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : tier.id === 'enterprise' ? (
                  <>
                    Contact Sales
                    <ArrowRight className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    Select Plan
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          ))}
        </div>

        {/* Included Features */}
        <div className="p-8 rounded-3xl bg-slate-800/50 border border-slate-700/50 mb-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <Shield className="w-6 h-6 text-emerald-400" />
            Included in All Tiers
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {includedFeatures.map((feature, index) => (
              <div key={index} className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-slate-300">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Important Notice */}
        <div className="p-6 rounded-2xl bg-amber-500/10 border border-amber-500/20">
          <h3 className="text-lg font-semibold text-amber-400 mb-3">Important</h3>
          <ul className="space-y-2 text-sm text-amber-200/90">
            <li className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 shrink-0" />
              <span>License activates verification authority for your organization</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 shrink-0" />
              <span>All verification events are immutable and append-only</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 shrink-0" />
              <span>Trust applies only forward in time from license activation</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 shrink-0" />
              <span>Payment is processed securely through Stripe</span>
            </li>
          </ul>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-slate-500">
          Questions?{' '}
          <Link href="/pricing" className="text-blue-400 hover:text-blue-300 transition-colors">
            View detailed pricing
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
