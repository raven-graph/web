import type { Metadata } from "next";
import type { CSSProperties, ReactNode } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { COLOR, CONTAINER, FONT } from "@/lib/landing/tokens";
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
    title: `${note.title} — RavenGraph`,
    description: note.summary,
  };
}

const bodyText: CSSProperties = {
  margin: "0 0 24px",
  fontSize: 16.5,
  lineHeight: 1.75,
  color: "#A9ADBB",
  fontWeight: 300,
};

const mdComponents = {
  h2: ({ children }: { children?: ReactNode }) => (
    <h2
      style={{
        margin: "56px 0 20px",
        fontFamily: FONT.serif,
        fontWeight: 500,
        fontSize: "clamp(24px,2.8vw,32px)",
        lineHeight: 1.25,
        letterSpacing: "-0.01em",
        color: "#F1F2F5",
      }}
    >
      {children}
    </h2>
  ),
  h3: ({ children }: { children?: ReactNode }) => (
    <h3
      style={{
        margin: "40px 0 16px",
        fontFamily: FONT.sans,
        fontWeight: 600,
        fontSize: 19,
        lineHeight: 1.35,
        color: "#ECEDF1",
      }}
    >
      {children}
    </h3>
  ),
  p: ({ children }: { children?: ReactNode }) => (
    <p style={bodyText}>{children}</p>
  ),
  strong: ({ children }: { children?: ReactNode }) => (
    <strong style={{ fontWeight: 600, color: "#ECEDF1" }}>{children}</strong>
  ),
  a: ({ href, children }: { href?: string; children?: ReactNode }) => (
    <a
      href={href}
      style={{ color: COLOR.cobaltLight, textDecoration: "underline" }}
    >
      {children}
    </a>
  ),
  ul: ({ children }: { children?: ReactNode }) => (
    <ul style={{ ...bodyText, paddingLeft: 24 }}>{children}</ul>
  ),
  ol: ({ children }: { children?: ReactNode }) => (
    <ol style={{ ...bodyText, paddingLeft: 24 }}>{children}</ol>
  ),
  li: ({ children }: { children?: ReactNode }) => (
    <li style={{ margin: "0 0 10px" }}>{children}</li>
  ),
  blockquote: ({ children }: { children?: ReactNode }) => (
    <blockquote
      style={{
        margin: "0 0 24px",
        padding: "4px 0 4px 22px",
        borderLeft: `2px solid ${COLOR.cobalt}`,
        fontStyle: "italic",
        color: "#C9CCD6",
      }}
    >
      {children}
    </blockquote>
  ),
  hr: () => (
    <hr
      style={{
        margin: "52px 0",
        border: "none",
        borderTop: "1px solid rgba(255,255,255,0.08)",
      }}
    />
  ),
  code: ({ children }: { children?: ReactNode }) => (
    <code
      style={{
        fontFamily: FONT.mono,
        fontSize: "0.88em",
        background: "#11131C",
        padding: "2px 6px",
        borderRadius: 4,
      }}
    >
      {children}
    </code>
  ),
};

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
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>
              {note.content}
            </ReactMarkdown>
          </div>
        </article>
      </div>
      <Footer />
    </div>
  );
}
