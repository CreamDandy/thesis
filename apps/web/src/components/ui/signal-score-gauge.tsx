'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface SignalScoreGaugeProps {
  score: number;
  label: string;
  bullishCount: number;
  neutralCount: number;
  bearishCount: number;
  className?: string;
}

export function SignalScoreGauge({
  score,
  label,
  bullishCount,
  neutralCount,
  bearishCount,
  className,
}: SignalScoreGaugeProps) {
  const clampedScore = Math.max(0, Math.min(100, score));

  const getScoreColor = () => {
    if (clampedScore <= 33) return 'text-red-500';
    if (clampedScore <= 66) return 'text-amber-500';
    return 'text-emerald-500';
  };

  // Gauge dimensions
  const width = 200;
  const height = 120;
  const cx = width / 2;
  const cy = height - 15;
  const radius = 70;
  const strokeWidth = 20;

  // Create a proper semicircle arc path
  // Start at left (9 o'clock), end at right (3 o'clock)
  const arcPath = `M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`;

  // Needle angle: score 0 = left (180°), score 100 = right (0°)
  // In SVG rotation: 0° points right, so we need to map score to rotation
  const needleRotation = -90 + (clampedScore / 100) * 180; // -90° (left) to 90° (right)
  const needleLength = radius - 8;

  return (
    <div className={cn('flex flex-col items-center', className)}>
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        style={{ overflow: 'visible' }}
      >
        {/* Background track */}
        <path
          d={arcPath}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          className="dark:stroke-gray-700"
        />

        {/* Colored segments using stroke-dasharray */}
        {/* Red segment (0-33%) */}
        <path
          d={arcPath}
          fill="none"
          stroke="#ef4444"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={`${(radius * Math.PI) * 0.33} ${radius * Math.PI}`}
          strokeDashoffset="0"
        />
        {/* Yellow segment (33-66%) */}
        <path
          d={arcPath}
          fill="none"
          stroke="#f59e0b"
          strokeWidth={strokeWidth}
          strokeDasharray={`${(radius * Math.PI) * 0.33} ${radius * Math.PI}`}
          strokeDashoffset={`${-(radius * Math.PI) * 0.33}`}
        />
        {/* Green segment (66-100%) */}
        <path
          d={arcPath}
          fill="none"
          stroke="#10b981"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={`${(radius * Math.PI) * 0.34} ${radius * Math.PI}`}
          strokeDashoffset={`${-(radius * Math.PI) * 0.66}`}
        />

        {/* Needle */}
        <g transform={`rotate(${needleRotation}, ${cx}, ${cy})`}>
          <line
            x1={cx}
            y1={cy}
            x2={cx + needleLength}
            y2={cy}
            stroke="#1f2937"
            strokeWidth={3}
            strokeLinecap="round"
            className="dark:stroke-gray-100"
          />
          <circle
            cx={cx + needleLength}
            cy={cy}
            r={5}
            fill="#1f2937"
            className="dark:fill-gray-100"
          />
        </g>

        {/* Center pivot */}
        <circle cx={cx} cy={cy} r={12} fill="#1f2937" className="dark:fill-gray-100" />
        <circle cx={cx} cy={cy} r={6} fill="white" className="dark:fill-gray-900" />

        {/* Labels */}
        <text x={cx - radius - 12} y={cy + 5} textAnchor="end" fill="#ef4444" fontSize="11" fontWeight="600">
          Sell
        </text>
        <text x={cx} y={cy - radius - 8} textAnchor="middle" fill="#f59e0b" fontSize="11" fontWeight="600">
          Hold
        </text>
        <text x={cx + radius + 12} y={cy + 5} textAnchor="start" fill="#10b981" fontSize="11" fontWeight="600">
          Buy
        </text>
      </svg>

      {/* Score display */}
      <div className="text-center -mt-3">
        <div className={cn('text-4xl font-bold tabular-nums', getScoreColor())}>
          {clampedScore}
        </div>
        <div className={cn('text-base font-semibold', getScoreColor())}>
          {label}
        </div>
      </div>

      {/* Signal counts */}
      <div className="flex items-center justify-center gap-4 mt-2">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <span className="text-sm text-muted-foreground tabular-nums">{bullishCount}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
          <span className="text-sm text-muted-foreground tabular-nums">{neutralCount}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
          <span className="text-sm text-muted-foreground tabular-nums">{bearishCount}</span>
        </div>
      </div>
    </div>
  );
}
