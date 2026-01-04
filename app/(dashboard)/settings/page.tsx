'use client';

import { User, Bell, Shield, Key, Mail } from 'lucide-react';

/**
 * SETTINGS PAGE
 * 
 * Purpose:
 * - User preferences
 * - Security
 * - Access tokens (if any)
 * - Notification controls
 * 
 * Rules:
 * - User-scoped only
 * - No organization-wide settings
 */

export default function SettingsPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-slate-400">
          Manage your account preferences and security
        </p>
      </div>

      <div className="space-y-6">
        {/* Profile */}
        <div className="bg-slate-800/50 rounded-2xl border border-slate-700 p-6">
          <div className="flex items-center gap-3 mb-6">
            <User className="w-6 h-6 text-blue-400" />
            <h2 className="text-xl font-semibold">Profile</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-slate-400 mb-2">Full Name</label>
              <input
                type="text"
                className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-white"
                defaultValue="John Doe"
              />
            </div>

            <div>
              <label className="block text-sm text-slate-400 mb-2">Email</label>
              <input
                type="email"
                className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-white"
                defaultValue="john@example.com"
              />
            </div>
          </div>

          <div className="mt-6">
            <button className="px-6 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg font-medium">
              Save Changes
            </button>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-slate-800/50 rounded-2xl border border-slate-700 p-6">
          <div className="flex items-center gap-3 mb-6">
            <Bell className="w-6 h-6 text-green-400" />
            <h2 className="text-xl font-semibold">Notifications</h2>
          </div>

          <div className="space-y-4">
            {[
              { label: 'Email notifications', description: 'Receive email updates for important events' },
              { label: 'Certification expiration alerts', description: 'Get notified before certifications expire' },
              { label: 'Incident reports', description: 'Receive notifications for new incidents' },
              { label: 'Audit events', description: 'Get notified of audit-related activities' },
            ].map((item, i) => (
              <div key={i} className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="font-medium">{item.label}</div>
                  <div className="text-sm text-slate-400">{item.description}</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-slate-700 peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Security */}
        <div className="bg-slate-800/50 rounded-2xl border border-slate-700 p-6">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-6 h-6 text-amber-400" />
            <h2 className="text-xl font-semibold">Security</h2>
          </div>

          <div className="space-y-4">
            <div>
              <button className="w-full md:w-auto px-6 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg font-medium flex items-center gap-2">
                <Key className="w-4 h-4" />
                Change Password
              </button>
            </div>

            <div className="pt-4 border-t border-slate-700">
              <div className="font-medium mb-2">Two-Factor Authentication</div>
              <div className="text-sm text-slate-400 mb-4">
                Add an extra layer of security to your account
              </div>
              <button className="px-6 py-2 border border-slate-600 hover:bg-slate-800 rounded-lg font-medium">
                Enable 2FA
              </button>
            </div>
          </div>
        </div>

        {/* API Access */}
        <div className="bg-slate-800/50 rounded-2xl border border-slate-700 p-6">
          <div className="flex items-center gap-3 mb-6">
            <Key className="w-6 h-6 text-purple-400" />
            <h2 className="text-xl font-semibold">API Access</h2>
          </div>

          <div className="text-sm text-slate-400 mb-4">
            Generate API tokens for programmatic access to T-REX AI OS
          </div>

          <button className="px-6 py-2 border border-slate-600 hover:bg-slate-800 rounded-lg font-medium">
            Generate API Token
          </button>
        </div>
      </div>
    </div>
  );
}
