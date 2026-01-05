'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Settings,
  Key,
  Activity,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Code,
  Database,
  Zap,
  Shield,
  Clock,
  TrendingUp,
  FileText
} from 'lucide-react';

/**
 * IT ADMINISTRATOR - INTEGRATIONS DASHBOARD
 * 
 * PURPOSE:
 * - Manage API integrations
 * - Monitor system health
 * - Configure API keys
 * - View error logs
 * 
 * AUTHORITY:
 * - High technical authority (APIs, security, integrations)
 * - Limited compliance authority (cannot override enforcement logic)
 * 
 * CRITICAL CONSTRAINTS:
 * - Cannot edit compliance decisions
 * - Cannot modify employee records
 * - Cannot bypass enforcement rules
 * - Read-only access to compliance data
 */

interface IntegrationStatus {
  id: string;
  name: string;
  type: 'inbound' | 'outbound' | 'webhook';
  status: 'active' | 'error' | 'disabled';
  lastSync: string;
  recordsProcessed: number;
  errorCount: number;
  apiKeyName?: string;
}

interface SystemHealth {
  apiStatus: 'operational' | 'degraded' | 'down';
  databaseStatus: 'operational' | 'degraded' | 'down';
  queueStatus: 'operational' | 'degraded' | 'down';
  uptime: number;
  requestsPerMinute: number;
  errorRate: number;
}

export default function IntegrationsDashboardPage() {
  const [integrations, setIntegrations] = useState<IntegrationStatus[]>([
    {
      id: '1',
      name: 'HRIS Employee Sync',
      type: 'inbound',
      status: 'active',
      lastSync: '2026-01-05T10:15:00Z',
      recordsProcessed: 1247,
      errorCount: 0,
      apiKeyName: 'hris-prod-key'
    },
    {
      id: '2',
      name: 'LMS Certification Import',
      type: 'inbound',
      status: 'active',
      lastSync: '2026-01-05T09:30:00Z',
      recordsProcessed: 89,
      errorCount: 0,
      apiKeyName: 'lms-sync-key'
    },
    {
      id: '3',
      name: 'Compliance Violation Webhook',
      type: 'webhook',
      status: 'error',
      lastSync: '2026-01-04T22:45:00Z',
      recordsProcessed: 12,
      errorCount: 3,
      apiKeyName: 'webhook-alert-key'
    }
  ]);

  const [systemHealth] = useState<SystemHealth>({
    apiStatus: 'operational',
    databaseStatus: 'operational',
    queueStatus: 'degraded',
    uptime: 99.97,
    requestsPerMinute: 142,
    errorRate: 0.03
  });

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Settings className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-slate-900">IT Administration</h1>
              <p className="text-sm text-slate-600">API integrations, system health, and security</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/admin/integrations/api-docs"
              className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-900 font-semibold rounded-lg transition-colors"
            >
              <FileText className="w-4 h-4" />
              API Docs
            </Link>
            <Link
              href="/admin/integrations/api-keys"
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
            >
              <Key className="w-4 h-4" />
              Manage API Keys
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Authority Notice */}
        <div className="mb-8 p-4 bg-amber-50 border-2 border-amber-200 rounded-lg">
          <div className="flex items-start gap-3">
            <Shield className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-amber-900 mb-1">IT Administrator Authority</h3>
              <p className="text-sm text-amber-800">
                You have <strong>technical authority</strong> over APIs, integrations, and system configuration. 
                However, you <strong>cannot edit compliance decisions</strong>, override enforcement logic, or 
                modify employee certification records. Compliance data is read-only for IT admins.
              </p>
            </div>
          </div>
        </div>

        {/* System Health Overview */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-slate-900 mb-4">System Health</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* API Status */}
            <div className="p-4 bg-white border border-slate-200 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-slate-700">API</span>
                {systemHealth.apiStatus === 'operational' ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : systemHealth.apiStatus === 'degraded' ? (
                  <AlertTriangle className="w-5 h-5 text-yellow-600" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600" />
                )}
              </div>
              <p className={`text-xs font-medium ${
                systemHealth.apiStatus === 'operational' ? 'text-green-600' :
                systemHealth.apiStatus === 'degraded' ? 'text-yellow-600' :
                'text-red-600'
              }`}>
                {systemHealth.apiStatus.toUpperCase()}
              </p>
            </div>

            {/* Database Status */}
            <div className="p-4 bg-white border border-slate-200 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-slate-700">Database</span>
                {systemHealth.databaseStatus === 'operational' ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : systemHealth.databaseStatus === 'degraded' ? (
                  <AlertTriangle className="w-5 h-5 text-yellow-600" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600" />
                )}
              </div>
              <p className={`text-xs font-medium ${
                systemHealth.databaseStatus === 'operational' ? 'text-green-600' :
                systemHealth.databaseStatus === 'degraded' ? 'text-yellow-600' :
                'text-red-600'
              }`}>
                {systemHealth.databaseStatus.toUpperCase()}
              </p>
            </div>

            {/* Queue Status */}
            <div className="p-4 bg-white border border-slate-200 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-slate-700">Job Queue</span>
                {systemHealth.queueStatus === 'operational' ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : systemHealth.queueStatus === 'degraded' ? (
                  <AlertTriangle className="w-5 h-5 text-yellow-600" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600" />
                )}
              </div>
              <p className={`text-xs font-medium ${
                systemHealth.queueStatus === 'operational' ? 'text-green-600' :
                systemHealth.queueStatus === 'degraded' ? 'text-yellow-600' :
                'text-red-600'
              }`}>
                {systemHealth.queueStatus.toUpperCase()}
              </p>
            </div>

            {/* Uptime */}
            <div className="p-4 bg-white border border-slate-200 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-slate-700">Uptime (30d)</span>
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-xl font-bold text-slate-900">
                {systemHealth.uptime}%
              </p>
            </div>
          </div>
        </section>

        {/* Metrics */}
        <section className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-white border border-slate-200 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <Activity className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-semibold text-slate-700">API Requests/Min</span>
              </div>
              <p className="text-2xl font-bold text-slate-900">{systemHealth.requestsPerMinute}</p>
            </div>

            <div className="p-4 bg-white border border-slate-200 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                <span className="text-sm font-semibold text-slate-700">Error Rate</span>
              </div>
              <p className="text-2xl font-bold text-slate-900">{systemHealth.errorRate}%</p>
            </div>

            <div className="p-4 bg-white border border-slate-200 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <Zap className="w-5 h-5 text-green-600" />
                <span className="text-sm font-semibold text-slate-700">Active Integrations</span>
              </div>
              <p className="text-2xl font-bold text-slate-900">
                {integrations.filter(i => i.status === 'active').length}/{integrations.length}
              </p>
            </div>
          </div>
        </section>

        {/* Active Integrations */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-900">Active Integrations</h2>
            <Link
              href="/admin/integrations/new"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
            >
              + Add Integration
            </Link>
          </div>

          <div className="space-y-4">
            {integrations.map((integration) => (
              <div 
                key={integration.id}
                className="p-6 bg-white border border-slate-200 rounded-lg hover:border-blue-300 transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg ${
                      integration.type === 'inbound' ? 'bg-blue-100' :
                      integration.type === 'outbound' ? 'bg-green-100' :
                      'bg-purple-100'
                    }`}>
                      {integration.type === 'inbound' ? (
                        <Database className="w-6 h-6 text-blue-600" />
                      ) : integration.type === 'outbound' ? (
                        <Zap className="w-6 h-6 text-green-600" />
                      ) : (
                        <Code className="w-6 h-6 text-purple-600" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">{integration.name}</h3>
                      <p className="text-sm text-slate-600">
                        {integration.type === 'inbound' ? 'Inbound API' :
                         integration.type === 'outbound' ? 'Outbound API' :
                         'Webhook'}
                      </p>
                    </div>
                  </div>

                  <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                    integration.status === 'active' ? 'bg-green-100 text-green-900' :
                    integration.status === 'error' ? 'bg-red-100 text-red-900' :
                    'bg-slate-100 text-slate-900'
                  }`}>
                    {integration.status.toUpperCase()}
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-slate-600 mb-1">Last Sync</p>
                    <p className="text-sm font-semibold text-slate-900">
                      {new Date(integration.lastSync).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-600 mb-1">Records Processed</p>
                    <p className="text-sm font-semibold text-slate-900">
                      {integration.recordsProcessed.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-600 mb-1">Errors (24h)</p>
                    <p className={`text-sm font-semibold ${
                      integration.errorCount > 0 ? 'text-red-600' : 'text-green-600'
                    }`}>
                      {integration.errorCount}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-600 mb-1">API Key</p>
                    <p className="text-sm font-semibold text-slate-900">
                      {integration.apiKeyName || 'None'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Link
                    href={`/admin/integrations/${integration.id}/configure`}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-900 font-semibold rounded-lg transition-colors text-sm"
                  >
                    Configure
                  </Link>
                  <Link
                    href={`/admin/integrations/${integration.id}/logs`}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-900 font-semibold rounded-lg transition-colors text-sm"
                  >
                    View Logs
                  </Link>
                  {integration.status === 'error' && (
                    <Link
                      href={`/admin/integrations/${integration.id}/errors`}
                      className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-900 font-semibold rounded-lg transition-colors text-sm"
                    >
                      View Errors ({integration.errorCount})
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Quick Links */}
        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-4">Quick Links</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/admin/integrations/api-docs"
              className="p-4 bg-white border border-slate-200 rounded-lg hover:border-blue-300 transition-colors"
            >
              <FileText className="w-6 h-6 text-blue-600 mb-2" />
              <h3 className="font-bold text-slate-900 mb-1">API Documentation</h3>
              <p className="text-sm text-slate-600">
                Complete API reference with examples and error codes
              </p>
            </Link>

            <Link
              href="/admin/integrations/failure-modes"
              className="p-4 bg-white border border-slate-200 rounded-lg hover:border-blue-300 transition-colors"
            >
              <AlertTriangle className="w-6 h-6 text-amber-600 mb-2" />
              <h3 className="font-bold text-slate-900 mb-1">Failure Modes</h3>
              <p className="text-sm text-slate-600">
                Error handling, retry logic, and failure recovery procedures
              </p>
            </Link>

            <Link
              href="/admin/integrations/security"
              className="p-4 bg-white border border-slate-200 rounded-lg hover:border-blue-300 transition-colors"
            >
              <Shield className="w-6 h-6 text-green-600 mb-2" />
              <h3 className="font-bold text-slate-900 mb-1">Security Settings</h3>
              <p className="text-sm text-slate-600">
                SSO configuration, API key rotation, and security logs
              </p>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
