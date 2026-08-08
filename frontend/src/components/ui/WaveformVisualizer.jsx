import React from 'react';

export const WaveformVisualizer = ({ waveform = [], isPlaying = false }) => {
  // Generate baseline bars if none provided
  const bars = waveform.length > 0 ? waveform : Array.from({ length: 48 }, () => Math.random() * 0.8 + 0.1);

  return (
    <div className="flex items-center justify-between gap-[3px] h-20 w-full px-4 py-2 bg-slate-900/80 rounded-xl border border-slate-800">
      {bars.map((val, idx) => {
        const heightPercent = Math.max(12, Math.min(100, val * 100));
        return (
          <div
            key={idx}
            className={`flex-1 rounded-full transition-all duration-200 ${
              isPlaying
                ? 'bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(6,182,212,0.6)]'
                : 'bg-slate-600 hover:bg-cyan-500'
            }`}
            style={{ height: `${heightPercent}%` }}
          />
        );
      })}
    </div>
  );
};
