export type MetricType = "velocity" | "traffic" | "none";

export interface ProjectMetrics {
  type: MetricType;
  data: number[];
  label?: string;
  subtitle?: string;
}

/** Tabs above the carousel, in display order; the first is selected by default */
export const SECTIONS = ["ML & Research", "AI Products", "Apps & Products", "Client Work"] as const;
export type Section = (typeof SECTIONS)[number];

export interface Project {
  name: string;
  description: string;
  status: "Live" | "Beta" | "Coming Soon" | "Development" | "Open Source";
  /** Which tab the project is listed under */
  section: Section;
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

export const projects: Project[] = [
  {
    name: "Bagheera",
    description:
      "Browser control room for PANTHER, a computational-pathology model: from raw whole-slide images to trained models and inference, no terminal needed. Built with Sheba Medical Center, where researchers use it today.",
    tagline: "Pathology ML, no terminal required",
    status: "Live",
    section: "ML & Research",
    link: "https://github.com/shaharishay14/Bagheera",
    icon: "projects/bagheera.png",
    colors: ["#3A3D46", "#16171B"],
  },
  {
    name: "Stock Prediction",
    description:
      "XGBoost and LSTM models forecasting price direction at four horizons, from one day to six months, combining technical indicators with live news sentiment.",
    tagline: "ML price forecasting",
    status: "Live",
    section: "ML & Research",
    link: "https://github.com/shaharishay14/Stock-Prediction",
    colors: ["#4C82FF", "#1E3FA8"],
    metrics: {
      type: "velocity",
      data: [2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24],
      label: "26 Features",
      subtitle: "Technicals + news sentiment",
    },
  },
  {
    name: "Seiton",
    description:
      "An AI assistant for every project. Tell it what you need in your own words; it adds tasks, moves deadlines and turns meetings into action items.",
    tagline: "Your AI assistant for every project",
    status: "Coming Soon",
    section: "AI Products",
    link: "https://useseiton.com",
    icon: "projects/seiton.png",
    colors: ["#C9B8FF", "#8FD8EC"],
  },
  {
    name: "Agent Studio",
    description:
      "Create AI agents in plain language, connect them to 30+ apps like Gmail, Slack and GitHub, chat with them in real time, and automate them with scheduled or event-based workflows.",
    tagline: "Build and automate AI agents",
    status: "Open Source",
    section: "AI Products",
    link: "https://github.com/shaharishay14/agent-studio",
    icon: "projects/agent-studio.svg",
    iconStyle: "tint",
    colors: ["#8B5CF6", "#4C1D95"],
  },
  {
    name: "SuperSave",
    description:
      "Build a shopping list and SuperSave shows which of Israel's major grocery chains has your whole basket cheapest, in stores and online. An LLM assistant and receipt parsing track spending and surface deals that fit you.",
    tagline: "Find where your basket is cheapest",
    status: "Live",
    section: "Apps & Products",
    link: "https://supersave-ai.com",
    icon: "projects/supersave.png",
    iconStyle: "tint",
    colors: ["#22C46E", "#0B8A4A"],
    metrics: {
      type: "traffic",
      data: [120, 190, 150, 100, 300, 380, 450, 380, 600, 900, 750, 1200],
      label: "1.2k API Req/day",
      subtitle: "Growing",
    },
  },
  {
    name: "SlabbedMRR",
    description:
      "Turns a startup's verified revenue into a collectible graded card, with a new themed edition every month. Connect a payment provider with a read-only key and mint your card.",
    tagline: "Verified MRR, slabbed",
    status: "Live",
    section: "Apps & Products",
    link: "https://slabbedmrr.com",
    icon: "projects/slabbedmrr.png",
    colors: ["#3BA8FF", "#0B5ED7"],
  },
  {
    name: "Nonchalife",
    description:
      "A habit tracker for iPhone. Tap the card when it's done and get on with your day.",
    tagline: "Habits, done nonchalantly",
    status: "Live",
    section: "Apps & Products",
    link: "https://nonchalife.com",
    icon: "projects/nonchalife.png",
    iconStyle: "app",
    colors: ["#E3F59A", "#B9D84A"],
  },
  {
    name: "Bloom",
    description: "A Zen step tracker. Watch your plant bloom as you walk",
    tagline: "A zen step tracker",
    status: "Beta",
    section: "Apps & Products",
    link: "https://github.com/shaharishay14/Bloom",
    icon: "projects/bloom.png",
    iconStyle: "app",
    colors: ["#FFC2D1", "#F27A9B"],
    metrics: {
      type: "velocity",
      data: [
        0, 10000, 60000, 30000, 40000, 20000, 60000, 30000, 80000, 90000,
        100000, 110000,
      ],
      label: "100K+ Steps Counted",
      subtitle: "And Going Strong.",
    },
  },
  {
    name: "NEXT Production",
    description:
      "Website for NEXT, a music festival production company behind shows with international DJs: events, artists, news and an admin panel to manage it all.",
    tagline: "Festival production website",
    status: "Live",
    section: "Client Work",
    link: "https://next-prod.com",
    icon: "projects/next-production.svg",
    iconStyle: "app",
    colors: ["#5B5B66", "#111114"],
  },
  {
    name: "Fishi HaGadol",
    description:
      "Official website for Fishi HaGadol, a pioneer of Israeli hip-hop and dancehall: upcoming shows, booking, merch shop and videos, in Hebrew.",
    tagline: "Artist website",
    status: "Live",
    section: "Client Work",
    link: "https://fishihagdol.com",
    icon: "projects/fishi-hagadol.svg",
    iconStyle: "app",
    colors: ["#3A2E1E", "#0E0C09"],
  },
];
