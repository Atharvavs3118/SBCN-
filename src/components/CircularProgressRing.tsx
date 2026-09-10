import React from 'react';
import { CheckCircle2, ShieldAlert, Sparkles } from 'lucide-react';

interface CircularProgressRingProps {
  score: number; // 0 to 100
  size?: number; // diameter in pixels (default: 136)
  strokeWidth?: number; // ring thickness in pixels (default: 10)
  label?: string; // Subtitle below percentage (default: "Readiness")
  stageLabel?: string; // e.g. "Operationally Ready"
  riskTier?: 'LOW' | 'MODERATE' | 'HIGH';
  showPill?: boolean;
  className?: string;
}

export const CircularProgressRing: React.FC<CircularProgressRingProps> = ({
  score = 0,
  size = 136,
  strokeWidth = 10,
  label = 'Readiness',
  stageLabel,
  riskTier,
  showPill = true,
  className = '',
}) => {
  const clampedScore = Math.max(0, Math.min(100, Math.round(score)));

  // SVG dimensions
  const center = size / 2;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clampedScore / 100) * circumference;

  // Dynamic color palette based on readiness threshold
  const getTheme = () => {
    if (clampedScore >= 80) {
      return {
        strokeColor: '#10B981',
        gradientStart: '#34D399',
        gradientEnd: '#059669',
        textColor: 'text-emerald-600 dark:text-emerald-400',
        badgeBg: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
        statusText: 'High Readiness',
      };
    }
    if (clampedScore >= 50) {
      return {
        strokeColor: '#3B82F6',
        gradientStart: '#60A5FA',
        gradientEnd: '#2563EB',
        textColor: 'text-blue-600 dark:text-blue-400',
        badgeBg: 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800',
        statusText: 'Moderate Readiness',
      };
    }
    return {
      strokeColor: '#F59E0B',
      gradientStart: '#FBBF24',
      gradientEnd: '#D97706',
      textColor: 'text-amber-600 dark:text-amber-400',
      badgeBg: 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800',
      statusText: 'Action Required',
    };
  };

  const theme = getTheme();
  const gradientId = `readiness-grad-${size}-${clampedScore}`;

  return (
    <div
      className={`relative flex flex-col items-center justify-center select-none ${className}`}
      role="progressbar"
      aria-valuenow={clampedScore}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`${label}: ${clampedScore}%`}
    >
      {/* SVG Circular Progress Ring */}
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="-rotate-90 transform"
        >
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={theme.gradientStart} />
              <stop offset="100%" stopColor={theme.gradientEnd} />
            </linearGradient>
          </defs>

          {/* Background Track Circle */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            strokeWidth={strokeWidth}
            fill="none"
            className="stroke-slate-200 dark:stroke-slate-800"
          />

          {/* Dynamic Animated Progress Circle */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            fill="none"
            stroke={`url(#${gradientId})`}
            className="transition-all duration-700 ease-out"
            style={{
              filter: clampedScore > 0 ? `drop-shadow(0 2px 4px ${theme.strokeColor}33)` : 'none',
            }}
          />
        </svg>

        {/* Center Content Inside the Ring */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-2">
          {clampedScore === 100 ? (
            <div className="flex items-center gap-1">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 animate-bounce" />
            </div>
          ) : null}

          <div className="flex items-baseline justify-center">
            <span className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white font-mono">
              {clampedScore}
            </span>
            <span className={`text-sm sm:text-base font-bold ml-0.5 ${theme.textColor}`}>
              %
            </span>
          </div>

          <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-0.5 line-clamp-1">
            {label}
          </span>
        </div>
      </div>

      {/* Optional Badge below the Ring */}
      {showPill && (stageLabel || riskTier) && (
        <div className="mt-2.5 flex items-center justify-center">
          <span
            className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] font-bold tracking-wide transition-all ${theme.badgeBg}`}
          >
            {clampedScore >= 80 ? (
              <Sparkles className="h-3 w-3" />
            ) : (
              <ShieldAlert className="h-3 w-3" />
            )}
            <span>{stageLabel || theme.statusText}</span>
          </span>
        </div>
      )}
    </div>
  );
};
