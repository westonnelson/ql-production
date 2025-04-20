import Link from 'next/link';
import { Button } from './components/ui/button';
import { ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-[#00E0FF]">
              Insurance Quotes Made Simple
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Get instant quotes for life, disability, and health insurance. Compare options and find the perfect coverage for your needs.
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/quote/life">
                <Button size="lg" className="bg-[#00E0FF] hover:bg-[#00c8e6]">
                  Get Life Insurance Quote <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Insurance Types Section */}
      <section className="w-full py-16 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">Choose Your Insurance Type</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Life Insurance Card */}
            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
              <h3 className="text-2xl font-semibold mb-4">Life Insurance</h3>
              <p className="text-gray-600 mb-6">Protect your family's financial future with comprehensive life insurance coverage.</p>
              <Link href="/quote/life">
                <Button variant="outline" className="w-full">Get Life Quote</Button>
              </Link>
            </div>

            {/* Disability Insurance Card */}
            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
              <h3 className="text-2xl font-semibold mb-4">Disability Insurance</h3>
              <p className="text-gray-600 mb-6">Secure your income with disability insurance that protects your earning potential.</p>
              <Link href="/quote/disability">
                <Button variant="outline" className="w-full">Get Disability Quote</Button>
              </Link>
            </div>

            {/* Health Insurance Card */}
            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
              <h3 className="text-2xl font-semibold mb-4">Health Insurance</h3>
              <p className="text-gray-600 mb-6">Find the right health insurance plan to keep you and your family covered.</p>
              <Link href="/quote/health">
                <Button variant="outline" className="w-full">Get Health Quote</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose QuoteLinker</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-3">Instant Quotes</h3>
              <p className="text-gray-600">Get quotes in minutes with our streamlined process.</p>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-3">Compare Options</h3>
              <p className="text-gray-600">Compare different plans and providers side by side.</p>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-3">Expert Support</h3>
              <p className="text-gray-600">Get help from licensed insurance professionals.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 