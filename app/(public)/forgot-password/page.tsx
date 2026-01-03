'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Shield,
  Mail,
  ArrowLeft,
  Loader2,
  CheckCircle2
} from 'lucide-react';

/**
 * FORGOT PASSWORD PAGE
 * 
 * Purpose:
 * - Password recovery entry point
 * - Separate, explicit, non-modal (important for audits and UX clarity)
 * - No compliance or verification logic
 * 
 * NO Base44, NO React Router, NO Framer Motion, NO custom components
 */

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // PASSWORD RESET PROVIDER HOOK GOES HERE
    await new Promise(res => setTimeout(res, 1200));

    setSent(true);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6">
      <div
        className="w-full max-w-md"
        style={{
          animation: 'fadeInUp 0.6s ease-out both'
        }}
      >
        <div className="text-center mb-8">
          <div className="w-12 h-12 mx-auto rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-4">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold">Reset Password</h1>
          <p className="text-slate-400 mt-1">
            Secure recovery process
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-slate-800/50 border border-slate-700/50">
          {sent ? (
            <div className="text-center space-y-4">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
              <p className="text-slate-300">
                If an account exists for this email, a reset link has been sent.
              </p>
              <Link
                href="/login"
                className="inline-flex items-center justify-center px-6 py-3 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800 font-medium transition-colors"
              >
                Return to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleReset} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-slate-300">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-lg bg-slate-900/50 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="you@company.com"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                Send Reset Link
              </button>

              <Link
                href="/login"
                className="flex items-center justify-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to login
              </Link>
            </form>
          )}
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
