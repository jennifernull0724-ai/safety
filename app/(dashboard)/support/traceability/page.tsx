'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, GitBranch, Search, CheckCircle, Clock, User, FileText, AlertCircle } from 'lucide-react';

/**
 * EVENT TRACEABILITY VIEWER
 * 
 * PURPOSE:
 * - Trace any event from origin to current state
 * - Show complete audit chain
 * - Verify every action is logged
 * - Support incident investigations
 * 
 * WHAT REVIEWERS NEED:
 * - "Can I trace this event back to its source?"
 * - "Who made this change and when?"
 * - "Is there a complete audit trail?"
 * - "Can I reproduce this sequence of events?"
 */

interface TraceNode {
  id: string;
  timestamp: string;
  eventType: string;
  description: string;
  performedBy: string;
  metadata: Record<string, any>;
  auditEntryId: string;
  relatedEvents?: string[];
}

interface TraceChain {
  rootEvent: TraceNode;
  chain: TraceNode[];
  complete: boolean;
  gaps: string[];
}

export default function TraceabilityPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<'employee' | 'event' | 'audit'>('employee');
  const [traceResult, setTraceResult] = useState<TraceChain | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    setIsSearching(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));

    // Mock trace result
    const mockTrace: TraceChain = {
      rootEvent: {
        id: 'evt-1001',
        timestamp: '2025-06-15T14:30:00Z',
        eventType: 'employee_created',
        description: 'Employee EMP-2401 created in system',
        performedBy: 'admin@company.com',
        metadata: {
          source: 'HRIS Import',
          importBatchId: 'BATCH-2025-06-15-001'
        },
        auditEntryId: 'AUDIT-10001'
      },
      chain: [
        {
          id: 'evt-1002',
          timestamp: '2025-06-15T14:32:00Z',
          eventType: 'certification_added',
          description: 'OSHA 10 certification added',
          performedBy: 'admin@company.com',
          metadata: {
            certificationType: 'OSHA 10',
            issueDate: '2025-06-15',
            expirationDate: '2029-06-15',
            issuingAuthority: 'OSHA Training Institute'
          },
          auditEntryId: 'AUDIT-10002',
          relatedEvents: ['evt-1001']
        },
        {
          id: 'evt-1003',
          timestamp: '2025-06-15T14:35:00Z',
          eventType: 'status_changed',
          description: 'Employee status changed to COMPLIANT',
          performedBy: 'system (automated)',
          metadata: {
            previousStatus: 'pending',
            newStatus: 'compliant',
            reason: 'All required certifications met'
          },
          auditEntryId: 'AUDIT-10003',
          relatedEvents: ['evt-1002']
        },
        {
          id: 'evt-1004',
          timestamp: '2025-08-22T10:15:00Z',
          eventType: 'qr_verified',
          description: 'QR code verified at Site Alpha',
          performedBy: 'field-user@company.com',
          metadata: {
            site: 'Site Alpha',
            latitude: 37.7749,
            longitude: -122.4194,
            verificationResult: 'COMPLIANT'
          },
          auditEntryId: 'AUDIT-10004',
          relatedEvents: ['evt-1003']
        },
        {
          id: 'evt-1005',
          timestamp: '2026-01-03T09:20:00Z',
          eventType: 'correction_submitted',
          description: 'Correction request for certification date',
          performedBy: 'compliance@company.com',
          metadata: {
            field: 'issueDate',
            previousValue: '2025-06-15',
            requestedValue: '2025-06-14',
            reason: 'Certification was actually issued on June 14, entered incorrectly',
            correctionId: 'CORR-456'
          },
          auditEntryId: 'AUDIT-10005',
          relatedEvents: ['evt-1002']
        },
        {
          id: 'evt-1006',
          timestamp: '2026-01-03T15:45:00Z',
          eventType: 'correction_approved',
          description: 'Correction request approved',
          performedBy: 'admin@company.com',
          metadata: {
            correctionId: 'CORR-456',
            approvalReason: 'Valid source documentation provided',
            evidenceAttached: true
          },
          auditEntryId: 'AUDIT-10006',
          relatedEvents: ['evt-1005']
        },
        {
          id: 'evt-1007',
          timestamp: '2026-01-03T15:46:00Z',
          eventType: 'certification_updated',
          description: 'OSHA 10 certification issue date corrected',
          performedBy: 'system (correction workflow)',
          metadata: {
            field: 'issueDate',
            oldValue: '2025-06-15',
            newValue: '2025-06-14',
            correctionId: 'CORR-456'
          },
          auditEntryId: 'AUDIT-10007',
          relatedEvents: ['evt-1006']
        }
      ],
      complete: true,
      gaps: []
    };

    setTraceResult(mockTrace);
    setIsSearching(false);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="flex items-center gap-4">
          <Link href="/support" className="text-slate-600 hover:text-slate-900">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Event Traceability</h1>
            <p className="text-sm text-slate-600">Trace events through the complete audit chain</p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Info Banner */}
        <div className="mb-8 p-6 bg-purple-50 border-2 border-purple-200 rounded-lg">
          <div className="flex items-start gap-3">
            <GitBranch className="w-6 h-6 text-purple-600 flex-shrink-0 mt-0.5" />
            <div>
              <h2 className="text-lg font-bold text-purple-900 mb-2">Complete Event Traceability</h2>
              <p className="text-sm text-purple-800 mb-3">
                Every action in the system creates an immutable audit entry. This tool traces events from 
                origin to current state, showing the complete chain of custody for any compliance decision.
              </p>
              <ul className="text-sm text-purple-800 space-y-1">
                <li>• <strong>100% traceable</strong> - every event has an audit trail</li>
                <li>• <strong>Tamper-evident</strong> - audit entries cannot be modified or deleted</li>
                <li>• <strong>Reproducible</strong> - same query always returns same historical state</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Search */}
        <section className="mb-8">
          <div className="p-6 bg-white border border-slate-200 rounded-lg">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Trace Event</h2>
            
            <div className="mb-4 flex items-center gap-3">
              <select
                value={searchType}
                onChange={(e) => setSearchType(e.target.value as any)}
                className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="employee">Employee ID</option>
                <option value="event">Event ID</option>
                <option value="audit">Audit Entry ID</option>
              </select>
              
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  searchType === 'employee' ? 'e.g., EMP-2401' :
                  searchType === 'event' ? 'e.g., evt-1001' :
                  'e.g., AUDIT-10001'
                }
                className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
              
              <button
                onClick={handleSearch}
                disabled={!searchQuery.trim() || isSearching}
                className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Search className="w-4 h-4" />
                {isSearching ? 'Searching...' : 'Trace'}
              </button>
            </div>

            <p className="text-sm text-slate-600">
              Enter an employee ID, event ID, or audit entry ID to view the complete event chain.
            </p>
          </div>
        </section>

        {/* Trace Results */}
        {traceResult && (
          <section>
            {/* Summary */}
            <div className="mb-6 p-6 bg-white border border-slate-200 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-slate-900">Trace Results</h2>
                <div className="flex items-center gap-2">
                  {traceResult.complete ? (
                    <div className="px-3 py-1 bg-green-100 text-green-900 text-sm font-bold rounded-full flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" />
                      COMPLETE CHAIN
                    </div>
                  ) : (
                    <div className="px-3 py-1 bg-amber-100 text-amber-900 text-sm font-bold rounded-full flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      GAPS DETECTED
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-slate-600 mb-1">Total Events</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {traceResult.chain.length + 1}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-600 mb-1">Time Span</p>
                  <p className="text-sm font-semibold text-slate-900">
                    {new Date(traceResult.rootEvent.timestamp).toLocaleDateString()} - 
                    {' '}{new Date(traceResult.chain[traceResult.chain.length - 1].timestamp).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-600 mb-1">Audit Gaps</p>
                  <p className={`text-2xl font-bold ${
                    traceResult.gaps.length === 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {traceResult.gaps.length}
                  </p>
                </div>
              </div>
            </div>

            {/* Event Timeline */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-900">Event Timeline</h3>
              
              {/* Root Event */}
              <div className="relative pl-8">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-purple-200"></div>
                <div className="absolute left-[-11px] top-6 w-6 h-6 bg-purple-600 rounded-full border-4 border-white"></div>
                
                <div className="p-6 bg-gradient-to-r from-purple-50 to-white border-2 border-purple-200 rounded-lg mb-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3">
                      <GitBranch className="w-6 h-6 text-purple-600 mt-1" />
                      <div>
                        <h4 className="text-lg font-bold text-purple-900">ROOT EVENT</h4>
                        <p className="text-sm text-purple-800">{traceResult.rootEvent.description}</p>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-purple-100 text-purple-900 text-xs font-bold rounded-full">
                      {traceResult.rootEvent.eventType}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-purple-700 mb-1">Timestamp</p>
                      <p className="text-sm font-semibold text-purple-900 flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {new Date(traceResult.rootEvent.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-purple-700 mb-1">Performed By</p>
                      <p className="text-sm font-semibold text-purple-900 flex items-center gap-2">
                        <User className="w-4 h-4" />
                        {traceResult.rootEvent.performedBy}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-purple-700 mb-1">Audit Entry</p>
                      <p className="text-sm font-mono font-semibold text-purple-900 flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        {traceResult.rootEvent.auditEntryId}
                      </p>
                    </div>
                  </div>

                  {Object.keys(traceResult.rootEvent.metadata).length > 0 && (
                    <div className="p-4 bg-white rounded border border-purple-200">
                      <p className="text-xs font-bold text-purple-900 mb-2">Metadata</p>
                      <pre className="text-xs text-slate-700 overflow-x-auto">
                        {JSON.stringify(traceResult.rootEvent.metadata, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              </div>

              {/* Chain Events */}
              {traceResult.chain.map((event, index) => (
                <div key={event.id} className="relative pl-8">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-slate-200"></div>
                  <div className="absolute left-[-11px] top-6 w-6 h-6 bg-blue-600 rounded-full border-4 border-white"></div>
                  
                  <div className="p-6 bg-white border border-slate-200 rounded-lg hover:border-purple-300 transition-colors mb-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="text-lg font-bold text-slate-900">{event.description}</h4>
                        <p className="text-sm text-slate-600">Step {index + 1} of {traceResult.chain.length}</p>
                      </div>
                      <span className="px-3 py-1 bg-blue-100 text-blue-900 text-xs font-bold rounded-full">
                        {event.eventType}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-slate-600 mb-1">Timestamp</p>
                        <p className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          {new Date(event.timestamp).toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-600 mb-1">Performed By</p>
                        <p className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                          <User className="w-4 h-4" />
                          {event.performedBy}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-600 mb-1">Audit Entry</p>
                        <p className="text-sm font-mono font-semibold text-slate-900 flex items-center gap-2">
                          <FileText className="w-4 h-4" />
                          {event.auditEntryId}
                        </p>
                      </div>
                    </div>

                    {event.relatedEvents && event.relatedEvents.length > 0 && (
                      <div className="mb-4 p-3 bg-slate-50 rounded">
                        <p className="text-xs font-bold text-slate-900 mb-1">Related Events</p>
                        <p className="text-xs font-mono text-slate-700">
                          {event.relatedEvents.join(', ')}
                        </p>
                      </div>
                    )}

                    {Object.keys(event.metadata).length > 0 && (
                      <details className="p-4 bg-slate-50 rounded border border-slate-200">
                        <summary className="cursor-pointer text-xs font-bold text-slate-900">
                          View Metadata
                        </summary>
                        <pre className="mt-2 text-xs text-slate-700 overflow-x-auto">
                          {JSON.stringify(event.metadata, null, 2)}
                        </pre>
                      </details>
                    )}
                  </div>
                </div>
              ))}

              {/* End Marker */}
              <div className="relative pl-8">
                <div className="absolute left-[-11px] top-0 w-6 h-6 bg-green-600 rounded-full border-4 border-white flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
                <p className="text-sm font-semibold text-green-600 pt-1">
                  End of trace (current state)
                </p>
              </div>
            </div>
          </section>
        )}

        {/* No Results */}
        {!traceResult && !isSearching && (
          <div className="p-12 bg-white border border-slate-200 rounded-lg text-center">
            <GitBranch className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-600">Enter a search query to trace events through the system</p>
          </div>
        )}
      </div>
    </div>
  );
}
