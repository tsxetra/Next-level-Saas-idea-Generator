import React from 'react';

interface WelcomeScreenProps {
  onBegin: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onBegin }) => {
  return (
    <div className="text-center animate-fade-in">
      <h1 className="text-5xl md:text-7xl font-serif mb-4">
        SaaS Idea Generator
      </h1>
      <p className="text-lg text-gray-400 mb-8">Discover your next venture, powered by AI.</p>
      <button
        onClick={onBegin}
        className="px-8 py-3 text-lg font-semibold rounded-md border border-white text-white bg-black hover:bg-white hover:text-black transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-white"
      >
        Begin
      </button>
    </div>
  );
};

export default WelcomeScreen;