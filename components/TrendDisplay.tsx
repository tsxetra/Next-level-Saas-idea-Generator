import React, { useEffect } from 'react';

interface TrendDisplayProps {
  topic: string | null;
  isLoading: boolean;
  error: string | null;
  onGenerate: () => void;
  onRetry: () => void;
}

const TrendDisplay: React.FC<TrendDisplayProps> = ({ topic, isLoading, error, onGenerate, onRetry }) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (error) {
        if (event.key === 'Backspace') {
            onRetry();
        }
        return;
      }
      if (!isLoading && topic) {
        if (event.key === 'Enter') {
          onGenerate();
        } else if (event.key === 'Backspace') {
          onRetry();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isLoading, topic, onGenerate, onRetry, error]);

  if (isLoading) {
    return (
      <div className="text-center animate-fade-in">
        <p className="text-2xl text-gray-400">Finding a trending topic...</p>
      </div>
    );
  }

  return (
    <div className="text-center animate-fade-in p-4">
      {error ? (
         <>
          <h2 className="text-2xl md:text-3xl text-red-500 mb-4 font-serif">An Error Occurred</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <p className="text-sm text-gray-500">Press <kbd className="px-2 py-1.5 text-xs font-semibold text-gray-300 bg-gray-700 border border-gray-600 rounded-lg">Backspace</kbd> to try again.</p>
        </>
      ) : (
        <>
          <p className="text-lg text-gray-400 mb-4">Here is a trending topic:</p>
          <h1 className="text-4xl md:text-6xl font-serif mb-8 text-white" style={{ fontFamily: "'Times New Roman', Times, serif" }}>
            "{topic}"
          </h1>
          <p className="text-sm text-gray-500">
            Press <kbd className="px-2 py-1.5 text-xs font-semibold text-gray-300 bg-gray-700 border border-gray-600 rounded-lg">Enter</kbd> to continue, or <kbd className="px-2 py-1.5 text-xs font-semibold text-gray-300 bg-gray-700 border border-gray-600 rounded-lg">Backspace</kbd> to retry.
          </p>
        </>
      )}
    </div>
  );
};

export default TrendDisplay;