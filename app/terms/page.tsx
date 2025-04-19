export const dynamic = 'force-static'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Terms of Service</h1>
        
        <div className="prose prose-gray max-w-none">
          <p className="text-lg text-gray-600 mb-6">Last updated: {new Date().toLocaleDateString()}</p>
          
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Agreement to Terms</h2>
            <p className="text-gray-600">
              By accessing or using our services, you agree to be bound by these Terms of Service. If you do not agree to these terms, 
              please do not use our services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Description of Services</h2>
            <p className="text-gray-600">
              We provide an online platform that connects users with insurance providers and facilitates the process of obtaining 
              insurance quotes. Our services include:
            </p>
            <ul className="list-disc pl-6 mt-2 text-gray-600">
              <li>Collection and processing of insurance quote requests</li>
              <li>Connecting users with insurance providers</li>
              <li>Providing insurance-related information and resources</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. User Responsibilities</h2>
            <p className="text-gray-600">
              Users of our service agree to:
            </p>
            <ul className="list-disc pl-6 mt-2 text-gray-600">
              <li>Provide accurate and truthful information</li>
              <li>Maintain the confidentiality of their account credentials</li>
              <li>Comply with all applicable laws and regulations</li>
              <li>Not use the service for any unlawful purpose</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Contact Information</h2>
            <p className="text-gray-600">
              If you have any questions about these Terms of Service, please contact us at:
            </p>
            <ul className="list-none pl-6 mt-2 text-gray-600">
              <li>Email: support@quotelinker.com</li>
              <li>Phone: (555) 123-4567</li>
              <li>Address: 123 Insurance Ave, Suite 100, San Francisco, CA 94105</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  )
} 