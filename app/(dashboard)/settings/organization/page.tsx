'use client';

import { Building2, Users, Shield, CheckCircle, XCircle } from 'lucide-react';

/**
 * ORGANIZATION PAGE
 * 
 * Purpose:
 * - Organization profile
 * - License status
 * - Roles & seats
 * - Verification authority status
 * 
 * Rules:
 * - This is not billing UI, just org state
 * - Read-only view of org configuration
 */

export default function OrganizationPage() {
  const org = {
    name: 'T-REX AI OS Organization',
    industry: 'Railroad',
    license_status: 'active',
    verification_authority: true,
    seats_used: 12,
    seats_total: 50,
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Organization</h1>
        <p className="text-slate-400">
          Organization profile and verification authority status
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Organization Profile */}
        <div className="bg-slate-800/50 rounded-2xl border border-slate-700 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">{org.name}</h2>
              <p className="text-sm text-slate-400">{org.industry}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <div className="text-sm text-slate-400 mb-1">License Status</div>
              <div className="flex items-center gap-2">
                {org.license_status === 'active' ? (
                  <>
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="font-medium text-green-400">Active</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5 text-red-400" />
                    <span className="font-medium text-red-400">Inactive</span>
                  </>
                )}
              </div>
            </div>

            <div>
              <div className="text-sm text-slate-400 mb-1">Verification Authority</div>
              <div className="flex items-center gap-2">
                {org.verification_authority ? (
                  <>
                    <Shield className="w-5 h-5 text-blue-400" />
                    <span className="font-medium">Enabled</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5 text-slate-400" />
                    <span className="font-medium text-slate-400">Not Enabled</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Seats & Roles */}
        <div className="bg-slate-800/50 rounded-2xl border border-slate-700 p-6">
          <div className="flex items-center gap-3 mb-6">
            <Users className="w-6 h-6 text-green-400" />
            <h2 className="text-xl font-semibold">Seats & Roles</h2>
          </div>

          <div className="space-y-4">
            <div>
              <div className="text-sm text-slate-400 mb-2">Seat Usage</div>
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-slate-700 rounded-full h-2">
                  <div 
                    className="bg-green-400 h-2 rounded-full"
                    style={{ width: `${(org.seats_used / org.seats_total) * 100}%` }}
                  />
                </div>
                <span className="text-sm font-medium">
                  {org.seats_used} / {org.seats_total}
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-700">
              <div className="text-sm text-slate-400 mb-3">Active Roles</div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Admin</span>
                  <span className="text-slate-400">2 users</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Safety Manager</span>
                  <span className="text-slate-400">3 users</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Supervisor</span>
                  <span className="text-slate-400">5 users</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Employee</span>
                  <span className="text-slate-400">2 users</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-blue-900/20 border border-blue-800/50 rounded-lg">
        <div className="text-sm">
          <div className="font-medium text-blue-300 mb-1">Organization Verification License</div>
          <div className="text-slate-400">
            Your organization has an active verification license. All employee QR codes will resolve to valid verification pages.
          </div>
        </div>
      </div>
    </div>
  );
}
