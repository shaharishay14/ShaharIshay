import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { formatPostDate, getAllPosts, getPost } from "@/lib/blog";

// Posts are built at deploy time; unknown slugs 404
export const dynamicParams = false;

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getPost(params.slug);
  if (!post) return {};
  const title = `${post.title} — Shahar Ishay`;
  return {
    title,
    description: post.summary,
    openGraph: { title, description: post.summary, type: "article", publishedTime: post.date },
  };
}

export default async function BlogPost({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);
  if (!post) notFound();

  return (
    <div className="min-h-[100dvh] bg-bg px-6 pb-24 pt-8 text-ink sm:px-10 sm:pt-10 lg:px-12 xl:px-16">
      <SiteHeader />

      <main className="max-w-[720px]">
        <Link href="/blog" className="mt-10 inline-block text-sm font-medium text-muted transition-colors hover:text-ink">
          ← All posts
        </Link>
        <article>
          <time dateTime={post.date} className="mt-8 block text-[13px] font-medium text-muted">
            {formatPostDate(post.date)}
          </time>
          <h1 className="mt-2 font-display text-[34px] font-semibold leading-[1.06] tracking-[-0.02em] sm:text-[42px]">
            {post.title}
          </h1>
          {/* Posts are our own Markdown files from content/blog, rendered at build time */}
          <div className="post-body mt-8" dangerouslySetInnerHTML={{ __html: post.html }} />
        </article>
      </main>
    </div>
  );
}
