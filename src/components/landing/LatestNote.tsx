import Link from "next/link";
import { COLOR, CONTAINER, FONT } from "@/lib/landing/tokens";
import type { Note } from "@/lib/notes";

export function LatestNote({ note }: { note: Omit<Note, "content"> }) {
  return (
    <section
      style={{
        position: "relative",
        borderTop: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div style={CONTAINER}>
        <div style={{ padding: "90px 0" }}>
          <Link
            href={`/notes/${note.slug}`}
            style={{
              display: "block",
              maxWidth: 860,
              border: "1px solid rgba(255,255,255,0.10)",
              borderRadius: 12,
              background: "#0A0B11",
              padding: "36px 40px",
              textDecoration: "none",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 16,
                flexWrap: "wrap",
              }}
            >
              <span
                style={{
                  fontFamily: FONT.mono,
                  fontSize: 11,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: COLOR.cobaltLight,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                <span
                  style={{ width: 22, height: 1, background: COLOR.cobalt }}
                />
                Latest from the lab
              </span>
              <span
                style={{
                  fontFamily: FONT.mono,
                  fontSize: 11,
                  letterSpacing: "0.1em",
                  color: "#5C606F",
                }}
              >
                {note.date} · {note.readingMinutes} MIN READ
              </span>
            </div>
            <h2
              style={{
                margin: "22px 0 0",
                fontFamily: FONT.serif,
                fontWeight: 500,
                fontSize: "clamp(24px,3vw,34px)",
                lineHeight: 1.22,
                letterSpacing: "-0.01em",
                color: "#F1F2F5",
              }}
            >
              {note.title}
            </h2>
            {note.summary && (
              <p
                style={{
                  margin: "16px 0 0",
                  maxWidth: 640,
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
                marginTop: 24,
                fontFamily: FONT.mono,
                fontSize: 11.5,
                letterSpacing: "0.12em",
                color: COLOR.cobaltLight,
              }}
            >
              READ NOTE →
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
