import Link from "next/link";
import { CONTAINER, FONT, MAILTO } from "@/lib/landing/tokens";
import { TopBar } from "@/components/landing/TopBar";
import { Footer } from "@/components/landing/Footer";
import { PathFigure } from "@/components/landing/PathFigure";
import { getAllNotes } from "@/lib/notes";

const body: React.CSSProperties = {
  margin: "22px 0 0",
  fontFamily: FONT.serif,
  fontSize: "clamp(18px,1.5vw,20px)",
  lineHeight: 1.65,
  color: "#C7CAD3",
};

const h2: React.CSSProperties = {
  margin: "88px 0 0",
  fontFamily: FONT.serif,
  fontWeight: 500,
  fontSize: "clamp(24px,2.6vw,30px)",
  lineHeight: 1.2,
  letterSpacing: "-0.005em",
  color: "#F1F2F5",
};

const small: React.CSSProperties = {
  fontFamily: FONT.sans,
  fontSize: 14,
  lineHeight: 1.55,
  color: "#7B7F8E",
};

// OPTIONAL Trading line, confirm with Gabriel before shipping. If enabled,
// the number must keep "paper trading" and "small book" in the same line:
// "Equities book up 46% since February, 34 points ahead of the S&P 500
// (paper trading, small book)."
// TODO: add "First graph model: <date>." to the Graph model row once set.
const STATUS: [string, string][] = [
  [
    "Engine",
    "Data pipelines, 80+ features and walk-forward validated models. In production for a year.",
  ],
  ["Trading", "Live since February 2026."],
  [
    "Partners",
    "Avant Protocol (DeFi) and a LatAm stablecoin payments company.",
  ],
  ["Graph model", "In build. Current models are baselines."],
];

export default function LandingPage() {
  const notes = getAllNotes().slice(0, 3);
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
      <main style={CONTAINER}>
        <div style={{ maxWidth: 720, padding: "96px 0 112px" }}>
          <h1
            style={{
              margin: 0,
              fontFamily: FONT.serif,
              fontWeight: 500,
              fontSize: "clamp(32px,4.4vw,48px)",
              lineHeight: 1.14,
              letterSpacing: "-0.01em",
              color: "#F1F2F5",
            }}
          >
            RavenGraph is a neolab building a world model of financial
            markets.
          </h1>
          <p style={{ ...body, marginTop: 30 }}>
            Markets are one connected system: a rate move hits banks, then
            credit, then crypto. Our model learns that structure directly,
            across equities, futures and crypto, and gets better with every
            asset and link we add.
          </p>
          <p style={body}>
            Most quant models forecast each asset in isolation. A world model
            learns how shocks travel between assets, so every asset we add
            improves the forecast for the others. The first thing the model
            trades is our own book. Agents do research. Validated models
            trade.
          </p>
          <p style={body}>
            We are early. The graph model is in build, and the models we run
            today are baselines.
          </p>
          <p style={body}>
            <a href={MAILTO} className="rg-link">
              Talk to the founders
            </a>
            <span style={{ color: "#4C4F5C", margin: "0 12px" }}>/</span>
            <Link href="/notes" className="rg-link">
              Read our notes
            </Link>
          </p>

          <figure style={{ margin: "72px 0 0" }}>
            <PathFigure />
            <figcaption style={{ ...small, marginTop: 18 }}>
              Fig. 1. The example above drawn as a path through the graph. A
              rise in the 10-year yield reaches bank equities, then credit
              spreads, then crypto. Illustrative, with no model output shown.
            </figcaption>
          </figure>

          <h2 style={h2}>Early, live, and honest about it.</h2>
          <div style={{ marginTop: 26 }}>
            {STATUS.map(([label, text]) => (
              <div
                key={label}
                className="rg-status-row"
                style={{
                  display: "grid",
                  gridTemplateColumns: "150px 1fr",
                  gap: 20,
                  padding: "16px 0",
                  borderTop: "1px solid rgba(255,255,255,0.08)",
                  alignItems: "baseline",
                }}
              >
                <div style={{ ...small, fontSize: 15 }}>{label}</div>
                <div style={{ ...body, margin: 0 }}>{text}</div>
              </div>
            ))}
          </div>

          <h2 style={h2}>Team</h2>
          <p style={body}>
            Mike Osorio, CTO, is an applied mathematician (Oxford) who led
            graph deep learning at JPMorgan. Gabriel Goulart, CEO, has spent
            ten years shipping production ML and was previously Lead Data
            Scientist at Whop.
          </p>
          <p style={body}>Two people. We think that&rsquo;s enough.</p>

          {notes.length > 0 && (
            <>
              <h2 style={h2}>Notes</h2>
              <ul style={{ listStyle: "none", margin: "22px 0 0", padding: 0 }}>
                {notes.map((n) => (
                  <li key={n.slug} style={{ margin: "0 0 18px" }}>
                    <Link
                      href={`/notes/${n.slug}`}
                      className="rg-link"
                      style={{
                        fontFamily: FONT.serif,
                        fontSize: "clamp(18px,1.5vw,20px)",
                        lineHeight: 1.45,
                      }}
                    >
                      {n.title}
                    </Link>
                    <div style={{ ...small, marginTop: 4 }}>{n.date}</div>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
