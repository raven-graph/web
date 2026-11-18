import Link from "next/link";
import { MAILTO, MAP } from "@/lib/landing/tokens";
import { TopBar } from "@/components/landing/TopBar";
import { Footer } from "@/components/landing/Footer";
import { MarketMap } from "@/components/landing/MarketMap";
import { Arrow } from "@/components/landing/Arrow";
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
    "For each asset, the model learns which neighbours matter now, and how much.",
  ],
] as const;

const PIPE = [
  ["Market graph", "Assets and the links between them, across equities, futures and crypto."],
  ["THGAT", "Learns the structure and how it changes over time."],
  ["Embeddings", "The learned representation, reusable by other models."],
] as const;

const USES = [
  ["Fine-tuned LLMs", "Embeddings that teach a language model how markets connect."],
  ["A world model for agents", "Research agents that can reason about how a shock will travel."],
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

        <section className="rg-wrap rg-model">
          <h2>
            The end goal is a temporal heterogeneous graph attention network
            (THGAT).
          </h2>
          <p className="rg-model-lede">
            It learns a representation of markets as one graph and turns it
            into embeddings: a compact description of every asset and where
            it sits in the system.
          </p>
          <dl className="rg-terms">
            {TERMS.map(([term, text]) => (
              <div key={term}>
                <dt>{term}</dt>
                <dd>{text}</dd>
              </div>
            ))}
          </dl>
          <div className="rg-pipe" role="group" aria-label="What the model produces">
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

        <section className="rg-wrap rg-team">
          <h2>Two people. We think that&rsquo;s enough.</h2>
          <div className="rg-team-grid">
            <div>
              <h3>Mike Osorio</h3>
              <p className="rg-role">CTO</p>
              <p>
                Applied mathematician (Oxford). Led graph deep learning at
                JPMorgan.
              </p>
            </div>
            <div>
              <h3>Gabriel Goulart</h3>
              <p className="rg-role">CEO</p>
              <p>
                Ten years shipping production ML. Previously Lead Data
                Scientist at Whop.
              </p>
            </div>
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
