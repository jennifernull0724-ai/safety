'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Shield,
  Building2,
  MessageSquare,
  ArrowRight,
  Loader2,
  AlertTriangle
} from 'lucide-react';

/**
 * JOIN ORGANIZATION / REQUEST ACCESS
 * 
 * Purpose:
 * - Authenticated user exists but is not associated with any organization
 * - Request access ONLY. No invites created here.
 * - Does NOT grant access, authority, or system activity
 * 
 * State Result:
 * user.status = "pending_org_access"
 * 
 * NO Base44, NO React Router, NO Framer Motion, NO custom components
 */

export default function JoinOrganization() {
  const [organizationName, setOrganizationName] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleRequestAccess = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // REQUEST ACCESS HOOK GOES HERE
      // await requestOrganizationAccess({ organizationName, message })
      
      await new Promise(res => setTimeout(res, 1200)); // placeholder
      setSubmitted(true);
    } catch (err) {
      setError('Unable to submit access request');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6">
        <div
          className="w-full max-w-md text-center"
          style={{
            animation: 'fadeInUp 0.6s ease-out both'
          }}
        >
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-6">
            <Shield className="w-8 h-8 text-white" />
          </div>
          
          <h1 className="text-2xl font-bold mb-3">Access Request Submitted</h1>
          <p className="text-slate-400 mb-8">
            Your request has been sent to the organization administrators.
            You will be notified when your access is approved.
          </p>

          <div className="p-6 rounded-2xl bg-slate-800/50 border border-slate-700/50">
            <h2 className="text-lg font-semibold mb-2">What Happens Next</h2>
            <ul className="text-left space-y-3 text-sm text-slate-300">
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0" />
                <span>Organization admin reviews your request</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0" />
                <span>You receive email notification when approved</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0" />
                <span>Access granted only after admin approval</span>
              </li>
            </ul>
          </div>

          <p className="text-sm text-slate-500 mt-6">
            You can close this page. We'll email you when there's an update.
          </p>
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

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6">
      <div
        className="w-full max-w-md"
        style={{
          animation: 'fadeInUp 0.6s ease-out both'
        }}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 mx-auto rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-4">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold">Join Organization</h1>
          <p className="text-slate-400 mt-1">
            Request access to an existing organization
          </p>
        </div>

        {/* Card */}
        <div className="p-8 rounded-3xl bg-slate-800/50 border border-slate-700/50">
          <form onSubmit={handleRequestAccess} className="space-y-6">
            {/* Error */}
            {error && (
              <div className="flex items-center gap-3 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                <AlertTriangle className="w-4 h-4" />
                {error}
              </div>
            )}

            {/* Organization Name */}
            <div className="space-y-2">
              <label htmlFor="organizationName" className="block text-sm font-medium text-slate-300">
                Organization Name
              </label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  id="organizationName"
                  type="text"
                  required
                  value={organizationName}
                  onChange={e => setOrganizationName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-slate-900/50 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Acme Construction LLC"
                />
              </div>
            </div>

            {/* Optional Message */}
            <div className="space-y-2">
              <label htmlFor="message" className="block text-sm font-medium text-slate-300">
                Message (Optional)
              </label>
              <div className="relative">
                <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                <textarea
                  id="message"
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  rows={4}
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-slate-900/50 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Why are you requesting access to this organization?"
                />
              </div>
            </div>

            {/* Important Notice */}
            <div className="p-4 rounded-lg bg-slate-900/50 border border-slate-700/50">
              <h3 className="text-sm font-semibold text-slate-300 mb-2">Important</h3>
              <ul className="space-y-2 text-xs text-slate-400">
                <li className="flex items-start gap-2">
                  <div className="w-1 h-1 rounded-full bg-slate-500 mt-1.5 shrink-0" />
                  <span>This request does NOT grant access automatically</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1 h-1 rounded-full bg-slate-500 mt-1.5 shrink-0" />
                  <span>Organization admin must approve your request</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1 h-1 rounded-full bg-slate-500 mt-1.5 shrink-0" />
                  <span>You will NOT have system permissions until approved</span>
                </li>
              </ul>
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
              Request Access
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-sm text-slate-500">
          Need to create a new organization?{' '}
          <Link
            href="/activate-license"
            className="text-blue-400 hover:text-blue-300 transition-colors"
          >
            Activate License
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
