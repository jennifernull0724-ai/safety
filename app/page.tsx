export default function HomePage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center p-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">System of Proof</h1>
        <p className="text-lg text-gray-600 mb-8">
          Employee-Anchored • QR-Verified • Audit-Defensible
        </p>
        <div className="space-y-4">
          <a
            href="/employee-directory"
            className="block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Employee Directory
          </a>
          <a
            href="/audit-vault"
            className="block px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            Audit Vault
          </a>
        </div>
      </div>
    </main>
  );
}
