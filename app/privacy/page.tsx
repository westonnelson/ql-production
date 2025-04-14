export const dynamic = 'force-static'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#0F1218] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-extrabold text-white mb-8">Privacy Policy</h1>
        
        <div className="prose prose-invert max-w-none">
          <p className="text-lg text-gray-300 mb-6">Last updated: {new Date().toLocaleDateString()}</p>
          
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">1. Information We Collect</h2>
            <p className="text-gray-300">We collect information that you provide directly to us, including:</p>
            <ul className="list-disc pl-6 mt-2 text-gray-300">
              <li>Name and contact information</li>
              <li>Age and gender</li>
              <li>Insurance preferences and requirements</li>
              <li>Other information you choose to provide</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">2. How We Use Your Information</h2>
            <p className="text-gray-300">We use the information we collect to:</p>
            <ul className="list-disc pl-6 mt-2 text-gray-300">
              <li>Provide insurance quotes and services</li>
              <li>Communicate with you about your requests</li>
              <li>Improve our services</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">3. Information Sharing</h2>
            <p className="text-gray-300">We may share your information with:</p>
            <ul className="list-disc pl-6 mt-2 text-gray-300">
              <li>Insurance providers to process your quote requests</li>
              <li>Service providers who assist in our operations</li>
              <li>As required by law or to protect rights</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">4. Data Security</h2>
            <p className="text-gray-300">
              We implement appropriate technical and organizational security measures to protect your information.
              However, no security system is impenetrable and we cannot guarantee the security of our systems 100%.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">5. Your Rights</h2>
            <p className="text-gray-300">You have the right to:</p>
            <ul className="list-disc pl-6 mt-2 text-gray-300">
              <li>Access your personal information</li>
              <li>Correct inaccurate information</li>
              <li>Request deletion of your information</li>
              <li>Opt-out of marketing communications</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">6. Contact Us</h2>
            <p className="text-gray-300">
              If you have any questions about this Privacy Policy, please contact us at:
              <br />
              <a href="mailto:privacy@quotelinker.com" className="text-primary hover:text-primary/90">
                privacy@quotelinker.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  )
} 