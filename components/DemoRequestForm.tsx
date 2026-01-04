'use client';

import React, { useState } from 'react';
import { Calendar, Send, Loader2, CheckCircle2 } from 'lucide-react';

export function DemoRequestForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    role: '',
    employeeCount: '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    try {
      const response = await fetch('/api/request-demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit demo request');
      }

      setSuccess(true);
      setFormData({ name: '', email: '', company: '', role: '', employeeCount: '', notes: '' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit demo request');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold mb-4 text-white">Request a Demo</h2>
        <p className="text-slate-400">
          See how our compliance record system works for your organization.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 p-8 rounded-2xl bg-slate-800/50 border border-slate-700">
        {error && (
          <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" />
            <span>Demo request submitted! We'll contact you within 24 hours to schedule.</span>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="demo-name" className="block text-sm font-medium text-slate-300 mb-2">
              Name *
            </label>
            <input
              id="demo-name"
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-white border border-slate-300 text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Your name"
            />
          </div>

          <div>
            <label htmlFor="demo-email" className="block text-sm font-medium text-slate-300 mb-2">
              Email *
            </label>
            <input
              id="demo-email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-white border border-slate-300 text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="you@company.com"
            />
          </div>
        </div>

        <div>
          <label htmlFor="demo-company" className="block text-sm font-medium text-slate-300 mb-2">
            Company *
          </label>
          <input
            id="demo-company"
            name="company"
            type="text"
            required
            value={formData.company}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg bg-white border border-slate-300 text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Your company name"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="demo-role" className="block text-sm font-medium text-slate-300 mb-2">
              Role
            </label>
            <input
              id="demo-role"
              name="role"
              type="text"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-white border border-slate-300 text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Safety Manager, Compliance Officer, etc."
            />
          </div>

          <div>
            <label htmlFor="demo-employeeCount" className="block text-sm font-medium text-slate-300 mb-2">
              Estimated Employee Count
            </label>
            <select
              id="demo-employeeCount"
              name="employeeCount"
              value={formData.employeeCount}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-white border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select range</option>
              <option value="1-50">1-50</option>
              <option value="51-200">51-200</option>
              <option value="201-500">201-500</option>
              <option value="500+">500+</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="demo-notes" className="block text-sm font-medium text-slate-300 mb-2">
            Additional Notes
          </label>
          <textarea
            id="demo-notes"
            name="notes"
            rows={4}
            value={formData.notes}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg bg-white border border-slate-300 text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            placeholder="Tell us about your compliance needs (optional)"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-lg bg-blue-600 hover:bg-blue-500 font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <Calendar className="w-5 h-5" />
              Request Demo
            </>
          )}
        </button>
      </form>
    </div>
  );
}
