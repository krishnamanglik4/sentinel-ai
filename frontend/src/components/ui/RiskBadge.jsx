import React from 'react';
import { ShieldCheck, AlertTriangle, AlertOctagon, ShieldAlert, CheckCircle2 } from 'lucide-react';

export const RiskBadge = ({ level = 'SAFE', size = 'md' }) => {
  const getStyles = () => {
    switch (level.toUpperCase()) {
      case 'SAFE':
        return {
          bg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
          icon: CheckCircle2,
          glow: 'shadow-[0_0_12px_rgba(16,185,129,0.3)]',
        };
      case 'LOW':
        return {
          bg: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400',
          icon: ShieldCheck,
          glow: 'shadow-[0_0_12px_rgba(6,182,212,0.3)]',
        };
      case 'MEDIUM':
        return {
          bg: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
          icon: AlertTriangle,
          glow: 'shadow-[0_0_12px_rgba(245,158,11,0.3)]',
        };
      case 'HIGH':
        return {
          bg: 'bg-orange-500/10 border-orange-500/30 text-orange-400',
          icon: AlertOctagon,
          glow: 'shadow-[0_0_12px_rgba(249,115,22,0.3)]',
        };
      case 'CRITICAL':
        return {
          bg: 'bg-red-500/10 border-red-500/30 text-red-400',
          icon: ShieldAlert,
          glow: 'shadow-[0_0_12px_rgba(239,68,68,0.3)]',
        };
      default:
        return {
          bg: 'bg-slate-500/10 border-slate-500/30 text-slate-400',
          icon: ShieldCheck,
          glow: '',
        };
    }
  };

  const { bg, icon: Icon, glow } = getStyles();
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs font-semibold' : size === 'lg' ? 'px-4 py-1.5 text-base font-bold' : 'px-3 py-1 text-sm font-semibold';

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border backdrop-blur-md ${bg} ${glow} ${sizeClasses}`}>
      <Icon className={size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4'} />
      {level.toUpperCase()} RISK
    </span>
  );
};
