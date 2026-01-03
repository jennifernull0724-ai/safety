// components/StatusBadge.tsx
import React from 'react';

/**
 * STATUS BADGE COMPONENT
 * 
 * Displays certification/enforcement status with semantic colors.
 * 
 * Rules:
 * - Color is immutable (semantic, not themeable)
 * - Tooltip shows "Evaluated at {timestamp}"
 * - Used for: Certifications, Enforcement Actions, QR status
 * 
 * Figma Spec: Section 1.2 - StatusBadge
 */

export type StatusType = 'PASS' | 'FAIL' | 'INCOMPLETE' | 'valid' | 'expiring' | 'expired' | 'revoked' | 'blocked';

interface StatusBadgeProps {
  status: StatusType;
  timestamp?: Date | string;
  className?: string;
}

const STATUS_CONFIG = {
  PASS: {
    color: 'bg-status-valid',
    label: 'PASS',
  },
  valid: {
    color: 'bg-status-valid',
    label: 'VALID',
  },
  expiring: {
    color: 'bg-status-expiring',
    label: 'EXPIRING',
  },
  INCOMPLETE: {
    color: 'bg-status-expiring',
    label: 'INCOMPLETE',
  },
  expired: {
    color: 'bg-status-expired',
    label: 'EXPIRED',
  },
  FAIL: {
    color: 'bg-status-expired',
    label: 'FAIL',
  },
  revoked: {
    color: 'bg-status-revoked',
    label: 'REVOKED',
  },
  blocked: {
    color: 'bg-status-blocked',
    label: 'BLOCKED',
  },
} as const;

export function StatusBadge({ status, timestamp, className = '' }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status];
  
  if (!config) {
    console.error(`[StatusBadge] Invalid status: ${status}`);
    return null;
  }

  const formattedTimestamp = timestamp 
    ? new Date(timestamp).toLocaleString()
    : null;

  return (
    <span
      className={`
        inline-flex items-center
        px-2 py-1
        rounded-full
        text-xs font-medium
        text-white
        ${config.color}
        ${className}
      `}
      title={formattedTimestamp ? `Evaluated at ${formattedTimestamp}` : undefined}
    >
      {config.label}
    </span>
  );
}
