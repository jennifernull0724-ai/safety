'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  FileCheck,
  Search,
  Lock,
  AlertTriangle,
  Ban,
  QrCode,
  Eye,
  FileWarning,
  Gavel,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

/**
 * AUDIT VAULT PAGE (READ-ONLY)
 * 
 * STRICTLY READ-ONLY - NO MUTATIONS
 * 
 * All audit events are:
 * - Loaded from server (GET /api/audit-events)
 * - Immutable
 * - Server-ordered (newest first)
 * 
 * NO CLIENT-SIDE FABRICATION
 * NO MODIFICATION PATHS
 */

const eventTypeConfig: any = {
  certification_issued: { icon: FileCheck, label: 'Certification Issued' },
  certification_expired: { icon: AlertTriangle, label: 'Certification Expired' },
  employee_blocked: { icon: Ban, label: 'Employee Blocked' },
  qr_scanned: { icon: QrCode, label: 'QR Scanned' },
  audit_accessed: { icon: Eye, label: 'Audit Accessed' },
  incident_reported: { icon: FileWarning, label: 'Incident Reported' },
  enforcement_action: { icon: Gavel, label: 'Enforcement Action' },
  employee_created: { icon: FileCheck, label: 'Employee Created' },
  certification_uploaded: { icon: FileCheck, label: 'Certification Uploaded' }
};

const severityConfig: any = {
  info: { label: 'Info', className: 'bg-slate-500/10 text-slate-400 border-slate-500/20' },
  warning: { label: 'Warning', className: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
  critical: { label: 'Critical', className: 'bg-red-500/10 text-red-400 border-red-500/20' }
};

export default function AuditVault() {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [auditEvents, setAuditEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedEvents, setExpandedEvents] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadAuditEvents();
  }, []);

  const loadAuditEvents = async () => {
    try {
      const res = await fetch('/api/audit-events?limit=100');
      if (res.ok) {
        const data = await res.json();
        setAuditEvents(data);
      }
    } catch (err) {
      console.error('Failed to load audit events');
    } finally {
      setLoading(false);
    }
  };

  const toggleExpanded = (eventId: string) => {
    setExpandedEvents(prev => {
      const next = new Set(prev);
      if (next.has(eventId)) {
        next.delete(eventId);
      } else {
        next.add(eventId);
      }
      return next;
    });
  };

  const filteredEvents = auditEvents.filter((event: any) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      event.description?.toLowerCase().includes(q) ||
      event.eventType?.toLowerCase().includes(q) ||
      event.actor?.toLowerCase().includes(q);

    const matchesType = typeFilter === 'all' || event.event_type === typeFilter || event.eventType === typeFilter;
    const matchesSeverity = severityFilter === 'all' || event.severity === severityFilter;

    return matchesSearch && matchesType && matchesSeverity;
  });

  const groupedEvents = filteredEvents.reduce((acc: any, event: any) => {
    const created = event.created_at || event.createdAt;
    if (!created) return acc;
    
    const date = new Date(created).toISOString().split('T')[0];
    if (!acc[date]) acc[date] = [];
    acc[date].push(event);
    return acc;
  }, {});

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="sticky top-0 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/50 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center gap-4">
          <Link href="/">
            <button className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-slate-800 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
          </Link>
          <div>
            <h1 className="text-lg font-semibold">Audit Vault</h1>
            <p className="text-xs text-slate-500">Immutable Event Ledger</p>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        {/* Immutability Notice */}
        <div className="mb-8 p-6 rounded-2xl bg-slate-800/30 border border-slate-700">
          <div className="flex gap-4">
            <Lock className="w-6 h-6 text-emerald-400 flex-shrink-0" />
            <div>
              <p className="text-sm text-slate-300 font-medium mb-1">Read-Only Audit Ledger</p>
              <p className="text-sm text-slate-400">
                All events in this vault are permanently recorded and cannot be modified or deleted.
              </p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search events..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white"
            />
          </div>

          <select
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
            className="px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white"
          >
            <option value="all">All Types</option>
            {Object.entries(eventTypeConfig).map(([k, v]: any) => (
              <option key={k} value={k}>{v.label}</option>
            ))}
          </select>

          <select
            value={severityFilter}
            onChange={e => setSeverityFilter(e.target.value)}
            className="px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white"
          >
            <option value="all">All Severity</option>
            <option value="info">Info</option>
            <option value="warning">Warning</option>
            <option value="critical">Critical</option>
          </select>
        </div>

        {/* Event List */}
        {loading ? (
          <div className="h-64 bg-slate-800/50 rounded-2xl animate-pulse" />
        ) : Object.keys(groupedEvents).length === 0 ? (
          <div className="text-center py-12">
            <Lock className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400">No audit events found</p>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedEvents).map(([date, events]: any) => (
              <div key={date}>
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-sm text-slate-400">
                    {formatDate(date)}
                  </span>
                  <div className="flex-1 h-px bg-slate-800" />
                  <span className="px-2 py-1 rounded text-xs bg-slate-800 text-slate-400 border border-slate-700">
                    {events.length} events
                  </span>
                </div>

                <div className="space-y-3">
                  {events.map((event: any) => {
                    const eventType = event.event_type || event.eventType || 'audit_accessed';
                    const type = eventTypeConfig[eventType] || eventTypeConfig.audit_accessed;
                    const severity = severityConfig[event.severity] || severityConfig.info;
                    const Icon = type.icon;
                    const timestamp = event.created_at || event.createdAt;
                    const isExpanded = expandedEvents.has(event.id);

                    return (
                      <div key={event.id}>
                        <button
                          onClick={() => toggleExpanded(event.id)}
                          className="w-full p-4 rounded-xl bg-slate-800/50 border border-slate-700 hover:bg-slate-800 transition-colors text-left"
                        >
                          <div className="flex gap-4">
                            <Icon className="w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5" />
                            <div className="flex-1 min-w-0">
                              <p className="font-medium">{event.description || event.eventType || 'Audit Event'}</p>
                              {event.actor && (
                                <p className="text-xs text-slate-500 mt-1">by {event.actor}</p>
                              )}
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <span className={`px-2 py-1 rounded text-xs font-medium border ${severity.className}`}>
                                {severity.label}
                              </span>
                              <span className="text-xs text-slate-500">
                                {formatTime(timestamp)}
                              </span>
                              {isExpanded ? (
                                <ChevronUp className="w-4 h-4 text-slate-500" />
                              ) : (
                                <ChevronDown className="w-4 h-4 text-slate-500" />
                              )}
                            </div>
                          </div>
                        </button>

                        {isExpanded && (
                          <div className="ml-9 mt-2 p-4 rounded-xl bg-slate-900/50 border border-slate-800">
                            <pre className="text-xs text-slate-400 overflow-auto">
                              {JSON.stringify(event, null, 2)}
                            </pre>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
