import type { Project } from "@/data/projects";

// Cards are drawn at 7:9, the same aspect the carousel uses for its planes.
const W = 1050;
const H = 1350;
const PAD = 72;

const DISPLAY = '"Schibsted Grotesk", "Helvetica Neue", Arial, sans-serif';
const BODY = '"Inter", system-ui, sans-serif';

export const FONTS_TO_LOAD = [`700 100px ${DISPLAY}`, `500 100px ${DISPLAY}`, `500 100px ${BODY}`];

const FALLBACK_COLORS: [string, string][] = [
  ["#FF8A5B", "#E2482B"],
  ["#4C82FF", "#1E3FA8"],
  ["#C9B8FF", "#8FD8EC"],
  ["#3A3D46", "#16171B"],
];

function hexToRgb(hex: string) {
  const n = parseInt(hex.replace("#", ""), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function luminance(hex: string) {
  const [r, g, b] = hexToRgb(hex).map((c) => {
    const v = c / 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function cardColors(project: Project, index: number): [string, string] {
  return project.colors ?? FALLBACK_COLORS[index % FALLBACK_COLORS.length];
}

/** Dark text on light cards, white on saturated/dark ones */
function inkFor(colors: [string, string]) {
  const lum = (luminance(colors[0]) + luminance(colors[1])) / 2;
  return lum > 0.45 ? { ink: "#17181C", muted: "rgba(23,24,28,0.6)" } : { ink: "#FFFFFF", muted: "rgba(255,255,255,0.72)" };
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement | null>((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

function roundRectPath(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function linkLabel(link?: string) {
  if (!link) return "";
  try {
    const url = new URL(link);
    if (url.hostname === "github.com") return "GitHub";
    return url.hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

/** Stand-in icon for projects without one: a rising candlestick chart */
function drawChartGlyph(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number, color: string) {
  const bars = [0.35, 0.5, 0.42, 0.62, 0.55, 0.78, 0.92];
  const gap = size / bars.length;
  const w = gap * 0.52;
  ctx.save();
  ctx.fillStyle = color;
  ctx.strokeStyle = color;
  ctx.lineWidth = Math.max(4, size * 0.012);
  ctx.lineCap = "round";
  bars.forEach((h, i) => {
    const x = cx - size / 2 + gap * i + (gap - w) / 2;
    const bh = size * h * 0.6;
    const top = cy + size * 0.32 - bh;
    ctx.globalAlpha = 0.55 + 0.45 * (i / (bars.length - 1));
    ctx.beginPath();
    ctx.moveTo(x + w / 2, top - size * 0.06);
    ctx.lineTo(x + w / 2, top + bh + size * 0.04);
    ctx.stroke();
    roundRectPath(ctx, x, top, w, bh, w * 0.25);
    ctx.fill();
  });
  ctx.restore();
}

/** Renders a project as a card image (data URL) for the carousel. */
export async function renderProjectCard(project: Project, index: number): Promise<string> {
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";

  const colors = cardColors(project, index);
  const { ink, muted } = inkFor(colors);

  // Background: diagonal gradient, a soft light from the top and a darker floor
  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, colors[0]);
  bg.addColorStop(1, colors[1]);
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);
  const glow = ctx.createRadialGradient(W * 0.3, H * 0.15, 0, W * 0.3, H * 0.15, W * 0.95);
  glow.addColorStop(0, "rgba(255,255,255,0.28)");
  glow.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, H);
  const floor = ctx.createLinearGradient(0, H * 0.6, 0, H);
  floor.addColorStop(0, "rgba(0,0,0,0)");
  floor.addColorStop(1, "rgba(0,0,0,0.14)");
  ctx.fillStyle = floor;
  ctx.fillRect(0, 0, W, H);

  // Title + tagline
  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = ink;
  ctx.font = `700 76px ${DISPLAY}`;
  ctx.fillText(project.name, PAD, PAD + 62);
  if (project.tagline) {
    ctx.font = `500 40px ${DISPLAY}`;
    ctx.fillStyle = muted;
    ctx.fillText(project.tagline, PAD, PAD + 122);
  }

  // Icon in the middle
  const cx = W / 2;
  const cy = H * 0.54;
  const icon = project.icon ? await loadImage(project.icon) : null;
  if (icon) {
    ctx.save();
    ctx.shadowColor = "rgba(0,0,0,0.28)";
    ctx.shadowBlur = 60;
    ctx.shadowOffsetY = 28;
    if (project.iconStyle === "app") {
      const s = W * 0.44;
      roundRectPath(ctx, cx - s / 2, cy - s / 2, s, s, s * 0.225);
      ctx.fillStyle = "#000";
      ctx.fill();
      ctx.shadowColor = "transparent";
      ctx.clip();
      ctx.drawImage(icon, cx - s / 2, cy - s / 2, s, s);
    } else {
      const max = project.iconStyle === "tint" ? W * 0.62 : W * 0.56;
      const scale = Math.min(max / icon.width, max / icon.height);
      const w = icon.width * scale;
      const h = icon.height * scale;
      if (project.iconStyle === "tint") {
        // Recolour a single-colour logo to the card's text colour
        const tinted = document.createElement("canvas");
        tinted.width = icon.width;
        tinted.height = icon.height;
        const t = tinted.getContext("2d")!;
        t.drawImage(icon, 0, 0);
        t.globalCompositeOperation = "source-in";
        t.fillStyle = ink;
        t.fillRect(0, 0, tinted.width, tinted.height);
        ctx.shadowColor = "rgba(0,0,0,0.18)";
        ctx.drawImage(tinted, cx - w / 2, cy - h / 2, w, h);
      } else {
        ctx.drawImage(icon, cx - w / 2, cy - h / 2, w, h);
      }
    }
    ctx.restore();
  } else {
    drawChartGlyph(ctx, cx, cy, W * 0.5, ink);
  }

  // Footer: status and where the card leads
  ctx.font = `500 34px ${BODY}`;
  ctx.fillStyle = muted;
  ctx.fillText(project.status, PAD, H - PAD);
  const label = linkLabel(project.link);
  if (label) {
    ctx.textAlign = "right";
    ctx.fillText(`${label} ↗`, W - PAD, H - PAD);
    ctx.textAlign = "left";
  }

  return canvas.toDataURL("image/png");
}

export function renderProjectCards(projects: Project[]) {
  return Promise.all(projects.map((p, i) => (p.image ? Promise.resolve(p.image) : renderProjectCard(p, i))));
}
