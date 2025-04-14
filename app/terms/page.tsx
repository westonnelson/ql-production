export const dynamic = 'force-static'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#0F1218] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-extrabold text-white mb-8">Terms of Service</h1>
        
        <div className="prose prose-invert max-w-none">
          <p className="text-lg text-gray-300 mb-6">Last updated: {new Date().toLocaleDateString()}</p>
          
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">1. Agreement to Terms</h2>
            <p className="text-gray-300">
              By accessing or using our services, you agree to be bound by these Terms of Service. If you do not agree to these terms, 
              please do not use our services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">2. Description of Services</h2>
            <p className="text-gray-300">
              We provide an online platform that connects users with insurance providers and facilitates the process of obtaining 
              insurance quotes. Our services include:
            </p>
            <ul className="list-disc pl-6 mt-2 text-gray-300">
              <li>Collection and processing of insurance quote requests</li>
              <li>Connecting users with insurance providers</li>
              <li>Providing insurance-related information and resources</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">3. User Responsibilities</h2>
            <p className="text-gray-300">You agree to:</p>
            <ul className="list-disc pl-6 mt-2 text-gray-300">
              <li>Provide accurate and complete information</li>
              <li>Maintain the confidentiality of your account</li>
              <li>Use the services in compliance with applicable laws</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">4. Contact Information</h2>
            <p className="text-gray-300">
              For questions about these Terms of Service, please contact us at:
              <br />
              <a href="mailto:terms@quotelinker.com" className="text-primary hover:text-primary/90">
                terms@quotelinker.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  )
} 