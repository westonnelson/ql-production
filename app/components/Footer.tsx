import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaEnvelope } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-white py-12 px-4 sm:px-6 lg:px-8 border-t border-gray-200">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 text-center md:text-left">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="relative w-8 h-8">
                <Image
                  src="/logo.svg"
                  alt="QuoteLinker"
                  fill
                  sizes="(max-width: 32px) 100vw"
                  className="object-contain"
                />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">QuoteLinker</h3>
            </div>
            <div className="flex items-center justify-center md:justify-start space-x-2 text-gray-600">
              <FaEnvelope className="text-[#00E0FF]" />
              <a href="mailto:support@quotelinker.com" className="hover:text-[#00E0FF] transition-colors">
                support@quotelinker.com
              </a>
            </div>
          </div>

          {/* Insurance */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Insurance</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/quote/life" className="text-gray-600 hover:text-[#00E0FF] transition-colors">
                  Life Insurance
                </Link>
              </li>
              <li>
                <Link href="/quote/disability" className="text-gray-600 hover:text-[#00E0FF] transition-colors">
                  Disability Insurance
                </Link>
              </li>
              <li>
                <Link href="/quote/supplemental" className="text-gray-600 hover:text-[#00E0FF] transition-colors">
                  Supplemental Health
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/benefits" className="text-gray-600 hover:text-[#00E0FF] transition-colors">
                  Benefits
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-600 hover:text-[#00E0FF] transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/education" className="text-gray-600 hover:text-[#00E0FF] transition-colors">
                  Insurance Education
                </Link>
              </li>
            </ul>
          </div>

          {/* Trust & Legal */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Trust & Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="text-gray-600 hover:text-[#00E0FF] transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-600 hover:text-[#00E0FF] transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/licensing" className="text-gray-600 hover:text-[#00E0FF] transition-colors">
                  Licensing
                </Link>
              </li>
              <li>
                <Link href="/agent" className="text-gray-600 hover:text-[#00E0FF] transition-colors">
                  Agent Access
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200 text-center">
          <p className="text-gray-600">
            © {new Date().getFullYear()} QuoteLinker. All rights reserved.
          </p>
          <p className="mt-2 text-sm text-gray-500">
            Powered by QuoteLinker and AI
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 