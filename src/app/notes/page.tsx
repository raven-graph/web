import type { Metadata } from "next";
import Link from "next/link";
import { TopBar } from "@/components/landing/TopBar";
import { Footer } from "@/components/landing/Footer";
import { Arrow } from "@/components/landing/Arrow";
import { getAllNotes } from "@/lib/notes";

export const metadata: Metadata = {
  title: "Notes · RavenGraph",
  description: "Notes on market structure, liquidity and risk from RavenGraph.",
};

export default function NotesPage() {
  const notes = getAllNotes();
  return (
    <div className="rg-world">
      <TopBar />
      <main className="rg-wrap rg-read">
        <h1>Notes on market structure.</h1>
        <p className="rg-read-lede">
          Liquidity, risk regimes and how shocks travel between markets.
        </p>
        <ul className="rg-index">
          {notes.map((note) => (
            <li key={note.slug}>
              <Link href={`/notes/${note.slug}`}>
                <span>{note.title}</span>
                <Arrow size={24} />
              </Link>
              {note.summary && <p>{note.summary}</p>}
              <div className="rg-meta">
                <time dateTime={note.date}>{note.date}</time>
                <span>{note.readingMinutes} min read</span>
              </div>
            </li>
          ))}
        </ul>
      </main>
      <Footer />
    </div>
  );
}
