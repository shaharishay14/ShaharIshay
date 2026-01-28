"use client";

import { useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import { Plus, Layers } from "lucide-react";
import { Sidebar } from "@/components/Sidebar";
import { ProjectCard } from "@/components/ProjectCard";
import { AddProjectModal } from "@/components/AddProjectModal";
import { EditProjectModal } from "@/components/EditProjectModal";
import { ContactForm } from "@/components/ContactForm";
import { projects, Project } from "@/data/projects";

function HomeContent() {
  const searchParams = useSearchParams();
  const modeParam = searchParams.get("mode");
  const adminSecret = process.env.NEXT_PUBLIC_MODE_URL;
  const isAdminMode = modeParam === adminSecret;
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setIsEditModalOpen(true);
  };

  const handleDeleteProject = (projectName: string) => {
    if (
      confirm(
        `Delete project "${projectName}"? This will generate the updated projects array for you to copy.`,
      )
    ) {
      const updatedProjects = projects.filter((p) => p.name !== projectName);
      const projectsCode = `export interface Project {
  name: string;
  description: string;
  status: "Live" | "Beta" | "Coming Soon" | "Development";
  link?: string;
  metrics?: number[];
}

export const projects: Project[] = ${JSON.stringify(updatedProjects, null, 2)};`;

      navigator.clipboard
        .writeText(projectsCode)
        .then(() => {
          alert(
            `Project deleted! The updated projects file has been copied to your clipboard. Replace the entire content in data/projects.ts`,
          );
        })
        .catch(() => {
          console.log("Updated projects file:");
          console.log(projectsCode);
          alert("Failed to copy. Check console for the updated projects file.");
        });
    }
  };

  return (
    <div className="min-h-screen lg:h-screen lg:overflow-hidden bg-[var(--background)] grid-bg">
      <div className="relative lg:h-full flex flex-col lg:flex-row">
        {/* Left Sidebar - Fixed on desktop, normal on mobile */}
        <div className="lg:fixed lg:left-0 lg:top-0 lg:h-screen lg:w-[420px] px-8 sm:px-10 lg:pl-16 lg:pr-12 py-12 lg:flex lg:items-start">
          <Sidebar />
        </div>

        {/* Middle Content Area - Projects */}
        <div className="flex-1 lg:ml-[420px] lg:mr-[450px] lg:h-full flex flex-col">
          {/* Fixed Projects Header on desktop, normal on mobile */}
          <div className="flex-shrink-0 px-8 sm:px-10 lg:px-16 pt-8 lg:pt-20">
            {/* Header with Admin Button */}
            <div className="mb-8">
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-4">
                    <Layers className="w-8 h-8 text-[var(--primary)]" />
                    <h2 className="text-5xl font-black font-display tracking-tight">
                      PROJECTS
                    </h2>
                  </div>
                  <div className="border-l-4 border-[var(--primary-dark)] pl-6 py-3">
                    <p className="text-sm font-mono text-gray-600 leading-relaxed">
                      [ BUILD FAST ]<br />[ ITERATE & LEARN ] <br /> [ GET SH*T
                      DONE ]
                    </p>
                  </div>
                </div>
                {isAdminMode && (
                  <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center gap-2 px-6 py-3.5 bg-[var(--primary)] text-white font-bold text-sm uppercase tracking-wider font-mono hover:bg-[var(--primary-dark)] transition-all duration-200 border-2 border-[var(--foreground)]"
                  >
                    <Plus className="w-5 h-5" />
                    <span>ADD</span>
                  </button>
                )}
              </div>

              {/* Stats bar */}
              <div className="flex items-center gap-12 text-base font-mono mt-6 pt-6 border-t-2 border-[var(--border)]">
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">TOTAL:</span>
                  <span className="text-[var(--primary)] font-bold">
                    {projects.length}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">LIVE:</span>
                  <span className="text-[var(--primary)] font-bold">
                    {projects.filter((p) => p.status === "Live").length}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">DEV:</span>
                  <span className="text-[var(--primary-dark)] font-bold">
                    {projects.filter((p) => p.status === "Development").length}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Scrollable Project Grid */}
          <div className="flex-1 lg:overflow-y-auto custom-scrollbar px-8 sm:px-10 lg:px-16 pb-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 pt-4">
              {projects.map((project, index) => (
                <ProjectCard
                  key={index}
                  project={project}
                  index={index}
                  isAdminMode={isAdminMode}
                  onEdit={() => handleEditProject(project)}
                  onDelete={() => handleDeleteProject(project.name)}
                />
              ))}
            </div>

            {/* Footer accent */}
            <div className="mt-20 pt-12 border-t-2 border-[var(--border)]">
              <p className="text-base font-mono text-gray-600 text-center">
                [ EOF ] - END OF PROJECTS LIST
              </p>
            </div>
          </div>
        </div>

        {/* Contact Form Section - Fixed on desktop, normal on mobile */}
        <div className="px-8 sm:px-10 py-12 xl:px-12 xl:fixed xl:right-0 xl:top-0 xl:h-screen xl:w-[450px] xl:flex xl:flex-col xl:justify-start xl:pt-20">
          <div className="bg-white border-4 border-[var(--foreground)] p-8 lg:p-10 relative w-full max-w-md mx-auto xl:max-w-none">
            {/* Corner accents */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-[var(--primary)]" />
            <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-[var(--primary)]" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-[var(--primary-dark)]" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-[var(--primary-dark)]" />

            <ContactForm />
          </div>
        </div>
      </div>

      {/* Add Project Modal */}
      <AddProjectModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      {/* Edit Project Modal */}
      {editingProject && (
        <EditProjectModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingProject(null);
          }}
          project={editingProject}
          allProjects={projects}
        />
      )}
    </div>
  );
}

export default function Home() {
  return (
    <Suspense
      fallback={<div className="min-h-screen bg-[var(--background)] grid-bg" />}
    >
      <HomeContent />
    </Suspense>
  );
}
