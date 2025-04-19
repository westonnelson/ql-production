import React from 'react';

interface LogoProps {
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ className = '' }) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="16" cy="16" r="16" fill="#06B6D4" />
      </svg>
      <span className="text-[24px] font-semibold text-[#111827]">
        <span className="text-[#06B6D4]">Quote</span>Linker
      </span>
    </div>
  );
}; 