'use client';

import { useState, useEffect } from 'react';
import { FileText, Search, Lock, Calendar, Shield } from 'lucide-react';

export default function AuditLogPage() {
  const [auditEvents, setAuditEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadAuditEvents();
  }, []);

  const loadAuditEvents = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/audit-events');
      if (res.ok) setAuditEvents(await res.json());
    } catch (err) {
      console.error('Failed to load audit events');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Shield className="w-8 h-8 text-amber-400" />
          <h1 className="text-3xl font-bold">Audit Log</h1>
        </div>
        <p className="text-slate-400">Regulator-grade audit trail for legal defensibility</p>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input type="text" placeholder="Search audit events..." className="w-full pl-10 px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-white" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
        </div>
      </div>

      {loading ? (
        <div className="h-96 bg-slate-800/50 rounded-2xl animate-pulse" />
      ) : (
        <div className="bg-slate-800/50 rounded-2xl border border-slate-700">
          <div className="p-4 bg-slate-900/50 border-b border-slate-700 flex items-center gap-2">
            <Lock className="w-4 h-4 text-amber-400" />
            <span className="text-sm font-medium">Append-Only Audit Trail (Earlier versions preserved)</span>
            <span className="ml-auto text-sm text-slate-400">{auditEvents.length} events</span>
          </div>
          <div className="divide-y divide-slate-700 max-h-[700px] overflow-y-auto">
            {auditEvents.length === 0 ? (
              <div className="p-12 text-center text-slate-500">No audit events found</div>
            ) : (
              auditEvents.map((event: any, i: number) => (
                <div key={i} className="p-4 hover:bg-slate-800/30">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <Shield className="w-5 h-5 text-amber-400 mt-1" />
                      <div>
                        <div className="font-medium mb-1">{event.action || event.type || 'Audit Event'}</div>
                        {event.entity && <div className="text-sm text-slate-400">Entity: {event.entity}</div>}
                        {event.actor && <div className="text-sm text-slate-400">Actor: {event.actor}</div>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                      <Calendar className="w-4 h-4" />
                      {new Date(event.created_at || event.timestamp).toLocaleString()}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      <div className="mt-6 p-4 bg-amber-900/20 border border-amber-800/50 rounded-lg">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-amber-400 mt-0.5" />
          <div className="text-sm">
            <div className="font-medium text-amber-300 mb-1">Regulator-Grade Audit Trail</div>
            <div className="text-slate-400">
              This audit log is designed for regulatory compliance and legal defensibility. All events use append-only 
              record structures (earlier versions preserved), include actor identity, timestamp, and complete context. 
              Records are retained and retrievable for regulatory inspection.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
