export type MetricType = "velocity" | "traffic" | "none";

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

export const projects: Project[] = [
  {
    name: "SuperSave",
    description:
      "Build a shopping list and SuperSave shows which of Israel's major grocery chains has your whole basket cheapest, in stores and online. It learns from your receipts to track spending and surface deals that fit you.",
    tagline: "Find where your basket is cheapest",
    status: "Live",
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
    name: "Nonchalife",
    description:
      "A habit tracker for iPhone. Tap the card when it's done and get on with your day.",
    tagline: "Habits, done nonchalantly",
    status: "Live",
    link: "https://nonchalife.com",
    icon: "projects/nonchalife.png",
    iconStyle: "app",
    colors: ["#E3F59A", "#B9D84A"],
  },
  {
    name: "Seiton",
    description:
      "An AI assistant for every project. Tell it what you need in your own words; it adds tasks, moves deadlines and turns meetings into action items.",
    tagline: "Your AI assistant for every project",
    status: "Coming Soon",
    link: "https://useseiton.com",
    icon: "projects/seiton.png",
    colors: ["#C9B8FF", "#8FD8EC"],
  },
  {
    name: "Bagheera",
    description:
      "Browser control room for computational-pathology ML pipelines, from raw whole-slide images to trained models and inference. Built with Sheba Medical Center.",
    tagline: "Pathology ML, no terminal required",
    status: "Live",
    link: "https://github.com/shaharishay14/Bagheera",
    icon: "projects/bagheera.png",
    colors: ["#3A3D46", "#16171B"],
  },
  {
    name: "Bloom",
    description: "A Zen step tracker. Watch your plant bloom as you walk",
    tagline: "A zen step tracker",
    status: "Beta",
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
    name: "Stock Prediction",
    description:
      "A production-ready machine learning system for stock price prediction using XGBoost and LSTM models",
    tagline: "ML price forecasting",
    status: "Live",
    link: "https://github.com/shaharishay14/Stock-Prediction",
    colors: ["#4C82FF", "#1E3FA8"],
    metrics: {
      type: "velocity",
      data: [2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24],
      label: "24+ Technical Indicators",
      subtitle: "SMA, EMA, RSI, Volume...",
    },
  },
];
