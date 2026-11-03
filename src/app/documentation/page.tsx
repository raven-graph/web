import fs from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { COLOR, CONTAINER, FONT } from "@/lib/landing/tokens";
import { TopBar } from "@/components/landing/TopBar";
import { Footer } from "@/components/landing/Footer";
import { proseComponents } from "@/components/markdown/proseComponents";

export const metadata: Metadata = {
  title: "Spread API documentation · RavenGraph",
  description:
    "Reference for the RavenGraph Spread API: hourly USDT/BRL gap predictions for Mercado Bitcoin, Foxbit and OKX against Binance.",
};

const DOC_PATH = path.join(process.cwd(), "content", "documentation", "spread-api.md");

function loadDoc() {
  const raw = fs.readFileSync(DOC_PATH, "utf8");
  // The first "# " line is the page title; the rest is the body.
  const match = raw.match(/^#\s+(.+)\n/m);
  const title = match ? match[1].trim() : "Spread API";
  const body = match ? raw.replace(match[0], "") : raw;
  const sections = [...body.matchAll(/^##\s+(.+)$/gm)].map((m) => {
    const label = m[1].trim();
    const id = label
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");
    return { label, id };
  });
  return { title, body, sections };
}

export default function DocumentationPage() {
  const { title, body, sections } = loadDoc();
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
        <article style={{ padding: "90px 0 120px", maxWidth: 820 }}>
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
              Documentation
            </span>
          </div>
          <h1
            style={{
              margin: "26px 0 0",
              fontFamily: FONT.serif,
              fontWeight: 500,
              fontSize: "clamp(30px,4.2vw,46px)",
              lineHeight: 1.15,
              letterSpacing: "-0.01em",
              color: "#F1F2F5",
            }}
          >
            {title}
          </h1>

          {sections.length > 0 && (
            <nav
              aria-label="On this page"
              style={{
                margin: "40px 0 0",
                padding: "22px 0",
                borderTop: "1px solid rgba(255,255,255,0.08)",
                borderBottom: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <div
                style={{
                  fontFamily: FONT.mono,
                  fontSize: 11,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "#5C606F",
                  marginBottom: 12,
                }}
              >
                On this page
              </div>
              <ul
                style={{
                  margin: 0,
                  padding: 0,
                  listStyle: "none",
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "8px 22px",
                }}
              >
                {sections.map((s) => (
                  <li key={s.id}>
                    <a
                      href={`#${s.id}`}
                      style={{
                        fontSize: 14.5,
                        color: "#A9ADBB",
                        textDecoration: "none",
                      }}
                    >
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          )}

          <div style={{ marginTop: 20 }}>
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={proseComponents}>
              {body}
            </ReactMarkdown>
          </div>
        </article>
      </div>
      <Footer />
    </div>
  );
}
