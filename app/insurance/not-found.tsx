import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Page Not Found</h1>
        <p className="text-lg text-gray-600 mb-8">
          The insurance page you're looking for doesn't exist or has been moved.
        </p>
        <div className="space-y-4">
          <p className="text-gray-600">Try one of these insurance types instead:</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/insurance/life"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-[#00E0FF] hover:bg-[#00E0FF]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00E0FF] transition-colors"
            >
              Life Insurance
            </Link>
            <Link
              href="/insurance/disability"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-[#00E0FF] hover:bg-[#00E0FF]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00E0FF] transition-colors"
            >
              Disability Insurance
            </Link>
            <Link
              href="/insurance/supplemental-health"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-[#00E0FF] hover:bg-[#00E0FF]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00E0FF] transition-colors"
            >
              Supplemental Health
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 