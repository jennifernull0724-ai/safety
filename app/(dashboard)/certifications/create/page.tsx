'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ArrowLeft,
  FileCheck,
  Upload,
  Save,
  Loader2
} from 'lucide-react';

/**
 * ADD CERTIFICATION PAGE
 * 
 * BACKEND-AUTHORITATIVE
 * - Certification creation → POST /api/certifications
 * - Employees loaded → GET /api/employees
 * - Proof upload → POST /api/uploads/certification-proof
 * 
 * CERTIFICATION IMAGE MANDATORY
 * - Must be preserved for QR Verification, Employee Detail, Audit
 * 
 * NO CLIENT-SIDE AUDIT FABRICATION
 * PRESETS ARE LOCKED (DO NOT MODIFY)
 */

/* 🔒 PRESETS — DO NOT MODIFY */
const CERTIFICATION_TYPES = [
  'OSHA 10-Hour',
  'OSHA 30-Hour',
  'FRA Track Safety',
  'FRA Roadway Worker',
  'HAZMAT Certification',
  'First Aid/CPR',
  'Forklift Operator',
  'Crane Operator',
  'Electrical Safety',
  'Confined Space Entry',
  'Fall Protection',
  'Environmental Compliance',
  'Drug/Alcohol Testing',
  'Background Check',
  'Other'
];

export default function AddCertification() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const employeeIdParam = searchParams?.get('employee_id');

  const [formData, setFormData] = useState<any>({
    employee_id: employeeIdParam || '',
    certification_type: '',
    issuing_authority: '',
    issue_date: '',
    expiration_date: '',
    status: 'pending_verification',
    verification_notes: '',
    proof_file_url: ''
  });

  const [employees, setEmployees] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [loadingEmployees, setLoadingEmployees] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      const res = await fetch('/api/employees');
      if (res.ok) {
        const data = await res.json();
        setEmployees(data);
      }
    } catch (err) {
      console.error('Failed to load employees');
    } finally {
      setLoadingEmployees(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    const body = new FormData();
    body.append('file', file);

    try {
      const res = await fetch('/api/uploads/certification-proof', {
        method: 'POST',
        body
      });

      if (!res.ok) {
        throw new Error('Upload failed');
      }

      const { url } = await res.json();
      setFormData((prev: any) => ({ ...prev, proof_file_url: url }));
      alert('Proof document uploaded successfully');
    } catch (err) {
      setError('Failed to upload proof document');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.employee_id || !formData.certification_type) {
      setError('Please fill in required fields');
      return;
    }

    setCreating(true);
    setError(null);

    try {
      const res = await fetch('/api/certifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!res.ok) {
        throw new Error('Failed to create certification');
      }

      alert('Certification added successfully');
      
      if (employeeIdParam) {
        router.push(`/people/employees/${employeeIdParam}`);
      } else {
        router.push('/');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to add certification');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="sticky top-0 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/50 z-10">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center gap-4">
          <Link href="/">
            <button className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-slate-800 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
          </Link>
          <div>
            <h1 className="text-lg font-semibold">Add Certification</h1>
            <p className="text-xs text-slate-500">Upload certification proof</p>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-800 rounded-xl text-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Employee Selection */}
          <section className="p-6 bg-slate-800/50 rounded-2xl border border-slate-700">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Select Employee *
            </label>
            {loadingEmployees ? (
              <div className="h-10 bg-slate-700 rounded-lg animate-pulse" />
            ) : (
              <select
                required
                className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white"
                value={formData.employee_id}
                onChange={e => setFormData({ ...formData, employee_id: e.target.value })}
              >
                <option value="">Choose employee</option>
                {employees.map((e: any) => (
                  <option key={e.id} value={e.id}>
                    {e.full_name || `${e.firstName} ${e.lastName}`} ({e.employee_id || e.employeeNumber})
                  </option>
                ))}
              </select>
            )}
          </section>

          {/* Certification Details */}
          <section className="p-6 bg-slate-800/50 rounded-2xl border border-slate-700 space-y-4">
            <h3 className="font-semibold mb-4">Certification Details</h3>
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Certification Type *
              </label>
              <select
                required
                className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white"
                value={formData.certification_type}
                onChange={e => setFormData({ ...formData, certification_type: e.target.value })}
              >
                <option value="">Select certification type</option>
                {CERTIFICATION_TYPES.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Issuing Authority
              </label>
              <input
                type="text"
                placeholder="e.g., OSHA, FRA, Red Cross"
                className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white"
                value={formData.issuing_authority}
                onChange={e => setFormData({ ...formData, issuing_authority: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Issue Date
                </label>
                <input
                  type="date"
                  className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white"
                  value={formData.issue_date}
                  onChange={e => setFormData({ ...formData, issue_date: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Expiration Date
                </label>
                <input
                  type="date"
                  className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white"
                  value={formData.expiration_date}
                  onChange={e => setFormData({ ...formData, expiration_date: e.target.value })}
                />
              </div>
            </div>
          </section>

          {/* Proof Image Upload */}
          <section className="p-6 bg-slate-800/50 rounded-2xl border border-slate-700 space-y-4">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <FileCheck className="w-5 h-5" />
              Proof Document (Required)
            </h3>
            
            <label className="cursor-pointer block">
              <div className="p-8 border-2 border-dashed border-slate-700 rounded-xl hover:border-slate-600 transition-colors text-center">
                {formData.proof_file_url ? (
                  <div>
                    <FileCheck className="w-12 h-12 mx-auto text-emerald-400 mb-3" />
                    <p className="text-sm text-emerald-400">Proof document uploaded</p>
                    <p className="text-xs text-slate-500 mt-1">Click to replace</p>
                  </div>
                ) : uploading ? (
                  <div>
                    <Loader2 className="w-12 h-12 mx-auto animate-spin text-blue-400 mb-3" />
                    <p className="text-sm text-slate-400">Uploading...</p>
                  </div>
                ) : (
                  <div>
                    <Upload className="w-12 h-12 mx-auto text-slate-500 mb-3" />
                    <p className="text-sm text-slate-300">Upload certification proof</p>
                    <p className="text-xs text-slate-500 mt-1">PDF, JPG, PNG (Max 10MB)</p>
                  </div>
                )}
              </div>
              <input
                type="file"
                hidden
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileUpload}
                disabled={uploading}
              />
            </label>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Verification Notes
              </label>
              <textarea
                rows={3}
                placeholder="Optional notes about this certification..."
                className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white"
                value={formData.verification_notes}
                onChange={e => setFormData({ ...formData, verification_notes: e.target.value })}
              />
            </div>
          </section>

          <div className="flex justify-end gap-3">
            <Link href="/">
              <button
                type="button"
                className="px-6 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 font-medium"
              >
                Cancel
              </button>
            </Link>
            <button
              type="submit"
              disabled={creating || uploading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {creating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Add Certification
                </>
              )}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
