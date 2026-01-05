'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Code, Copy, Check, AlertTriangle, Key, Shield } from 'lucide-react';

/**
 * API DOCUMENTATION FOR IT ADMINISTRATORS
 * 
 * PURPOSE:
 * - Complete API reference
 * - Authentication examples
 * - Error handling guide
 * - Rate limiting documentation
 * 
 * APPROVAL BLOCKER RESOLUTION:
 * - "No API documentation" → Comprehensive API docs with examples
 * - "No failure behavior defined" → Error codes, retry logic, failure modes
 */

interface Endpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  description: string;
  authRequired: boolean;
  parameters?: { name: string; type: string; required: boolean; description: string }[];
  requestExample?: string;
  responseExample?: string;
  errorCodes?: { code: number; message: string; meaning: string }[];
}

export default function APIDocsPage() {
  const [copiedEndpoint, setCopiedEndpoint] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('employees');

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedEndpoint(id);
    setTimeout(() => setCopiedEndpoint(null), 2000);
  };

  const endpoints: Record<string, Endpoint[]> = {
    employees: [
      {
        method: 'GET',
        path: '/api/v1/employees',
        description: 'List all employee records with compliance status',
        authRequired: true,
        parameters: [
          { name: 'page', type: 'integer', required: false, description: 'Page number (default: 1)' },
          { name: 'limit', type: 'integer', required: false, description: 'Results per page (default: 50, max: 500)' },
          { name: 'status', type: 'string', required: false, description: 'Filter by status: compliant, blocked, expiring' }
        ],
        requestExample: `curl -X GET "https://api.trexaios.com/api/v1/employees?status=blocked&limit=100" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json"`,
        responseExample: `{
  "data": [
    {
      "id": "EMP-2401",
      "name": "John Smith",
      "status": "blocked",
      "blockingReasons": ["OSHA 10 Expired"],
      "lastUpdated": "2026-01-05T10:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 100,
    "total": 1247
  }
}`,
        errorCodes: [
          { code: 401, message: 'Unauthorized', meaning: 'Invalid or missing API key' },
          { code: 429, message: 'Too Many Requests', meaning: 'Rate limit exceeded (max 1000/hour)' },
          { code: 500, message: 'Internal Server Error', meaning: 'Server error - retry with exponential backoff' }
        ]
      },
      {
        method: 'GET',
        path: '/api/v1/employees/:id',
        description: 'Get detailed employee record with full certification history',
        authRequired: true,
        parameters: [
          { name: 'id', type: 'string', required: true, description: 'Employee ID (e.g., EMP-2401)' }
        ],
        requestExample: `curl -X GET "https://api.trexaios.com/api/v1/employees/EMP-2401" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json"`,
        responseExample: `{
  "id": "EMP-2401",
  "name": "John Smith",
  "status": "compliant",
  "certifications": [
    {
      "type": "OSHA 10",
      "status": "valid",
      "issueDate": "2025-06-15",
      "expirationDate": "2029-06-15"
    }
  ],
  "auditTrail": [
    {
      "eventType": "certification_added",
      "timestamp": "2025-06-15T14:30:00Z",
      "performedBy": "admin@company.com"
    }
  ]
}`
      }
    ],
    certifications: [
      {
        method: 'POST',
        path: '/api/v1/certifications',
        description: 'Add new certification record (INBOUND INTEGRATION)',
        authRequired: true,
        parameters: [
          { name: 'employeeId', type: 'string', required: true, description: 'Employee ID' },
          { name: 'certificationType', type: 'string', required: true, description: 'Certification type (must match preset)' },
          { name: 'issueDate', type: 'string', required: true, description: 'ISO 8601 date' },
          { name: 'expirationDate', type: 'string', required: true, description: 'ISO 8601 date' },
          { name: 'issuingAuthority', type: 'string', required: true, description: 'Issuing organization' },
          { name: 'certificateNumber', type: 'string', required: false, description: 'Certificate ID from issuer' }
        ],
        requestExample: `curl -X POST "https://api.trexaios.com/api/v1/certifications" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "employeeId": "EMP-2401",
    "certificationType": "OSHA 10",
    "issueDate": "2025-06-15",
    "expirationDate": "2029-06-15",
    "issuingAuthority": "OSHA Training Institute",
    "certificateNumber": "OSHA-123456"
  }'`,
        responseExample: `{
  "id": "CERT-9876",
  "status": "active",
  "createdAt": "2026-01-05T10:30:00Z",
  "auditEntry": {
    "id": "AUDIT-45678",
    "action": "certification_added",
    "performedBy": "api-key:hris-prod-key",
    "timestamp": "2026-01-05T10:30:00Z"
  }
}`,
        errorCodes: [
          { code: 400, message: 'Bad Request', meaning: 'Missing required fields or invalid data format' },
          { code: 404, message: 'Not Found', meaning: 'Employee ID does not exist' },
          { code: 422, message: 'Unprocessable Entity', meaning: 'Certification type not in preset list' }
        ]
      }
    ],
    webhooks: [
      {
        method: 'POST',
        path: '/api/v1/webhooks/subscribe',
        description: 'Subscribe to compliance events (OUTBOUND INTEGRATION)',
        authRequired: true,
        parameters: [
          { name: 'url', type: 'string', required: true, description: 'Your webhook endpoint URL (must be HTTPS)' },
          { name: 'events', type: 'array', required: true, description: 'Event types: employee_blocked, certification_expired, compliance_violation' },
          { name: 'secret', type: 'string', required: false, description: 'Webhook signing secret (recommended)' }
        ],
        requestExample: `curl -X POST "https://api.trexaios.com/api/v1/webhooks/subscribe" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "url": "https://your-company.com/webhooks/compliance",
    "events": ["employee_blocked", "certification_expired"],
    "secret": "your_webhook_secret_key"
  }'`,
        responseExample: `{
  "webhookId": "WH-12345",
  "status": "active",
  "verificationRequired": true,
  "verificationToken": "verify_abc123xyz"
}`
      }
    ]
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="flex items-center gap-4 mb-2">
          <Link href="/admin/integrations" className="text-slate-600 hover:text-slate-900">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">API Documentation</h1>
            <p className="text-sm text-slate-600">Complete REST API reference for integrations</p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Authentication Section */}
        <section className="mb-8 p-6 bg-blue-50 border-2 border-blue-200 rounded-lg">
          <div className="flex items-start gap-3 mb-4">
            <Key className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h2 className="text-lg font-bold text-blue-900 mb-2">Authentication</h2>
              <p className="text-sm text-blue-800 mb-3">
                All API requests require a valid API key in the <code className="px-2 py-1 bg-blue-100 rounded">Authorization</code> header:
              </p>
              <div className="p-4 bg-white rounded border border-blue-200">
                <code className="text-sm text-slate-900">
                  Authorization: Bearer YOUR_API_KEY
                </code>
              </div>
              <p className="text-sm text-blue-800 mt-3">
                <Link href="/admin/integrations/api-keys" className="font-semibold underline">
                  Manage your API keys →
                </Link>
              </p>
            </div>
          </div>
        </section>

        {/* Rate Limiting */}
        <section className="mb-8 p-6 bg-amber-50 border-2 border-amber-200 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <h2 className="text-lg font-bold text-amber-900 mb-2">Rate Limiting</h2>
              <ul className="text-sm text-amber-800 space-y-1">
                <li>• <strong>1,000 requests/hour</strong> per API key</li>
                <li>• <strong>429 Too Many Requests</strong> response when limit exceeded</li>
                <li>• <strong>Retry-After</strong> header indicates seconds until reset</li>
                <li>• <strong>Exponential backoff</strong> recommended for retries</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Category Tabs */}
        <div className="mb-6 flex items-center gap-2 border-b border-slate-200">
          {Object.keys(endpoints).map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 font-semibold capitalize transition-colors ${
                selectedCategory === category
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Endpoints */}
        <div className="space-y-8">
          {endpoints[selectedCategory]?.map((endpoint, index) => (
            <div key={index} className="p-6 bg-white border border-slate-200 rounded-lg">
              {/* Method + Path */}
              <div className="flex items-center gap-3 mb-4">
                <span className={`px-3 py-1 rounded font-bold text-sm ${
                  endpoint.method === 'GET' ? 'bg-blue-100 text-blue-900' :
                  endpoint.method === 'POST' ? 'bg-green-100 text-green-900' :
                  endpoint.method === 'PUT' ? 'bg-amber-100 text-amber-900' :
                  'bg-red-100 text-red-900'
                }`}>
                  {endpoint.method}
                </span>
                <code className="text-lg font-mono text-slate-900">{endpoint.path}</code>
                {endpoint.authRequired && (
                  <span className="ml-auto px-2 py-1 bg-slate-100 text-slate-700 text-xs font-semibold rounded">
                    🔒 Auth Required
                  </span>
                )}
              </div>

              <p className="text-sm text-slate-700 mb-4">{endpoint.description}</p>

              {/* Parameters */}
              {endpoint.parameters && endpoint.parameters.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-sm font-bold text-slate-900 mb-2">Parameters</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-slate-50">
                        <tr>
                          <th className="px-3 py-2 text-left font-semibold text-slate-700">Name</th>
                          <th className="px-3 py-2 text-left font-semibold text-slate-700">Type</th>
                          <th className="px-3 py-2 text-left font-semibold text-slate-700">Required</th>
                          <th className="px-3 py-2 text-left font-semibold text-slate-700">Description</th>
                        </tr>
                      </thead>
                      <tbody>
                        {endpoint.parameters.map((param, i) => (
                          <tr key={i} className="border-t border-slate-200">
                            <td className="px-3 py-2 font-mono text-blue-600">{param.name}</td>
                            <td className="px-3 py-2 text-slate-600">{param.type}</td>
                            <td className="px-3 py-2">
                              <span className={`px-2 py-1 rounded text-xs font-semibold ${
                                param.required ? 'bg-red-100 text-red-900' : 'bg-slate-100 text-slate-700'
                              }`}>
                                {param.required ? 'Required' : 'Optional'}
                              </span>
                            </td>
                            <td className="px-3 py-2 text-slate-700">{param.description}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Request Example */}
              {endpoint.requestExample && (
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-bold text-slate-900">Request Example</h3>
                    <button
                      onClick={() => copyToClipboard(endpoint.requestExample!, `request-${index}`)}
                      className="flex items-center gap-2 px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded text-sm transition-colors"
                    >
                      {copiedEndpoint === `request-${index}` ? (
                        <>
                          <Check className="w-4 h-4 text-green-600" />
                          <span className="text-green-600">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="p-4 bg-slate-900 text-slate-100 rounded overflow-x-auto text-sm">
                    <code>{endpoint.requestExample}</code>
                  </pre>
                </div>
              )}

              {/* Response Example */}
              {endpoint.responseExample && (
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-bold text-slate-900">Response Example (200 OK)</h3>
                    <button
                      onClick={() => copyToClipboard(endpoint.responseExample!, `response-${index}`)}
                      className="flex items-center gap-2 px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded text-sm transition-colors"
                    >
                      {copiedEndpoint === `response-${index}` ? (
                        <>
                          <Check className="w-4 h-4 text-green-600" />
                          <span className="text-green-600">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="p-4 bg-slate-900 text-slate-100 rounded overflow-x-auto text-sm">
                    <code>{endpoint.responseExample}</code>
                  </pre>
                </div>
              )}

              {/* Error Codes */}
              {endpoint.errorCodes && endpoint.errorCodes.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-slate-900 mb-2">Error Codes</h3>
                  <div className="space-y-2">
                    {endpoint.errorCodes.map((error, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 bg-red-50 border border-red-200 rounded">
                        <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-mono text-sm font-bold text-red-900">
                            {error.code} {error.message}
                          </p>
                          <p className="text-sm text-red-800">{error.meaning}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer Links */}
        <div className="mt-8 p-6 bg-slate-100 rounded-lg">
          <h3 className="font-bold text-slate-900 mb-3">Additional Resources</h3>
          <div className="space-y-2 text-sm">
            <Link href="/admin/integrations/failure-modes" className="block text-blue-600 hover:underline">
              → Failure Modes & Error Handling
            </Link>
            <Link href="/admin/integrations/api-keys" className="block text-blue-600 hover:underline">
              → Manage API Keys
            </Link>
            <Link href="/admin/integrations/security" className="block text-blue-600 hover:underline">
              → Security Best Practices
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
