import React from 'react';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Terms of Service</h1>
        
        <div className="prose prose-blue max-w-none">
          <p className="text-lg text-gray-600 mb-6">Last updated: {new Date().toLocaleDateString()}</p>
          
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Agreement to Terms</h2>
            <p className="text-gray-600">
              By accessing or using QuoteLinker's services, you agree to be bound by these Terms of Service.
              If you disagree with any part of the terms, you may not access our services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Description of Service</h2>
            <p className="text-gray-600">
              QuoteLinker provides an online platform for users to request and receive insurance quotes.
              We connect users with insurance providers and facilitate the quote request process.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. User Responsibilities</h2>
            <p className="text-gray-600">You agree to:</p>
            <ul className="list-disc pl-6 mt-2 text-gray-600">
              <li>Provide accurate and complete information</li>
              <li>Maintain the confidentiality of your account</li>
              <li>Use the service for lawful purposes only</li>
              <li>Not misuse or attempt to circumvent our systems</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Disclaimer of Warranties</h2>
            <p className="text-gray-600">
              Our services are provided "as is" and "as available" without any warranties, either express or implied.
              We do not guarantee the accuracy, completeness, or usefulness of any information provided.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Limitation of Liability</h2>
            <p className="text-gray-600">
              QuoteLinker shall not be liable for any indirect, incidental, special, consequential, or punitive damages
              resulting from your use or inability to use our services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Changes to Terms</h2>
            <p className="text-gray-600">
              We reserve the right to modify these terms at any time. We will notify users of any material changes
              by posting the new Terms of Service on this page.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Contact Information</h2>
            <p className="text-gray-600">
              For any questions about these Terms of Service, please contact us at:
              <br />
              <a href="mailto:legal@quotelinker.com" className="text-primary hover:text-primary/90">
                legal@quotelinker.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
} 