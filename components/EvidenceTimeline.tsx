// components/EvidenceTimeline.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { EvidenceLink } from './EvidenceLink';

/**
 * EVIDENCE TIMELINE COMPONENT
 * 
 * Renders chronological vertical timeline of evidence nodes.
 * 
 * Props:
 * - evidenceNodeIds: Array of evidence node UUIDs
 * 
 * Renders:
 * - Chronological vertical timeline
 * - Icon per evidence type
 * - Clickable evidence links
 * 
 * Used by:
 * - Employee profiles
 * - Audit vault
 * - Incident timelines
 * 
 * Figma Spec: Section 1.2 - EvidenceTimeline
 */

interface EvidenceTimelineProps {
  evidenceNodeIds: string[];
  className?: string;
}

interface EvidenceNode {
  id: string;
  entityType: string;
  actorType: string;
  timestamp: string;
  ledgerEntries: { eventType: string }[];
}

const ENTITY_TYPE_ICONS: Record<string, string> = {
  Certification: '📜',
  VerificationEvent: '✅',
  JHAAcknowledgment: '📋',
  WorkWindow: '⏰',
  Incident: '⚠️',
  EnforcementAction: '🚫',
  AuditCase: '🔍',
  FieldLog: '📝',
  default: '📌',
};

export function EvidenceTimeline({ evidenceNodeIds, className = '' }: EvidenceTimelineProps) {
  const [evidence, setEvidence] = useState<EvidenceNode[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvidence() {
      try {
        const promises = evidenceNodeIds.map(id =>
          fetch(`/api/evidence/${id}`).then(res => res.ok ? res.json() : null)
        );
        const results = await Promise.all(promises);
        const validResults = results.filter(Boolean) as EvidenceNode[];
        
        // Sort chronologically (newest first)
        validResults.sort((a, b) => 
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
        
        setEvidence(validResults);
      } catch (error) {
        console.error('[EvidenceTimeline] Failed to fetch evidence:', error);
      } finally {
        setLoading(false);
      }
    }

    if (evidenceNodeIds.length > 0) {
      fetchEvidence();
    } else {
      setLoading(false);
    }
  }, [evidenceNodeIds]);

  if (loading) {
    return <div className="text-gray-500 text-sm">Loading evidence timeline...</div>;
  }

  if (evidence.length === 0) {
    return <div className="text-gray-500 text-sm">No evidence recorded</div>;
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {evidence.map((node, index) => {
        const icon = ENTITY_TYPE_ICONS[node.entityType] || ENTITY_TYPE_ICONS.default;
        const eventType = node.ledgerEntries[0]?.eventType || 'Unknown event';
        
        return (
          <div key={node.id} className="relative flex gap-4">
            {/* Timeline line */}
            {index < evidence.length - 1 && (
              <div className="absolute left-4 top-8 bottom-0 w-0.5 bg-gray-300" />
            )}

            {/* Icon */}
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-lg z-10">
              {icon}
            </div>

            {/* Content */}
            <div className="flex-1 pb-4">
              <div className="flex items-baseline gap-2">
                <EvidenceLink
                  evidenceNodeId={node.id}
                  label={eventType}
                />
                <span className="text-xs text-gray-500">
                  by {node.actorType}
                </span>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {new Date(node.timestamp).toLocaleString()}
              </div>
              <div className="text-sm text-gray-700 mt-1">
                {node.entityType}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
