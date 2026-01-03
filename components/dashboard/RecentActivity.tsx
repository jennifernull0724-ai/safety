import React from 'react';
import { format } from 'date-fns';
import {
  QrCode,
  AlertTriangle,
  FileCheck,
  Eye,
  CheckCircle2
} from 'lucide-react';

/**
 * RECENT ACTIVITY COMPONENT (PRESENTATION-ONLY)
 * 
 * HARD RULES:
 * - NO BASE44
 * - NO DATA FETCHING OR MUTATION
 * - NO MOCK OR FABRICATED ACTIVITY
 * - ALL EVENTS RENDERED EXCLUSIVELY FROM PROPS
 * 
 * ACCEPTABLE LOGIC (ALLOWED):
 * - Mapping verification types to icons/labels
 * - Mapping results to display states
 * - Time formatting
 * - Deriving employee display name from provided employees array
 * - Limiting display count (e.g. latest 10)
 */

type Props = {
  logs: any[];
  employees: any[];
};

const eventConfig: any = {
  qr_scan: { icon: QrCode, color: 'text-blue-400', bg: 'bg-blue-500/10' },
  certification_check: { icon: FileCheck, color: 'text-violet-400', bg: 'bg-violet-500/10' },
  jha_acknowledgment: { icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  incident_trigger: { icon: AlertTriangle, color: 'text-amber-400', bg: 'bg-amber-500/10' },
  audit_access: { icon: Eye, color: 'text-slate-400', bg: 'bg-slate-500/10' }
};

const resultConfig: any = {
  verified: { label: 'Verified', color: 'text-emerald-400' },
  failed: { label: 'Failed', color: 'text-red-400' },
  blocked: { label: 'Blocked', color: 'text-red-400' },
  expired: { label: 'Expired', color: 'text-amber-400' }
};

export default function RecentActivity({ logs, employees }: Props) {
  const getEmployeeName = (employeeId: string) => {
    const employee =
      employees.find(e => e.id === employeeId) ||
      employees.find(e => e.employee_id === employeeId);
    return employee?.full_name || employee?.firstName && employee?.lastName
      ? `${employee.firstName} ${employee.lastName}`
      : 'Unknown Employee';
  };

  const formatVerificationType = (type?: string) => {
    if (!type) return 'Verification';
    return type
      .replace(/_/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <div className="rounded-2xl bg-slate-800/50 border border-slate-700/50 overflow-hidden">
      <div className="p-6 border-b border-slate-700/50">
        <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
        <p className="text-sm text-slate-400 mt-1">
          Latest verification events
        </p>
      </div>

      <div className="divide-y divide-slate-700/50">
        {logs.length === 0 ? (
          <div className="p-8 text-center text-slate-500">
            No activity recorded yet
          </div>
        ) : (
          logs.slice(0, 10).map((log, i) => {
            const event =
              eventConfig[log.verification_type] ||
              eventConfig.qr_scan;

            const result =
              resultConfig[log.result] ||
              resultConfig.verified;

            const EventIcon = event.icon;

            return (
              <div
                key={log.id}
                className="p-4 hover:bg-slate-700/20 transition-colors"
                style={{
                  animation: `fadeInLeft 0.3s ease-out ${i * 0.05}s both`
                }}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-2 rounded-lg ${event.bg} flex-shrink-0`}>
                    <EventIcon className={`w-4 h-4 ${event.color}`} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-medium text-white">
                          {getEmployeeName(log.employee_id)}
                        </p>
                        <p className="text-sm text-slate-400">
                          {formatVerificationType(log.verification_type)}
                        </p>
                      </div>

                      <span
                        className={`text-xs font-medium ${result.color} flex-shrink-0`}
                      >
                        {result.label}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                      {log.location && <span>{log.location}</span>}
                      <span>
                        {format(
                          new Date(log.created_at || log.created_date || log.timestamp),
                          'MMM d, h:mm a'
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <style jsx>{`
        @keyframes fadeInLeft {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
}
