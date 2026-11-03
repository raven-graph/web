import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { CONTAINER, FONT } from "@/lib/landing/tokens";
import { proseComponents } from "@/components/markdown/proseComponents";
import { TopBar } from "@/components/landing/TopBar";
import { Footer } from "@/components/landing/Footer";
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
    <div
      style={{
        background: "#0B0C11",
        color: "#ECEDF1",
        fontFamily: FONT.sans,
        minHeight: "100vh",
        overflowX: "hidden",
        WebkitFontSmoothing: "antialiased",
      }}
    >
      <TopBar />
      <div style={CONTAINER}>
        <article style={{ padding: "80px 0 120px", maxWidth: 720 }}>
          <Link
            href="/notes"
            style={{
              fontFamily: FONT.mono,
              fontSize: 11,
              letterSpacing: "0.12em",
              color: "#5C606F",
              textDecoration: "none",
            }}
          >
            ← NOTES
          </Link>
          <div
            style={{
              margin: "34px 0 0",
              fontFamily: FONT.mono,
              fontSize: 11,
              letterSpacing: "0.1em",
              color: "#5C606F",
              display: "flex",
              gap: 16,
            }}
          >
            <span>{note.date}</span>
            <span>{note.readingMinutes} MIN READ</span>
          </div>
          <h1
            style={{
              margin: "18px 0 0",
              fontFamily: FONT.serif,
              fontWeight: 500,
              fontSize: "clamp(30px,4.2vw,46px)",
              lineHeight: 1.15,
              letterSpacing: "-0.01em",
              color: "#F1F2F5",
            }}
          >
            {note.title}
          </h1>
          <div style={{ marginTop: 46 }}>
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={proseComponents}>
              {note.content}
            </ReactMarkdown>
          </div>
        </article>
      </div>
      <Footer />
    </div>
  );
}
