import React from 'react';
import {
  Users,
  Shield,
  AlertTriangle,
  QrCode,
  TrendingUp,
  TrendingDown
} from 'lucide-react';

/**
 * STATS OVERVIEW COMPONENT (PRESENTATION-ONLY)
 * 
 * HARD RULES:
 * - NO BASE44
 * - NO DATA FETCHING OR MUTATION
 * - NO MOCK OR FABRICATED ANALYTICS
 * - ALL VALUES DERIVED EXCLUSIVELY FROM PROPS
 * 
 * ACCEPTABLE DERIVED METRICS (ALLOWED):
 * - Totals
 * - Percentages
 * - Rolling windows (e.g. last 7 days)
 * - Simple comparisons (trend up/down)
 * - These are PRESENTATION DERIVATIONS ONLY
 */

type Props = {
  employees: any[];
  certifications: any[];
  verificationLogs: any[];
};

export default function StatsOverview({
  employees,
  certifications,
  verificationLogs
}: Props) {
  const totalEmployees = employees.length;

  const compliantEmployees = employees.filter(
    e => e.status === 'compliant' || e.status === 'active'
  ).length;

  const blockedEmployees = employees.filter(
    e => e.status === 'blocked'
  ).length;

  const recentScans = verificationLogs.filter(log => {
    const logDate = new Date(log.created_at || log.created_date || log.timestamp);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return logDate > weekAgo;
  }).length;

  const complianceRate =
    totalEmployees > 0
      ? Math.round((compliantEmployees / totalEmployees) * 100)
      : 0;

  const stats = [
    {
      label: 'Total Employees',
      value: totalEmployees,
      icon: Users,
      bgColor: 'bg-blue-500/10',
      textColor: 'text-blue-400'
    },
    {
      label: 'Compliance Rate',
      value: `${complianceRate}%`,
      icon: Shield,
      bgColor: 'bg-emerald-500/10',
      textColor: 'text-emerald-400',
      trend: complianceRate >= 90 ? 'up' : 'down'
    },
    {
      label: 'Blocked',
      value: blockedEmployees,
      icon: AlertTriangle,
      bgColor: 'bg-red-500/10',
      textColor: 'text-red-400'
    },
    {
      label: 'Scans (7d)',
      value: recentScans,
      icon: QrCode,
      bgColor: 'bg-violet-500/10',
      textColor: 'text-violet-400'
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, i) => (
        <div
          key={stat.label}
          className="relative p-6 rounded-2xl bg-slate-800/50 border border-slate-700/50
                     overflow-hidden hover:border-slate-600/50 transition-colors"
          style={{
            animation: `fadeInUp 0.3s ease-out ${i * 0.1}s both`
          }}
        >
          <div className="flex items-start justify-between mb-4">
            <div className={`p-3 rounded-xl ${stat.bgColor}`}>
              <stat.icon className={`w-5 h-5 ${stat.textColor}`} />
            </div>

            {stat.trend && (
              <div
                className={`flex items-center gap-1 text-xs ${
                  stat.trend === 'up'
                    ? 'text-emerald-400'
                    : 'text-red-400'
                }`}
              >
                {stat.trend === 'up' ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
              </div>
            )}
          </div>

          <div className="text-3xl font-bold text-white mb-1">
            {stat.value}
          </div>
          <div className="text-sm text-slate-400">{stat.label}</div>
        </div>
      ))}

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
