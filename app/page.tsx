"use client";

import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState, Suspense } from "react";
import { MotionConfig, motion } from "motion/react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { BlurFade } from "@/components/ui/blur-fade";
import { DrumCarousel } from "@/components/ui/drum-carousel";
import { ContactDialog } from "@/components/ContactDialog";
import { AddProjectModal } from "@/components/AddProjectModal";
import { EditProjectModal } from "@/components/EditProjectModal";
import { projects, Project } from "@/data/projects";
import { FONTS_TO_LOAD, cardColors, renderProjectCards } from "@/lib/project-cards";
import { projectsFileSource } from "@/lib/projects-code";
import { cn } from "@/lib/utils";

const SOCIALS = [
  { name: "GitHub", url: "https://github.com/shaharishay14" },
  { name: "X", url: "https://x.com/shahar_ishay14?s=21&t=pHYwv3OZuImbn_TGDDxPIQ" },
  { name: "LinkedIn", url: "https://www.linkedin.com/in/shahar-ishay-831762303/" },
];

// Gentle entrance: fade and a short rise, no blur
const fadeIn = { offset: 8, blur: "0px", duration: 0.6 } as const;

function StatusDot({ status }: { status: Project["status"] }) {
  return (
    <span
      className={cn("inline-block h-1.5 w-1.5 rounded-full", status === "Live" ? "bg-[#1F9D55]" : "bg-muted/50")}
      aria-hidden="true"
    />
  );
}

// Cards are drawn on a canvas, so wait for the web fonts first (but never hang on them)
async function loadCardFonts() {
  const fonts = Promise.all(FONTS_TO_LOAD.map((f) => document.fonts.load(f))).then(() => document.fonts.ready);
  await Promise.race([fonts.catch(() => undefined), new Promise((r) => setTimeout(r, 2500))]);
}

function HomeContent() {
  const searchParams = useSearchParams();
  const modeParam = searchParams.get("mode");
  const adminSecret = process.env.NEXT_PUBLIC_MODE_URL;
  const isAdminMode = !!adminSecret && modeParam === adminSecret;

  const [cards, setCards] = useState<string[]>([]);
  const [active, setActive] = useState(0);
  const [contactOpen, setContactOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  useEffect(() => {
    let cancelled = false;
    loadCardFonts()
      .then(() => renderProjectCards(projects))
      .then((images) => {
        if (!cancelled) setCards(images);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const openProject = useCallback((index: number) => {
    const link = projects[index]?.link;
    if (link) window.open(link, "_blank", "noopener,noreferrer");
  }, []);

  const closeContact = useCallback(() => setContactOpen(false), []);

  const handleDeleteProject = (projectName: string) => {
    if (
      !confirm(
        `Delete project "${projectName}"? This will generate the updated projects array for you to copy.`,
      )
    ) {
      return;
    }
    const projectsCode = projectsFileSource(projects.filter((p) => p.name !== projectName));
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
  };

  const activeProject = projects[active];

  return (
    <MotionConfig reducedMotion="user">
      <div className="flex min-h-[100dvh] flex-col bg-bg text-ink lg:h-[100dvh] lg:overflow-hidden">
        <div className="px-6 pt-8 sm:px-10 sm:pt-10 lg:px-12 xl:px-16">
          <BlurFade {...fadeIn} delay={0.05}>
            <header className="flex flex-wrap items-center justify-between gap-x-8 gap-y-3">
              <a href="./" className="font-display text-lg font-semibold tracking-tight" aria-label="Shahar Ishay — home">
                Shahar Ishay
              </a>
              <nav aria-label="Elsewhere" className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-medium text-muted">
                <button
                  type="button"
                  onClick={() => setContactOpen(true)}
                  className="text-ink transition-colors hover:text-accent"
                >
                  Contact
                </button>
                {SOCIALS.map((link) => (
                  <a
                    key={link.name}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors hover:text-ink"
                  >
                    {link.name}
                  </a>
                ))}
                {isAdminMode && (
                  <span className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsAddModalOpen(true)}
                      className="flex h-8 items-center gap-1.5 rounded-full border border-line bg-surface px-3 text-ink transition-colors hover:border-accent/50"
                    >
                      <Plus className="h-3.5 w-3.5" /> Add
                    </button>
                    {activeProject && (
                      <>
                        <button
                          type="button"
                          onClick={() => setEditingProject(activeProject)}
                          aria-label={`Edit ${activeProject.name}`}
                          className="flex h-8 w-8 items-center justify-center rounded-full border border-line bg-surface text-ink transition-colors hover:border-accent/50"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteProject(activeProject.name)}
                          aria-label={`Delete ${activeProject.name}`}
                          className="flex h-8 w-8 items-center justify-center rounded-full border border-line bg-surface text-ink transition-colors hover:border-accent/50"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </>
                    )}
                  </span>
                )}
              </nav>
            </header>
          </BlurFade>

          <BlurFade {...fadeIn} delay={0.12}>
            <h1 className="mt-10 max-w-[920px] font-display text-[34px] font-semibold leading-[1.06] tracking-[-0.02em] sm:text-[42px] lg:mt-10 xl:text-[46px]">
              Full stack and mobile developer building production systems end&nbsp;to&nbsp;end.
            </h1>
          </BlurFade>

          <BlurFade {...fadeIn} delay={0.2}>
            <p className="mt-4 max-w-[640px] text-base leading-relaxed text-muted">
              I build full stack web applications and mobile apps, from the database and APIs to the interface people use every day. My work spans grocery price comparison, AI project assistants, habit tracking and machine-learning tools for medical research.
            </p>
          </BlurFade>
        </div>

        {/* Carousel */}
        <section aria-label="Projects" className="relative flex h-[72svh] min-h-[440px] flex-col lg:h-auto lg:min-h-0 lg:flex-1">
          {/* Soft wash in the front card's colour. One layer per project, crossfaded:
              browsers can't animate between two gradients, so a single layer would jump */}
          {projects.map((project, i) => (
            <div
              key={project.name}
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 transition-opacity duration-700"
              style={{
                opacity: i === active ? 1 : 0,
                background: `radial-gradient(40% 45% at 50% 47%, ${cardColors(project, i)[0]}2e, transparent 72%)`,
              }}
            />
          ))}
          <div className="relative min-h-0 flex-1">
            {cards.length > 0 && (
              <BlurFade offset={0} blur="0px" duration={0.8} delay={0.15} className="absolute inset-0">
                <DrumCarousel
                  images={cards}
                  onActiveChange={setActive}
                  onOpen={openProject}
                  ariaLabel="Projects. Drag, scroll or use the arrow keys; click the front card to open it."
                />
              </BlurFade>
            )}
          </div>
          {/* Fixed height: if the caption grew with longer descriptions, the drum above
              would shrink and every card would resize */}
          <div className="relative flex h-[116px] shrink-0 justify-center overflow-hidden px-6 sm:h-[124px]" aria-live="polite">
            {activeProject && (
              <motion.div
                key={activeProject.name}
                className="max-w-[520px] text-center"
                initial={{ opacity: 0.4 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.25 }}
              >
                <div className="flex items-center justify-center gap-2 text-[13px] font-medium text-muted">
                  <span className="text-ink">{activeProject.name}</span>
                  <span aria-hidden="true">·</span>
                  <StatusDot status={activeProject.status} />
                  {activeProject.status}
                </div>
                <p className="mt-2 line-clamp-3 text-sm leading-snug text-muted">{activeProject.description}</p>
              </motion.div>
            )}
          </div>
        </section>

        <ContactDialog open={contactOpen} onClose={closeContact} />

        <AddProjectModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />

        {editingProject && (
          <EditProjectModal
            isOpen
            onClose={() => setEditingProject(null)}
            project={editingProject}
            allProjects={projects}
          />
        )}
      </div>
    </MotionConfig>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-[100dvh] bg-bg" />}>
      <HomeContent />
    </Suspense>
  );
}
