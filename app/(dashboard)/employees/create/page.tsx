'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Shield,
  ArrowLeft,
  User,
  Building2,
  Mail,
  Upload,
  Save,
  Loader2
} from 'lucide-react';

export default function AddEmployee() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    employeeId: '',
    organizationId: '',
    tradeRole: '',
    industry: 'railroad',
    email: '',
    phone: '',
    status: 'INCOMPLETE',
    photoUrl: ''
  });

  const [uploading, setUploading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    const body = new FormData();
    body.append('file', file);

    try {
      const res = await fetch('/api/uploads/employee-photo', {
        method: 'POST',
        body
      });

      if (!res.ok) {
        throw new Error('Photo upload failed');
      }

      const { url } = await res.json();
      setFormData(prev => ({ ...prev, photoUrl: url }));
    } catch (err) {
      setError('Photo upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.firstName || !formData.lastName || !formData.organizationId) {
      setError('Please fill in all required fields');
      return;
    }

    setCreating(true);
    setError(null);

    try {
      const res = await fetch('/api/internal/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          tradeRole: formData.tradeRole,
          organizationId: formData.organizationId,
          userId: 'system'
        })
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Employee creation failed');
      }

      const result = await res.json();
      router.push(`/employee-directory`);
    } catch (err: any) {
      setError(err.message);
      setCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/50">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center gap-4">
          <Link href="/employee-directory">
            <button className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-slate-800 transition-colors">
              <ArrowLeft />
            </button>
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Shield />
            </div>
            <div>
              <div className="text-lg font-semibold">Add Employee</div>
              <div className="text-xs text-slate-500">Register for verification</div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-800 rounded-xl text-red-200">
            <strong>Error:</strong> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Photo */}
          <div className="flex justify-center">
            <label className="cursor-pointer">
              <div className="w-32 h-32 rounded-2xl bg-slate-800 border border-dashed border-slate-700 flex items-center justify-center overflow-hidden">
                {formData.photoUrl ? (
                  <img src={formData.photoUrl} className="w-full h-full object-cover" alt="Employee" />
                ) : uploading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <Upload />
                )}
              </div>
              <input type="file" accept="image/*" hidden onChange={handlePhotoUpload} />
            </label>
          </div>

          {/* Basic Info */}
          <section className="p-6 bg-slate-800/50 border border-slate-700 rounded-2xl space-y-4">
            <h3 className="flex items-center gap-2 text-lg font-semibold">
              <User /> Basic Information
            </h3>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  First Name *
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white"
                  value={formData.firstName}
                  onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Last Name *
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white"
                  value={formData.lastName}
                  onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                />
              </div>
            </div>
          </section>

          {/* Employment */}
          <section className="p-6 bg-slate-800/50 border border-slate-700 rounded-2xl space-y-4">
            <h3 className="flex items-center gap-2 text-lg font-semibold">
              <Building2 /> Employment Details
            </h3>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Organization ID *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter organization UUID"
                  className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white"
                  value={formData.organizationId}
                  onChange={e => setFormData({ ...formData, organizationId: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Trade Role *
                </label>
                <select
                  required
                  className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white"
                  value={formData.tradeRole}
                  onChange={e => setFormData({ ...formData, tradeRole: e.target.value })}
                >
                  <option value="">Select Role</option>
                  <option value="Track Maintenance">Track Maintenance</option>
                  <option value="Signal Maintainer">Signal Maintainer</option>
                  <option value="Bridge Inspector">Bridge Inspector</option>
                  <option value="Equipment Operator">Equipment Operator</option>
                  <option value="Welder">Welder</option>
                  <option value="Foreman">Foreman</option>
                  <option value="Railroad Contractor">Railroad Contractor</option>
                  <option value="Laborer">Laborer</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Industry
                </label>
                <select
                  className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white"
                  value={formData.industry}
                  onChange={e => setFormData({ ...formData, industry: e.target.value })}
                >
                  <option value="railroad">Railroad</option>
                  <option value="construction">Construction</option>
                  <option value="environmental">Environmental</option>
                  <option value="general">General</option>
                </select>
              </div>
            </div>
          </section>

          {/* Contact */}
          <section className="p-6 bg-slate-800/50 border border-slate-700 rounded-2xl space-y-4">
            <h3 className="flex items-center gap-2 text-lg font-semibold">
              <Mail /> Contact Information
            </h3>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="email@example.com"
                  className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white"
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
            </div>
          </section>

          <div className="flex justify-end gap-3">
            <Link href="/employee-directory">
              <button
                type="button"
                className="px-6 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 font-medium"
              >
                Cancel
              </button>
            </Link>
            <button
              type="submit"
              disabled={creating}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {creating ? <Loader2 className="animate-spin w-4 h-4" /> : <Save className="w-4 h-4" />}
              Add Employee
            </button>
          </div>

          <div className="bg-blue-900/20 border border-blue-800 rounded-lg p-4">
            <p className="text-sm text-blue-200">
              <strong>Note:</strong> Creating an employee will automatically:
            </p>
            <ul className="text-sm text-blue-300 mt-2 ml-4 list-disc space-y-1">
              <li>Generate a unique QR code</li>
              <li>Instantiate all 55 required certifications (status: INCOMPLETE)</li>
              <li>Create an evidence node and ledger entry</li>
            </ul>
          </div>
        </form>
      </main>
    </div>
  );
}
