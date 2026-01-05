'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, AlertTriangle, XCircle, RefreshCw, Clock, Shield, Database, Zap } from 'lucide-react';

/**
 * FAILURE MODES & ERROR HANDLING DOCUMENTATION
 * 
 * PURPOSE:
 * - Document all failure scenarios
 * - Define retry logic
 * - Explain error recovery procedures
 * - Provide troubleshooting guides
 * 
 * APPROVAL BLOCKER RESOLUTION:
 * - "No failure behavior defined" → Complete failure mode documentation
 */

interface FailureMode {
  id: string;
  category: 'integration' | 'database' | 'api' | 'webhook';
  title: string;
  description: string;
  symptoms: string[];
  causes: string[];
  resolution: string[];
  preventionSteps: string[];
  retryLogic?: string;
  escalation?: string;
}

export default function FailureModesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const failureModes: FailureMode[] = [
    {
      id: 'api-rate-limit',
      category: 'api',
      title: '429 Too Many Requests',
      description: 'API rate limit exceeded (1000 requests/hour)',
      symptoms: [
        'HTTP 429 response code',
        'Retry-After header present',
        'Integration shows "degraded" status'
      ],
      causes: [
        'Too many requests in short time window',
        'Multiple API keys sharing same rate limit bucket',
        'Batch job processing without throttling'
      ],
      resolution: [
        'Wait for duration specified in Retry-After header',
        'Implement exponential backoff (2^n seconds)',
        'Reduce request frequency',
        'Split batch processing into smaller chunks'
      ],
      preventionSteps: [
        'Add rate limiting to client code',
        'Use batch endpoints where available',
        'Cache frequent lookups locally',
        'Monitor API usage dashboard daily'
      ],
      retryLogic: 'Wait Retry-After seconds, then retry with exponential backoff: 2s, 4s, 8s, 16s, 32s (max 5 attempts)',
      escalation: 'If rate limits persistently exceeded, contact support to discuss limit increase'
    },
    {
      id: 'webhook-delivery-failed',
      category: 'webhook',
      title: 'Webhook Delivery Failure',
      description: 'Outbound webhook failed to deliver event to subscriber endpoint',
      symptoms: [
        'Webhook status shows "error"',
        'Event count discrepancy',
        'Timeout errors in webhook logs'
      ],
      causes: [
        'Subscriber endpoint unreachable (down/network issue)',
        'Subscriber endpoint returned 4xx/5xx error',
        'Webhook signature verification failed',
        'Endpoint timeout (>30 seconds)'
      ],
      resolution: [
        'Check subscriber endpoint health',
        'Verify webhook signing secret matches',
        'Review subscriber endpoint logs for errors',
        'Re-deliver failed events from webhook dashboard'
      ],
      preventionSteps: [
        'Implement webhook endpoint health monitoring',
        'Add idempotency keys to prevent duplicate processing',
        'Set up webhook retry queues',
        'Configure alerting for failed deliveries'
      ],
      retryLogic: 'Automatic retries: Immediate, +1min, +5min, +30min, +2hr (max 5 attempts). After 5 failures, webhook disabled.',
      escalation: 'Check /admin/integrations/webhooks/failed-deliveries for manual retry'
    },
    {
      id: 'certification-import-failed',
      category: 'integration',
      title: 'Certification Import Failed',
      description: 'Inbound certification data rejected during import',
      symptoms: [
        'Import job shows "error" status',
        'Error count > 0 in integration dashboard',
        'Missing certifications in employee records'
      ],
      causes: [
        'Invalid date format (must be ISO 8601)',
        'Certification type not in preset list',
        'Employee ID does not exist',
        'Duplicate certification record',
        'Missing required fields'
      ],
      resolution: [
        'Download error report from integration logs',
        'Fix data format issues in source system',
        'Add missing certification types to presets',
        'Verify employee IDs match exactly',
        'Re-run import after corrections'
      ],
      preventionSteps: [
        'Validate data before API submission',
        'Use certification preset endpoint to get valid types',
        'Implement pre-flight validation',
        'Set up automated data quality checks'
      ],
      retryLogic: 'Failed records moved to quarantine. Manual review required. Use /admin/integrations/quarantine to review and resubmit.',
      escalation: 'Persistent validation errors may require schema update - contact support'
    },
    {
      id: 'database-deadlock',
      category: 'database',
      title: 'Database Deadlock Detected',
      description: 'Concurrent write operations caused database deadlock',
      symptoms: [
        'HTTP 503 Service Unavailable',
        'Transaction timeout errors',
        'Slow API response times'
      ],
      causes: [
        'High concurrent write volume',
        'Long-running transactions',
        'Inefficient query patterns',
        'Lock contention on same records'
      ],
      resolution: [
        'System automatically retries deadlocked transactions',
        'If persists, reduce concurrent write operations',
        'Batch updates during off-peak hours',
        'Contact support if deadlocks occur frequently'
      ],
      preventionSteps: [
        'Avoid long-running transactions',
        'Use batch endpoints for bulk operations',
        'Schedule heavy operations during off-peak hours',
        'Monitor database performance metrics'
      ],
      retryLogic: 'Automatic retry with exponential backoff (3 attempts). Client should retry 503 errors.',
      escalation: 'Frequent deadlocks indicate capacity issue - contact support for scaling'
    },
    {
      id: 'api-key-revoked',
      category: 'api',
      title: 'API Key Revoked or Expired',
      description: 'API requests rejected due to invalid credentials',
      symptoms: [
        'HTTP 401 Unauthorized',
        'All API requests failing',
        'Integration status shows "disabled"'
      ],
      causes: [
        'API key manually revoked by admin',
        'API key exceeded expiration date',
        'API key rotation completed but not updated in integration',
        'Incorrect API key in Authorization header'
      ],
      resolution: [
        'Generate new API key from /admin/integrations/api-keys',
        'Update integration configuration with new key',
        'Verify Authorization header format: "Bearer YOUR_KEY"',
        'Test API key with curl before deploying'
      ],
      preventionSteps: [
        'Set calendar reminders for API key expiration (90 days)',
        'Use key rotation process (create new before revoking old)',
        'Monitor API key usage dashboard',
        'Document which keys are used by which integrations'
      ],
      retryLogic: 'No automatic retry. Manual intervention required to update API key.',
      escalation: 'If cannot generate new keys, verify admin permissions or contact support'
    },
    {
      id: 'point-in-time-unavailable',
      category: 'database',
      title: 'Historical Data Unavailable',
      description: 'Point-in-time query failed due to data retention limits',
      symptoms: [
        'HTTP 404 Not Found for historical queries',
        'Message: "Data not available for requested date"',
        'Audit timeline shows gaps'
      ],
      causes: [
        'Requested date outside retention period (7 years)',
        'Data archival job in progress',
        'Employee record created after requested date'
      ],
      resolution: [
        'Verify requested date is within 7-year retention window',
        'Check employee creation date',
        'If data archival in progress, retry in 1 hour',
        'Contact support for data restoration from cold storage'
      ],
      preventionSteps: [
        'Document data retention policies',
        'Run regular backup verification',
        'Monitor archival job health',
        'Keep critical historical exports offline'
      ],
      retryLogic: 'No automatic retry. Verify date range and contact support if data should exist.',
      escalation: 'Data restoration from cold storage requires support ticket (24-48hr SLA)'
    }
  ];

  const filteredModes = selectedCategory === 'all' 
    ? failureModes 
    : failureModes.filter(m => m.category === selectedCategory);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="flex items-center gap-4">
          <Link href="/admin/integrations" className="text-slate-600 hover:text-slate-900">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Failure Modes & Error Handling</h1>
            <p className="text-sm text-slate-600">Complete troubleshooting guide for IT administrators</p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Critical Notice */}
        <div className="mb-8 p-6 bg-red-50 border-2 border-red-200 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h2 className="text-lg font-bold text-red-900 mb-2">Critical: Failure Impact on Compliance</h2>
              <p className="text-sm text-red-800 mb-3">
                Integration failures do NOT bypass enforcement logic. If certification data fails to import, 
                employees will remain blocked until data is corrected and successfully imported.
              </p>
              <ul className="text-sm text-red-800 space-y-1">
                <li>• <strong>NO automatic fallback to "approved" status</strong></li>
                <li>• <strong>NO manual override of blocked status without valid data</strong></li>
                <li>• <strong>System defaults to SAFE (blocked) on any data uncertainty</strong></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Retry Logic Summary */}
        <div className="mb-8 p-6 bg-blue-50 border-2 border-blue-200 rounded-lg">
          <div className="flex items-start gap-3">
            <RefreshCw className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h2 className="text-lg font-bold text-blue-900 mb-2">General Retry Logic</h2>
              <div className="text-sm text-blue-800 space-y-2">
                <p><strong>Automatic Retries (System):</strong></p>
                <ul className="ml-4 space-y-1">
                  <li>• 5xx errors: Exponential backoff (2s, 4s, 8s, 16s, 32s)</li>
                  <li>• 429 rate limits: Wait Retry-After duration</li>
                  <li>• Network timeouts: 3 attempts with jitter</li>
                  <li>• Database deadlocks: 3 immediate retries</li>
                </ul>
                <p className="mt-3"><strong>Manual Retries Required:</strong></p>
                <ul className="ml-4 space-y-1">
                  <li>• 4xx client errors (bad data/validation)</li>
                  <li>• 401 authentication failures</li>
                  <li>• Webhook delivery failures (after 5 auto-retries)</li>
                  <li>• Quarantined import records</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-6 flex items-center gap-2 border-b border-slate-200">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 font-semibold transition-colors ${
              selectedCategory === 'all'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All ({failureModes.length})
          </button>
          <button
            onClick={() => setSelectedCategory('api')}
            className={`px-4 py-2 font-semibold transition-colors ${
              selectedCategory === 'api'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            API ({failureModes.filter(m => m.category === 'api').length})
          </button>
          <button
            onClick={() => setSelectedCategory('integration')}
            className={`px-4 py-2 font-semibold transition-colors ${
              selectedCategory === 'integration'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Integrations ({failureModes.filter(m => m.category === 'integration').length})
          </button>
          <button
            onClick={() => setSelectedCategory('webhook')}
            className={`px-4 py-2 font-semibold transition-colors ${
              selectedCategory === 'webhook'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Webhooks ({failureModes.filter(m => m.category === 'webhook').length})
          </button>
          <button
            onClick={() => setSelectedCategory('database')}
            className={`px-4 py-2 font-semibold transition-colors ${
              selectedCategory === 'database'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Database ({failureModes.filter(m => m.category === 'database').length})
          </button>
        </div>

        {/* Failure Modes */}
        <div className="space-y-6">
          {filteredModes.map((mode) => (
            <div key={mode.id} className="p-6 bg-white border border-slate-200 rounded-lg">
              {/* Title */}
              <div className="flex items-start gap-3 mb-4">
                <XCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{mode.title}</h3>
                  <p className="text-sm text-slate-600">{mode.description}</p>
                </div>
                <span className={`ml-auto px-3 py-1 rounded text-xs font-bold ${
                  mode.category === 'api' ? 'bg-blue-100 text-blue-900' :
                  mode.category === 'integration' ? 'bg-green-100 text-green-900' :
                  mode.category === 'webhook' ? 'bg-purple-100 text-purple-900' :
                  'bg-amber-100 text-amber-900'
                }`}>
                  {mode.category.toUpperCase()}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Symptoms */}
                <div>
                  <h4 className="text-sm font-bold text-slate-900 mb-2">🔍 Symptoms</h4>
                  <ul className="text-sm text-slate-700 space-y-1">
                    {mode.symptoms.map((symptom, i) => (
                      <li key={i}>• {symptom}</li>
                    ))}
                  </ul>
                </div>

                {/* Causes */}
                <div>
                  <h4 className="text-sm font-bold text-slate-900 mb-2">⚠️ Common Causes</h4>
                  <ul className="text-sm text-slate-700 space-y-1">
                    {mode.causes.map((cause, i) => (
                      <li key={i}>• {cause}</li>
                    ))}
                  </ul>
                </div>

                {/* Resolution */}
                <div>
                  <h4 className="text-sm font-bold text-slate-900 mb-2">✅ Resolution Steps</h4>
                  <ol className="text-sm text-slate-700 space-y-1">
                    {mode.resolution.map((step, i) => (
                      <li key={i}>{i + 1}. {step}</li>
                    ))}
                  </ol>
                </div>

                {/* Prevention */}
                <div>
                  <h4 className="text-sm font-bold text-slate-900 mb-2">🛡️ Prevention</h4>
                  <ul className="text-sm text-slate-700 space-y-1">
                    {mode.preventionSteps.map((step, i) => (
                      <li key={i}>• {step}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Retry Logic */}
              {mode.retryLogic && (
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded">
                  <div className="flex items-start gap-2">
                    <RefreshCw className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-bold text-blue-900 mb-1">Retry Logic</h4>
                      <p className="text-sm text-blue-800">{mode.retryLogic}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Escalation */}
              {mode.escalation && (
                <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-bold text-amber-900 mb-1">Escalation Path</h4>
                      <p className="text-sm text-amber-800">{mode.escalation}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Support Resources */}
        <div className="mt-8 p-6 bg-slate-100 rounded-lg">
          <h3 className="font-bold text-slate-900 mb-3">Need Help?</h3>
          <div className="space-y-2 text-sm">
            <p className="text-slate-700">
              <strong>IT Admin Support:</strong> <a href="mailto:it-support@trexaios.com" className="text-blue-600 hover:underline">it-support@trexaios.com</a>
            </p>
            <p className="text-slate-700">
              <strong>Emergency Hotline:</strong> 1-800-TREXAIOS (24/7 for production outages)
            </p>
            <p className="text-slate-700">
              <strong>Status Page:</strong> <a href="https://status.trexaios.com" className="text-blue-600 hover:underline">status.trexaios.com</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
