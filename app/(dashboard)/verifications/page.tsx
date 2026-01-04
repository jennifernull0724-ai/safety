'use client';

import { useState, useEffect } from 'react';
import { CheckSquare, Search, QrCode, Calendar, CheckCircle, XCircle } from 'lucide-react';

export default function VerificationsPage() {
  const [verifications, setVerifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadVerifications();
  }, []);

  const loadVerifications = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/verifications');
      if (res.ok) setVerifications(await res.json());
    } catch (err) {
      console.error('Failed to load verifications');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Verifications</h1>
        <p className="text-slate-400">Immutable verification logs - read-only, append-only</p>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input type="text" placeholder="Search verifications..." className="w-full pl-10 px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-white" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
        </div>
      </div>

      {loading ? (
        <div className="h-96 bg-slate-800/50 rounded-2xl animate-pulse" />
      ) : (
        <div className="bg-slate-800/50 rounded-2xl border border-slate-700">
          <div className="p-4 bg-slate-900/50 border-b border-slate-700 flex items-center gap-2">
            <CheckSquare className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-medium">Append-Only Log</span>
            <span className="ml-auto text-sm text-slate-400">{verifications.length} records</span>
          </div>
          <div className="divide-y divide-slate-700 max-h-[700px] overflow-y-auto">
            {verifications.length === 0 ? (
              <div className="p-12 text-center text-slate-500">No verification records found</div>
            ) : (
              verifications.map((v: any, i: number) => (
                <div key={i} className="p-4 hover:bg-slate-800/30 flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <QrCode className="w-5 h-5 text-blue-400 mt-1" />
                    <div>
                      <div className="font-medium mb-1">{v.type || 'Verification'}</div>
                      <div className="text-sm text-slate-400">{v.employee_name || v.result}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <Calendar className="w-4 h-4" />
                    {new Date(v.created_at || v.timestamp).toLocaleString()}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
