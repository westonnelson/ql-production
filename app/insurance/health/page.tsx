import { Metadata } from 'next'
import Link from 'next/link'
import { FaShieldAlt, FaHospital, FaWheelchair, FaClock, FaMoneyBillWave, FaUserMd } from 'react-icons/fa'

export const metadata: Metadata = {
  title: 'Health Insurance Options | QuoteLinker',
  description: 'Learn about supplemental health and disability income insurance options. Compare policies and get quotes from top providers.',
}

export default function HealthInsurancePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#00E0FF]/10 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Health Insurance Solutions</h1>
          <p className="text-xl text-gray-600 max-w-3xl">
            Protect your health and financial well-being with comprehensive insurance coverage. We offer both supplemental health and disability income insurance options.
          </p>
        </div>
      </div>

      {/* Supplemental Health Insurance Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Supplemental Health Insurance</h2>
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div>
              <p className="text-gray-600 mb-6">
                Supplemental health insurance provides additional coverage beyond your primary health insurance, helping with out-of-pocket expenses and gaps in coverage.
              </p>
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <FaHospital className="text-[#00E0FF] text-xl mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Hospital Income Benefits</h3>
                    <p className="text-gray-600">Receive cash benefits when hospitalized to help cover expenses.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <FaUserMd className="text-[#00E0FF] text-xl mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Physician Visit Coverage</h3>
                    <p className="text-gray-600">Benefits for doctor visits and outpatient procedures.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <FaShieldAlt className="text-[#00E0FF] text-xl mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Critical Illness Protection</h3>
                    <p className="text-gray-600">Additional coverage for serious medical conditions.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Key Benefits</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-center space-x-3">
                  <span className="text-[#00E0FF]">✓</span>
                  <span>Cash benefits paid directly to you</span>
                </li>
                <li className="flex items-center space-x-3">
                  <span className="text-[#00E0FF]">✓</span>
                  <span>Coverage for hospital stays and medical procedures</span>
                </li>
                <li className="flex items-center space-x-3">
                  <span className="text-[#00E0FF]">✓</span>
                  <span>No network restrictions</span>
                </li>
                <li className="flex items-center space-x-3">
                  <span className="text-[#00E0FF]">✓</span>
                  <span>Guaranteed renewable</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Disability Income Insurance Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Short-Term Disability Income Insurance</h2>
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div>
              <p className="text-gray-600 mb-6">
                Protect your income if you're unable to work due to a covered illness or injury. Short-term disability insurance provides monthly benefits to help cover your expenses.
              </p>
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <FaMoneyBillWave className="text-[#00E0FF] text-xl mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Income Replacement</h3>
                    <p className="text-gray-600">Monthly benefits to help maintain your lifestyle.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <FaClock className="text-[#00E0FF] text-xl mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Quick Benefit Start</h3>
                    <p className="text-gray-600">Benefits begin after a short elimination period.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <FaWheelchair className="text-[#00E0FF] text-xl mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Comprehensive Coverage</h3>
                    <p className="text-gray-600">Protection for both injury and illness-related disabilities.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Coverage Features</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-center space-x-3">
                  <span className="text-[#00E0FF]">✓</span>
                  <span>Monthly benefits up to 60% of your income</span>
                </li>
                <li className="flex items-center space-x-3">
                  <span className="text-[#00E0FF]">✓</span>
                  <span>Benefit periods of 3, 6, 12, or 24 months</span>
                </li>
                <li className="flex items-center space-x-3">
                  <span className="text-[#00E0FF]">✓</span>
                  <span>Optional riders for additional coverage</span>
                </li>
                <li className="flex items-center space-x-3">
                  <span className="text-[#00E0FF]">✓</span>
                  <span>Portable coverage that stays with you</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Get Protected?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Compare quotes and find the right coverage for your needs.
          </p>
          <Link
            href="/quote/health"
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-[#00E0FF] hover:bg-[#00E0FF]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00E0FF] transition-colors"
          >
            Get Your Quote
          </Link>
        </div>
      </section>
    </div>
  )
} 