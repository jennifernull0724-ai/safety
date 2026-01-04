'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { LoginLayout } from '@/components/LoginLayout';
import {
  Shield,
  Mail,
  Lock,
  ArrowRight,
  Loader2,
  AlertTriangle
} from 'lucide-react';

/**
 * CANONICAL LOGIN PAGE
 * 
 * Purpose:
 * - Authentication entry point only
 * - Explicit recovery path
 * - No compliance, verification, or product logic
 * 
 * NO Base44, NO React Router, NO Framer Motion, NO custom components
 */

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // AUTH PROVIDER HOOK GOES HERE
      // await signIn({ email, password })

      await new Promise(res => setTimeout(res, 1200)); // placeholder
      
      // Redirect to dashboard after successful login
      window.location.href = '/dashboard';
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginLayout>
      <div className="min-h-screen bg-white pt-12 pb-16 px-6 flex items-center justify-center">
        <div
          className="w-full max-w-md"
          style={{
            animation: 'fadeInUp 0.6s ease-out both'
          }}
        >
        {/* Header */}
        <div className="text-center mb-8">
          <img src="/trex-logo.png" alt="T-REX AI OS" className="h-16 w-auto mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-slate-900">T-REX AI OS</h1>
          <p className="text-slate-600 mt-1">Secure Login</p>
        </div>

        {/* Card */}
        <div className="p-8 rounded-3xl bg-blue-600 border border-blue-700">
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Error */}
            {error && (
              <div className="flex items-center gap-3 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                <AlertTriangle className="w-4 h-4" />
                {error}
              </div>
            )}

            {/* Email */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-white">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  id="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-blue-500 bg-blue-700 text-white placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-white"
                  placeholder="you@company.com"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-white">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="password"
                  id="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-blue-500 bg-blue-700 text-white placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-white"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Forgot Password */}
            <div className="flex justify-end">
              <Link
                href="/forgot-password"
                className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <ArrowRight className="w-4 h-4" />
              )}
              Sign In
            </button>
          </form>
        </div>

        {/* Footer Text */}
        <div className="text-center mt-6 text-sm text-slate-500">
          Unauthorized access is prohibited.
        </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 bg-white py-10 text-center text-sm text-slate-500">
        <div className="mb-4">
          <Link href="/contact-support" className="text-slate-600 hover:text-slate-900 font-medium">
            Contact Support
          </Link>
        </div>
        <div>
          © {new Date().getFullYear()} T-REX AI OS. All rights reserved.
        </div>
      </footer>

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
    </LoginLayout>
  );
}
