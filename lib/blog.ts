import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { marked } from "marked";

// One Markdown file per post; the file name (minus .md) is the URL slug
const POSTS_DIR = path.join(process.cwd(), "content", "blog");

export interface PostMeta {
  slug: string;
  title: string;
  /** YYYY-MM-DD */
  date: string;
  summary: string;
}

export interface Post extends PostMeta {
  html: string;
}

// YAML turns an unquoted 2026-10-18 into a Date; keep dates as plain strings
function toDateString(value: unknown) {
  return value instanceof Date ? value.toISOString().slice(0, 10) : String(value ?? "");
}

function readPost(slug: string) {
  const { data, content } = matter(fs.readFileSync(path.join(POSTS_DIR, `${slug}.md`), "utf8"));
  const meta: PostMeta = {
    slug,
    title: String(data.title ?? slug),
    date: toDateString(data.date),
    summary: String(data.summary ?? ""),
  };
  return { meta, content };
}

/** All posts, newest first */
export function getAllPosts(): PostMeta[] {
  if (!fs.existsSync(POSTS_DIR)) return [];
  return fs
    .readdirSync(POSTS_DIR)
    .filter((file) => file.endsWith(".md"))
    .map((file) => readPost(file.replace(/\.md$/, "")).meta)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export async function getPost(slug: string): Promise<Post | null> {
  // Only known slugs, so a crafted URL can't read outside the posts folder
  if (!getAllPosts().some((p) => p.slug === slug)) return null;
  const { meta, content } = readPost(slug);
  return { ...meta, html: await marked.parse(content) };
}

export function formatPostDate(date: string) {
  const d = new Date(`${date}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return date;
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric", timeZone: "UTC" });
}
