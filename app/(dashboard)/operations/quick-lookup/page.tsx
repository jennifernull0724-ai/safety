'use client';

import { useState } from 'react';
import { Search, QrCode, CheckCircle, XCircle, AlertTriangle, User, Smartphone } from 'lucide-react';
import Link from 'next/link';

/**
 * MOBILE-OPTIMIZED QUICK LOOKUP
 * 
 * PURPOSE:
 * - Fast employee status lookup for field supervisors
 * - Mobile-first design for job sites
 * - Minimal input, maximum clarity
 * - Offline-friendly
 * 
 * USE CASE:
 * - "I'm at the job site, need to check if someone can work NOW"
 * - Touch-optimized for gloves/outdoor use
 * - Large buttons, high contrast
 */

interface QuickLookupResult {
  employeeId: string;
  fullName: string;
  tradeRole: string;
  status: 'cleared' | 'blocked' | 'pending';
  blockReason?: string;
  qrCode?: string;
}

export default function QuickLookupPage() {
  const [searchInput, setSearchInput] = useState('');
  const [result, setResult] = useState<QuickLookupResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!searchInput.trim()) return;

    try {
      setLoading(true);
      setError(null);
      setResult(null);

      const res = await fetch(`/api/operations/quick-lookup?q=${encodeURIComponent(searchInput)}`);
      
      if (!res.ok) {
        throw new Error('Employee not found');
      }

      const data = await res.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <Smartphone className="w-12 h-12 text-blue-400 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2">Quick Lookup</h1>
          <p className="text-slate-400">Fast employee work authorization check</p>
        </div>

        {/* Search Input - Mobile Optimized */}
        <div className="mb-8">
          <label className="block text-sm font-medium mb-3 text-slate-400">
            Search by Name or Employee ID
          </label>
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-500" />
              <input
                type="text"
                className="w-full pl-14 pr-4 py-5 bg-slate-900 border-2 border-slate-700 rounded-xl focus:ring-4 focus:ring-blue-500 focus:border-blue-500 text-white text-lg"
                placeholder="Enter name or ID..."
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                onKeyPress={handleKeyPress}
                autoFocus
                inputMode="search"
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={!searchInput.trim() || loading}
              className="px-8 py-5 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:text-slate-500 rounded-xl font-bold text-lg"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-6 p-6 bg-red-900/30 border-2 border-red-600 rounded-xl">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0" />
              <div>
                <p className="font-bold text-red-300">Not Found</p>
                <p className="text-sm text-red-400 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Result Card - Large, High Contrast */}
        {result && (
          <div className="space-y-6">
            {/* Status Banner - Extra Large for Visibility */}
            <div className={`p-8 rounded-2xl border-4 ${
              result.status === 'cleared'
                ? 'bg-emerald-900/30 border-emerald-500'
                : result.status === 'blocked'
                ? 'bg-red-900/30 border-red-500'
                : 'bg-amber-900/30 border-amber-500'
            }`}>
              <div className="flex items-center justify-center gap-4 mb-4">
                {result.status === 'cleared' ? (
                  <CheckCircle className="w-20 h-20 text-emerald-400" />
                ) : result.status === 'blocked' ? (
                  <XCircle className="w-20 h-20 text-red-400" />
                ) : (
                  <AlertTriangle className="w-20 h-20 text-amber-400" />
                )}
              </div>
              
              <div className="text-center">
                <h2 className={`text-4xl font-bold mb-2 ${
                  result.status === 'cleared'
                    ? 'text-emerald-400'
                    : result.status === 'blocked'
                    ? 'text-red-400'
                    : 'text-amber-400'
                }`}>
                  {result.status === 'cleared' ? 'CLEARED' : result.status === 'blocked' ? 'BLOCKED' : 'PENDING'}
                </h2>
                <p className={`text-xl ${
                  result.status === 'cleared'
                    ? 'text-emerald-300'
                    : result.status === 'blocked'
                    ? 'text-red-300'
                    : 'text-amber-300'
                }`}>
                  {result.status === 'cleared' 
                    ? 'Authorized to Work' 
                    : result.status === 'blocked'
                    ? 'Do Not Authorize'
                    : 'Review Required'}
                </p>
              </div>
            </div>

            {/* Employee Info Card */}
            <div className="p-6 bg-slate-800/50 border-2 border-slate-700 rounded-xl">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-slate-700 rounded-xl flex items-center justify-center">
                  <User className="w-8 h-8 text-slate-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold">{result.fullName}</h3>
                  <p className="text-slate-400 text-lg">ID: {result.employeeId}</p>
                </div>
              </div>
              <div className="p-4 bg-slate-900/50 rounded-lg">
                <p className="text-sm text-slate-400 mb-1">Trade/Role</p>
                <p className="text-xl font-medium">{result.tradeRole}</p>
              </div>
            </div>

            {/* Block Reason (if blocked) */}
            {result.status === 'blocked' && result.blockReason && (
              <div className="p-6 bg-red-900/30 border-2 border-red-600 rounded-xl">
                <div className="flex items-start gap-3 mb-3">
                  <XCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-bold text-red-300 text-lg">Block Reason</p>
                    <p className="text-red-200 mt-2 text-lg">{result.blockReason}</p>
                  </div>
                </div>
                <div className="mt-4 p-4 bg-red-900/50 rounded-lg">
                  <p className="text-sm font-bold text-red-200 mb-2">Action Required:</p>
                  <p className="text-sm text-red-300">
                    Contact Compliance Administrator at <strong>1-800-SAFETY-1</strong> to resolve
                  </p>
                </div>
              </div>
            )}

            {/* QR Code Link */}
            {result.qrCode && (
              <Link href={`/verify/employee/${result.qrCode}`} target="_blank">
                <button className="w-full p-6 bg-blue-600 hover:bg-blue-500 rounded-xl flex items-center justify-center gap-3 text-xl font-bold">
                  <QrCode className="w-8 h-8" />
                  View Full QR Verification
                </button>
              </Link>
            )}

            {/* New Search Button */}
            <button
              onClick={() => {
                setResult(null);
                setSearchInput('');
                setError(null);
              }}
              className="w-full p-5 bg-slate-700 hover:bg-slate-600 rounded-xl font-bold text-lg"
            >
              New Search
            </button>
          </div>
        )}

        {/* Instructions - Show when no result */}
        {!result && !loading && !error && (
          <div className="mt-12 p-6 bg-slate-800/50 border border-slate-700 rounded-xl">
            <h3 className="font-bold mb-3">How to Use Quick Lookup</h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-1">•</span>
                <span>Enter employee name (partial match works) or exact employee ID</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-1">•</span>
                <span>Results show immediate work authorization status</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-1">•</span>
                <span>Large buttons designed for mobile use and outdoor conditions</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-1">•</span>
                <span>Bookmark this page for instant job site access</span>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
