"use client";

import { useState, useEffect } from "react";
import { X, Save, Check } from "lucide-react";
import { Project, MetricType } from "@/data/projects";

interface EditProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
  allProjects: Project[];
}

export function EditProjectModal({ isOpen, onClose, project, allProjects }: EditProjectModalProps) {
  const [name, setName] = useState(project.name);
  const [description, setDescription] = useState(project.description);
  const [status, setStatus] = useState<Project["status"]>(project.status);
  const [link, setLink] = useState(project.link || "");
  const [metricsType, setMetricsType] = useState<MetricType>(project.metrics?.type || "none");
  const [metricsData, setMetricsData] = useState(project.metrics?.data.join(", ") || "");
  const [metricsLabel, setMetricsLabel] = useState(project.metrics?.label || "");
  const [metricsSubtitle, setMetricsSubtitle] = useState(project.metrics?.subtitle || "");
  const [saved, setSaved] = useState(false);

  // Reset form when project changes
  useEffect(() => {
    setName(project.name);
    setDescription(project.description);
    setStatus(project.status);
    setLink(project.link || "");
    setMetricsType(project.metrics?.type || "none");
    setMetricsData(project.metrics?.data.join(", ") || "");
    setMetricsLabel(project.metrics?.label || "");
    setMetricsSubtitle(project.metrics?.subtitle || "");
    setSaved(false);
  }, [project]);

  const handleSave = async () => {
    if (!name || !description) {
      alert("Please fill in name and description");
      return;
    }

    // Parse metrics data
    const parsedMetricsData = metricsData
      .split(",")
      .map(m => parseInt(m.trim()))
      .filter(n => !isNaN(n));

    // Create updated project
    const updatedProject: Project = {
      name,
      description,
      status,
      ...(link && { link }),
    };

    // Add metrics if type is not "none" and data exists
    if (metricsType !== "none" && parsedMetricsData.length > 0) {
      updatedProject.metrics = {
        type: metricsType,
        data: parsedMetricsData,
        ...(metricsLabel && { label: metricsLabel }),
        ...(metricsSubtitle && { subtitle: metricsSubtitle }),
      };
    }

    // Replace the old project with updated one
    const updatedProjects = allProjects.map(p =>
      p.name === project.name ? updatedProject : p
    );

    const projectsCode = `export type MetricType = "velocity" | "traffic" | "none";

export interface ProjectMetrics {
  type: MetricType;
  data: number[];
  label?: string;
  subtitle?: string;
}

export interface Project {
  name: string;
  description: string;
  status: "Live" | "Beta" | "Coming Soon" | "Development";
  link?: string;
  metrics?: ProjectMetrics;
}

export const projects: Project[] = ${JSON.stringify(updatedProjects, null, 2)};`;

    try {
      await navigator.clipboard.writeText(projectsCode);
      setSaved(true);
      setTimeout(() => {
        setSaved(false);
        onClose();
      }, 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
      alert("Failed to copy to clipboard. Check console for the updated code.");
      console.log(projectsCode);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-white border-4 border-[var(--foreground)] p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Corner accents */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-[var(--primary)]" />
        <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-[var(--primary)]" />
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-[var(--primary-dark)]" />
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-[var(--primary-dark)]" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 border-2 border-[var(--border)] hover:border-[var(--primary)] hover:bg-[var(--accent)] transition-all flex items-center justify-center group"
        >
          <X className="w-4 h-4 group-hover:text-[var(--primary)]" />
        </button>

        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-black font-display tracking-tight mb-2">EDIT PROJECT</h2>
          <div className="w-12 h-1 bg-[var(--primary)]" />
        </div>

        {/* Form */}
        <div className="space-y-5">
          <div>
            <label className="block text-xs font-mono text-gray-500 mb-2 uppercase tracking-wider">
              NAME *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="project_name"
              className="terminal-input w-full px-3 py-2.5 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-gray-500 mb-2 uppercase tracking-wider">
              DESCRIPTION *
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="brief_description"
              rows={3}
              className="terminal-input w-full px-3 py-2.5 text-sm resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-gray-500 mb-2 uppercase tracking-wider">
              STATUS
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as Project["status"])}
              className="terminal-input w-full px-3 py-2.5 text-sm"
            >
              <option value="Development">Development</option>
              <option value="Beta">Beta</option>
              <option value="Live">Live</option>
              <option value="Coming Soon">Coming Soon</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-mono text-gray-500 mb-2 uppercase tracking-wider">
              LINK (OPTIONAL)
            </label>
            <input
              type="url"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="https://example.com"
              className="terminal-input w-full px-3 py-2.5 text-sm"
            />
          </div>

          {/* Metrics Section */}
          <div className="pt-4 border-t-2 border-[var(--border)]">
            <label className="block text-xs font-mono text-gray-500 mb-3 uppercase tracking-wider">
              METRICS TYPE
            </label>
            <select
              value={metricsType}
              onChange={(e) => setMetricsType(e.target.value as MetricType)}
              className="terminal-input w-full px-3 py-2.5 text-sm mb-4"
            >
              <option value="none">None</option>
              <option value="velocity">Dev Velocity (Commits)</option>
              <option value="traffic">Live Traffic (Users/API)</option>
            </select>

            {metricsType !== "none" && (
              <>
                <div className="mb-4">
                  <label className="block text-xs font-mono text-gray-500 mb-2 uppercase tracking-wider">
                    METRICS DATA (COMMA SEPARATED)
                  </label>
                  <input
                    type="text"
                    value={metricsData}
                    onChange={(e) => setMetricsData(e.target.value)}
                    placeholder="12, 19, 25, 30, 45, 60, 75, 90"
                    className="terminal-input w-full px-3 py-2.5 text-sm"
                  />
                  <p className="mt-1 text-[10px] font-mono text-gray-500">
                    Numbers for the sparkline chart (12 values recommended)
                  </p>
                </div>

                <div className="mb-4">
                  <label className="block text-xs font-mono text-gray-500 mb-2 uppercase tracking-wider">
                    LABEL
                  </label>
                  <input
                    type="text"
                    value={metricsLabel}
                    onChange={(e) => setMetricsLabel(e.target.value)}
                    placeholder={metricsType === "velocity" ? "145 commits" : "1.2k API Req/day"}
                    className="terminal-input w-full px-3 py-2.5 text-sm"
                  />
                  <p className="mt-1 text-[10px] font-mono text-gray-500">
                    {metricsType === "velocity" ? "e.g., '145 commits' or '52 commits/week'" : "e.g., '1.2k API Req/day' or '50 Active Users'"}
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-mono text-gray-500 mb-2 uppercase tracking-wider">
                    SUBTITLE
                  </label>
                  <input
                    type="text"
                    value={metricsSubtitle}
                    onChange={(e) => setMetricsSubtitle(e.target.value)}
                    placeholder={metricsType === "velocity" ? "High Velocity" : "Growing"}
                    className="terminal-input w-full px-3 py-2.5 text-sm"
                  />
                  <p className="mt-1 text-[10px] font-mono text-gray-500">
                    {metricsType === "velocity" ? "e.g., 'High Velocity' or 'Active Dev'" : "e.g., 'Growing' or 'Stable'"}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={saved}
          className={`w-full mt-8 py-3.5 font-bold text-xs uppercase tracking-wider font-mono transition-all duration-200 border-2 border-[var(--foreground)] flex items-center justify-center gap-2 ${
            saved
              ? 'bg-[var(--primary)] text-white'
              : 'bg-[var(--primary-dark)] hover:bg-[var(--primary)] text-white'
          }`}
        >
          {saved ? (
            <>
              <Check className="w-5 h-5" />
              <span>SAVED!</span>
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              <span>SAVE CHANGES</span>
            </>
          )}
        </button>

        <div className="mt-6 p-3 border-2 border-[var(--border)] bg-[var(--accent)]">
          <p className="text-[10px] font-mono text-gray-600 leading-relaxed">
            &gt; Full projects file will be copied to clipboard<br />
            &gt; Replace entire content in data/projects.ts
          </p>
        </div>
      </div>
    </div>
  );
}
