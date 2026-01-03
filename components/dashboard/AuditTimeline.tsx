import React from 'react';
import { format } from 'date-fns';
import {
  AlertTriangle,
  Ban,
  QrCode,
  Eye,
  FileWarning,
  Gavel,
  FileCheck
} from 'lucide-react';

/**
 * AUDIT TIMELINE COMPONENT (PRESENTATION-ONLY)
 * 
 * HARD RULES:
 * - NO BASE44
 * - NO DATA FETCHING OR MUTATION
 * - NO MOCK OR FABRICATED AUDIT EVENTS
 * - ALL ENTRIES RENDERED EXCLUSIVELY FROM PROPS
 * 
 * ACCEPTABLE LOGIC (ALLOWED):
 * - Mapping event_type to icon/color
 * - Mapping severity to visual emphasis
 * - Time formatting
 * - Display limiting (e.g. latest 10)
 * - Animation for presentation only
 */

type Props = {
  events: any[];
};

const eventTypeConfig: any = {
  certification_issued: {
    icon: FileCheck,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500'
  },
  certification_expired: {
    icon: AlertTriangle,
    color: 'text-amber-400',
    bg: 'bg-amber-500'
  },
  employee_blocked: {
    icon: Ban,
    color: 'text-red-400',
    bg: 'bg-red-500'
  },
  qr_scanned: {
    icon: QrCode,
    color: 'text-blue-400',
    bg: 'bg-blue-500'
  },
  audit_accessed: {
    icon: Eye,
    color: 'text-slate-400',
    bg: 'bg-slate-500'
  },
  incident_reported: {
    icon: FileWarning,
    color: 'text-red-400',
    bg: 'bg-red-500'
  },
  enforcement_action: {
    icon: Gavel,
    color: 'text-violet-400',
    bg: 'bg-violet-500'
  }
};

const severityConfig: any = {
  info: 'border-slate-700/50',
  warning: 'border-amber-500/30',
  critical: 'border-red-500/30'
};

export default function AuditTimeline({ events }: Props) {
  return (
    <div className="rounded-2xl bg-slate-800/50 border border-slate-700/50 overflow-hidden">
      <div className="p-6 border-b border-slate-700/50">
        <h3 className="text-lg font-semibold text-white">Audit Trail</h3>
        <p className="text-sm text-slate-400 mt-1">
          Immutable event ledger
        </p>
      </div>

      <div className="p-6">
        {events.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            No audit events recorded
          </div>
        ) : (
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-4 top-0 bottom-0 w-px bg-slate-700/50" />

            <div className="space-y-6">
              {events.slice(0, 10).map((event, i) => {
                const config =
                  eventTypeConfig[event.event_type] ||
                  eventTypeConfig.qr_scanned;

                const EventIcon = config.icon;
                const severityBorder =
                  severityConfig[event.severity] ||
                  severityConfig.info;

                return (
                  <div
                    key={event.id}
                    className="relative flex gap-4"
                    style={{
                      animation: `fadeInLeft 0.3s ease-out ${i * 0.05}s both`
                    }}
                  >
                    {/* Timeline dot */}
                    <div
                      className={`w-8 h-8 rounded-full ${config.bg}
                                  flex items-center justify-center z-10 flex-shrink-0`}
                    >
                      <EventIcon className="w-4 h-4 text-white" />
                    </div>

                    {/* Content */}
                    <div
                      className={`flex-1 p-4 rounded-xl bg-slate-700/30
                                  border ${severityBorder}`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-sm font-medium text-white">
                            {event.description}
                          </p>
                          {event.actor && (
                            <p className="text-xs text-slate-400 mt-1">
                              by {event.actor}
                            </p>
                          )}
                        </div>

                        <span className="text-xs text-slate-500 whitespace-nowrap">
                          {format(
                            new Date(
                              event.created_at || event.created_date || event.timestamp
                            ),
                            'MMM d, h:mm a'
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
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
