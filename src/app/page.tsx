import Link from "next/link";
import { MAILTO, MAP } from "@/lib/landing/tokens";
import { TopBar } from "@/components/landing/TopBar";
import { Footer } from "@/components/landing/Footer";
import { MarketMap } from "@/components/landing/MarketMap";
import { Arrow } from "@/components/landing/Arrow";
import { MergeFigure, TermGlyph } from "@/components/landing/ArchFigure";
import { getAllNotes } from "@/lib/notes";

const KEY_LINES = [
  ["Rates", MAP.rates],
  ["Equities", MAP.equities],
  ["Credit", MAP.credit],
  ["Crypto", MAP.crypto],
  ["Futures", MAP.futures],
] as const;

const TERMS = [
  [
    "Temporal",
    "Links between markets strengthen, fade and reverse. The model learns the timetable as well as the map.",
  ],
  [
    "Heterogeneous",
    "Stocks, futures, rates and tokens are different kinds of station, joined by different kinds of link. The model keeps them distinct.",
  ],
  [
    "Graph attention",
    "For each asset, the model learns which neighbors matter now, and how much.",
  ],
] as const;

const PIPE = [
  ["Market graph", "Assets and the links between them, across equities, futures and crypto."],
  ["THGAT", "Learns the structure and how it changes over time."],
  [
    "Embeddings",
    "The learned representation. The foundation every downstream model and strategy builds on.",
  ],
] as const;

const USES = [
  [
    "A world model for agents",
    "Research agents that can reason about how a shock will travel before it does.",
  ],
  // OPTIONAL, remove if not confirmed
  [
    "Market-aware language models",
    "Embeddings fed to a language model as structured context, so it knows how markets connect.",
  ],
] as const;

// The Nodes line had "From 64 futures today"; Gabriel said that count is
// wrong, so no starting number is stated until he supplies the right one.
const SCALES = [
  ["Nodes", "More assets, across equities, futures, commodities, indices and crypto."],
  ["Relations", "More edge types: correlation, lead-lag, sector, supply chain, flows."],
  ["Time", "From daily to hourly to dollar-volume bars."],
] as const;

// OPTIONAL Trading line, confirm with Gabriel before shipping. If enabled,
// the number must keep "paper trading" and "small book" in the same line:
// "Equities book up 46% since February, 34 points ahead of the S&P 500
// (paper trading, small book)."
// TODO: add "First graph model: <date>." to the Graph model row once set.
const SERVICE: { name: string; live: boolean; text: string }[] = [
  {
    name: "Engine",
    live: true,
    text: "Data pipelines, 80+ features and walk-forward validated models. In production for a year.",
  },
  { name: "Trading", live: true, text: "Live since February 2026." },
  {
    name: "Partners",
    live: true,
    text: "Avant Protocol (DeFi) and a LatAm stablecoin payments company.",
  },
  {
    name: "Graph model",
    live: false,
    text: "In build. Current models are baselines.",
  },
];

export default function LandingPage() {
  const notes = getAllNotes().slice(0, 3);
  return (
    <div className="rg-world">
      <TopBar />
      <main>
        <section className="rg-hero">
          <div className="rg-hero-in">
            <div className="rg-title">
              <h1>A world model of financial markets.</h1>
              <p>
                RavenGraph is a neolab. Markets are one connected system: a
                rate move hits banks, then credit, then crypto. Our model
                learns that structure directly, across equities, futures and
                crypto, and gets better with every asset and link we add.
              </p>
              <div className="rg-actions">
                <a href={MAILTO} className="rg-plate">
                  Talk to the founders <Arrow />
                </a>
                <Link href="/notes" className="rg-text-link">
                  Read our notes
                </Link>
              </div>
            </div>
            <MarketMap />
          </div>
        </section>

        <section className="rg-wrap rg-thesis">
          <div>
            <h2>Most quant models forecast each asset in isolation.</h2>
            <p>
              A world model learns how shocks travel between assets, so every
              asset we add improves the forecast for the others.
            </p>
            <p>
              The first thing the model trades is our own book. Agents do
              research. Validated models trade.
            </p>
          </div>
          <div className="rg-key">
            <h3>Key</h3>
            <ul>
              {KEY_LINES.map(([name, color]) => (
                <li key={name}>
                  <span className="rg-key-line" style={{ background: color }} />
                  {name}
                </li>
              ))}
              <li>
                <span className="rg-key-stop" />
                An asset
              </li>
              <li>
                <span className="rg-key-hub" />
                Where one market moves another
              </li>
              <li>
                <span className="rg-key-planned" />
                Planned extension
              </li>
            </ul>
            <p>
              Schematic. Lines, stations and journeys are illustrative. No
              model output is shown.
            </p>
          </div>
        </section>

        <section className="rg-wrap rg-model" id="architecture">
          <h2>One model for the whole market.</h2>
          <p className="rg-model-lede">
            The world model is being built on a temporal heterogeneous graph
            attention network (THGAT). It learns markets as one graph and
            turns that graph into embeddings: a compact description of every
            asset and where it sits in the system.
          </p>
          <MergeFigure />
          <div className="rg-pipe" role="group" aria-label="From market graph to embeddings">
            <ol className="rg-pipe-main">
              {PIPE.map(([name, note]) => (
                <li key={name}>
                  <span className="rg-pipe-track" />
                  <span className="rg-pipe-stop" />
                  <h3>{name}</h3>
                  <p>{note}</p>
                </li>
              ))}
            </ol>
            <ul className="rg-fork">
              {USES.map(([name, note]) => (
                <li key={name}>
                  <span className="rg-pipe-stop" />
                  <h3>{name}</h3>
                  <p>{note}</p>
                </li>
              ))}
            </ul>
          </div>

          <dl className="rg-terms">
            {TERMS.map(([term, text]) => (
              <div key={term}>
                <dt>{term}</dt>
                <dd>{text}</dd>
                <TermGlyph term={term} />
              </div>
            ))}
          </dl>
          {/* CONFIRM WITH MIKE before shipping */}
          <p className="rg-model-spec">
            Typed-edge attention, learned time encodings, walk-forward
            training against XGBoost and LSTM baselines.
          </p>

          <div className="rg-scales">
            <h3>What scales</h3>
            <dl>
              {SCALES.map(([label, text]) => (
                <div key={label}>
                  <dt>{label}</dt>
                  <dd>{text}</dd>
                </div>
              ))}
            </dl>
            <p>Every axis adds signal to every node.</p>
          </div>

          <div className="rg-test">
            <h3>How we&rsquo;ll know it works</h3>
            <p>
              We train the same model on a shuffled graph, with edges
              randomly rewired. If the real structure doesn&rsquo;t beat the
              shuffled one out of sample, the graph adds nothing, and
              we&rsquo;ll say so.
            </p>
          </div>
        </section>

        <section className="rg-board">
          <div className="rg-wrap">
            <h2>Early, live, and honest about it.</h2>
            <ol className="rg-service">
              {SERVICE.map((s, i) => {
                const next = SERVICE[i + 1];
                return (
                  <li key={s.name} data-live={s.live}>
                    {next && <span className="rg-service-track" data-live={next.live} />}
                    <span className="rg-service-stop" />
                    <h3>{s.name}</h3>
                    <span className="rg-service-state">
                      {s.live ? "In service" : "Under construction"}
                    </span>
                    <p>{s.text}</p>
                  </li>
                );
              })}
            </ol>
          </div>
        </section>

        {notes.length > 0 && (
          <section className="rg-wrap rg-notes">
            <h2>Notes</h2>
            <ul>
              {notes.map((n) => (
                <li key={n.slug}>
                  <Link href={`/notes/${n.slug}`}>
                    <span>{n.title}</span>
                    <Arrow size={22} />
                  </Link>
                  <time dateTime={n.date}>{n.date}</time>
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}
