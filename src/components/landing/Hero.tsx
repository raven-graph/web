import Link from "next/link";
import { COLOR, CONTAINER, FONT, MAILTO } from "@/lib/landing/tokens";
import { CtaLink } from "./CtaLink";
import { HeroSchematic } from "./HeroSchematic";
import { NetworkBackground } from "./NetworkBackground";

const FIG0_EDGES = [
  { pair: "10Y → bank equities (XLF)", read: "β −0.6 · 30m" },
  { pair: "DXY → EM FX", read: "β −0.8 · 20m" },
  { pair: "VIX → ETH", read: "β −0.7 · 45m" },
];

export function Hero() {
  return (
    <section
      style={{
        position: "relative",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        overflow: "hidden",
      }}
    >
      {/* Animated lattice, masked to fade behind the headline */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
          WebkitMaskImage:
            "radial-gradient(ellipse 66% 72% at 31% 47%, transparent 8%, #000 66%)",
          maskImage:
            "radial-gradient(ellipse 66% 72% at 31% 47%, transparent 8%, #000 66%)",
        }}
      >
        <NetworkBackground />
      </div>

      <div style={{ ...CONTAINER, position: "relative", zIndex: 1 }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(min(360px,100%),1fr))",
            gap: 56,
            alignItems: "center",
            minHeight: "calc(100vh - 102px)",
            padding: "72px 0",
          }}
        >
          {/* Left column */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 26,
              maxWidth: 560,
            }}
          >
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
                Graph-native AI for financial markets
              </span>
            </div>
            <h1
              style={{
                margin: 0,
                fontFamily: FONT.serif,
                fontWeight: 500,
                fontSize: "clamp(38px,4.8vw,64px)",
                lineHeight: 1.04,
                letterSpacing: "-0.01em",
                color: "#F1F2F5",
              }}
            >
              We&rsquo;re building a world model{" "}
              <span style={{ fontStyle: "italic", color: "#C9CCD6" }}>
                of financial markets.
              </span>
            </h1>
            <p
              style={{
                margin: 0,
                maxWidth: 460,
                fontSize: "clamp(16px,1.4vw,19px)",
                lineHeight: 1.6,
                color: "#9CA0B0",
                fontWeight: 300,
              }}
            >
              Every market is connected. A rate move hits banks, then credit,
              then crypto.{" "}
              <span style={{ color: "#ECEDF1", fontWeight: 500 }}>
                RavenGraph learns that structure as one graph, across every
                asset at once, and gets smarter as the graph grows.
              </span>
            </p>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                gap: "16px 26px",
                marginTop: 4,
              }}
            >
              <CtaLink href={MAILTO} className="rg-cta-lg">
                Talk to the founders <span style={{ fontSize: 18 }}>→</span>
              </CtaLink>
              <Link
                href="/notes"
                style={{
                  fontFamily: FONT.sans,
                  fontWeight: 500,
                  fontSize: 16,
                  color: "#C7CAD3",
                  textDecoration: "underline",
                  textDecorationColor: "rgba(255,255,255,0.25)",
                  textUnderlineOffset: 5,
                  whiteSpace: "nowrap",
                }}
              >
                Read our notes
              </Link>
            </div>
          </div>

          {/* Right column: Fig. 0 instrument panel */}
          <div
            style={{
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 14,
              background: "#0E0F17",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "13px 16px",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <span
                style={{
                  fontFamily: FONT.mono,
                  fontSize: 11,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "#9CA0B0",
                }}
              >
                Fig. 0 · Market graph
              </span>
              <span
                style={{
                  fontFamily: FONT.mono,
                  fontSize: 10,
                  letterSpacing: "0.12em",
                  color: "#5C606F",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <span
                  style={{
                    width: 5,
                    height: 5,
                    borderRadius: "50%",
                    background: COLOR.cobaltLight,
                  }}
                />
                SCHEMATIC
              </span>
            </div>
            <div style={{ padding: "10px 12px 4px", background: "#0A0B11" }}>
              <HeroSchematic />
            </div>
            <div
              style={{
                padding: "14px 16px",
                display: "flex",
                flexDirection: "column",
                gap: 8,
                borderTop: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              {FIG0_EDGES.map((e, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 12,
                    fontFamily: FONT.mono,
                    fontSize: 12,
                  }}
                >
                  <span style={{ color: "#C7CAD3" }}>{e.pair}</span>
                  <span style={{ color: "#9CA0B0", whiteSpace: "nowrap" }}>
                    {e.read}
                  </span>
                </div>
              ))}
            </div>
            <div
              style={{
                padding: "11px 16px",
                borderTop: "1px solid rgba(255,255,255,0.06)",
                fontFamily: FONT.mono,
                fontSize: 10,
                lineHeight: 1.5,
                color: "#4C4F5C",
              }}
            >
              Nodes: equities, sectors, futures, rates, FX, commodities,
              crypto, stablecoins, macro. Edges: lead-lag. Illustrative of
              the model in build.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
