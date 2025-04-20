'use client';

import React from 'react';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

export default function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="relative">
      <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
        <div
          style={{ width: `${progress}%` }}
          className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-[#06B6D4] transition-all duration-500"
        />
      </div>
      <div className="flex justify-between">
        {Array.from({ length: totalSteps }, (_, i) => (
          <div
            key={i}
            className={`flex flex-col items-center ${
              i + 1 <= currentStep ? 'text-[#06B6D4]' : 'text-gray-400'
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                i + 1 <= currentStep
                  ? 'bg-[#06B6D4] text-white'
                  : 'bg-gray-200 text-gray-400'
              }`}
            >
              {i + 1}
            </div>
            <span className="text-xs mt-1">Step {i + 1}</span>
          </div>
        ))}
      </div>
    </div>
  );
} 