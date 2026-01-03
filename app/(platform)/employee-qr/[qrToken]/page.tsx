'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

interface Certification {
  id: string;
  presetCategory: string;
  certificationType: string;
  issuingAuthority: string | null;
  issueDate: string | null;
  expirationDate: string | null;
  isNonExpiring: boolean;
  status: 'PASS' | 'FAIL' | 'INCOMPLETE';
  failureReason: string | null;
  lastVerifiedAt: string | null;
  mediaFiles: Array<{
    id: string;
    objectPath: string;
    mimeType: string;
    uploadedAt: string;
    checksumSha256: string;
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
    type: string;
  };
}

interface EmployeeData {
  employee: Employee;
  certifications: Certification[];
  verificationToken: {
    createdAt: string;
    lastScanned: string | null;
  };
}

export default function InternalQRPage() {
  const params = useParams();
  const qrToken = params?.qrToken as string;

  const [data, setData] = useState<EmployeeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCert, setSelectedCert] = useState<Certification | null>(null);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadLoading, setUploadLoading] = useState(false);

  useEffect(() => {
    if (qrToken) {
      fetchEmployeeData();
    }
  }, [qrToken]);

  const fetchEmployeeData = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/verify/employee/${qrToken}`);
      if (!res.ok) throw new Error('Failed to fetch employee data');
      const json = await res.json();
      setData(json);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (certificationId: string) => {
    if (!uploadFile || !data) return;

    try {
      setUploadLoading(true);

      // 1. Get signed URL
      const signedUrlRes = await fetch(
        `/api/internal/employees/${data.employee.id}/certifications/${certificationId}/signed-url`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-user-id': 'USER_ID_PLACEHOLDER', // TODO: Get from auth
            'x-organization-id': 'ORG_ID_PLACEHOLDER', // TODO: Get from auth
          },
          body: JSON.stringify({
            fileName: uploadFile.name,
            mimeType: uploadFile.type,
          }),
        }
      );

      if (!signedUrlRes.ok) throw new Error('Failed to get signed URL');
      const { signedUrl, bucket, objectPath } = await signedUrlRes.json();

      // 2. Upload to GCS (simulated for now)
      // TODO: Implement actual GCS upload
      // await fetch(signedUrl, { method: 'PUT', body: uploadFile });

      // 3. Calculate checksum
      const arrayBuffer = await uploadFile.arrayBuffer();
      const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const checksumSha256 = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

      // 4. Confirm upload
      const confirmRes = await fetch(
        `/api/internal/employees/${data.employee.id}/certifications/${certificationId}/upload`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-user-id': 'USER_ID_PLACEHOLDER',
            'x-organization-id': 'ORG_ID_PLACEHOLDER',
          },
          body: JSON.stringify({
            bucket,
            objectPath,
            mimeType: uploadFile.type,
            sizeBytes: uploadFile.size,
            checksumSha256,
            // TODO: Add date inputs
          }),
        }
      );

      if (!confirmRes.ok) throw new Error('Failed to confirm upload');

      // Refresh data
      await fetchEmployeeData();
      setSelectedCert(null);
      setUploadFile(null);
      alert('Upload successful!');
    } catch (err: any) {
      alert('Upload failed: ' + err.message);
    } finally {
      setUploadLoading(false);
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-600">Error: {error}</div>;
  if (!data) return <div className="p-8">No data found</div>;

  const { employee, certifications } = data;

  const groupedCerts = certifications.reduce((acc, cert) => {
    if (!acc[cert.presetCategory]) acc[cert.presetCategory] = [];
    acc[cert.presetCategory].push(cert);
    return acc;
  }, {} as Record<string, Certification[]>);

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Employee Identity */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-start gap-6">
          <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
            {employee.photoMediaId ? (
              <img src={`/api/media/${employee.photoMediaId}`} alt={employee.fullName} className="w-full h-full rounded-full object-cover" />
            ) : (
              <span className="text-3xl text-gray-500">👤</span>
            )}
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900">{employee.fullName}</h1>
            <p className="text-lg text-gray-600 mt-1">{employee.tradeRole}</p>
            <p className="text-sm text-gray-500 mt-2">{employee.organization.name}</p>
            <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
              {employee.status}
            </div>
          </div>
        </div>
      </div>

      {/* Certifications by Category */}
      {Object.entries(groupedCerts).map(([category, certs]) => (
        <div key={category} className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            {category.replace(/_/g, ' ')}
          </h2>
          <div className="space-y-3">
            {certs.map((cert) => (
              <div
                key={cert.id}
                className="border rounded p-4 flex items-center justify-between"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <StatusBadge status={cert.status} />
                    <h3 className="font-medium text-gray-900">{cert.certificationType}</h3>
                  </div>
                  {cert.issuingAuthority && (
                    <p className="text-sm text-gray-500 mt-1">Issued by: {cert.issuingAuthority}</p>
                  )}
                  <div className="flex gap-4 mt-2 text-sm text-gray-600">
                    {cert.issueDate && <span>Issued: {new Date(cert.issueDate).toLocaleDateString()}</span>}
                    {cert.expirationDate && <span>Expires: {new Date(cert.expirationDate).toLocaleDateString()}</span>}
                    {cert.isNonExpiring && <span className="text-blue-600">Non-expiring</span>}
                  </div>
                  {cert.failureReason && (
                    <p className="text-sm text-red-600 mt-1">⚠️ {cert.failureReason}</p>
                  )}
                  {cert.mediaFiles.length > 0 && (
                    <p className="text-sm text-green-600 mt-1">✓ {cert.mediaFiles.length} file(s) uploaded</p>
                  )}
                </div>
                <button
                  onClick={() => setSelectedCert(cert)}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Upload Proof
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Upload Modal */}
      {selectedCert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full">
            <h3 className="text-xl font-semibold mb-4">{selectedCert.certificationType}</h3>
            <input
              type="file"
              accept="image/*,application/pdf"
              onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
              className="w-full border rounded p-2 mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={() => handleUpload(selectedCert.id)}
                disabled={!uploadFile || uploadLoading}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {uploadLoading ? 'Uploading...' : 'Upload'}
              </button>
              <button
                onClick={() => {
                  setSelectedCert(null);
                  setUploadFile(null);
                }}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
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
    PASS: 'bg-green-100 text-green-800',
    FAIL: 'bg-red-100 text-red-800',
    INCOMPLETE: 'bg-yellow-100 text-yellow-800',
  };

  const icons = {
    PASS: '✅',
    FAIL: '❌',
    INCOMPLETE: '⚠️',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status]}`}>
      {icons[status]} {status}
    </span>
  );
}
