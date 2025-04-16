import React from 'react';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, totalSteps }) => {
  const progress = (currentStep / totalSteps) * 100;
  return (
    <div className="progress-container">
      <div className="progress-bar" style={{ width: `${progress}%` }}></div>
      <div className="progress-text">Step {currentStep} of {totalSteps}</div>
      <style jsx>{`
        .progress-container {
          background: #e0e0e0;
          border-radius: 5px;
          position: relative;
          width: 100%;
          height: 20px;
          margin-bottom: 1rem;
        }

        .progress-bar {
          background: #0055a4;
          height: 100%;
          border-radius: 5px;
          transition: width 0.3s ease;
        }

        .progress-text {
          position: absolute;
          width: 100%;
          text-align: center;
          top: 0;
          left: 0;
          font-size: 0.875rem;
          line-height: 20px;
          color: #fff;
          font-weight: bold;
        }
      `}</style>
    </div>
  );
};

export default ProgressBar; 