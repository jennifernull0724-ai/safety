'use client';

import { useState } from 'react';
import { AlertCircle, CheckCircle, Clock, FileText } from 'lucide-react';

interface CorrectionChainItem {
  id: string;
  certificationType: string;
  issuingAuthority: string;
  issueDate: Date;
  expirationDate: Date;
  status: string;
  createdAt: Date;
  isCorrected: boolean;
  correctedAt: Date | null;
  correctedByUserId: string | null;
  correctionReason: string | null;
}

interface CorrectionChainViewProps {
  certificationId: string;
  onCorrectionCreated?: () => void;
}

export default function CorrectionChainView({
  certificationId,
  onCorrectionCreated,
}: CorrectionChainViewProps) {
  const [chain, setChain] = useState<CorrectionChainItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [correctionReason, setCorrectionReason] = useState('');
  const [changes, setChanges] = useState<any>({});

  const loadChain = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/certifications/${certificationId}/correct`);
      if (res.ok) {
        const data = await res.json();
        setChain(data.chain);
      }
    } catch (error) {
      console.error('Failed to load correction chain:', error);
    } finally {
      setLoading(false);
    }
  };

  const createCorrection = async () => {
    if (!correctionReason.trim()) {
      alert('Correction reason is required');
      return;
    }

    try {
      const res = await fetch(`/api/certifications/${certificationId}/correct`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reason: correctionReason,
          changes,
        }),
      });

      if (res.ok) {
        alert('Correction created successfully');
        setShowCreateForm(false);
        setCorrectionReason('');
        setChanges({});
        loadChain();
        onCorrectionCreated?.();
      } else {
        const error = await res.json();
        alert(`Failed to create correction: ${error.error}`);
      }
    } catch (error) {
      console.error('Error creating correction:', error);
      alert('Failed to create correction');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Correction History
        </h3>
        <div className="flex gap-2">
          <button
            onClick={loadChain}
            disabled={loading}
            className="px-3 py-1 bg-slate-700 hover:bg-slate-600 rounded text-sm disabled:opacity-50"
          >
            {loading ? 'Loading...' : chain.length > 0 ? 'Refresh' : 'Load History'}
          </button>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="px-3 py-1 bg-blue-600 hover:bg-blue-500 rounded text-sm"
          >
            Create Correction
          </button>
        </div>
      </div>

      {/* Create Correction Form */}
      {showCreateForm && (
        <div className="p-4 bg-slate-800 border border-slate-700 rounded-lg">
          <h4 className="font-semibold mb-3">Create New Correction</h4>
          <div className="space-y-3">
            <div>
              <label className="block text-sm mb-1">Correction Reason (Required)</label>
              <textarea
                value={correctionReason}
                onChange={(e) => setCorrectionReason(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded"
                rows={3}
                placeholder="Describe why this certification is being corrected..."
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Changes (JSON format)</label>
              <textarea
                value={JSON.stringify(changes, null, 2)}
                onChange={(e) => {
                  try {
                    setChanges(JSON.parse(e.target.value));
                  } catch {
                    // Invalid JSON, ignore
                  }
                }}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded font-mono text-xs"
                rows={6}
                placeholder='{"expirationDate": "2025-12-31T00:00:00.000Z"}'
              />
              <p className="text-xs text-slate-400 mt-1">
                Specify fields to update: certificationType, issuingAuthority, issueDate, expirationDate, status
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={createCorrection}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded font-medium"
              >
                Create Correction
              </button>
              <button
                onClick={() => setShowCreateForm(false)}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Correction Chain Display */}
      {chain.length > 0 && (
        <div className="space-y-3">
          <div className="bg-blue-900/20 border border-blue-800/50 rounded p-3 text-sm">
            <p className="text-blue-300">
              <strong>Correction chain contains {chain.length} version(s).</strong> Original records remain visible.
              All versions are preserved for audit trail.
            </p>
          </div>

          {chain.map((version, idx) => {
            const isCurrent = idx === chain.length - 1;
            const isOriginal = idx === 0;

            return (
              <div
                key={version.id}
                className={`p-4 rounded-lg border ${
                  isCurrent
                    ? 'bg-emerald-900/20 border-emerald-800/50'
                    : version.isCorrected
                    ? 'bg-amber-900/20 border-amber-800/50'
                    : 'bg-slate-800/50 border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="font-semibold flex items-center gap-2">
                      Version {idx + 1}
                      {isCurrent && (
                        <span className="text-xs bg-emerald-600 text-white px-2 py-0.5 rounded-full">
                          Current
                        </span>
                      )}
                      {isOriginal && (
                        <span className="text-xs bg-slate-600 text-white px-2 py-0.5 rounded-full">
                          Original
                        </span>
                      )}
                      {version.isCorrected && !isCurrent && (
                        <span className="text-xs bg-amber-600 text-white px-2 py-0.5 rounded-full">
                          Corrected
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-400 mt-1">
                      Created: {new Date(version.createdAt).toLocaleString()}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-slate-400">Type:</span>{' '}
                    <span className="font-medium">{version.certificationType}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Issuer:</span>{' '}
                    <span className="font-medium">{version.issuingAuthority}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Issued:</span>{' '}
                    <span className="font-medium">
                      {new Date(version.issueDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400">Expires:</span>{' '}
                    <span className="font-medium">
                      {new Date(version.expirationDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400">Status:</span>{' '}
                    <span className="font-medium">{version.status}</span>
                  </div>
                </div>

                {version.correctionReason && (
                  <div className="mt-3 p-2 bg-amber-900/30 border border-amber-800/50 rounded text-sm">
                    <div className="text-amber-300 font-semibold mb-1">Correction Reason:</div>
                    <div className="text-amber-200">{version.correctionReason}</div>
                    {version.correctedAt && (
                      <div className="text-xs text-amber-400 mt-1">
                        Corrected at: {new Date(version.correctedAt).toLocaleString()}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {chain.length === 0 && !loading && (
        <div className="p-4 bg-slate-800/50 border border-slate-700 rounded text-center text-slate-400">
          No correction history. Click "Load History" to check for corrections.
        </div>
      )}
    </div>
  );
}
