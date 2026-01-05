'use client';

import { useState } from 'react';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Upload,
  FileText,
  Users,
  Download,
  Play
} from 'lucide-react';

/**
 * BULK CREW VALIDATION TOOL
 * 
 * PURPOSE:
 * - Validate large crew lists before assignment
 * - CSV upload for batch validation
 * - Identify compliance issues across entire crew
 * - Export validation reports
 * 
 * USE CASES:
 * - "I have a 50-person job starting next week — who's eligible?"
 * - "Upload crew roster from scheduling system for validation"
 * - "Pre-validate before submitting assignments"
 * 
 * WORKFLOW:
 * 1. Upload CSV with employee IDs and job dates
 * 2. System validates each employee
 * 3. Shows pass/fail with reasons
 * 4. Export validation report
 */

interface ValidationResult {
  employeeId: string;
  fullName: string;
  tradeRole: string;
  status: 'valid' | 'warning' | 'invalid';
  message: string;
  blockers?: string[];
  warnings?: string[];
}

export default function CrewValidationTool() {
  const [file, setFile] = useState<File | null>(null);
  const [jobStartDate, setJobStartDate] = useState('');
  const [jobEndDate, setJobEndDate] = useState('');
  const [validating, setValidating] = useState(false);
  const [results, setResults] = useState<ValidationResult[]>([]);
  const [validated, setValidated] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setValidated(false);
      setResults([]);
    }
  };

  const validateCrew = async () => {
    if (!file || !jobStartDate || !jobEndDate) {
      alert('Please select a file and enter job dates');
      return;
    }

    setValidating(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('startDate', jobStartDate);
      formData.append('endDate', jobEndDate);

      const res = await fetch('/api/dispatch/validate-bulk', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setResults(data.results);
        setValidated(true);
      } else {
        alert('Validation failed');
      }
    } catch (err) {
      console.error('Validation error');
      alert('Validation error');
    } finally {
      setValidating(false);
    }
  };

  const exportResults = () => {
    const csv = [
      ['Employee ID', 'Name', 'Trade', 'Status', 'Message', 'Blockers', 'Warnings'].join(','),
      ...results.map(r => [
        r.employeeId,
        r.fullName,
        r.tradeRole,
        r.status.toUpperCase(),
        r.message,
        r.blockers?.join('; ') || '',
        r.warnings?.join('; ') || ''
      ].join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `crew-validation-${jobStartDate}.csv`;
    a.click();
  };

  const downloadTemplate = () => {
    const template = 'Employee ID,Name (optional)\nEMP001,John Smith\nEMP002,Jane Doe';
    const blob = new Blob([template], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'crew-validation-template.csv';
    a.click();
  };

  const stats = {
    total: results.length,
    valid: results.filter(r => r.status === 'valid').length,
    warnings: results.filter(r => r.status === 'warning').length,
    invalid: results.filter(r => r.status === 'invalid').length,
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Users className="w-8 h-8 text-blue-400" />
          <h1 className="text-3xl font-bold">Bulk Crew Validation</h1>
        </div>
        <p className="text-slate-400">Upload crew roster for batch eligibility checking</p>
      </div>

      {/* Upload Section */}
      <div className="mb-6 p-6 bg-slate-800/50 border border-slate-700 rounded-lg">
        <h2 className="text-lg font-bold mb-4">Step 1: Upload Crew List</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-slate-400">Job Start Date</label>
            <input
              type="date"
              className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
              value={jobStartDate}
              onChange={e => setJobStartDate(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-slate-400">Job End Date</label>
            <input
              type="date"
              className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
              value={jobEndDate}
              onChange={e => setJobEndDate(e.target.value)}
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2 text-slate-400">
            Upload CSV File (Employee IDs)
          </label>
          <div className="flex gap-3">
            <label className="flex-1 flex items-center justify-center gap-3 px-6 py-8 bg-slate-900 border-2 border-dashed border-slate-700 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-slate-800/50">
              <Upload className="w-6 h-6 text-slate-400" />
              <div>
                <div className="font-medium text-white">
                  {file ? file.name : 'Click to upload CSV'}
                </div>
                <div className="text-sm text-slate-400">
                  or drag and drop
                </div>
              </div>
              <input
                type="file"
                accept=".csv"
                className="hidden"
                onChange={handleFileUpload}
              />
            </label>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={downloadTemplate}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg flex items-center gap-2 text-sm"
          >
            <Download className="w-4 h-4" />
            Download CSV Template
          </button>
        </div>
      </div>

      {/* Validation Action */}
      {file && jobStartDate && jobEndDate && !validated && (
        <div className="mb-6">
          <button
            onClick={validateCrew}
            disabled={validating}
            className="w-full px-8 py-4 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 rounded-lg flex items-center justify-center gap-3 font-bold text-lg"
          >
            <Play className="w-6 h-6" />
            {validating ? 'Validating...' : 'Validate Crew'}
          </button>
        </div>
      )}

      {/* Results */}
      {validated && results.length > 0 && (
        <>
          {/* Summary Stats */}
          <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 bg-slate-800/50 border border-slate-700 rounded-lg">
              <div className="text-2xl font-bold">{stats.total}</div>
              <div className="text-sm text-slate-400">Total Crew</div>
            </div>

            <div className="p-4 bg-emerald-900/20 border border-emerald-800/50 rounded-lg">
              <div className="text-2xl font-bold text-emerald-400">{stats.valid}</div>
              <div className="text-sm text-emerald-300">Valid</div>
            </div>

            <div className="p-4 bg-amber-900/20 border border-amber-800/50 rounded-lg">
              <div className="text-2xl font-bold text-amber-400">{stats.warnings}</div>
              <div className="text-sm text-amber-300">Warnings</div>
            </div>

            <div className="p-4 bg-red-900/20 border border-red-800/50 rounded-lg">
              <div className="text-2xl font-bold text-red-400">{stats.invalid}</div>
              <div className="text-sm text-red-300">Invalid</div>
            </div>
          </div>

          {/* Export Button */}
          <div className="mb-6 flex justify-end">
            <button
              onClick={exportResults}
              className="px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg flex items-center gap-2 font-medium"
            >
              <Download className="w-5 h-5" />
              Export Validation Report
            </button>
          </div>

          {/* Results List */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
            <h2 className="text-lg font-bold mb-4">Validation Results</h2>
            
            {stats.invalid > 0 && (
              <div className="mb-4 p-4 bg-red-900/30 border-2 border-red-600 rounded-lg">
                <div className="flex items-center gap-2 text-red-300">
                  <XCircle className="w-5 h-5" />
                  <span className="font-bold">
                    {stats.invalid} crew member(s) cannot be assigned
                  </span>
                </div>
              </div>
            )}

            <div className="space-y-3">
              {results.map((result, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-lg border-2 ${
                    result.status === 'valid'
                      ? 'bg-emerald-900/20 border-emerald-800/50'
                      : result.status === 'warning'
                      ? 'bg-amber-900/20 border-amber-800/50'
                      : 'bg-red-900/20 border-red-800/50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {result.status === 'valid' ? (
                      <CheckCircle className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                    ) : result.status === 'warning' ? (
                      <AlertTriangle className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-medium text-white">{result.fullName || result.employeeId}</span>
                        <span className="text-sm text-slate-400">{result.employeeId}</span>
                        {result.tradeRole && (
                          <span className="px-2 py-0.5 bg-slate-700 text-slate-300 text-xs rounded">
                            {result.tradeRole}
                          </span>
                        )}
                      </div>
                      <div className={`text-sm mb-2 ${
                        result.status === 'valid'
                          ? 'text-emerald-300'
                          : result.status === 'warning'
                          ? 'text-amber-300'
                          : 'text-red-300'
                      }`}>
                        {result.message}
                      </div>
                      {result.blockers && result.blockers.length > 0 && (
                        <div className="mt-2">
                          <div className="text-xs font-bold text-red-400 mb-1">Blockers:</div>
                          <ul className="space-y-1">
                            {result.blockers.map((blocker, i) => (
                              <li key={i} className="text-sm text-red-300 flex items-start gap-2">
                                <span className="text-red-400 mt-1">•</span>
                                <span>{blocker}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {result.warnings && result.warnings.length > 0 && (
                        <div className="mt-2">
                          <div className="text-xs font-bold text-amber-400 mb-1">Warnings:</div>
                          <ul className="space-y-1">
                            {result.warnings.map((warning, i) => (
                              <li key={i} className="text-sm text-amber-300 flex items-start gap-2">
                                <span className="text-amber-400 mt-1">•</span>
                                <span>{warning}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Summary Action */}
          {stats.invalid === 0 && (
            <div className="mt-6 p-6 bg-emerald-900/20 border-2 border-emerald-600 rounded-lg">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-emerald-400" />
                <div>
                  <h3 className="font-bold text-emerald-300 text-lg">All Crew Members Validated ✓</h3>
                  <p className="text-emerald-200">
                    {stats.total} employees eligible for assignment.
                    {stats.warnings > 0 && ` ${stats.warnings} warning(s) noted for review.`}
                  </p>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Instructions */}
      {!validated && (
        <div className="mt-6 p-6 bg-slate-800/50 border border-slate-700 rounded-lg">
          <h3 className="font-bold mb-3 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-400" />
            How to Use Bulk Validation
          </h3>
          <ol className="space-y-2 text-sm text-slate-400 ml-6 list-decimal">
            <li>Download the CSV template or prepare your own</li>
            <li>Include employee IDs (one per row)</li>
            <li>Enter job start and end dates</li>
            <li>Upload CSV file</li>
            <li>Click "Validate Crew" to check eligibility</li>
            <li>Review results and export validation report</li>
          </ol>
          <div className="mt-4 p-3 bg-blue-900/20 border border-blue-800/50 rounded">
            <p className="text-sm text-blue-300">
              <strong>Note:</strong> Validation checks certification status as of the job start date. 
              Workers with expiring certifications will show warnings.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
