// components/QRCodeCard.tsx
'use client';

import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { StatusBadge, StatusType } from './StatusBadge';

/**
 * QR CODE CARD COMPONENT
 * 
 * Displays QR code with status badge and legal notice.
 * 
 * Props:
 * - certificationId: UUID of certification
 * - status: Certification status
 * - qrToken: Raw QR token string
 * 
 * Displays:
 * - QR code (scannable)
 * - StatusBadge (semantic color)
 * - "Scan recorded on use" notice
 * 
 * Rules:
 * - Always show QR, even if revoked/expired
 * - QR scans are legal evidence
 * - Notice is non-optional
 * 
 * Figma Spec: Section 1.2 - QRCodeCard
 */

interface QRCodeCardProps {
  certificationId: string;
  status: StatusType;
  qrToken: string;
  className?: string;
}

export function QRCodeCard({ certificationId, status, qrToken, className = '' }: QRCodeCardProps) {
  const qrValue = `${process.env.NEXT_PUBLIC_APP_URL || 'https://app.systemofproof.com'}/verify/${qrToken}`;

  return (
    <div className={`
      flex flex-col items-center
      gap-4 p-5
      border border-gray-300 rounded-lg
      bg-white
      ${className}
    `}>
      {/* QR Code */}
      <div className="bg-white p-2 rounded">
        <QRCodeSVG
          value={qrValue}
          size={200}
          level="H"
          includeMargin={false}
        />
      </div>

      {/* Status Badge */}
      <StatusBadge status={status} />

      {/* Legal Notice */}
      <p className="text-xs text-gray-600 text-center max-w-xs">
        ⚠️ Scan is recorded at verification time. QR scans are legal evidence.
      </p>

      {/* Certification ID (for debugging) */}
      <p className="text-xs text-gray-400 font-mono">
        {certificationId.slice(0, 8)}...
      </p>
    </div>
  );
}
