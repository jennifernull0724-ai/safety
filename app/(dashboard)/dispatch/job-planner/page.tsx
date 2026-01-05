'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Briefcase,
  Calendar,
  Users,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Plus,
  Trash2,
  ArrowLeft,
  Download,
  Send
} from 'lucide-react';

/**
 * JOB ASSIGNMENT PLANNER
 * 
 * PURPOSE:
 * - Pre-validate crew assignments before dispatch
 * - Prevent last-minute compliance failures
 * - Surface hidden issues early
 * - Generate assignment reports
 * 
 * WORKFLOW:
 * 1. Enter job details (name, date, required trades)
 * 2. Add employees to proposed crew
 * 3. System validates eligibility
 * 4. Shows pass/fail with reasons
 * 5. Export validated crew list
 * 
 * PREVENTS:
 * - Assigning blocked workers
 * - Assigning workers with expiring certs
 * - Last-minute job site surprises
 */

interface ProposedCrewMember {
  employeeId: string;
  fullName: string;
  tradeRole: string;
  validationStatus: 'valid' | 'warning' | 'invalid';
  validationMessage: string;
  expiringCerts?: string[];
}

interface JobDetails {
  jobName: string;
  jobSite: string;
  startDate: string;
  endDate: string;
  requiredTrades: string[];
}

export default function JobPlannerPage() {
  const [jobDetails, setJobDetails] = useState<JobDetails>({
    jobName: '',
    jobSite: '',
    startDate: '',
    endDate: '',
    requiredTrades: [],
  });

  const [proposedCrew, setProposedCrew] = useState<ProposedCrewMember[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [validating, setValidating] = useState(false);
  const [validated, setValidated] = useState(false);

  const handleSearchEmployee = async () => {
    if (!searchQuery.trim()) return;

    try {
      const res = await fetch(`/api/dispatch/search-employee?q=${encodeURIComponent(searchQuery)}`);
      if (res.ok) {
        const data = await res.json();
        setSearchResults(data);
      }
    } catch (err) {
      console.error('Search failed');
    }
  };

  const addToCrew = async (employee: any) => {
    // Validate employee against job dates
    try {
      const res = await fetch('/api/dispatch/validate-assignment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          employeeId: employee.id,
          startDate: jobDetails.startDate,
          endDate: jobDetails.endDate,
        }),
      });

      if (res.ok) {
        const validation = await res.json();
        setProposedCrew([...proposedCrew, {
          employeeId: employee.id,
          fullName: employee.fullName,
          tradeRole: employee.tradeRole,
          validationStatus: validation.status,
          validationMessage: validation.message,
          expiringCerts: validation.expiringCerts,
        }]);
        setSearchQuery('');
        setSearchResults([]);
      }
    } catch (err) {
      console.error('Validation failed');
    }
  };

  const removeFromCrew = (employeeId: string) => {
    setProposedCrew(proposedCrew.filter(c => c.employeeId !== employeeId));
  };

  const validateEntireCrew = async () => {
    setValidating(true);
    try {
      const res = await fetch('/api/dispatch/validate-crew', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          crew: proposedCrew.map(c => c.employeeId),
          startDate: jobDetails.startDate,
          endDate: jobDetails.endDate,
        }),
      });

      if (res.ok) {
        const validatedCrew = await res.json();
        setProposedCrew(validatedCrew);
        setValidated(true);
      }
    } catch (err) {
      console.error('Crew validation failed');
    } finally {
      setValidating(false);
    }
  };

  const exportAssignment = () => {
    const csv = [
      ['Job Name', 'Job Site', 'Start Date', 'End Date', 'Employee ID', 'Name', 'Trade', 'Status', 'Warnings'].join(','),
      ...proposedCrew.map(member => [
        jobDetails.jobName,
        jobDetails.jobSite,
        jobDetails.startDate,
        jobDetails.endDate,
        member.employeeId,
        member.fullName,
        member.tradeRole,
        member.validationStatus.toUpperCase(),
        member.validationMessage
      ].join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `job-assignment-${jobDetails.jobName.replace(/\s+/g, '-')}-${jobDetails.startDate}.csv`;
    a.click();
  };

  const crewStats = {
    total: proposedCrew.length,
    valid: proposedCrew.filter(c => c.validationStatus === 'valid').length,
    warnings: proposedCrew.filter(c => c.validationStatus === 'warning').length,
    invalid: proposedCrew.filter(c => c.validationStatus === 'invalid').length,
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link href="/dispatch">
          <button className="mb-4 flex items-center gap-2 text-slate-400 hover:text-white">
            <ArrowLeft className="w-4 h-4" />
            Back to Dispatch Dashboard
          </button>
        </Link>
        <div className="flex items-center gap-3 mb-2">
          <Briefcase className="w-8 h-8 text-blue-400" />
          <h1 className="text-3xl font-bold">Job Assignment Planner</h1>
        </div>
        <p className="text-slate-400">Validate crew assignments before dispatch</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Job Details */}
        <div className="lg:col-span-1 space-y-6">
          {/* Job Details Form */}
          <div className="p-6 bg-slate-800/50 border border-slate-700 rounded-lg">
            <h2 className="text-lg font-bold mb-4">Job Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-slate-400">Job Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                  placeholder="e.g., Track Maintenance - Mile 45"
                  value={jobDetails.jobName}
                  onChange={e => setJobDetails({ ...jobDetails, jobName: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-slate-400">Job Site</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                  placeholder="e.g., Chicago Yard"
                  value={jobDetails.jobSite}
                  onChange={e => setJobDetails({ ...jobDetails, jobSite: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-slate-400">Start Date</label>
                <input
                  type="date"
                  className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                  value={jobDetails.startDate}
                  onChange={e => setJobDetails({ ...jobDetails, startDate: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-slate-400">End Date</label>
                <input
                  type="date"
                  className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                  value={jobDetails.endDate}
                  onChange={e => setJobDetails({ ...jobDetails, endDate: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Crew Stats */}
          {proposedCrew.length > 0 && (
            <div className="p-6 bg-slate-800/50 border border-slate-700 rounded-lg">
              <h3 className="font-bold mb-4">Crew Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Total Crew</span>
                  <span className="text-2xl font-bold">{crewStats.total}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-emerald-400">Validated</span>
                  <span className="text-xl font-bold text-emerald-400">{crewStats.valid}</span>
                </div>
                {crewStats.warnings > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-amber-400">Warnings</span>
                    <span className="text-xl font-bold text-amber-400">{crewStats.warnings}</span>
                  </div>
                )}
                {crewStats.invalid > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-red-400">Invalid</span>
                    <span className="text-xl font-bold text-red-400">{crewStats.invalid}</span>
                  </div>
                )}
              </div>

              {crewStats.invalid > 0 && (
                <div className="mt-4 p-3 bg-red-900/20 border border-red-800/50 rounded">
                  <p className="text-sm text-red-300">
                    ⚠️ Cannot dispatch with invalid crew members
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column - Crew Builder */}
        <div className="lg:col-span-2 space-y-6">
          {/* Add Employee Section */}
          <div className="p-6 bg-slate-800/50 border border-slate-700 rounded-lg">
            <h2 className="text-lg font-bold mb-4">Add Crew Members</h2>
            <div className="flex gap-3 mb-4">
              <input
                type="text"
                className="flex-1 px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                placeholder="Search employee by name or ID..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && handleSearchEmployee()}
              />
              <button
                onClick={handleSearchEmployee}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg font-medium"
              >
                Search
              </button>
            </div>

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="space-y-2">
                {searchResults.map(emp => (
                  <div
                    key={emp.id}
                    className="p-4 bg-slate-900/50 border border-slate-700 rounded-lg flex justify-between items-center"
                  >
                    <div>
                      <div className="font-medium text-white">{emp.fullName}</div>
                      <div className="text-sm text-slate-400">
                        {emp.employeeId} • {emp.tradeRole}
                      </div>
                    </div>
                    <button
                      onClick={() => addToCrew(emp)}
                      disabled={proposedCrew.some(c => c.employeeId === emp.id)}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 disabled:text-slate-500 rounded-lg flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Add
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Proposed Crew List */}
          <div className="p-6 bg-slate-800/50 border border-slate-700 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Proposed Crew ({proposedCrew.length})</h2>
              <div className="flex gap-2">
                {proposedCrew.length > 0 && (
                  <>
                    <button
                      onClick={validateEntireCrew}
                      disabled={validating}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 rounded-lg flex items-center gap-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      {validating ? 'Validating...' : 'Validate Crew'}
                    </button>
                    <button
                      onClick={exportAssignment}
                      className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg flex items-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Export
                    </button>
                  </>
                )}
              </div>
            </div>

            {proposedCrew.length === 0 ? (
              <div className="p-12 text-center text-slate-500">
                <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No crew members added yet</p>
                <p className="text-sm mt-1">Search and add employees above</p>
              </div>
            ) : (
              <div className="space-y-3">
                {proposedCrew.map(member => (
                  <div
                    key={member.employeeId}
                    className={`p-4 rounded-lg border-2 ${
                      member.validationStatus === 'valid'
                        ? 'bg-emerald-900/20 border-emerald-800/50'
                        : member.validationStatus === 'warning'
                        ? 'bg-amber-900/20 border-amber-800/50'
                        : member.validationStatus === 'invalid'
                        ? 'bg-red-900/20 border-red-800/50'
                        : 'bg-slate-900/50 border-slate-700'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          {member.validationStatus === 'valid' ? (
                            <CheckCircle className="w-5 h-5 text-emerald-400" />
                          ) : member.validationStatus === 'warning' ? (
                            <AlertTriangle className="w-5 h-5 text-amber-400" />
                          ) : member.validationStatus === 'invalid' ? (
                            <XCircle className="w-5 h-5 text-red-400" />
                          ) : (
                            <Calendar className="w-5 h-5 text-slate-400" />
                          )}
                          <div>
                            <div className="font-medium text-white">{member.fullName}</div>
                            <div className="text-sm text-slate-400">
                              {member.employeeId} • {member.tradeRole}
                            </div>
                          </div>
                        </div>
                        <div className={`text-sm ${
                          member.validationStatus === 'valid'
                            ? 'text-emerald-300'
                            : member.validationStatus === 'warning'
                            ? 'text-amber-300'
                            : member.validationStatus === 'invalid'
                            ? 'text-red-300'
                            : 'text-slate-400'
                        }`}>
                          {member.validationMessage}
                        </div>
                        {member.expiringCerts && member.expiringCerts.length > 0 && (
                          <div className="mt-2 text-xs text-amber-400">
                            Expiring: {member.expiringCerts.join(', ')}
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => removeFromCrew(member.employeeId)}
                        className="p-2 hover:bg-red-900/30 rounded"
                      >
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Dispatch Actions */}
          {validated && crewStats.invalid === 0 && proposedCrew.length > 0 && (
            <div className="p-6 bg-emerald-900/20 border-2 border-emerald-600 rounded-lg">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-emerald-400 mt-1" />
                  <div>
                    <h3 className="font-bold text-emerald-300 text-lg mb-1">Crew Validated ✓</h3>
                    <p className="text-emerald-200">
                      All {crewStats.total} crew members are eligible for assignment.
                      {crewStats.warnings > 0 && ` ${crewStats.warnings} warning(s) noted.`}
                    </p>
                  </div>
                </div>
                <button className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 rounded-lg flex items-center gap-2 font-bold">
                  <Send className="w-5 h-5" />
                  Submit to Dispatch
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
