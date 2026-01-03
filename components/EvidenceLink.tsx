// components/EvidenceLink.tsx
'use client';

import React, { useState } from 'react';
import { EvidenceDrawer } from './EvidenceDrawer';

/**
 * EVIDENCE LINK COMPONENT
 * 
 * Clickable link that opens read-only evidence drawer.
 * 
 * Props:
 * - evidenceNodeId: UUID of evidence node
 * - label: Display text (e.g., "QR Scan", "JHA Ack", "Enforcement Action")
 * 
 * Behavior:
 * - Opens read-only evidence drawer
 * - Shows evidence node + ledger entries
 * - Cannot edit or delete (immutable)
 * 
 * Figma Spec: Section 1.2 - EvidenceLink
 */

interface EvidenceLinkProps {
  evidenceNodeId: string;
  label: string;
  className?: string;
}

export function EvidenceLink({ evidenceNodeId, label, className = '' }: EvidenceLinkProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsDrawerOpen(true)}
        className={`
          text-blue-600 hover:text-blue-800
          underline
          text-sm
          cursor-pointer
          ${className}
        `}
        type="button"
      >
        {label}
      </button>

      {isDrawerOpen && (
        <EvidenceDrawer
          evidenceNodeId={evidenceNodeId}
          onClose={() => setIsDrawerOpen(false)}
        />
      )}
    </>
  );
}
