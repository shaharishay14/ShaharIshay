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
  metrics?: ProjectMetrics;
}

export const projects: Project[] = [
  {
    name: "SuperSave",
    description: "SaaS platform for smart savings automation",
    status: "Live",
    link: "https://supersave-ai.com",
    metrics: {
      type: "traffic",
      data: [120, 190, 150, 100, 300, 380, 450, 380, 600, 900, 750, 1200],
      label: "1.2k API Req/day",
      subtitle: "Growing",
    },
  },
  {
    name: "Stock Prediction",
    description:
      "A production-ready machine learning system for stock price prediction using XGBoost and LSTM models",
    status: "Live",
    link: "https://github.com/shaharishay14/Stock-Prediction",
    metrics: {
      type: "velocity",
      data: [2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24],
      label: "24+ Technical Indicators",
      subtitle: "SMA, EMA, RSI, Volume...",
    },
  },
  {
    name: "Bloom",
    description: "A Zen step tracker. Watch your plant bloom as you walk",
    status: "Beta",
    link: "https://github.com/shaharishay14/Bloom",
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
    name: "Shared Calendar",
    description: "AI-powered household calendar app for families and couples",
    status: "Development",
    link: "https://github.com/shaharishay14/Shared-Calendar",
    metrics: {
      type: "traffic",
      data: [0, 12, 80, 34, 400, 276, 350, 199, 430, 580],
      label: "576+ Events Created",
      subtitle: "Be More Organized",
    },
  },
];
