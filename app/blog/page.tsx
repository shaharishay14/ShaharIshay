import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { formatPostDate, getAllPosts } from "@/lib/blog";

const description = "Weekly notes on ML, LLMs and building things that run in production.";

export const metadata: Metadata = {
  title: "Blog — Shahar Ishay",
  description,
  openGraph: { title: "Blog — Shahar Ishay", description, type: "website" },
};

export default function BlogIndex() {
  const posts = getAllPosts();

  return (
    <div className="min-h-[100dvh] bg-bg px-6 pb-24 pt-8 text-ink sm:px-10 sm:pt-10 lg:px-12 xl:px-16">
      <SiteHeader />

      <main className="max-w-[720px]">
        <h1 className="mt-10 font-display text-[34px] font-semibold leading-[1.06] tracking-[-0.02em] sm:text-[42px] xl:text-[46px]">
          Blog
        </h1>
        <p className="mt-4 max-w-[640px] text-base leading-relaxed text-muted">{description}</p>

        {posts.length === 0 ? (
          <p className="mt-12 border-t border-line pt-8 text-sm text-muted">
            The first post lands soon. New posts every week.
          </p>
        ) : (
          <ul className="mt-12 border-t border-line">
            {posts.map((post) => (
              <li key={post.slug} className="border-b border-line">
                <Link href={`/blog/${post.slug}`} className="group block py-6">
                  <time dateTime={post.date} className="text-[13px] font-medium text-muted">
                    {formatPostDate(post.date)}
                  </time>
                  <h2 className="mt-1.5 font-display text-xl font-semibold tracking-tight transition-colors group-hover:text-accent">
                    {post.title}
                  </h2>
                  {post.summary && <p className="mt-1.5 text-sm leading-relaxed text-muted">{post.summary}</p>}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
