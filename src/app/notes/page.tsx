import type { Metadata } from "next";
import Link from "next/link";
import { COLOR, CONTAINER, FONT } from "@/lib/landing/tokens";
import { TopBar } from "@/components/landing/TopBar";
import { Footer } from "@/components/landing/Footer";
import { getAllNotes } from "@/lib/notes";

export const metadata: Metadata = {
  title: "Notes — RavenGraph",
  description: "Research notes from the RavenGraph lab.",
};

export default function NotesPage() {
  const notes = getAllNotes();
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
        <div style={{ padding: "90px 0 120px", maxWidth: 760 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ width: 22, height: 1, background: COLOR.cobalt }} />
            <span
              style={{
                fontFamily: FONT.mono,
                fontSize: 11,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: COLOR.cobaltLight,
              }}
            >
              Notes
            </span>
          </div>
          <h1
            style={{
              margin: "26px 0 0",
              fontFamily: FONT.serif,
              fontWeight: 500,
              fontSize: "clamp(34px,4.6vw,56px)",
              lineHeight: 1.08,
              letterSpacing: "-0.01em",
              color: "#F1F2F5",
            }}
          >
            Notes from the lab.
          </h1>
          <p
            style={{
              margin: "18px 0 0",
              maxWidth: 560,
              fontSize: 17,
              lineHeight: 1.6,
              color: "#9CA0B0",
              fontWeight: 300,
            }}
          >
            Research, market structure, and how we think about building
            systems that trade.
          </p>

          <div style={{ marginTop: 70 }}>
            {notes.map((note) => (
              <Link
                key={note.slug}
                href={`/notes/${note.slug}`}
                style={{
                  display: "block",
                  padding: "34px 0",
                  borderTop: "1px solid rgba(255,255,255,0.08)",
                  textDecoration: "none",
                }}
              >
                <div
                  style={{
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
                <h2
                  style={{
                    margin: "12px 0 0",
                    fontFamily: FONT.serif,
                    fontWeight: 500,
                    fontSize: "clamp(22px,2.6vw,30px)",
                    lineHeight: 1.25,
                    letterSpacing: "-0.01em",
                    color: "#F1F2F5",
                  }}
                >
                  {note.title}
                </h2>
                {note.summary && (
                  <p
                    style={{
                      margin: "12px 0 0",
                      fontSize: 15.5,
                      lineHeight: 1.65,
                      color: "#9CA0B0",
                      fontWeight: 300,
                    }}
                  >
                    {note.summary}
                  </p>
                )}
                <span
                  style={{
                    display: "inline-block",
                    marginTop: 16,
                    fontFamily: FONT.mono,
                    fontSize: 11,
                    letterSpacing: "0.12em",
                    color: COLOR.cobaltLight,
                  }}
                >
                  READ NOTE →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
