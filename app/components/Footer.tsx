import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaEnvelope } from 'react-icons/fa';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="w-full py-6 px-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-gray-600 text-sm">
            © {currentYear} QuoteLinker. All rights reserved.
          </div>
          <div className="flex gap-6 text-sm">
            <Link href="/privacy" className="text-gray-600 hover:text-[#00E0FF]">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-gray-600 hover:text-[#00E0FF]">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}; 