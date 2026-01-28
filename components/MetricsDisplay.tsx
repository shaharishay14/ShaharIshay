"use client";

import { TrendingUp, Zap, Activity } from "lucide-react";
import { Sparkline } from "./Sparkline";
import { ProjectMetrics } from "@/data/projects";
import { cn } from "@/lib/utils";

interface MetricsDisplayProps {
  metrics: ProjectMetrics;
}

export function MetricsDisplay({ metrics }: MetricsDisplayProps) {
  if (!metrics || metrics.type === "none" || metrics.data.length === 0) {
    return null;
  }

  const getIcon = () => {
    switch (metrics.type) {
      case "velocity":
        return <Zap className="w-3 h-3 text-[var(--primary)]" />;
      case "traffic":
        return <TrendingUp className="w-3 h-3 text-[var(--primary)]" />;
      default:
        return <Activity className="w-3 h-3 text-[var(--primary)]" />;
    }
  };

  const getTypeLabel = () => {
    switch (metrics.type) {
      case "velocity":
        return "DEV VELOCITY";
      case "traffic":
        return "LIVE TRAFFIC";
      default:
        return "METRICS";
    }
  };

  const getGradientColor = () => {
    switch (metrics.type) {
      case "velocity":
        return "var(--primary-dark)"; // Red for commits/velocity
      case "traffic":
        return "var(--primary)"; // Orange for traffic/usage
      default:
        return "var(--primary)";
    }
  };

  return (
    <div className="space-y-3 pt-4 border-t-2 border-[var(--border)]">
      {/* Header */}
      <div className="flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-2">
          {getIcon()}
          <span className="text-gray-500">{getTypeLabel()}</span>
        </div>
        <div className="text-right">
          {metrics.label && (
            <div className="font-bold text-sm text-[var(--foreground)]">
              {metrics.label}
            </div>
          )}
          {metrics.subtitle && (
            <div className="text-gray-500 text-[10px] uppercase tracking-wider">
              {metrics.subtitle}
            </div>
          )}
        </div>
      </div>

      {/* Sparkline Chart */}
      <div className="relative border border-[var(--border)] p-2 bg-[var(--accent)]/50">
        <Sparkline data={metrics.data} color={getGradientColor()} />
        {/* Grid overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-5">
          <div
            className="w-full h-full"
            style={{
              backgroundImage:
                "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
          />
        </div>
      </div>

      {/* Stats Footer */}
      <div className="flex items-center justify-between text-[10px] font-mono text-gray-600">
        <span>MIN: {Math.min(...metrics.data)}</span>
        <span>
          AVG:{" "}
          {Math.round(
            metrics.data.reduce((a, b) => a + b, 0) / metrics.data.length
          )}
        </span>
        <span>MAX: {Math.max(...metrics.data)}</span>
      </div>
    </div>
  );
}
