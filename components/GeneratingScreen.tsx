import React, { useState, useEffect } from 'react';

const steps = [
  "Analyzing market trends...",
  "Ideating a unique concept...",
  "Defining brand identity...",
  "Designing a modern logo...",
  "Finalizing your brief...",
];

const GeneratingScreen: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep(prev => {
        // Stop at the last step
        if (prev >= steps.length - 1) {
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="text-center animate-fade-in flex flex-col items-center justify-center min-h-[200px]">
      <div className="w-16 h-16 border-2 border-white border-dashed rounded-full animate-spin mb-8"></div>
      <div className="h-8">
          <p className="text-2xl text-gray-300 transition-opacity duration-500">
            {steps[currentStep]}
          </p>
      </div>
    </div>
  );
};

export default GeneratingScreen;