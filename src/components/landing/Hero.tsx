import { COLOR, CONTAINER, FONT } from "@/lib/landing/tokens";
import { CtaLink } from "./CtaLink";
import { HeroSchematic } from "./HeroSchematic";
import { NetworkBackground } from "./NetworkBackground";

const META = ["Live, micro-size", "~29% YTD equities", "graph layer in build"];

const FIG0_EDGES = [
  { pair: "10Y → XLF", read: "β +0.41 · 20m" },
  { pair: "WTI → JETS", read: "β −0.48 · 15m" },
  { pair: "SMH → NVDA", read: "β +0.83 · 6m" },
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
            gridTemplateColumns: "repeat(auto-fit,minmax(360px,1fr))",
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
                Graph-native hedge fund
              </span>
            </div>
            <h1
              style={{
                margin: 0,
                fontFamily: FONT.serif,
                fontWeight: 500,
                fontSize: "clamp(40px,5.6vw,76px)",
                lineHeight: 1.0,
                letterSpacing: "-0.01em",
                color: "#F1F2F5",
              }}
            >
              Markets are networks.
              <br />
              <span style={{ fontStyle: "italic", color: "#C9CCD6" }}>
                We trade the structure.
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
              RavenGraph models the market as a living graph of stocks, sectors,
              macro and commodities.{" "}
              <span style={{ color: "#ECEDF1", fontWeight: 500 }}>
                The graph is the asset.
              </span>
            </p>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 18,
                marginTop: 4,
              }}
            >
              <CtaLink style={{ alignSelf: "flex-start" }}>
                Get in touch <span style={{ fontSize: 18 }}>→</span>
              </CtaLink>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "10px 18px",
                  fontFamily: FONT.mono,
                  fontSize: 11,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "#5C606F",
                }}
              >
                {META.map((m, i) => (
                  <span key={i} style={{ display: "contents" }}>
                    <span>{m}</span>
                    {i < META.length - 1 && (
                      <span style={{ color: "#2E3140" }}>/</span>
                    )}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right column — Fig. 0 instrument panel */}
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
                    fontFamily: FONT.mono,
                    fontSize: 12,
                  }}
                >
                  <span style={{ color: "#C7CAD3" }}>{e.pair}</span>
                  <span style={{ color: "#9CA0B0" }}>{e.read}</span>
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
              Nodes: assets, sectors, macro, commodities. Edges: calibrated
              lead–lag. Illustrative of the model in build.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
