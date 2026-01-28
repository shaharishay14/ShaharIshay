"use client";

import { ExternalLink, Box, Trash2, Edit } from "lucide-react";
import { MetricsDisplay } from "./MetricsDisplay";
import { Project } from "@/data/projects";
import { cn } from "@/lib/utils";

interface ProjectCardProps {
  project: Project;
  index: number;
  isAdminMode?: boolean;
  onDelete?: () => void;
  onEdit?: () => void;
}

const statusConfig = {
  Live: {
    color: "text-[var(--primary)]",
    bg: "bg-[var(--primary)]/10",
    border: "border-[var(--primary)]",
    glow: true,
  },
  Beta: {
    color: "text-blue-600",
    bg: "bg-blue-600/10",
    border: "border-blue-600",
    glow: false,
  },
  "Coming Soon": {
    color: "text-purple-600",
    bg: "bg-purple-600/10",
    border: "border-purple-600",
    glow: false,
  },
  Development: {
    color: "text-[var(--primary-dark)]",
    bg: "bg-[var(--primary-dark)]/10",
    border: "border-[var(--primary-dark)]",
    glow: false,
  },
};

export function ProjectCard({ project, index, isAdminMode = false, onDelete, onEdit }: ProjectCardProps) {
  const config = statusConfig[project.status];

  return (
    <div
      className="group relative bg-white border-2 border-[var(--border)] hover:border-[var(--primary)] transition-all duration-300 overflow-hidden"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[var(--primary)] opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[var(--primary-dark)] opacity-0 group-hover:opacity-100 transition-opacity" />

      {/* Scan line on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        <div className="absolute w-full h-[1px] bg-gradient-to-r from-transparent via-[var(--primary)] to-transparent animate-[scan_2s_linear_infinite]" />
      </div>

      <div className="relative p-8 space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-6">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-3">
              <Box className="w-5 h-5 text-[var(--primary)] flex-shrink-0" />
              <h3
                className="text-xl font-bold font-display truncate glitch"
                data-text={project.name}
              >
                {project.name}
              </h3>
            </div>
            <p className="text-sm font-mono text-gray-600 leading-relaxed">
              {project.description}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 w-12 h-12 border-2 border-[var(--border)] hover:border-[var(--primary)] bg-white flex items-center justify-center transition-all group/link"
              >
                <ExternalLink className="w-5 h-5 group-hover/link:text-[var(--primary)] group-hover/link:rotate-12 transition-all" />
              </a>
            )}
            {isAdminMode && onEdit && (
              <button
                onClick={onEdit}
                className="flex-shrink-0 w-12 h-12 border-2 border-[var(--primary)] hover:border-[var(--primary)] hover:bg-[var(--primary)] bg-white flex items-center justify-center transition-all group/edit"
                title="Edit project"
              >
                <Edit className="w-5 h-5 text-[var(--primary)] group-hover/edit:text-white transition-all" />
              </button>
            )}
            {isAdminMode && onDelete && (
              <button
                onClick={onDelete}
                className="flex-shrink-0 w-12 h-12 border-2 border-[var(--primary-dark)] hover:border-[var(--primary-dark)] hover:bg-[var(--primary-dark)] bg-white flex items-center justify-center transition-all group/delete"
                title="Delete project"
              >
                <Trash2 className="w-5 h-5 text-[var(--primary-dark)] group-hover/delete:text-white transition-all" />
              </button>
            )}
          </div>
        </div>

        {/* Status Badge */}
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "inline-flex items-center gap-2 px-4 py-2 border-2 font-mono text-sm uppercase tracking-wider font-bold",
              config.border,
              config.bg,
              config.color,
              config.glow && "status-live"
            )}
          >
            <div className={cn("w-2 h-2", config.glow ? "bg-[var(--primary)] animate-pulse" : `bg-current`)} />
            {project.status}
          </div>
        </div>

        {/* Metrics Section */}
        {project.metrics && <MetricsDisplay metrics={project.metrics} />}
      </div>
    </div>
  );
}
