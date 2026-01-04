import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface PublicLayoutProps {
  children: React.ReactNode;
}

export function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Global Header */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <img src="/trex-logo.png" alt="T-REX AI OS" className="h-10 w-auto" />
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/pricing"
              className="text-slate-600 hover:text-slate-900 transition-colors font-medium"
            >
              Pricing
            </Link>
            <Link
              href="/create-account"
              className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors font-medium"
            >
              Create Account
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
            >
              Login
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Page Content */}
      <main className="flex-1 pt-20">
        {children}
      </main>

      {/* Global Footer */}
      <footer className="border-t border-slate-300 bg-slate-50 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* Product ID */}
            <div>
              <div className="font-semibold text-slate-900 mb-2">T-REX AI OS</div>
              <p className="text-xs text-slate-600">
                Employee-anchored compliance and verification system
              </p>
            </div>

            {/* Legal */}
            <div>
              <div className="text-sm font-medium text-slate-900 mb-3">Legal</div>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/terms" className="text-slate-600 hover:text-slate-900">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-slate-600 hover:text-slate-900">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/data-security" className="text-slate-600 hover:text-slate-900">
                    Data & Security
                  </Link>
                </li>
                <li>
                  <Link href="/regulator-access" className="text-slate-600 hover:text-slate-900">
                    Regulator Access
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <div className="text-sm font-medium text-slate-900 mb-3">Support</div>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/request-demo" className="text-slate-600 hover:text-slate-900">
                    Request a Demo
                  </Link>
                </li>
                <li>
                  <a href="mailto:support@trexaios.com" className="text-slate-600 hover:text-slate-900">
                    Contact Support
                  </a>
                </li>
              </ul>
            </div>

            {/* Access */}
            <div>
              <div className="text-sm font-medium text-slate-900 mb-3">Access</div>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/login" className="text-slate-600 hover:text-slate-900">
                    Login
                  </Link>
                </li>
                <li>
                  <Link href="/create-account" className="text-slate-600 hover:text-slate-900">
                    Create Account
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-300 text-center text-xs text-slate-500">
            © {new Date().getFullYear()} T-REX AI OS. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
