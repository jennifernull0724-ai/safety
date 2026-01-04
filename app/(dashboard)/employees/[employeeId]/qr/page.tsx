'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';

interface Certification {
  id: string;
  presetCategory: string;
  certificationType: string;
  issuingAuthority: string | null;
  issueDate: string | null;
  expirationDate: string | null;
  isNonExpiring: boolean;
  status: 'PASS' | 'FAIL' | 'INCOMPLETE';
  createdAt: string;
  lastVerifiedAt: string | null;
  mediaFiles: Array<{
    id: string;
    objectPath: string;
    uploadedAt: string;
  }>;
}

interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  tradeRole: string;
  status: string;
  photoMediaId: string | null;
  organization: {
    name: string;
  };
}

/**
 * INTERNAL QR PAGE (AUTHENTICATED)
 * 
 * PURPOSE: Compliance management + proof upload
 * 
 * FEATURES:
 * - Employee identity card with QR code
 * - Compliance table with all certifications
 * - Upload proof modal
 * - Snapshot generation
 */
export default function InternalEmployeeQRPage() {
  const params = useParams();
  const employeeId = params?.employeeId as string;

  const [employee, setEmployee] = useState<Employee | null>(null);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [qrToken, setQrToken] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Upload modal state
  const [selectedCert, setSelectedCert] = useState<Certification | null>(null);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [expirationDate, setExpirationDate] = useState<string>('');
  const [issueDate, setIssueDate] = useState<string>('');
  const [isNonExpiring, setIsNonExpiring] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (employeeId) {
      fetchEmployeeData();
    }
  }, [employeeId]);

  const fetchEmployeeData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const res = await fetch(`/api/internal/employees/${employeeId}`, {
        headers: {
          'x-user-id': 'system',
          'x-organization-id': 'placeholder',
        },
      });
      
      if (!res.ok) {
        if (res.status === 404) {
          throw new Error('Employee not found');
        }
        throw new Error('Failed to fetch employee data');
      }
      
      const data = await res.json();
      setEmployee(data.employee);
      setCertifications(data.certifications || []);
      setQrToken(data.qrToken || '');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async () => {
    if (!uploadFile || !selectedCert) return;

    // Validate required fields
    if (!selectedCert.isNonExpiring && !expirationDate) {
      alert('Expiration date is required for this certification');
      return;
    }

    if (!issueDate) {
      alert('Issue date is required');
      return;
    }

    try {
      setUploading(true);

      // 1. Get signed URL
      const signedUrlRes = await fetch(
        `/api/internal/employees/${employeeId}/certifications/${selectedCert.id}/signed-url`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-user-id': 'USER_PLACEHOLDER',
            'x-organization-id': 'ORG_PLACEHOLDER',
          },
          body: JSON.stringify({
            fileName: uploadFile.name,
            mimeType: uploadFile.type,
          }),
        }
      );

      if (!signedUrlRes.ok) throw new Error('Failed to get signed URL');
      const { signedUrl, bucket, objectPath } = await signedUrlRes.json();

      // 2. Upload to GCS
      // TODO: Implement actual GCS upload
      // await fetch(signedUrl, { method: 'PUT', body: uploadFile });

      // 3. Calculate checksum
      const arrayBuffer = await uploadFile.arrayBuffer();
      const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const checksumSha256 = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

      // 4. Confirm upload (creates evidence + ledger entry)
      const confirmRes = await fetch(
        `/api/internal/employees/${employeeId}/certifications/${selectedCert.id}/upload`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-user-id': 'USER_PLACEHOLDER',
            'x-organization-id': 'ORG_PLACEHOLDER',
          },
          body: JSON.stringify({
            bucket,
            objectPath,
            mimeType: uploadFile.type,
            sizeBytes: uploadFile.size,
            checksumSha256,
            issueDate,
            expirationDate: isNonExpiring ? null : expirationDate,
            issuingAuthority: selectedCert.issuingAuthority,
          }),
        }
      );

      if (!confirmRes.ok) {
        const errorData = await confirmRes.json();
        throw new Error(errorData.error || 'Upload failed');
      }

      // Success - refresh data
      await fetchEmployeeData();
      closeUploadModal();
      alert('Proof uploaded successfully');
    } catch (err: any) {
      alert('Upload failed: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const closeUploadModal = () => {
    setSelectedCert(null);
    setUploadFile(null);
    setExpirationDate('');
    setIssueDate('');
    setIsNonExpiring(false);
  };

  const generateSnapshot = async () => {
    if (!confirm('Generate immutable verification snapshot?')) return;
    
    try {
      // TODO: Implement snapshot generation endpoint
      alert('Snapshot generation not yet implemented');
    } catch (err: any) {
      alert('Snapshot generation failed: ' + err.message);
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-gray-600">Loading employee data...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="p-8 max-w-2xl mx-auto">
        <div className="bg-red-50 border-2 border-red-300 rounded-lg p-6 text-center">
          <div className="text-5xl mb-4">❌</div>
          <h2 className="text-xl font-bold text-red-900 mb-2">Error Loading Employee</h2>
          <p className="text-red-800">{error}</p>
          <button
            onClick={() => window.location.href = '/employee-directory'}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Back to Directory
          </button>
        </div>
      </div>
    );
  }
  
  if (!employee) {
    return (
      <div className="p-8 max-w-2xl mx-auto">
        <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-6 text-center">
          <div className="text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-yellow-900 mb-2">Employee Not Found</h2>
          <p className="text-yellow-800">The requested employee does not exist</p>
          <button
            onClick={() => window.location.href = '/employee-directory'}
            className="mt-4 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
          >
            Back to Directory
          </button>
        </div>
      </div>
    );
  }

  const groupedCerts = certifications.reduce((acc, cert) => {
    if (!acc[cert.presetCategory]) acc[cert.presetCategory] = [];
    acc[cert.presetCategory].push(cert);
    return acc;
  }, {} as Record<string, Certification[]>);

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* EMPLOYEE IDENTITY CARD (READ-ONLY) */}
      <div className="bg-white shadow-lg rounded-lg p-6">
        <div className="flex items-start gap-6">
          {/* Left: Photo + QR */}
          <div className="space-y-4">
            <div className="w-32 h-32 bg-gray-200 rounded-lg flex items-center justify-center">
              {employee.photoMediaId ? (
                <img
                  src={`/api/media/${employee.photoMediaId}`}
                  alt={employee.fullName}
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <span className="text-5xl text-gray-400">👤</span>
              )}
            </div>
            
            {/* QR Code */}
            <div className="w-32 h-32 bg-white border-2 border-gray-300 rounded-lg flex items-center justify-center">
              {qrToken ? (
                <div className="text-center">
                  {/* TODO: Generate actual QR code image */}
                  <div className="text-xs text-gray-500">QR CODE</div>
                  <div className="text-xs text-gray-400 mt-1">Downloadable</div>
                </div>
              ) : (
                <span className="text-xs text-gray-400">No QR</span>
              )}
            </div>
          </div>

          {/* Right: Employee Details */}
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900">{employee.fullName}</h1>
            <p className="text-lg text-gray-600 mt-1">{employee.organization?.name || 'N/A'}</p>
            <p className="text-base text-gray-500 mt-1">{employee.tradeRole}</p>
            <div className="mt-3 flex items-center gap-3">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                employee.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {employee.status.toUpperCase()}
              </span>
              <span className="text-sm text-gray-500">ID: {employee.id.slice(0, 8)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* SNAPSHOT ACTIONS (INTERNAL) */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex gap-3">
        <button
          onClick={generateSnapshot}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium"
        >
          📸 Generate Verification Snapshot
        </button>
        <button
          onClick={() => window.print()}
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 font-medium"
        >
          🖨️ Print
        </button>
        <button
          onClick={() => alert('Export PDF not yet implemented')}
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 font-medium"
        >
          📄 Export PDF
        </button>
      </div>

      {/* COMPLIANCE TABLE (PRIMARY INTERFACE) */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">Compliance Status</h2>
        
        {Object.entries(groupedCerts).map(([category, certs]) => (
          <div key={category} className="bg-white shadow rounded-lg overflow-hidden">
            <div className="bg-gray-100 px-6 py-3 border-b">
              <h3 className="font-semibold text-gray-900">{category.replace(/_/g, ' ')}</h3>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Certification</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Issue Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Expiration</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Proof</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Updated</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {certs.map((cert) => (
                    <tr key={cert.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">{cert.certificationType}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {cert.issueDate ? new Date(cert.issueDate).toLocaleDateString() : '-'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {cert.isNonExpiring ? (
                          <span className="text-blue-600">Non-expiring</span>
                        ) : cert.expirationDate ? (
                          new Date(cert.expirationDate).toLocaleDateString()
                        ) : (
                          '-'
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={cert.status} />
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {cert.mediaFiles.length > 0 ? (
                          <span className="text-green-600">✓ Uploaded</span>
                        ) : (
                          <span className="text-gray-400">Missing</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {cert.lastVerifiedAt 
                          ? new Date(cert.lastVerifiedAt).toLocaleDateString()
                          : new Date(cert.createdAt).toLocaleDateString()
                        }
                      </td>
                      <td className="px-6 py-4 text-right">
                        {cert.status === 'PASS' && cert.mediaFiles.length > 0 ? (
                          <button
                            onClick={() => alert('View proof not yet implemented')}
                            className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                          >
                            View Proof
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              setSelectedCert(cert);
                              setIsNonExpiring(cert.isNonExpiring);
                            }}
                            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm font-medium"
                          >
                            ⬆️ Upload Proof
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>

      {/* UPLOAD MODAL (STRICT) */}
      {selectedCert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full">
            <h3 className="text-xl font-semibold mb-4">{selectedCert.certificationType}</h3>
            
            <div className="space-y-4">
              {/* File Picker */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Certificate (Image or PDF) *
                </label>
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                  className="w-full border border-gray-300 rounded p-2"
                  required
                />
              </div>

              {/* Issue Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Issue Date *
                </label>
                <input
                  type="date"
                  value={issueDate}
                  onChange={(e) => setIssueDate(e.target.value)}
                  className="w-full border border-gray-300 rounded p-2"
                  required
                />
              </div>

              {/* Non-Expiring Checkbox */}
              {selectedCert.isNonExpiring && (
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="nonExpiring"
                    checked={isNonExpiring}
                    onChange={(e) => setIsNonExpiring(e.target.checked)}
                    className="mr-2"
                  />
                  <label htmlFor="nonExpiring" className="text-sm text-gray-700">
                    This certification does not expire
                  </label>
                </div>
              )}

              {/* Expiration Date */}
              {!isNonExpiring && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expiration Date *
                  </label>
                  <input
                    type="date"
                    value={expirationDate}
                    onChange={(e) => setExpirationDate(e.target.value)}
                    className="w-full border border-gray-300 rounded p-2"
                    required
                  />
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleUpload}
                disabled={!uploadFile || uploading || !issueDate || (!isNonExpiring && !expirationDate)}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {uploading ? 'Uploading...' : 'Upload'}
              </button>
              <button
                onClick={closeUploadModal}
                disabled={uploading}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 disabled:opacity-50 font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: 'PASS' | 'FAIL' | 'INCOMPLETE' }) {
  const styles = {
    PASS: 'bg-green-100 text-green-800 border-green-300',
    FAIL: 'bg-red-100 text-red-800 border-red-300',
    INCOMPLETE: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  };

  const icons = {
    PASS: '✅',
    FAIL: '❌',
    INCOMPLETE: '⚠️',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${styles[status]}`}>
      {icons[status]} {status}
    </span>
  );
}
