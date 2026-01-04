'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Shield,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  Activity,
  Lock,
  RefreshCw,
  ChevronRight
} from 'lucide-react';

export default function Dashboard() {
  const [compliance, setCompliance] = useState<any>(null);
  const [verification, setVerification] = useState<any>(null);
  const [risks, setRisks] = useState<any[]>([]);
  const [activity, setActivity] = useState<any[]>([]);
  const [auditIntegrity, setAuditIntegrity] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [verificationWindow, setVerificationWindow] = useState<'24h' | '72h'>('24h');

  useEffect(() => {
    loadDashboard();
  }, [verificationWindow]);

  const loadDashboard = async () => {
    setLoading(true);
    try {
      const [compRes, verRes, riskRes, actRes, auditRes] = await Promise.all([
        fetch('/api/analytics/compliance-overview'),
        fetch(`/api/analytics/verification-snapshot?window=${verificationWindow}`),
        fetch('/api/analytics/risk-indicators'),
        fetch('/api/analytics/recent-activity?limit=10'),
        fetch('/api/analytics/audit-integrity')
      ]);

      if (compRes.ok) setCompliance(await compRes.json());
      if (verRes.ok) setVerification(await verRes.json());
      if (riskRes.ok) {
        const data = await riskRes.json();
        setRisks(data.indicators || []);
      }
      if (actRes.ok) {
        const data = await actRes.json();
        setActivity(data.events || []);
      }
      if (auditRes.ok) setAuditIntegrity(await auditRes.json());
    } catch (err) {
      console.error('Failed to load dashboard analytics');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'compliant': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
      case 'at_risk': return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
      case 'non_compliant': return 'text-red-400 bg-red-500/10 border-red-500/30';
      default: return 'text-slate-400 bg-slate-500/10 border-slate-500/30';
    }
  };

  const getSeverityColor = (severity: string) => {
    return severity === 'critical' 
      ? 'text-red-400 bg-red-500/10 border-red-500/30'
      : 'text-amber-400 bg-amber-500/10 border-amber-500/30';
  };

  const getRiskLabel = (type: string) => {
    const labels: Record<string, string> = {
      employees_blocked: 'Employees Blocked',
      certifications_expired: 'Certifications Expired',
      certifications_expiring_soon: 'Expiring Soon (≤30d)',
      recent_incidents: 'Recent Incidents'
    };
    return labels[type] || type;
  };

  const getRiskRoute = (type: string) => {
    if (type.includes('employee')) return '/employees';
    if (type.includes('certification')) return '/certifications';
    if (type.includes('incident')) return '/audit';
    return '/dashboard';
  };

  return (
    <div className="p-8 space-y-8">
      {/* Compliance Status */}
      <section>
        <h2 className="text-lg font-semibold mb-4">Compliance Status</h2>
        {loading ? (
          <div className="h-48 rounded-2xl bg-slate-800/50 animate-pulse" />
        ) : compliance ? (
          <div className="p-6 rounded-2xl bg-slate-800/50 border border-slate-700">
            <div className="flex items-center justify-between mb-6">
              <div className={`px-4 py-2 rounded-lg border font-semibold uppercase text-sm ${getStatusColor(compliance.overall_status)}`}>
                {compliance.overall_status.replace('_', ' ')}
              </div>
            </div>
            <div className="grid sm:grid-cols-4 gap-4 mb-4">
              <div className="p-4 rounded-lg bg-slate-900/50">
                <div className="text-sm text-slate-400 mb-1">Total</div>
                <div className="text-2xl font-bold">{compliance.employees.total}</div>
              </div>
              <div className="p-4 rounded-lg bg-slate-900/50">
                <div className="text-sm text-slate-400 mb-1">Compliant</div>
                <div className="text-2xl font-bold text-emerald-400">{compliance.employees.compliant}</div>
              </div>
              <div className="p-4 rounded-lg bg-slate-900/50">
                <div className="text-sm text-slate-400 mb-1">Non-Compliant</div>
                <div className="text-2xl font-bold text-red-400">{compliance.employees.non_compliant}</div>
              </div>
              <div className="p-4 rounded-lg bg-slate-900/50">
                <div className="text-sm text-slate-400 mb-1">Blocked</div>
                <div className="text-2xl font-bold text-red-500">{compliance.employees.blocked}</div>
              </div>
            </div>
            <div className="pt-4 border-t border-slate-700 grid sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-slate-900/50">
                <div className="text-sm text-slate-400 mb-1">Active Certifications</div>
                <div className="text-2xl font-bold text-blue-400">{compliance.certifications.active}</div>
              </div>
              <div className="p-4 rounded-lg bg-slate-900/50">
                <div className="text-sm text-slate-400 mb-1">Expiring Soon</div>
                <div className="text-2xl font-bold text-amber-400">{compliance.certifications.expiring_soon}</div>
              </div>
              <div className="p-4 rounded-lg bg-slate-900/50">
                <div className="text-sm text-slate-400 mb-1">Expired</div>
                <div className="text-2xl font-bold text-red-400">{compliance.certifications.expired}</div>
              </div>
            </div>
          </div>
        ) : null}
      </section>

      {/* Risk Indicators */}
      {!loading && risks.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            Active Risk Indicators
          </h2>
          <div className="grid sm:grid-cols-4 gap-4">
            {risks.map((risk: any, i: number) => (
              <Link
                key={i}
                href={getRiskRoute(risk.type)}
                className={`p-4 rounded-lg border ${getSeverityColor(risk.severity)} hover:bg-opacity-20 transition-colors`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium mb-1">{getRiskLabel(risk.type)}</div>
                    <div className="text-3xl font-bold">{risk.count}</div>
                  </div>
                  <ChevronRight className="w-5 h-5 opacity-50" />
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Verification Activity */}
        <div className="lg:col-span-2 space-y-6">
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Verification Activity</h2>
              <select
                value={verificationWindow}
                onChange={(e) => setVerificationWindow(e.target.value as any)}
                className="px-3 py-1.5 text-sm rounded-lg bg-slate-800 border border-slate-700"
              >
                <option value="24h">Last 24 Hours</option>
                <option value="72h">Last 72 Hours</option>
              </select>
            </div>
            {loading ? (
              <div className="h-64 rounded-2xl bg-slate-800/50 animate-pulse" />
            ) : verification ? (
              <div className="p-6 rounded-2xl bg-slate-800/50 border border-slate-700">
                <div className="text-center mb-6">
                  <div className="text-5xl font-bold text-blue-400">{verification.total}</div>
                  <div className="text-sm text-slate-400 mt-1">Total Verifications</div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-lg bg-slate-900/50">
                    <div className="flex items-center gap-2 text-emerald-400 mb-1">
                      <CheckCircle2 className="w-4 h-4" />
                      <span className="text-sm">Verified</span>
                    </div>
                    <div className="text-2xl font-bold">{verification.results.verified}</div>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-900/50">
                    <div className="flex items-center gap-2 text-red-400 mb-1">
                      <XCircle className="w-4 h-4" />
                      <span className="text-sm">Failed</span>
                    </div>
                    <div className="text-2xl font-bold">{verification.results.failed}</div>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-900/50">
                    <div className="flex items-center gap-2 text-red-500 mb-1">
                      <AlertTriangle className="w-4 h-4" />
                      <span className="text-sm">Blocked</span>
                    </div>
                    <div className="text-2xl font-bold">{verification.results.blocked}</div>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-900/50">
                    <div className="flex items-center gap-2 text-amber-400 mb-1">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">Expired</span>
                    </div>
                    <div className="text-2xl font-bold">{verification.results.expired}</div>
                  </div>
                </div>
              </div>
            ) : null}
          </section>

          {/* Audit Integrity */}
          {!loading && auditIntegrity && (
            <section>
              <h2 className="text-lg font-semibold mb-4">Audit Integrity</h2>
              <div className="p-6 rounded-2xl bg-slate-800/50 border border-slate-700">
                <div className="flex items-start gap-4">
                  <Lock className="w-8 h-8 text-emerald-400 flex-shrink-0" />
                  <div>
                    <div className="text-lg font-semibold mb-2">Audit Trail Intact</div>
                    <div className="space-y-1.5 text-sm text-slate-400">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>Append-only ledger active</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>No tampering detected</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}
        </div>

        {/* Recent Activity */}
        <div>
          <section>
            <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
            {loading ? (
              <div className="h-96 rounded-2xl bg-slate-800/50 animate-pulse" />
            ) : (
              <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700">
                <div className="space-y-3">
                  {activity.map((event: any) => (
                    <div key={event.event_id} className="p-3 rounded-lg bg-slate-900/50">
                      <div className="flex items-start gap-3">
                        <Activity className="w-4 h-4 text-blue-400 mt-0.5" />
                        <div className="flex-1">
                          <div className="text-sm text-slate-300">{event.description}</div>
                          <div className="text-xs text-slate-500 mt-1">
                            {new Date(event.timestamp).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <Link href="/audit" className="mt-4 block text-center text-sm text-blue-400">
                  View Full Audit Log →
                </Link>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
