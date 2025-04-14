import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaEnvelope } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-[#0F1218] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 text-center md:text-left">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">QuoteLinker</h3>
            <div className="flex items-center justify-center md:justify-start space-x-2 text-gray-300">
              <FaEnvelope className="text-primary" />
              <a href="mailto:support@quotelinker.com" className="hover:text-primary transition-colors">
                support@quotelinker.com
              </a>
            </div>
          </div>

          {/* Insurance */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Insurance</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/quote/life" className="text-gray-300 hover:text-primary transition-colors">
                  Life Insurance
                </Link>
              </li>
              <li>
                <Link href="/quote/disability" className="text-gray-300 hover:text-primary transition-colors">
                  Disability Insurance
                </Link>
              </li>
              <li>
                <Link href="/quote/supplemental" className="text-gray-300 hover:text-primary transition-colors">
                  Supplemental Health
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/benefits" className="text-gray-300 hover:text-primary transition-colors">
                  Benefits
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-300 hover:text-primary transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/education" className="text-gray-300 hover:text-primary transition-colors">
                  Insurance Education
                </Link>
              </li>
            </ul>
          </div>

          {/* For Agents */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">For Agents</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/agent/login" className="text-gray-300 hover:text-primary transition-colors">
                  Agent Login
                </Link>
              </li>
              <li>
                <Link href="/agent/register" className="text-gray-300 hover:text-primary transition-colors">
                  Join Our Network
                </Link>
              </li>
              <li>
                <Link href="/agent/resources" className="text-gray-300 hover:text-primary transition-colors">
                  Agent Resources
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800 text-center">
          <p className="text-gray-400">
            © {new Date().getFullYear()} QuoteLinker. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 