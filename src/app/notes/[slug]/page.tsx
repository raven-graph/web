import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { proseComponents } from "@/components/markdown/proseComponents";
import { TopBar } from "@/components/landing/TopBar";
import { Footer } from "@/components/landing/Footer";
import { Arrow } from "@/components/landing/Arrow";
import { getAllNotes, getNote } from "@/lib/notes";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return getAllNotes().map((note) => ({ slug: note.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const note = getNote((await params).slug);
  if (!note) return {};
  return {
    title: `${note.title} · RavenGraph`,
    description: note.summary,
  };
}

export default async function NotePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const note = getNote((await params).slug);
  if (!note) notFound();

  return (
    <div className="rg-world">
      <TopBar />
      <main className="rg-wrap rg-read">
        <article>
          <Link href="/notes" className="rg-back">
            <Arrow size={18} back /> Notes
          </Link>
          <h1>{note.title}</h1>
          <div className="rg-meta">
            <time dateTime={note.date}>{note.date}</time>
            <span>{note.readingMinutes} min read</span>
          </div>
          <div className="rg-prose">
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={proseComponents}>
              {note.content}
            </ReactMarkdown>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}
