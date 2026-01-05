'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Key, Plus, Eye, EyeOff, Copy, Check, Trash2, AlertTriangle, Shield, Clock } from 'lucide-react';

/**
 * API KEY MANAGEMENT FOR IT ADMINISTRATORS
 * 
 * PURPOSE:
 * - Generate new API keys
 * - Rotate existing keys
 * - Revoke compromised keys
 * - Track key usage
 * 
 * SECURITY:
 * - Keys shown only once at creation
 * - Automatic expiration (90 days)
 * - Usage tracking per key
 * - Audit trail for all key operations
 */

interface APIKey {
  id: string;
  name: string;
  keyPrefix: string;
  createdAt: string;
  expiresAt: string;
  lastUsed: string | null;
  usageCount: number;
  status: 'active' | 'expired' | 'revoked';
  createdBy: string;
}

export default function APIKeysPage() {
  const [apiKeys, setApiKeys] = useState<APIKey[]>([
    {
      id: '1',
      name: 'HRIS Production Sync',
      keyPrefix: 'sk_prod_abc123...',
      createdAt: '2025-10-15T10:00:00Z',
      expiresAt: '2026-01-15T10:00:00Z',
      lastUsed: '2026-01-05T09:30:00Z',
      usageCount: 12487,
      status: 'active',
      createdBy: 'admin@company.com'
    },
    {
      id: '2',
      name: 'LMS Integration Key',
      keyPrefix: 'sk_prod_xyz789...',
      createdAt: '2025-11-01T14:30:00Z',
      expiresAt: '2026-02-01T14:30:00Z',
      lastUsed: '2026-01-05T08:15:00Z',
      usageCount: 3421,
      status: 'active',
      createdBy: 'it-admin@company.com'
    },
    {
      id: '3',
      name: 'Webhook Alerts (OLD)',
      keyPrefix: 'sk_prod_old456...',
      createdAt: '2025-08-20T16:00:00Z',
      expiresAt: '2025-11-20T16:00:00Z',
      lastUsed: '2025-11-18T22:45:00Z',
      usageCount: 8934,
      status: 'expired',
      createdBy: 'admin@company.com'
    }
  ]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [createdKey, setCreatedKey] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState(false);
  const [selectedKeyToRevoke, setSelectedKeyToRevoke] = useState<string | null>(null);

  const handleCreateKey = () => {
    if (!newKeyName.trim()) return;

    // Generate mock API key
    const generatedKey = `sk_prod_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
    setCreatedKey(generatedKey);

    // Add to keys list (with just prefix showing after creation)
    const newKey: APIKey = {
      id: String(apiKeys.length + 1),
      name: newKeyName,
      keyPrefix: `${generatedKey.substring(0, 15)}...`,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(), // 90 days
      lastUsed: null,
      usageCount: 0,
      status: 'active',
      createdBy: 'current-user@company.com'
    };

    setApiKeys([newKey, ...apiKeys]);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleRevokeKey = (keyId: string) => {
    setApiKeys(apiKeys.map(key => 
      key.id === keyId ? { ...key, status: 'revoked' as const } : key
    ));
    setSelectedKeyToRevoke(null);
  };

  const getDaysUntilExpiration = (expiresAt: string) => {
    const days = Math.ceil((new Date(expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return days;
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin/integrations" className="text-slate-600 hover:text-slate-900">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">API Key Management</h1>
              <p className="text-sm text-slate-600">Generate, rotate, and revoke API keys</p>
            </div>
          </div>
          <button
            onClick={() => {
              setShowCreateModal(true);
              setCreatedKey(null);
              setNewKeyName('');
            }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Create New Key
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Security Notice */}
        <div className="mb-8 p-6 bg-amber-50 border-2 border-amber-200 rounded-lg">
          <div className="flex items-start gap-3">
            <Shield className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <h2 className="text-lg font-bold text-amber-900 mb-2">API Key Security Best Practices</h2>
              <ul className="text-sm text-amber-800 space-y-1">
                <li>• <strong>Keys are shown only ONCE at creation</strong> - save immediately</li>
                <li>• <strong>Rotate keys every 90 days</strong> (automatic expiration enforced)</li>
                <li>• <strong>Use descriptive names</strong> to identify key purpose (e.g., "HRIS Prod Sync")</li>
                <li>• <strong>Revoke immediately</strong> if key is compromised or no longer needed</li>
                <li>• <strong>Never commit keys to version control</strong> - use environment variables</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Active Keys */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-slate-900 mb-4">
            Active Keys ({apiKeys.filter(k => k.status === 'active').length})
          </h2>

          <div className="space-y-4">
            {apiKeys.filter(k => k.status === 'active').map((key) => {
              const daysUntilExpiration = getDaysUntilExpiration(key.expiresAt);
              const isExpiringSoon = daysUntilExpiration <= 14;

              return (
                <div 
                  key={key.id}
                  className={`p-6 bg-white border rounded-lg ${
                    isExpiringSoon ? 'border-amber-300 bg-amber-50' : 'border-slate-200'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-blue-100 rounded-lg">
                        <Key className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-slate-900">{key.name}</h3>
                        <p className="text-sm font-mono text-slate-600">{key.keyPrefix}</p>
                      </div>
                    </div>

                    {isExpiringSoon && (
                      <div className="px-3 py-1 bg-amber-100 text-amber-900 text-xs font-bold rounded-full flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        EXPIRES IN {daysUntilExpiration}d
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-slate-600 mb-1">Created</p>
                      <p className="text-sm font-semibold text-slate-900">
                        {new Date(key.createdAt).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-slate-600">by {key.createdBy}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-600 mb-1">Expires</p>
                      <p className={`text-sm font-semibold ${
                        isExpiringSoon ? 'text-amber-600' : 'text-slate-900'
                      }`}>
                        {new Date(key.expiresAt).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-slate-600">{daysUntilExpiration} days remaining</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-600 mb-1">Last Used</p>
                      <p className="text-sm font-semibold text-slate-900">
                        {key.lastUsed ? new Date(key.lastUsed).toLocaleDateString() : 'Never'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-600 mb-1">Total Requests</p>
                      <p className="text-sm font-semibold text-slate-900">
                        {key.usageCount.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Link
                      href={`/admin/integrations/api-keys/${key.id}/usage`}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-900 font-semibold rounded-lg transition-colors text-sm"
                    >
                      View Usage
                    </Link>
                    <button
                      onClick={() => setSelectedKeyToRevoke(key.id)}
                      className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-900 font-semibold rounded-lg transition-colors text-sm flex items-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Revoke
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Expired/Revoked Keys */}
        {apiKeys.filter(k => k.status !== 'active').length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-4">
              Inactive Keys ({apiKeys.filter(k => k.status !== 'active').length})
            </h2>

            <div className="space-y-4">
              {apiKeys.filter(k => k.status !== 'active').map((key) => (
                <div 
                  key={key.id}
                  className="p-6 bg-white border border-slate-200 rounded-lg opacity-60"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-slate-100 rounded-lg">
                        <Key className="w-6 h-6 text-slate-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-slate-900">{key.name}</h3>
                        <p className="text-sm font-mono text-slate-600">{key.keyPrefix}</p>
                      </div>
                    </div>

                    <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                      key.status === 'expired' ? 'bg-slate-100 text-slate-900' : 'bg-red-100 text-red-900'
                    }`}>
                      {key.status.toUpperCase()}
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-4 gap-4">
                    <div>
                      <p className="text-xs text-slate-600 mb-1">Created</p>
                      <p className="text-sm font-semibold text-slate-900">
                        {new Date(key.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-600 mb-1">
                        {key.status === 'expired' ? 'Expired' : 'Revoked'}
                      </p>
                      <p className="text-sm font-semibold text-slate-900">
                        {new Date(key.expiresAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-600 mb-1">Last Used</p>
                      <p className="text-sm font-semibold text-slate-900">
                        {key.lastUsed ? new Date(key.lastUsed).toLocaleDateString() : 'Never'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-600 mb-1">Total Requests</p>
                      <p className="text-sm font-semibold text-slate-900">
                        {key.usageCount.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Create Key Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            {createdKey ? (
              // Show created key (ONLY ONCE)
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <Check className="w-6 h-6 text-green-600" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900">API Key Created</h2>
                </div>

                <div className="mb-6 p-6 bg-red-50 border-2 border-red-200 rounded-lg">
                  <div className="flex items-start gap-3 mb-4">
                    <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-bold text-red-900 mb-1">CRITICAL: Save This Key Now</h3>
                      <p className="text-sm text-red-800">
                        This is the <strong>only time</strong> you will see the full API key. 
                        Save it to a secure password manager immediately. We cannot recover it later.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <code className="flex-1 p-3 bg-white border border-red-300 rounded font-mono text-sm text-slate-900 overflow-x-auto">
                      {createdKey}
                    </code>
                    <button
                      onClick={() => copyToClipboard(createdKey)}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors flex items-center gap-2"
                    >
                      {copiedKey ? (
                        <>
                          <Check className="w-4 h-4" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          Copy
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded">
                  <h3 className="font-bold text-blue-900 mb-2">Next Steps</h3>
                  <ol className="text-sm text-blue-800 space-y-1">
                    <li>1. Save the API key to your password manager</li>
                    <li>2. Add it to your integration configuration</li>
                    <li>3. Test the integration with a simple API call</li>
                    <li>4. Set a calendar reminder for key rotation (88 days from now)</li>
                  </ol>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              // Create key form
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-4">Create New API Key</h2>

                <div className="mb-6">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Key Name (describe its purpose)
                  </label>
                  <input
                    type="text"
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                    placeholder="e.g., HRIS Production Sync, LMS Integration"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <p className="text-xs text-slate-600 mt-1">
                    Use a descriptive name to identify which integration uses this key
                  </p>
                </div>

                <div className="mb-6 p-4 bg-slate-50 border border-slate-200 rounded">
                  <h3 className="text-sm font-bold text-slate-900 mb-2">Key Details</h3>
                  <ul className="text-sm text-slate-700 space-y-1">
                    <li>• <strong>Expiration:</strong> 90 days from creation</li>
                    <li>• <strong>Rate Limit:</strong> 1,000 requests/hour</li>
                    <li>• <strong>Permissions:</strong> Read/Write access to compliance data</li>
                  </ul>
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="px-6 py-2 bg-slate-100 hover:bg-slate-200 text-slate-900 font-semibold rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateKey}
                    disabled={!newKeyName.trim()}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Generate Key
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Revoke Confirmation Modal */}
      {selectedKeyToRevoke && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-red-600" />
              <h2 className="text-xl font-bold text-slate-900">Revoke API Key?</h2>
            </div>

            <p className="text-sm text-slate-700 mb-6">
              This will immediately revoke the API key and stop all requests using it. 
              Any integrations using this key will fail until updated with a new key.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setSelectedKeyToRevoke(null)}
                className="px-6 py-2 bg-slate-100 hover:bg-slate-200 text-slate-900 font-semibold rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleRevokeKey(selectedKeyToRevoke)}
                className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors"
              >
                Revoke Key
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
