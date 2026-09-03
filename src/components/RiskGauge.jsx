import React from 'react';

export default function RiskGauge({ score, size = 120 }) {
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  let strokeColor = '#10b981'; // Green
  let glowClass = 'glow-cyan';

  if (score >= 75) {
    strokeColor = '#ef4444'; // Red
    glowClass = 'glow-sif';
  } else if (score >= 55) {
    strokeColor = '#f59e0b'; // Amber
    glowClass = 'glow-amber';
  }

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background track circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#1e293b"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Animated progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
        />
      </svg>
      {/* Score text overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-2xl font-extrabold font-mono text-white tracking-tight">
          {score}%
        </span>
        <span className="text-[9px] font-extrabold uppercase text-slate-400 font-mono tracking-wider">
          SIF RISK
        </span>
      </div>
    </div>
  );
}
