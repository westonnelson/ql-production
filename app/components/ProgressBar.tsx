import React from 'react';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, totalSteps }) => {
  const progress = (currentStep / totalSteps) * 100;
  return (
    <div 
      className="w-full bg-gray-200 rounded-lg mb-4" 
      style={{ height: '10px' }}
    >
      <div 
        className="bg-blue-600 h-full rounded-lg transition-all duration-300 ease-in-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

export default ProgressBar; 