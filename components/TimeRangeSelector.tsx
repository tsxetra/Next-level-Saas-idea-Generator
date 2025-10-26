import React from 'react';

interface TimeRangeSelectorProps {
  onSelectRange: (range: string) => void;
}

const timeRanges = [
  { label: 'The Past Hour', value: 'the past hour' },
  { label: 'The Past 7 Days', value: 'the past 7 days' },
  { label: 'The Past Month', value: 'the past month' },
  { label: 'The Past Year', value: 'the past year' },
  { label: 'The Past 5 Years', value: 'the past 5 years' },
];

const TimeRangeSelector: React.FC<TimeRangeSelectorProps> = ({ onSelectRange }) => {
  return (
    <div className="text-center animate-fade-in-up max-w-2xl mx-auto">
      <h2 className="text-3xl md:text-4xl font-serif mb-8">
        Select a time frame for trend analysis.
      </h2>
      <div className="flex flex-col items-center gap-4">
        {timeRanges.map(range => (
          <button
            key={range.value}
            onClick={() => onSelectRange(range.value)}
            className="w-full md:w-auto md:min-w-[300px] text-xl p-4 border border-gray-700 rounded-md hover:border-white hover:bg-gray-900 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-white"
          >
            {range.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TimeRangeSelector;