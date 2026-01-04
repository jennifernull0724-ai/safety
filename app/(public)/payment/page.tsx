'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Shield,
  CreditCard,
  Lock,
  CheckCircle2,
  ArrowRight,
  Loader2,
  AlertTriangle,
  Tag
} from 'lucide-react';

/**
 * STRIPE PAYMENT PAGE
 * 
 * Purpose: Collect payment for $9,500/year license
 * Features: Card payment + promo code support
 */

export default function Payment() {
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [billingName, setBillingName] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const basePrice = 950000; // $9,500.00 in cents
  const finalPrice = basePrice - discount;

  const handleApplyPromo = () => {
    if (promoCode.toUpperCase() === 'LAUNCH50') {
      setDiscount(475000); // 50% off
      setPromoApplied(true);
      setError(null);
    } else if (promoCode.toUpperCase() === 'SAVE20') {
      setDiscount(190000); // 20% off
      setPromoApplied(true);
      setError(null);
    } else {
      setError('Invalid promo code');
      setPromoApplied(false);
      setDiscount(0);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // STRIPE PAYMENT PROCESSING HOOK GOES HERE
      // await processStripePayment({ 
      //   cardNumber, 
      //   expiryDate, 
      //   cvv, 
      //   billingName, 
      //   amount: finalPrice,
      //   promoCode: promoApplied ? promoCode : null 
      // })
      
      await new Promise(res => setTimeout(res, 2000)); // placeholder
      
      // Send welcome email (extract email from form - need to add email field)
      // For now, using billingName as placeholder until real Stripe integration
      // await fetch('/api/send-welcome', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email: 'customer@example.com', name: billingName })
      // });
      
      // Redirect to dashboard after successful payment
      window.location.href = '/dashboard';
    } catch (err) {
      setError('Payment failed. Please check your card details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <img src="/trex-logo.png" alt="T-REX AI OS" className="h-16 w-auto mx-auto mb-6" />
          <h1 className="text-3xl font-bold mb-3">Complete Your Purchase</h1>
          <p className="text-slate-400 text-lg">
            Secure payment processing powered by Stripe
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Payment Form */}
          <div className="lg:col-span-2">
            <div className="p-8 rounded-3xl bg-slate-800/50 border border-slate-700/50">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Error */}
                {error && (
                  <div className="flex items-center gap-3 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                    <AlertTriangle className="w-5 h-5" />
                    {error}
                  </div>
                )}

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
                    className="w-full px-4 py-3 rounded-lg bg-slate-900/50 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Jane Doe"
                  />
                </div>

                {/* Card Number */}
                <div className="space-y-2">
                  <label htmlFor="cardNumber" className="block text-sm font-medium text-slate-300">
                    Card Number
                  </label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <input
                      id="cardNumber"
                      type="text"
                      required
                      maxLength={19}
                      value={cardNumber}
                      onChange={e => setCardNumber(e.target.value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim())}
                      className="w-full pl-12 pr-4 py-3 rounded-lg bg-slate-900/50 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="1234 5678 9012 3456"
                    />
                  </div>
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
                      className="w-full px-4 py-3 rounded-lg bg-slate-900/50 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                      maxLength={4}
                      value={cvv}
                      onChange={e => setCvv(e.target.value.replace(/\D/g, ''))}
                      className="w-full px-4 py-3 rounded-lg bg-slate-900/50 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="123"
                    />
                  </div>
                </div>

                {/* Promo Code */}
                <div className="space-y-2">
                  <label htmlFor="promoCode" className="block text-sm font-medium text-slate-300">
                    Promo Code (Optional)
                  </label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                      <input
                        id="promoCode"
                        type="text"
                        value={promoCode}
                        onChange={e => setPromoCode(e.target.value.toUpperCase())}
                        disabled={promoApplied}
                        className="w-full pl-12 pr-4 py-3 rounded-lg bg-slate-900/50 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                        placeholder="LAUNCH50"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleApplyPromo}
                      disabled={promoApplied || !promoCode}
                      className="px-6 py-3 rounded-lg bg-slate-700 hover:bg-slate-600 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Apply
                    </button>
                  </div>
                  {promoApplied && (
                    <div className="flex items-center gap-2 text-emerald-400 text-sm">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Promo code applied!</span>
                    </div>
                  )}
                  <p className="text-xs text-slate-500">
                    Promotional codes are time-limited incentives and do not alter the standard renewal price unless explicitly stated in contract terms.
                  </p>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-lg bg-blue-600 hover:bg-blue-500 font-semibold text-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Processing Payment...
                    </>
                  ) : (
                    <>
                      <Lock className="w-5 h-5" />
                      Pay ${(finalPrice / 100).toLocaleString()}
                    </>
                  )}
                </button>

                <p className="text-xs text-center text-slate-500">
                  Secure payment processing. Your card information is encrypted and secure.
                </p>
              </form>
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <div className="p-6 rounded-3xl bg-slate-800/50 border border-slate-700/50 sticky top-8">
              <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Annual License</span>
                  <span className="font-semibold">${(basePrice / 100).toLocaleString()}</span>
                </div>
                
                {discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-emerald-400">Promo Discount</span>
                    <span className="text-emerald-400 font-semibold">-${(discount / 100).toLocaleString()}</span>
                  </div>
                )}

                <div className="pt-4 border-t border-slate-700">
                  <div className="flex justify-between">
                    <span className="font-semibold">Total</span>
                    <span className="text-2xl font-bold text-blue-400">${(finalPrice / 100).toLocaleString()}</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">Billed annually</p>
                </div>
              </div>

              <div className="space-y-3 text-sm text-slate-400">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span>Full access to verification platform</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span>AI analytics and risk scoring</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span>Immutable audit trail</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span>Unlimited QR verifications</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-slate-500">
          Need help?{' '}
          <Link href="/pricing" className="text-blue-400 hover:text-blue-300 transition-colors">
            View Pricing Details
          </Link>
        </div>
      </div>
    </div>
  );
}
