// components/EvidenceDrawer.tsx
'use client';

import React, { useEffect, useState } from 'react';

/**
 * EVIDENCE DRAWER COMPONENT
 * 
 * Read-only side drawer showing evidence node + ledger entries.
 * 
 * Features:
 * - Displays evidence metadata (entityType, entityId, actorType, timestamp)
 * - Shows chronological ledger entries
 * - No edit/delete controls (immutable)
 * - Slide-in from right
 * 
 * Used by: EvidenceLink, EvidenceTimeline
 */

interface EvidenceDrawerProps {
  evidenceNodeId: string;
  onClose: () => void;
}

interface EvidenceNode {
  id: string;
  entityType: string;
  entityId: string;
  actorType: string;
  actorId: string;
  timestamp: string;
  ledgerEntries: {
    id: string;
    eventType: string;
    payload: any;
    createdAt: string;
  }[];
}

export function EvidenceDrawer({ evidenceNodeId, onClose }: EvidenceDrawerProps) {
  const [evidence, setEvidence] = useState<EvidenceNode | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvidence() {
      try {
        const res = await fetch(`/api/evidence/${evidenceNodeId}`);
        if (res.ok) {
          const data = await res.json();
          setEvidence(data);
        }
      } catch (error) {
        console.error('[EvidenceDrawer] Failed to fetch evidence:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchEvidence();
  }, [evidenceNodeId]);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="absolute right-0 top-0 h-full w-full max-w-2xl bg-white shadow-xl">
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Evidence Node
              </h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
                type="button"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            {loading ? (
              <div className="text-gray-500">Loading evidence...</div>
            ) : evidence ? (
              <div className="space-y-6">
                {/* Metadata */}
                <div className="space-y-2">
                  <div className="text-xs text-gray-500 uppercase">Metadata</div>
                  <dl className="grid grid-cols-2 gap-2 text-sm">
                    <dt className="font-medium text-gray-700">Entity Type:</dt>
                    <dd className="text-gray-900">{evidence.entityType}</dd>
                    
                    <dt className="font-medium text-gray-700">Entity ID:</dt>
                    <dd className="text-gray-900 font-mono text-xs">{evidence.entityId}</dd>
                    
                    <dt className="font-medium text-gray-700">Actor:</dt>
                    <dd className="text-gray-900">{evidence.actorType}</dd>
                    
                    <dt className="font-medium text-gray-700">Timestamp:</dt>
                    <dd className="text-gray-900">{new Date(evidence.timestamp).toLocaleString()}</dd>
                  </dl>
                </div>

                {/* Ledger Entries */}
                <div className="space-y-2">
                  <div className="text-xs text-gray-500 uppercase">Ledger Entries (Immutable)</div>
                  <div className="space-y-3">
                    {evidence.ledgerEntries.map((entry) => (
                      <div key={entry.id} className="border-l-4 border-blue-500 bg-gray-50 p-3">
                        <div className="font-medium text-gray-900">{entry.eventType}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          {new Date(entry.createdAt).toLocaleString()}
                        </div>
                        <pre className="mt-2 text-xs bg-white p-2 rounded overflow-x-auto">
                          {JSON.stringify(entry.payload, null, 2)}
                        </pre>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-red-600">Evidence not found</div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 px-6 py-4">
            <div className="text-xs text-gray-500">
              ⚠️ This evidence is immutable and cannot be edited or deleted.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
