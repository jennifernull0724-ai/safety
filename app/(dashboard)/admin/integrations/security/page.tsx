'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Shield, Lock, Key, Users, AlertTriangle, CheckCircle, Clock, Bell } from 'lucide-react';

/**
 * SECURITY SETTINGS FOR IT ADMINISTRATORS
 * 
 * PURPOSE:
 * - SSO configuration
 * - Security policies
 * - Access control
 * - Security audit logs
 * 
 * AUTHORITY LIMITS:
 * - IT admins CAN configure technical security (SSO, API keys, session duration)
 * - IT admins CANNOT override compliance enforcement or edit employee records
 */

interface SecuritySetting {
  id: string;
  name: string;
  description: string;
  value: string | boolean | number;
  category: 'sso' | 'api' | 'session' | 'audit';
  editable: boolean;
}

interface SecurityLog {
  id: string;
  timestamp: string;
  eventType: string;
  user: string;
  details: string;
  severity: 'info' | 'warning' | 'critical';
}

export default function SecuritySettingsPage() {
  const [settings, setSettings] = useState<SecuritySetting[]>([
    // SSO Settings
    {
      id: 'sso-enabled',
      name: 'SSO Enabled',
      description: 'Enable Single Sign-On for user authentication',
      value: true,
      category: 'sso',
      editable: true
    },
    {
      id: 'sso-provider',
      name: 'SSO Provider',
      description: 'Identity provider (Okta, Azure AD, Google Workspace)',
      value: 'Okta',
      category: 'sso',
      editable: true
    },
    {
      id: 'sso-domain',
      name: 'SSO Domain',
      description: 'Allowed email domain for SSO (e.g., company.com)',
      value: 'company.com',
      category: 'sso',
      editable: true
    },
    {
      id: 'sso-force-login',
      name: 'Force SSO Login',
      description: 'Require SSO for all users (disable password login)',
      value: false,
      category: 'sso',
      editable: true
    },

    // API Settings
    {
      id: 'api-rate-limit',
      name: 'API Rate Limit',
      description: 'Requests per hour per API key',
      value: 1000,
      category: 'api',
      editable: true
    },
    {
      id: 'api-key-rotation',
      name: 'API Key Rotation Period',
      description: 'Automatic key expiration (days)',
      value: 90,
      category: 'api',
      editable: true
    },
    {
      id: 'api-ip-whitelist',
      name: 'IP Whitelist Enabled',
      description: 'Restrict API access to specific IP addresses',
      value: false,
      category: 'api',
      editable: true
    },

    // Session Settings
    {
      id: 'session-timeout',
      name: 'Session Timeout',
      description: 'Idle session timeout (minutes)',
      value: 60,
      category: 'session',
      editable: true
    },
    {
      id: 'session-max-duration',
      name: 'Maximum Session Duration',
      description: 'Force re-login after (hours)',
      value: 8,
      category: 'session',
      editable: true
    },
    {
      id: 'mfa-required',
      name: 'Require MFA',
      description: 'Require multi-factor authentication for all users',
      value: true,
      category: 'session',
      editable: true
    },

    // Audit Settings
    {
      id: 'audit-retention',
      name: 'Audit Log Retention',
      description: 'Keep security logs for (years)',
      value: 7,
      category: 'audit',
      editable: false // Compliance requirement - cannot be changed
    },
    {
      id: 'audit-alerts',
      name: 'Security Alerts',
      description: 'Send email alerts for critical security events',
      value: true,
      category: 'audit',
      editable: true
    }
  ]);

  const [securityLogs] = useState<SecurityLog[]>([
    {
      id: '1',
      timestamp: '2026-01-05T10:30:00Z',
      eventType: 'API Key Created',
      user: 'admin@company.com',
      details: 'Created API key "HRIS Production Sync"',
      severity: 'info'
    },
    {
      id: '2',
      timestamp: '2026-01-05T09:15:00Z',
      eventType: 'Failed Login Attempt',
      user: 'unknown@external.com',
      details: 'Failed SSO login from IP 203.0.113.42',
      severity: 'warning'
    },
    {
      id: '3',
      timestamp: '2026-01-04T22:45:00Z',
      eventType: 'API Key Revoked',
      user: 'it-admin@company.com',
      details: 'Revoked API key "Webhook Alerts (OLD)" due to expiration',
      severity: 'info'
    },
    {
      id: '4',
      timestamp: '2026-01-04T18:20:00Z',
      eventType: 'Rate Limit Exceeded',
      user: 'api-key:hris-prod-key',
      details: 'API key exceeded 1000 requests/hour limit',
      severity: 'warning'
    },
    {
      id: '5',
      timestamp: '2026-01-03T14:10:00Z',
      eventType: 'Unauthorized Access Attempt',
      user: 'unknown',
      details: 'Attempted access to /api/v1/admin endpoint without valid token',
      severity: 'critical'
    }
  ]);

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [editingSettingId, setEditingSettingId] = useState<string | null>(null);

  const categories = [
    { id: 'all', name: 'All Settings', icon: Shield },
    { id: 'sso', name: 'Single Sign-On', icon: Users },
    { id: 'api', name: 'API Security', icon: Key },
    { id: 'session', name: 'Session & Auth', icon: Lock },
    { id: 'audit', name: 'Audit & Logs', icon: Clock }
  ];

  const filteredSettings = selectedCategory === 'all' 
    ? settings 
    : settings.filter(s => s.category === selectedCategory);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="flex items-center gap-4">
          <Link href="/admin/integrations" className="text-slate-600 hover:text-slate-900">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Security Settings</h1>
            <p className="text-sm text-slate-600">SSO, API security, session management, and audit logs</p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Authority Notice */}
        <div className="mb-8 p-6 bg-amber-50 border-2 border-amber-200 rounded-lg">
          <div className="flex items-start gap-3">
            <Shield className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <h2 className="text-lg font-bold text-amber-900 mb-2">IT Administrator Security Authority</h2>
              <p className="text-sm text-amber-800 mb-3">
                You can configure <strong>technical security settings</strong> (SSO, API keys, sessions). 
                However, you <strong>cannot modify compliance enforcement rules</strong> or override blocked employee status.
              </p>
              <ul className="text-sm text-amber-800 space-y-1">
                <li>• ✅ You CAN: Configure SSO, rotate API keys, set session timeouts</li>
                <li>• ❌ You CANNOT: Override compliance rules, edit certification records, unblock employees</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Category Navigation */}
          <aside className="lg:col-span-1">
            <div className="bg-white border border-slate-200 rounded-lg p-4">
              <h2 className="text-sm font-bold text-slate-900 mb-3">Categories</h2>
              <nav className="space-y-1">
                {categories.map((category) => {
                  const Icon = category.icon;
                  const count = category.id === 'all' 
                    ? settings.length 
                    : settings.filter(s => s.category === category.id).length;

                  return (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                        selectedCategory === category.id
                          ? 'bg-blue-100 text-blue-900'
                          : 'text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-sm font-semibold flex-1 text-left">{category.name}</span>
                      <span className="text-xs font-bold text-slate-500">{count}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Quick Links */}
            <div className="mt-4 bg-white border border-slate-200 rounded-lg p-4">
              <h2 className="text-sm font-bold text-slate-900 mb-3">Quick Links</h2>
              <div className="space-y-2 text-sm">
                <Link href="/admin/integrations/api-keys" className="block text-blue-600 hover:underline">
                  → Manage API Keys
                </Link>
                <Link href="/admin/integrations/failure-modes" className="block text-blue-600 hover:underline">
                  → View Failure Modes
                </Link>
                <Link href="/admin/integrations/api-docs" className="block text-blue-600 hover:underline">
                  → API Documentation
                </Link>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Settings */}
            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-4">
                {categories.find(c => c.id === selectedCategory)?.name || 'Settings'}
              </h2>

              <div className="space-y-4">
                {filteredSettings.map((setting) => (
                  <div 
                    key={setting.id}
                    className="p-6 bg-white border border-slate-200 rounded-lg"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-slate-900">{setting.name}</h3>
                        <p className="text-sm text-slate-600">{setting.description}</p>
                      </div>
                      {!setting.editable && (
                        <div className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-bold rounded-full flex items-center gap-1">
                          <Lock className="w-3 h-3" />
                          LOCKED
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        {typeof setting.value === 'boolean' ? (
                          <div className="flex items-center gap-2">
                            <div className={`px-4 py-2 rounded-lg font-semibold ${
                              setting.value 
                                ? 'bg-green-100 text-green-900' 
                                : 'bg-slate-100 text-slate-900'
                            }`}>
                              {setting.value ? 'Enabled' : 'Disabled'}
                            </div>
                          </div>
                        ) : (
                          <div className="px-4 py-2 bg-slate-100 rounded-lg font-mono text-slate-900">
                            {setting.value}
                          </div>
                        )}
                      </div>
                      {setting.editable && (
                        <button
                          onClick={() => setEditingSettingId(setting.id)}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors text-sm"
                        >
                          Edit
                        </button>
                      )}
                    </div>

                    {!setting.editable && (
                      <p className="mt-3 text-xs text-slate-600 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-amber-600" />
                        This setting is locked due to compliance requirements and cannot be modified.
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Security Logs */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-slate-900">Recent Security Events</h2>
                <Link
                  href="/admin/integrations/security/logs"
                  className="text-sm text-blue-600 hover:underline font-semibold"
                >
                  View All Logs →
                </Link>
              </div>

              <div className="space-y-3">
                {securityLogs.map((log) => (
                  <div 
                    key={log.id}
                    className={`p-4 rounded-lg border ${
                      log.severity === 'critical' ? 'bg-red-50 border-red-200' :
                      log.severity === 'warning' ? 'bg-amber-50 border-amber-200' :
                      'bg-white border-slate-200'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-start gap-3">
                        {log.severity === 'critical' ? (
                          <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                        ) : log.severity === 'warning' ? (
                          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                        ) : (
                          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        )}
                        <div>
                          <h3 className={`font-bold text-sm ${
                            log.severity === 'critical' ? 'text-red-900' :
                            log.severity === 'warning' ? 'text-amber-900' :
                            'text-slate-900'
                          }`}>
                            {log.eventType}
                          </h3>
                          <p className={`text-sm ${
                            log.severity === 'critical' ? 'text-red-800' :
                            log.severity === 'warning' ? 'text-amber-800' :
                            'text-slate-700'
                          }`}>
                            {log.details}
                          </p>
                        </div>
                      </div>
                      <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                        log.severity === 'critical' ? 'bg-red-100 text-red-900' :
                        log.severity === 'warning' ? 'bg-amber-100 text-amber-900' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {log.severity.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-slate-600">
                      <span>👤 {log.user}</span>
                      <span>🕐 {new Date(log.timestamp).toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Security Recommendations */}
            <section className="p-6 bg-blue-50 border-2 border-blue-200 rounded-lg">
              <div className="flex items-start gap-3">
                <Bell className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h2 className="text-lg font-bold text-blue-900 mb-2">Security Recommendations</h2>
                  <ul className="text-sm text-blue-800 space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <span><strong>Enable MFA:</strong> Multi-factor authentication is currently enabled for all users ✓</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-600" />
                      <span><strong>Force SSO Login:</strong> Consider requiring SSO for all users (currently optional)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-600" />
                      <span><strong>IP Whitelist:</strong> Enable IP whitelisting for API access to reduce unauthorized access risk</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <span><strong>API Key Rotation:</strong> 90-day rotation policy is active ✓</span>
                    </li>
                  </ul>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
