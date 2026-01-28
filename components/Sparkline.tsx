"use client";

import { LineChart, Line, ResponsiveContainer, Area, AreaChart } from "recharts";

interface SparklineProps {
  data: number[];
  color?: string;
}

export function Sparkline({ data, color = "var(--primary)" }: SparklineProps) {
  const chartData = data.map((value, index) => ({ value, index }));
  const gradientId = `gradient-${color.replace(/[(),-\s]/g, '')}`;

  return (
    <ResponsiveContainer width="100%" height={50}>
      <AreaChart data={chartData}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.4} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={2}
          fill={`url(#${gradientId})`}
          isAnimationActive={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
