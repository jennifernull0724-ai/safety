'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  Shield,
  ArrowLeft,
  User,
  Building2,
  Mail,
  Phone,
  QrCode,
  FileCheck,
  AlertTriangle,
  Clock,
  Ban,
  CheckCircle2,
  Copy,
  ExternalLink
} from 'lucide-react';

const statusConfig: any = {
  compliant: { label: 'Compliant', icon: Shield, color: 'emerald' },
  non_compliant: { label: 'Non-Compliant', icon: AlertTriangle, color: 'amber' },
  pending: { label: 'Pending Verification', icon: Clock, color: 'blue' },
  blocked: { label: 'Blocked', icon: Ban, color: 'red' },
  active: { label: 'Active', icon: Shield, color: 'emerald' },
  inactive: { label: 'Inactive', icon: Clock, color: 'gray' }
};

const industryLabels: any = {
  railroad: 'Railroad',
  construction: 'Construction',
  environmental: 'Environmental',
  general: 'General'
};

export default function EmployeeDetail() {
  const params = useParams();
  const employeeId = params?.id as string;

  const [employee, setEmployee] = useState<any>(null);
  const [certifications, setCertifications] = useState<any[]>([]);
  const [verifications, setVerifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [recording, setRecording] = useState(false);

  useEffect(() => {
    if (!employeeId) return;

    const loadData = async () => {
      try {
        const [empRes, certRes, verRes] = await Promise.all([
          fetch(`/api/employees/${employeeId}`),
          fetch(`/api/employees/${employeeId}/certifications`),
          fetch(`/api/employees/${employeeId}/verifications`)
        ]);

        if (empRes.ok) setEmployee(await empRes.json());
        if (certRes.ok) setCertifications(await certRes.json());
        if (verRes.ok) setVerifications(await verRes.json());
      } catch (err) {
        console.error('Failed to load employee data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [employeeId]);

  const recordVerification = async () => {
    setRecording(true);
    try {
      const res = await fetch(`/api/employees/${employeeId}/verifications`, {
        method: 'POST'
      });
      if (res.ok) {
        const verRes = await fetch(`/api/employees/${employeeId}/verifications`);
        if (verRes.ok) setVerifications(await verRes.json());
        alert('Verification recorded successfully');
      }
    } catch (err) {
      alert('Failed to record verification');
    } finally {
      setRecording(false);
    }
  };

  const copyQRLink = () => {
    if (employee?.qr_code) {
      navigator.clipboard.writeText(
        `${window.location.origin}/verify/employee?code=${employee.qr_code}`
      );
      alert('QR link copied to clipboard');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 p-6">
        <div className="h-64 bg-slate-800/50 rounded-2xl animate-pulse" />
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        <div className="text-center">
          <AlertTriangle className="w-10 h-10 text-amber-400 mx-auto mb-4" />
          <p>Employee not found</p>
        </div>
      </div>
    );
  }

  const status = statusConfig[employee.status] || statusConfig.pending;
  const StatusIcon = status.icon;

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="sticky top-0 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/50">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-4">
          <Link href="/employee-directory">
            <button className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-slate-800 transition-colors">
              <ArrowLeft />
            </button>
          </Link>
          <h1 className="text-lg font-semibold">Employee Profile</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8 grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Card */}
          <div className="p-6 bg-slate-800/50 rounded-2xl border border-slate-700">
            <div className="flex gap-6">
              <div className="w-24 h-24 bg-slate-700 rounded-2xl flex items-center justify-center overflow-hidden">
                {employee.photo_url ? (
                  <img src={employee.photo_url} className="w-full h-full object-cover" alt="Employee" />
                ) : (
                  <User className="w-10 h-10 text-slate-400" />
                )}
              </div>

              <div className="flex-1">
                <div className="flex justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">
                      {employee.full_name || `${employee.firstName} ${employee.lastName}`}
                    </h2>
                    <p className="text-slate-400">{employee.role || employee.tradeRole}</p>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-slate-700/50 border border-slate-600 h-fit">
                    <StatusIcon className="w-4 h-4" />
                    <span className="text-sm">{status.label}</span>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4 mt-4 text-sm">
                  <div className="flex items-center gap-2 text-slate-300">
                    <Building2 className="w-4 h-4" />
                    {employee.employer || employee.organization?.name || 'N/A'}
                  </div>
                  {employee.industry && (
                    <div className="px-3 py-1 bg-slate-700/50 rounded-lg border border-slate-600 w-fit">
                      {industryLabels[employee.industry] || employee.industry}
                    </div>
                  )}
                  {employee.email && (
                    <div className="flex items-center gap-2 text-slate-300">
                      <Mail className="w-4 h-4" />
                      {employee.email}
                    </div>
                  )}
                  {employee.phone && (
                    <div className="flex items-center gap-2 text-slate-300">
                      <Phone className="w-4 h-4" />
                      {employee.phone}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Certifications */}
          <div className="p-6 bg-slate-800/50 rounded-2xl border border-slate-700">
            <h2 className="flex items-center gap-2 text-lg font-semibold mb-4">
              <FileCheck className="w-5 h-5" />
              Certifications
            </h2>

            {certifications.length === 0 ? (
              <p className="text-slate-500 text-center py-8">No certifications on file</p>
            ) : (
              <div className="space-y-3">
                {certifications.map((c: any) => (
                  <div key={c.id} className="p-4 bg-slate-700/30 rounded-xl border border-slate-600/50">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{c.certification_type || c.certType}</h3>
                        <p className="text-xs text-slate-400 mt-1">
                          {c.expiration_date && `Expires ${new Date(c.expiration_date || c.expirationDate).toLocaleDateString()}`}
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        c.status === 'valid' ? 'bg-green-900/30 text-green-300' :
                        c.status === 'expired' ? 'bg-yellow-900/30 text-yellow-300' :
                        'bg-red-900/30 text-red-300'
                      }`}>
                        {c.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Verification History */}
          <div className="p-6 bg-slate-800/50 rounded-2xl border border-slate-700">
            <h2 className="flex items-center gap-2 text-lg font-semibold mb-4">
              <Clock className="w-5 h-5" />
              Verification History
            </h2>

            {verifications.length === 0 ? (
              <p className="text-slate-500 text-center py-8">No verification history</p>
            ) : (
              <div className="space-y-2">
                {verifications.map((v: any) => (
                  <div key={v.id} className="flex justify-between items-center p-3 bg-slate-700/30 rounded-lg">
                    <span className="text-sm">{v.result || 'Verified'}</span>
                    <span className="text-xs text-slate-400">
                      {new Date(v.created_at || v.timestamp).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* QR Code Sidebar */}
        <div className="space-y-6">
          <div className="p-6 bg-slate-800/50 rounded-2xl border border-slate-700">
            <h2 className="flex items-center gap-2 text-lg font-semibold mb-4">
              <QrCode className="w-5 h-5" />
              Verification QR
            </h2>

            {employee.qr_image_url && (
              <div className="bg-white p-4 rounded-xl mb-4">
                <img src={employee.qr_image_url} className="w-full" alt="QR Code" />
              </div>
            )}

            <div className="space-y-2">
              <button
                onClick={recordVerification}
                disabled={recording}
                className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <CheckCircle2 className="w-4 h-4" />
                {recording ? 'Recording...' : 'Record Verification'}
              </button>

              <button
                onClick={copyQRLink}
                className="w-full px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg font-medium flex items-center justify-center gap-2"
              >
                <Copy className="w-4 h-4" />
                Copy QR Link
              </button>

              {employee.qr_code && (
                <Link href={`/verify/employee?code=${employee.qr_code}`} target="_blank">
                  <button className="w-full px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg font-medium flex items-center justify-center gap-2">
                    <ExternalLink className="w-4 h-4" />
                    Open Public Page
                  </button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
