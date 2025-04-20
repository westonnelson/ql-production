import Link from 'next/link';
import { Logo } from './Logo';

export function Footer() {
  return (
    <footer className="w-full bg-gray-50 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Logo className="mb-4" />
            <p className="text-gray-600 max-w-md">
              QuoteLinker helps you find the right insurance coverage with instant quotes and expert guidance.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Insurance</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/quote/life" className="text-gray-600 hover:text-gray-900">
                  Life Insurance
                </Link>
              </li>
              <li>
                <Link href="/quote/disability" className="text-gray-600 hover:text-gray-900">
                  Disability Insurance
                </Link>
              </li>
              <li>
                <Link href="/quote/health" className="text-gray-600 hover:text-gray-900">
                  Health Insurance
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-600 hover:text-gray-900">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-600 hover:text-gray-900">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-600 hover:text-gray-900">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-600 hover:text-gray-900">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-center text-gray-600">
            © {new Date().getFullYear()} QuoteLinker. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
} 