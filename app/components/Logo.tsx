import React from 'react';

interface LogoProps {
  className?: string;
}

export function Logo({ className = '' }: LogoProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-[#00E0FF]"
      >
        <path
          d="M16 0C7.163 0 0 7.163 0 16s7.163 16 16 16 16-7.163 16-16S24.837 0 16 0zm0 28c-6.627 0-12-5.373-12-12S9.373 4 16 4s12 5.373 12 12-5.373 12-12 12z"
          fill="currentColor"
        />
        <path
          d="M16 8c4.418 0 8 3.582 8 8 0 4.418-3.582 8-8 8V8z"
          fill="currentColor"
        />
      </svg>
      <span className="text-2xl font-bold">
        <span className="text-[#00E0FF]">Quote</span>
        <span className="text-gray-900">Linker</span>
      </span>
    </div>
  );
} 