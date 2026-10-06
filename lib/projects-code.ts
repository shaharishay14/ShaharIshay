import type { Project } from "@/data/projects";

/** Full contents of data/projects.ts for the given projects (used by admin mode). */
export function projectsFileSource(projects: Project[]) {
  return `export type MetricType = "velocity" | "traffic" | "none";

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
  /** Short line shown under the name on the card */
  tagline?: string;
  /** Icon or logo drawn in the middle of the card (path under public/, no leading slash) */
  icon?: string;
  /** "app" draws the icon as a rounded app icon; "tint" recolours a one-colour logo to the card text colour */
  iconStyle?: "app" | "tint";
  /** Card background gradient, top-left to bottom-right */
  colors?: [string, string];
  /** Optional full card image; replaces the generated card entirely */
  image?: string;
  metrics?: ProjectMetrics;
}

export const projects: Project[] = ${JSON.stringify(projects, null, 2)};
`;
}
