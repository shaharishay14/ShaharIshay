"use client";

import { useState } from "react";
import { X, Copy, Check } from "lucide-react";
import { Project, MetricType } from "@/data/projects";

interface AddProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddProjectModal({ isOpen, onClose }: AddProjectModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<Project["status"]>("Development");
  const [link, setLink] = useState("");
  const [metricsType, setMetricsType] = useState<MetricType>("velocity");
  const [copied, setCopied] = useState(false);

  const generateJSON = () => {
    // Generate random sparkline data
    const metricsData = Array.from({ length: 12 }, (_, i) =>
      Math.floor(Math.random() * 50) + (i * 5)
    );

    const projectData: Project = {
      name,
      description,
      status,
      ...(link && { link }),
    };

    // Add metrics based on type
    if (metricsType !== "none") {
      const label = metricsType === "velocity"
        ? `${metricsData[metricsData.length - 1]} commits`
        : `${Math.floor(metricsData[metricsData.length - 1] * 10)} API Req/day`;

      const subtitle = metricsType === "velocity"
        ? "Active Dev"
        : "Growing";

      projectData.metrics = {
        type: metricsType,
        data: metricsData,
        label,
        subtitle,
      };
    }

    return JSON.stringify(projectData, null, 2);
  };

  const handleGenerate = async () => {
    if (!name || !description) {
      alert("Please fill in name and description");
      return;
    }

    const json = generateJSON();

    try {
      await navigator.clipboard.writeText(json);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
        // Reset form
        setName("");
        setDescription("");
        setStatus("Development");
        setLink("");
        onClose();
      }, 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
      alert("Failed to copy to clipboard. Check console for the JSON.");
      console.log(json);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-white border-4 border-[var(--foreground)] p-8 shadow-2xl">
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
          <h2 className="text-2xl font-black font-display tracking-tight mb-2">ADD PROJECT</h2>
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

          <div className="pt-4 border-t-2 border-[var(--border)]">
            <label className="block text-xs font-mono text-gray-500 mb-2 uppercase tracking-wider">
              METRICS TYPE
            </label>
            <select
              value={metricsType}
              onChange={(e) => setMetricsType(e.target.value as MetricType)}
              className="terminal-input w-full px-3 py-2.5 text-sm"
            >
              <option value="velocity">Dev Velocity (Commits)</option>
              <option value="traffic">Live Traffic (Users/API)</option>
              <option value="none">No Metrics</option>
            </select>
            <p className="mt-2 text-[10px] font-mono text-gray-500">
              {metricsType === "velocity" && "Auto-generates commit velocity data with label"}
              {metricsType === "traffic" && "Auto-generates traffic/usage data with label"}
              {metricsType === "none" && "Project card won't show metrics section"}
            </p>
          </div>
        </div>

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          disabled={copied}
          className={`w-full mt-8 py-3.5 font-bold text-xs uppercase tracking-wider font-mono transition-all duration-200 border-2 border-[var(--foreground)] flex items-center justify-center gap-2 ${
            copied
              ? 'bg-[var(--primary)] text-white'
              : 'bg-[var(--primary-dark)] hover:bg-[var(--primary)] text-white'
          }`}
        >
          {copied ? (
            <>
              <Check className="w-5 h-5" />
              <span>COPIED!</span>
            </>
          ) : (
            <>
              <Copy className="w-5 h-5" />
              <span>GENERATE JSON</span>
            </>
          )}
        </button>

        <div className="mt-6 p-3 border-2 border-[var(--border)] bg-[var(--accent)]">
          <p className="text-[10px] font-mono text-gray-600 leading-relaxed">
            &gt; JSON will be copied to clipboard<br />
            &gt; Paste into data/projects.ts
          </p>
        </div>
      </div>
    </div>
  );
}
