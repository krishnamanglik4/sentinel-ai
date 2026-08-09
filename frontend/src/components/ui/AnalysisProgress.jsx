import React, { useEffect, useState } from 'react';
import { CheckCircle2, Loader2, Circle } from 'lucide-react';
import { motion } from 'framer-motion';

export const AnalysisProgress = ({ steps = [], scanType = 'image' }) => {
  const defaultSteps = [
    "Validating file integrity & permissions",
    "Extracting metadata & image dimensions",
    "Running multi-signal forensic neural checks",
    "Calculating normalized Risk & Trust scores",
    "Generating Explainable AI (XAI) recommendations"
  ];

  const activeSteps = steps.length > 0 ? steps : defaultSteps;
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < activeSteps.length - 1) return prev + 1;
        return prev;
      });
    }, 450);

    return () => clearInterval(interval);
  }, [activeSteps]);

  return (
    <div className="glass-panel p-6 rounded-2xl border-cyan-500/30 bg-slate-900/80 space-y-4">
      <div className="flex items-center gap-2 text-cyan-400 font-bold font-outfit text-sm uppercase tracking-wider">
        <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
        <span>Forensic Pipeline Execution</span>
      </div>

      <div className="space-y-3 pt-2">
        {activeSteps.map((stepText, idx) => {
          const isDone = idx < currentStep;
          const isCurrent = idx === currentStep;

          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              className={`flex items-center gap-3 text-xs font-mono p-2.5 rounded-xl border transition-all ${
                isDone
                  ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
                  : isCurrent
                  ? 'bg-cyan-950/30 border-cyan-500/40 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.15)]'
                  : 'bg-slate-900/40 border-slate-800 text-slate-500'
              }`}
            >
              {isDone ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : isCurrent ? (
                <Loader2 className="w-4 h-4 text-cyan-400 animate-spin shrink-0" />
              ) : (
                <Circle className="w-4 h-4 text-slate-600 shrink-0" />
              )}
              <span className="truncate">{stepText}</span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
