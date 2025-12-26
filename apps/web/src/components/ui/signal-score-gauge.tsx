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
  // Clamp score between 0 and 100
  const clampedScore = Math.max(0, Math.min(100, score));

  // 3-Zone color system based on score
  const getScoreColor = () => {
    if (clampedScore <= 33) return 'text-red-500';
    if (clampedScore <= 66) return 'text-amber-500';
    return 'text-emerald-500';
  };

  // Gauge dimensions
  const width = 220;
  const height = 130;
  const cx = width / 2; // Center X
  const cy = height - 20; // Center Y (pivot point)
  const radius = 80;
  const strokeWidth = 24;

  // Helper: convert polar to cartesian
  // Angle 0 = pointing right (3 o'clock), 90 = up (12 o'clock), 180 = left (9 o'clock)
  const getPoint = (angle: number, r: number = radius) => {
    const rad = (angle * Math.PI) / 180;
    return {
      x: cx + r * Math.cos(rad),
      y: cy - r * Math.sin(rad), // Minus because SVG Y is inverted
    };
  };

  // Create arc path using SVG arc command
  // Arc goes from startAngle to endAngle (counterclockwise in standard math)
  const createArc = (startAngle: number, endAngle: number) => {
    const start = getPoint(startAngle);
    const end = getPoint(endAngle);
    const largeArc = Math.abs(endAngle - startAngle) > 180 ? 1 : 0;
    // sweep = 0 for counterclockwise (going from higher angle to lower)
    return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArc} 0 ${end.x} ${end.y}`;
  };

  // Needle: score 0 = left (180°), score 50 = up (90°), score 100 = right (0°)
  const needleAngle = 180 - (clampedScore / 100) * 180;
  const needleLength = radius - 12;
  const needleTip = getPoint(needleAngle, needleLength);

  return (
    <div className={cn('flex flex-col items-center', className)}>
      {/* SVG Gauge */}
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        style={{ overflow: 'visible' }}
      >
        {/* Arc segments - from left (180°) to right (0°) */}
        {/* Red zone: 180° to 120° (left third) */}
        <path
          d={createArc(180, 120)}
          fill="none"
          stroke="#ef4444"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        {/* Yellow zone: 120° to 60° (middle third) */}
        <path
          d={createArc(120, 60)}
          fill="none"
          stroke="#f59e0b"
          strokeWidth={strokeWidth}
          strokeLinecap="butt"
        />
        {/* Green zone: 60° to 0° (right third) */}
        <path
          d={createArc(60, 0)}
          fill="none"
          stroke="#10b981"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />

        {/* Needle */}
        <line
          x1={cx}
          y1={cy}
          x2={needleTip.x}
          y2={needleTip.y}
          stroke="#1f2937"
          strokeWidth={4}
          strokeLinecap="round"
          className="dark:stroke-gray-100"
        />

        {/* Needle tip triangle */}
        <circle
          cx={needleTip.x}
          cy={needleTip.y}
          r={6}
          fill="#1f2937"
          className="dark:fill-gray-100"
        />

        {/* Center pivot */}
        <circle
          cx={cx}
          cy={cy}
          r={14}
          fill="#1f2937"
          className="dark:fill-gray-100"
        />
        <circle
          cx={cx}
          cy={cy}
          r={8}
          fill="white"
          className="dark:fill-gray-900"
        />

        {/* Labels */}
        <text
          x={cx - radius - 8}
          y={cy + 5}
          textAnchor="end"
          fill="#ef4444"
          fontSize="12"
          fontWeight="600"
        >
          Sell
        </text>
        <text
          x={cx}
          y={cy - radius - strokeWidth / 2 - 8}
          textAnchor="middle"
          fill="#f59e0b"
          fontSize="12"
          fontWeight="600"
        >
          Hold
        </text>
        <text
          x={cx + radius + 8}
          y={cy + 5}
          textAnchor="start"
          fill="#10b981"
          fontSize="12"
          fontWeight="600"
        >
          Buy
        </text>
      </svg>

      {/* Score display */}
      <div className="text-center -mt-4">
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
