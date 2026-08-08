import React from 'react';
import { motion } from 'framer-motion';

export const ScoreMeter = ({ score = 0, label = 'Risk Score', size = 160 }) => {
  const radius = (size - 24) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  // Determine stroke color
  let strokeColor = '#10b981'; // Green for low risk
  if (score > 40 && score <= 60) strokeColor = '#f59e0b'; // Amber
  else if (score > 60 && score <= 80) strokeColor = '#f97316'; // Orange
  else if (score > 80) strokeColor = '#ef4444'; // Red

  if (label.toLowerCase().includes('trust')) {
    // Reverse color logic for trust score
    if (score >= 80) strokeColor = '#10b981';
    else if (score >= 60) strokeColor = '#06b6d4';
    else if (score >= 40) strokeColor = '#f59e0b';
    else strokeColor = '#ef4444';
  }

  return (
    <div className="flex flex-col items-center justify-center relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#1e293b"
          strokeWidth="10"
          fill="transparent"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={strokeColor}
          strokeWidth="10"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          strokeLinecap="round"
          fill="transparent"
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center text-center">
        <motion.span 
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-extrabold font-outfit text-white tracking-tight"
        >
          {score}
        </motion.span>
        <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mt-0.5">
          {label}
        </span>
      </div>
    </div>
  );
};
