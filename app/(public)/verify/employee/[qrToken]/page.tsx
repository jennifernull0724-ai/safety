'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  ShieldOff,
  User,
  Building2,
  FileCheck,
  Clock,
  AlertTriangle,
  Lock,
  Printer,
  CheckCircle
} from 'lucide-react';

/**
 * PUBLIC QR VERIFICATION PAGE (READ-ONLY)
 * 
 * STRICTLY READ-ONLY - NO AUTHENTICATION REQUIRED
 * 
 * Used by:
 * - Railroads
 * - Inspectors
 * - Emergency responders
 * - Regulators
 * 
 * NO MODIFICATIONS ALLOWED
 * NO CLIENT-SIDE VERIFICATION LOGGING
 * 
 * ENFORCEMENT:
 * - Middleware blocks all non-GET requests
 * - No mutation paths in UI
 * - All data fetched read-only from server
 */

const statusConfig: any = {
  compliant: {
    label: 'VERIFIED',
    sublabel: 'Authorized to work',
    icon: ShieldCheck,
    color: 'emerald'
  },
  non_compliant: {
    label: 'NON-COMPLIANT',
    sublabel: 'Review required',
    icon: ShieldAlert,
    color: 'amber'
  },
  pending: {
    label: 'PENDING',
    sublabel: 'Verification in progress',
    icon: Shield,
    color: 'blue'
  },
  blocked: {
    label: 'BLOCKED',
    sublabel: 'Work authorization suspended',
    icon: ShieldOff,
    color: 'red'
  }
};

// Format timestamp with explicit UTC timezone
function formatTimestampUTC(dateString: string): string {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'UTC',
    timeZoneName: 'short'
  };
  return date.toLocaleString('en-US', options);
}

export default function QRVerification() {
  const params = useParams();
  const searchParams = useSearchParams();
  
  // Support both route params and query params
  const qrCode = (params?.qrToken as string) || searchParams?.get('code');

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (qrCode) {
      loadVerificationData();
    }
  }, [qrCode]);

  const loadVerificationData = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/qr/verify?code=${qrCode}`);
      if (!res.ok) {
        throw new Error('Invalid QR code');
      }
      const json = await res.json();
      setData(json);
    } catch (err: any) {
      setError(err.message || 'Failed to verify');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (!qrCode) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-amber-400 mx-auto mb-4" />
          <p>No QR code provided</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="h-64 w-full max-w-md bg-slate-800/50 rounded-2xl animate-pulse" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="text-center">
          <ShieldOff className="w-14 h-14 text-red-400 mx-auto mb-4" />
          <h1 className="text-xl font-bold mb-2">Verification Failed</h1>
          <p className="text-slate-400">{error || 'Invalid QR code'}</p>
        </div>
      </div>
    );
  }

  const { employee, certifications, verification_status, verified_at } = data;
  const status = statusConfig[verification_status] || statusConfig.pending;
  const StatusIcon = status.icon;

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-md mx-auto space-y-6">
        {/* OFFICIAL READ-ONLY BANNER */}
        <div className="bg-blue-900/20 border-2 border-blue-500/50 rounded-lg p-4 print:border-black print:bg-white">
          <div className="flex items-start gap-3">
            <Lock className="w-6 h-6 text-blue-400 flex-shrink-0 print:text-black" />
            <div>
              <p className="font-bold text-white text-sm mb-1 print:text-black">
                OFFICIAL READ-ONLY COMPLIANCE RECORD — NOT EDITABLE
              </p>
              <p className="text-xs text-blue-200 print:text-gray-700">
                This record reflects the compliance state as recorded at the time shown below.
              </p>
            </div>
          </div>
        </div>

        {/* Header */}
        <div className="text-center print:mb-4">
          <img src="/trex-logo.png" alt="T-REX Compliance System" className="h-12 w-auto mx-auto mb-3" />
          <h1 className="font-semibold">T-REX Compliance System</h1>
          <p className="text-xs text-slate-500 print:text-gray-600">QR Verification</p>
        </div>

        {/* Status Banner */}
        <div className="rounded-2xl bg-slate-800/50 border border-slate-700 p-6 text-center print:border-gray-300 print:bg-white">
          <StatusIcon className={`w-16 h-16 mx-auto mb-4 text-${status.color}-400 print:text-gray-700`} />
          <h2 className="text-2xl font-bold print:text-black">{status.label}</h2>
          <p className="text-slate-400 print:text-gray-600">{status.sublabel}</p>
          {verified_at && (
            <div className="mt-4 p-3 bg-slate-900/50 rounded border border-slate-600 print:border-gray-300 print:bg-gray-50">
              <p className="text-sm text-slate-300 font-medium print:text-black">
                Verified: {formatTimestampUTC(verified_at)}
              </p>
              <p className="text-xs text-slate-500 mt-1 print:text-gray-600">
                All timestamps are recorded and displayed in Coordinated Universal Time (UTC)
              </p>
            </div>
          )}
        </div>

        {/* Employee Card */}
        <div className="rounded-2xl bg-slate-800/50 border border-slate-700 p-6 print:border-gray-300 print:bg-white">
          <div className="flex gap-4">
            <div className="w-16 h-16 rounded-xl bg-slate-700 flex items-center justify-center overflow-hidden print:border print:border-gray-300">
              {employee.photo_url ? (
                <img src={employee.photo_url} className="w-full h-full object-cover" alt="Employee" />
              ) : (
                <User className="w-8 h-8 text-slate-500 print:text-gray-400" />
              )}
            </div>
            <div>
              <h3 className="text-lg font-bold print:text-black">{employee.full_name || `${employee.firstName} ${employee.lastName}`}</h3>
              <p className="text-slate-400 print:text-gray-600">{employee.employee_id}</p>
              <div className="flex items-center gap-2 text-sm mt-2">
                <Building2 className="w-4 h-4" />
                <span className="print:text-black">{employee.employer}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Certifications (IMAGES REQUIRED) */}
        <div className="rounded-2xl bg-slate-800/50 border border-slate-700 p-6 print:border-gray-300 print:bg-white">
          <h3 className="font-semibold flex items-center gap-2 mb-4 print:text-black">
            <FileCheck className="w-5 h-5 text-blue-400 print:text-gray-700" />
            Certifications
          </h3>

          {certifications.length === 0 ? (
            <p className="text-sm text-slate-500 print:text-gray-600">No certifications on file</p>
          ) : (
            <div className="space-y-4">
              {certifications.map((c: any) => (
                <div
                  key={c.id}
                  className="p-4 rounded-xl bg-slate-700/30 border border-slate-700 print:border-gray-300 print:bg-gray-50"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="font-medium print:text-black">{c.certification_type || c.certificationType}</p>
                      {(c.expiration_date || c.expirationDate) && (
                        <p className="text-xs text-slate-500 mt-1 print:text-gray-600">
                          Expires {new Date(c.expiration_date || c.expirationDate).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium print:border print:border-gray-400 print:bg-white print:text-black ${
                      c.status === 'valid' || c.status === 'PASS' ? 'bg-green-900/30 text-green-300' :
                      c.status === 'INCOMPLETE' ? 'bg-yellow-900/30 text-yellow-300' :
                      'bg-red-900/30 text-red-300'
                    }`}>
                      {c.status}
                    </span>
                  </div>

                  {/* CERTIFICATION IMAGE — MANDATORY */}
                  {c.image_url ? (
                    <div>
                      <img
                        src={c.image_url}
                        alt={c.certification_type || c.certificationType}
                        className="w-full rounded-lg border border-slate-600 mt-3 print:border-gray-300"
                      />
                      {c.uploaded_at && (
                        <p className="text-xs text-slate-500 mt-2 print:text-gray-600">
                          Uploaded by authorized organization user on {new Date(c.uploaded_at).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="mt-3 p-4 bg-slate-800/50 rounded-lg border border-slate-600 text-center print:border-gray-300 print:bg-gray-100">
                      <p className="text-xs text-slate-500 italic print:text-gray-600">
                        No certification image on file
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Print Button */}
        <button
          onClick={handlePrint}
          className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors print:hidden"
        >
          <Printer className="w-5 h-5" />
          Print Official Verification
        </button>

        {/* Read-only Notice */}
        <div className="rounded-xl bg-slate-800/30 border border-slate-700 p-4 print:border-gray-300 print:bg-gray-50">
          <div className="flex gap-3">
            <Lock className="w-5 h-5 text-slate-500 flex-shrink-0 print:text-gray-600" />
            <div>
              <p className="text-xs text-slate-400 print:text-gray-700">
                This is a read-only verification page. This document is a read-only representation of a system-recorded compliance state.
              </p>
            </div>
          </div>
        </div>

        {/* Authenticity Notice */}
        <div className="text-center text-xs text-slate-500 print:text-gray-600 print:mt-8">
          <p>
            To verify authenticity, confirm this page is served from <strong className="text-slate-400 print:text-black">trexaios.com</strong> over a secure HTTPS connection.
          </p>
        </div>
      </div>
    </div>
  );
}
