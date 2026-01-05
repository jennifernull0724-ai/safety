'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Clock, 
  FileCheck, 
  User,
  AlertCircle,
  CheckCircle,
  Download,
  ArrowLeft,
  Shield,
  Calendar
} from 'lucide-react';
import { PublicLayout } from '@/components/PublicLayout';

/**
 * AUDIT TIMELINE VIEWER FOR REGULATORS
 * 
 * PURPOSE:
 * - Public access (NO LOGIN REQUIRED)
 * - Chronological view of all compliance events
 * - Tamper-evident historical state reconstruction
 * - Simple, non-technical interface
 * 
 * CRITICAL FEATURES:
 * - Show ALL certification changes with timestamps
 * - Show WHO made each change and WHY
 * - Point-in-time state reconstruction ("Was employee X compliant on June 15?")
 * - Clear visual timeline
 * - Download/export capability
 */

interface TimelineEvent {
  id: string;
  timestamp: string;
  eventType: 'certification_added' | 'certification_expired' | 'certification_renewed' | 'status_changed' | 'verification_scan' | 'correction_applied';
  description: string;
  performedBy: string;
  reason?: string;
  previousValue?: string;
  newValue?: string;
  complianceStatus: 'compliant' | 'non_compliant' | 'expiring_soon';
  evidenceFiles?: string[];
}

export default function AuditTimelinePage() {
  const [employeeId, setEmployeeId] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [pointInTimeDate, setPointInTimeDate] = useState('');
  const [pointInTimeStatus, setPointInTimeStatus] = useState<{
    compliant: boolean;
    certifications: { name: string; status: string }[];
  } | null>(null);

  // PLACEHOLDER: Fetch timeline from API
  const fetchTimeline = async () => {
    if (!employeeId) return;
    setLoading(true);
    
    try {
      // In production: const response = await fetch(`/api/regulator/timeline/${employeeId}?date=${dateFilter}`);
      // const data = await response.json();
      // setTimeline(data.events);
      
      // MOCK DATA for demonstration
      setTimeline([
        {
          id: '1',
          timestamp: '2025-12-15T14:30:00Z',
          eventType: 'certification_added',
          description: 'OSHA 30 certification added',
          performedBy: 'Sarah Johnson (Compliance Admin)',
          reason: 'New hire certification upload',
          newValue: 'OSHA 30 - Expires 2028-12-01',
          complianceStatus: 'compliant',
          evidenceFiles: ['osha-30-cert.pdf']
        },
        {
          id: '2',
          timestamp: '2026-01-03T09:15:00Z',
          eventType: 'verification_scan',
          description: 'QR verification scan - Chicago Yard Gate 5',
          performedBy: 'Mark Wilson (Site Supervisor)',
          complianceStatus: 'compliant'
        },
        {
          id: '3',
          timestamp: '2026-01-04T11:20:00Z',
          eventType: 'certification_expired',
          description: 'First Aid/CPR certification expired',
          performedBy: 'System (Automated)',
          previousValue: 'First Aid/CPR - Valid',
          newValue: 'First Aid/CPR - EXPIRED',
          complianceStatus: 'non_compliant'
        }
      ]);
    } catch (error) {
      console.error('Failed to fetch timeline:', error);
    } finally {
      setLoading(false);
    }
  };

  // PLACEHOLDER: Query point-in-time status
  const queryPointInTime = async () => {
    if (!employeeId || !pointInTimeDate) return;
    
    try {
      // In production: const response = await fetch(`/api/regulator/point-in-time/${employeeId}?date=${pointInTimeDate}`);
      // const data = await response.json();
      // setPointInTimeStatus(data);
      
      // MOCK DATA
      setPointInTimeStatus({
        compliant: true,
        certifications: [
          { name: 'OSHA 30', status: 'Valid - Expires 2028-12-01' },
          { name: 'First Aid/CPR', status: 'Valid - Expires 2026-01-03' },
          { name: 'Railroad Safety', status: 'Valid - Expires 2027-06-15' }
        ]
      });
    } catch (error) {
      console.error('Failed to query point-in-time status:', error);
    }
  };

  const downloadTimeline = () => {
    // PLACEHOLDER: Export timeline as PDF or CSV
    alert('Timeline export functionality - would download CSV/PDF of all events');
  };

  return (
    <PublicLayout>
      <div className="max-w-5xl mx-auto px-4 md:px-6 py-8 md:py-16">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/regulator" 
            className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Regulator Access
          </Link>
          <div className="flex items-center gap-4">
            <Clock className="w-12 h-12 text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                Audit Timeline Viewer
              </h1>
              <p className="text-lg text-slate-600 mt-1">
                Chronological compliance history — Tamper-evident and publicly accessible
              </p>
            </div>
          </div>
        </div>

        {/* Search Section */}
        <section className="mb-8 p-6 bg-white border border-slate-200 rounded-lg">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Search Employee Timeline</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Employee ID or Name
              </label>
              <input
                type="text"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                placeholder="Enter employee ID (e.g., EMP-12345) or name"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Date Range (Optional)
              </label>
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="mt-1 text-sm text-slate-600">
                Leave blank to see all events. Enter a date to filter events from that date forward.
              </p>
            </div>

            <button
              onClick={fetchTimeline}
              disabled={!employeeId || loading}
              className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Loading...' : 'View Timeline'}
            </button>
          </div>
        </section>

        {/* Point-in-Time Query */}
        {timeline.length > 0 && (
          <section className="mb-8 p-6 bg-blue-50 border-2 border-blue-200 rounded-lg">
            <div className="flex items-start gap-4 mb-4">
              <Calendar className="w-8 h-8 text-blue-600 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h2 className="text-xl font-bold text-blue-900 mb-2">
                  Point-in-Time Compliance Query
                </h2>
                <p className="text-slate-700 mb-4">
                  See exactly what this employee's compliance status was on a specific past date. Critical 
                  for incident investigations and historical verification.
                </p>
                
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Select Date
                    </label>
                    <input
                      type="date"
                      value={pointInTimeDate}
                      onChange={(e) => setPointInTimeDate(e.target.value)}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={queryPointInTime}
                      disabled={!pointInTimeDate}
                      className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed"
                    >
                      Query Status
                    </button>
                  </div>
                </div>

                {/* Point-in-Time Results */}
                {pointInTimeStatus && (
                  <div className="mt-4 p-4 bg-white border border-blue-200 rounded-lg">
                    <div className="flex items-center gap-3 mb-3">
                      {pointInTimeStatus.compliant ? (
                        <>
                          <CheckCircle className="w-6 h-6 text-green-600" />
                          <span className="font-bold text-green-900 text-lg">
                            COMPLIANT on {pointInTimeDate}
                          </span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="w-6 h-6 text-red-600" />
                          <span className="font-bold text-red-900 text-lg">
                            NOT COMPLIANT on {pointInTimeDate}
                          </span>
                        </>
                      )}
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-semibold text-slate-700">Certifications on this date:</p>
                      {pointInTimeStatus.certifications.map((cert, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-sm text-slate-700">
                          <span className="text-blue-600">•</span>
                          <span><strong>{cert.name}:</strong> {cert.status}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Timeline Display */}
        {timeline.length > 0 && (
          <section className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900">
                Compliance Timeline
              </h2>
              <button
                onClick={downloadTimeline}
                className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white font-semibold rounded-lg hover:bg-slate-800"
              >
                <Download className="w-5 h-5" />
                Export Timeline
              </button>
            </div>

            <div className="space-y-6">
              {timeline.map((event, index) => (
                <div 
                  key={event.id} 
                  className={`relative pl-8 pb-6 ${index !== timeline.length - 1 ? 'border-l-2 border-slate-200' : ''}`}
                >
                  {/* Timeline Dot */}
                  <div className="absolute left-0 top-0 -ml-2.5 w-5 h-5 rounded-full bg-blue-600 border-2 border-white" />
                  
                  {/* Event Card */}
                  <div className="p-5 bg-white border border-slate-200 rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {event.eventType === 'certification_added' && <FileCheck className="w-6 h-6 text-green-600" />}
                        {event.eventType === 'certification_expired' && <AlertCircle className="w-6 h-6 text-red-600" />}
                        {event.eventType === 'certification_renewed' && <CheckCircle className="w-6 h-6 text-blue-600" />}
                        {event.eventType === 'verification_scan' && <Shield className="w-6 h-6 text-blue-600" />}
                        {event.eventType === 'correction_applied' && <FileCheck className="w-6 h-6 text-amber-600" />}
                        
                        <div>
                          <h3 className="font-bold text-slate-900">{event.description}</h3>
                          <p className="text-sm text-slate-600">
                            {new Date(event.timestamp).toLocaleString('en-US', {
                              dateStyle: 'medium',
                              timeStyle: 'short'
                            })}
                          </p>
                        </div>
                      </div>
                      
                      {/* Compliance Status Badge */}
                      <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                        event.complianceStatus === 'compliant' ? 'bg-green-100 text-green-900' :
                        event.complianceStatus === 'non_compliant' ? 'bg-red-100 text-red-900' :
                        'bg-yellow-100 text-yellow-900'
                      }`}>
                        {event.complianceStatus === 'compliant' ? 'COMPLIANT' :
                         event.complianceStatus === 'non_compliant' ? 'NOT COMPLIANT' :
                         'EXPIRING SOON'}
                      </div>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-start gap-2">
                        <User className="w-4 h-4 text-slate-600 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-700">
                          <strong>Performed by:</strong> {event.performedBy}
                        </span>
                      </div>
                      
                      {event.reason && (
                        <div className="flex items-start gap-2">
                          <FileCheck className="w-4 h-4 text-slate-600 flex-shrink-0 mt-0.5" />
                          <span className="text-slate-700">
                            <strong>Reason:</strong> {event.reason}
                          </span>
                        </div>
                      )}
                      
                      {event.previousValue && event.newValue && (
                        <div className="p-3 bg-slate-50 rounded mt-2">
                          <div className="text-slate-700">
                            <strong>Change:</strong> {event.previousValue} → {event.newValue}
                          </div>
                        </div>
                      )}
                      
                      {event.evidenceFiles && event.evidenceFiles.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-slate-200">
                          <p className="text-xs font-semibold text-slate-700 mb-2">Evidence Files:</p>
                          {event.evidenceFiles.map((file, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                              <Download className="w-4 h-4 text-blue-600" />
                              <a href="#" className="text-blue-600 hover:text-blue-800 underline text-sm">
                                {file}
                              </a>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Empty State */}
        {timeline.length === 0 && (
          <div className="text-center py-12 text-slate-600">
            <Clock className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <p className="text-lg">Enter an employee ID to view their compliance timeline</p>
          </div>
        )}

        {/* Help Section */}
        <section className="p-6 bg-slate-50 border border-slate-200 rounded-lg">
          <h3 className="text-lg font-bold text-slate-900 mb-3">How to Use This Tool</h3>
          <ul className="space-y-2 text-sm text-slate-700">
            <li className="flex items-start gap-2">
              <span className="text-blue-600">1.</span>
              <span>Enter the employee ID or name you want to investigate</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600">2.</span>
              <span>Optionally filter by date range to see events after a specific date</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600">3.</span>
              <span>Review the chronological timeline of all certification and verification events</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600">4.</span>
              <span>Use "Point-in-Time Query" to see compliance status on a specific past date</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600">5.</span>
              <span>Download the timeline for inclusion in your audit or investigation report</span>
            </li>
          </ul>
        </section>
      </div>
    </PublicLayout>
  );
}
