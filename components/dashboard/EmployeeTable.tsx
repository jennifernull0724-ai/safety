import React from 'react';
import Link from 'next/link';
import {
  User,
  Building2,
  QrCode,
  ChevronRight,
  Shield,
  AlertTriangle,
  Clock,
  Ban
} from 'lucide-react';

/**
 * EMPLOYEE TABLE COMPONENT (PRESENTATION-ONLY)
 * 
 * HARD RULES:
 * - NO BASE44
 * - NO DATA FETCHING OR MUTATION
 * - NO MOCK OR FABRICATED DATA
 * - ALL ROWS RENDERED EXCLUSIVELY FROM PROPS
 * 
 * ACCEPTABLE LOGIC (ALLOWED):
 * - Conditional rendering (empty state)
 * - Status mapping for labels/icons
 * - Presentation-only animation
 * - Routing via provided employee identifiers
 */

type Props = {
  employees: any[];
};

const statusConfig: any = {
  compliant: {
    label: 'Compliant',
    icon: Shield,
    className: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
  },
  active: {
    label: 'Compliant',
    icon: Shield,
    className: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
  },
  non_compliant: {
    label: 'Non-Compliant',
    icon: AlertTriangle,
    className: 'bg-amber-500/10 text-amber-400 border-amber-500/20'
  },
  pending: {
    label: 'Pending',
    icon: Clock,
    className: 'bg-blue-500/10 text-blue-400 border-blue-500/20'
  },
  blocked: {
    label: 'Blocked',
    icon: Ban,
    className: 'bg-red-500/10 text-red-400 border-red-500/20'
  }
};

const industryLabels: any = {
  railroad: 'Railroad',
  construction: 'Construction',
  environmental: 'Environmental',
  general: 'General'
};

export default function EmployeeTable({ employees }: Props) {
  return (
    <div className="rounded-2xl bg-slate-800/50 border border-slate-700/50 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-700/50">
              <th className="text-left px-4 py-3 text-slate-400 font-medium text-sm">
                Employee
              </th>
              <th className="text-left px-4 py-3 text-slate-400 font-medium text-sm">
                Employer
              </th>
              <th className="text-left px-4 py-3 text-slate-400 font-medium text-sm">
                Industry
              </th>
              <th className="text-left px-4 py-3 text-slate-400 font-medium text-sm">
                Status
              </th>
              <th className="text-right px-4 py-3 text-slate-400 font-medium text-sm">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {employees.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="text-center py-12 text-slate-500 px-4"
                >
                  No employees found
                </td>
              </tr>
            ) : (
              employees.map((employee, i) => {
                const status =
                  statusConfig[employee.status] || statusConfig.pending;
                const StatusIcon = status.icon;

                return (
                  <tr
                    key={employee.id}
                    className="border-b border-slate-700/50 hover:bg-slate-700/20 transition-colors"
                    style={{
                      animation: `fadeInUp 0.3s ease-out ${i * 0.05}s both`
                    }}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-700/50 flex items-center justify-center overflow-hidden flex-shrink-0">
                          {employee.photo_url ? (
                            <img
                              src={employee.photo_url}
                              alt={employee.full_name || `${employee.firstName} ${employee.lastName}`}
                              className="w-10 h-10 rounded-xl object-cover"
                            />
                          ) : (
                            <User className="w-5 h-5 text-slate-400" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-white">
                            {employee.full_name || `${employee.firstName} ${employee.lastName}`}
                          </div>
                          <div className="text-sm text-slate-500">
                            {employee.employee_id || employee.employeeId}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 text-slate-300">
                        <Building2 className="w-4 h-4 text-slate-500" />
                        {employee.employer || employee.organization?.name || 'N/A'}
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <span className="text-slate-400">
                        {industryLabels[employee.industry] ||
                          employee.industry ||
                          'General'}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium border ${status.className}`}
                      >
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {status.label}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/people/employees/${employee.id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                      >
                        <QrCode className="w-4 h-4" />
                        View
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
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
