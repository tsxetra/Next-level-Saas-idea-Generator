import React, { useState, useCallback } from 'react';
import WelcomeScreen from './components/WelcomeScreen';
import TimeRangeSelector from './components/TimeRangeSelector';
import TrendDisplay from './components/TrendDisplay';
import GeneratingScreen from './components/GeneratingScreen';
import SaaSBrief from './components/SaaSBrief';
import { getTrendingTopic, generateSaaSConcept } from './services/geminiService';
import type { SaaSBriefData } from './types';

type AppStep = 'welcome' | 'select_range' | 'show_trend' | 'generating' | 'show_brief';

const App: React.FC = () => {
  const [step, setStep] = useState<AppStep>('welcome');
  const [trendingTopic, setTrendingTopic] = useState<string | null>(null);
  const [saasBrief, setSaaSBrief] = useState<SaaSBriefData | null>(null);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [isLoadingTrend, setIsLoadingTrend] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleBegin = () => setStep('select_range');
  
  const handleReset = () => {
    setTrendingTopic(null);
    setSaaSBrief(null);
    setLogoUrl(null);
    setError(null);
    setStep('welcome');
  };

  const handleRetryTrend = () => {
    setTrendingTopic(null);
    setError(null);
    setStep('select_range');
  };

  const handleFetchTrend = useCallback(async (range: string) => {
    setIsLoadingTrend(true);
    setError(null);
    setTrendingTopic(null);
    setSaaSBrief(null);
    setLogoUrl(null);
    setStep('show_trend');

    try {
      const topic = await getTrendingTopic(range);
      setTrendingTopic(topic);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoadingTrend(false);
    }
  }, []);

  const handleGenerateBrief = useCallback(async () => {
    if (!trendingTopic) return;
    setStep('generating');
    setError(null);
    setSaaSBrief(null);
    setLogoUrl(null);

    try {
      const { brief, logoUrl } = await generateSaaSConcept(trendingTopic);
      setSaaSBrief(brief);
      setLogoUrl(logoUrl);
      setStep('show_brief');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      setStep('show_trend');
    }
  }, [trendingTopic]);

  const renderStep = () => {
    switch (step) {
      case 'welcome':
        return <WelcomeScreen onBegin={handleBegin} />;
      case 'select_range':
        return <TimeRangeSelector onSelectRange={handleFetchTrend} />;
      case 'show_trend':
        return (
          <TrendDisplay
            topic={trendingTopic}
            isLoading={isLoadingTrend}
            error={error}
            onGenerate={handleGenerateBrief}
            onRetry={handleRetryTrend}
          />
        );
      case 'generating':
        return <GeneratingScreen />;
      case 'show_brief':
        if (saasBrief && logoUrl) {
          return <SaaSBrief brief={saasBrief} logoUrl={logoUrl} onReset={handleReset} />;
        }
        handleRetryTrend();
        return null;
      default:
        return <WelcomeScreen onBegin={handleBegin} />;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans flex items-center justify-center p-4">
      <div className="w-full max-w-7xl">
        {renderStep()}
      </div>
       <style>{`
        @keyframes fade-in {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        .animate-fade-in {
            animation: fade-in 0.5s ease-in-out forwards;
        }
        @keyframes fade-in-up {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
            animation: fade-in-up 0.6s ease-out forwards;
        }
        kbd {
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
        }
      `}</style>
    </div>
  );
};

export default App;