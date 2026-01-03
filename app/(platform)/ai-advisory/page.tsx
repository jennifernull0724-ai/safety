import { prisma } from '@/lib/prisma';

export default async function AIAdvisoryPage() {
  // Get near misses for AI clustering insights (advisory only)
  const nearMisses = await prisma.nearMiss.findMany({ 
    take: 50,
    orderBy: { reportedAt: 'desc' },
  });

  return (
    <div className="p-6 space-y-6">
      <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
        <h1 className="text-2xl font-bold text-yellow-800">AI Advisory Dashboard</h1>
        <p className="text-yellow-700">All insights are advisory only. AI does not block any operations.</p>
      </div>
      
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="font-semibold mb-4">Near Miss Clustering Analysis</h2>
        <p className="text-gray-600">
          Analyzing {nearMisses.length} recent near miss reports for patterns.
        </p>
        {nearMisses.length === 0 ? (
          <p className="text-gray-500 italic mt-4">No near miss data available for analysis</p>
        ) : (
          <p className="text-sm text-gray-500 mt-4">
            AI clustering identifies patterns in safety data to help prioritize preventive measures.
          </p>
        )}
      </div>
    </div>
  );
}
