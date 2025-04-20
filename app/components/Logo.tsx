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
        className="text-primary"
      >
        <path
          d="M16 2C8.268 2 2 8.268 2 16s6.268 14 14 14 14-6.268 14-14S23.732 2 16 2zm0 25.2c-6.188 0-11.2-5.012-11.2-11.2S9.812 4.8 16 4.8 27.2 9.812 27.2 16 22.188 27.2 16 27.2z"
          fill="currentColor"
        />
        <path
          d="M16 7.6c-4.631 0-8.4 3.769-8.4 8.4 0 4.631 3.769 8.4 8.4 8.4 4.631 0 8.4-3.769 8.4-8.4 0-4.631-3.769-8.4-8.4-8.4zm0 14c-3.077 0-5.6-2.523-5.6-5.6s2.523-5.6 5.6-5.6 5.6 2.523 5.6 5.6-2.523 5.6-5.6 5.6z"
          fill="currentColor"
        />
        <path
          d="M16 13.2c-1.544 0-2.8 1.256-2.8 2.8 0 1.544 1.256 2.8 2.8 2.8 1.544 0 2.8-1.256 2.8-2.8 0-1.544-1.256-2.8-2.8-2.8z"
          fill="currentColor"
        />
      </svg>
      <span className="text-xl font-bold text-primary">QuoteLinker</span>
    </div>
  );
} 