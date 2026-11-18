import { COLOR, CONTAINER, FONT } from "@/lib/landing/tokens";
import { Kicker } from "./Kicker";

const CARDS = [
  {
    name: "Learns structure",
    desc: "Lead-lag and influence between assets, learned from data.",
  },
  {
    name: "Scales with the graph",
    desc: "Every new asset, venue and timeframe adds signal to every other node.",
  },
  {
    name: "Trades what it learns",
    desc: "The first thing the model runs on is our own book.",
  },
];

export function WhyItScales() {
  return (
    <section
      style={{
        position: "relative",
        borderTop: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div style={CONTAINER}>
        <div style={{ padding: "100px 0" }}>
          <Kicker label="Why it scales" />
          <h2
            style={{
              margin: 0,
              maxWidth: 880,
              fontFamily: FONT.serif,
              fontWeight: 500,
              fontSize: "clamp(30px,4.8vw,54px)",
              lineHeight: 1.08,
              letterSpacing: "-0.01em",
              color: "#F1F2F5",
            }}
          >
            One model.
            <br />
            <span style={{ fontStyle: "italic", color: "#C9CCD6" }}>
              Better with every asset we add.
            </span>
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
              gap: 18,
              marginTop: 44,
            }}
          >
            {CARDS.map((c, i) => (
              <div
                key={c.name}
                style={{
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 14,
                  background: "#0E0F17",
                  padding: 20,
                  display: "flex",
                  flexDirection: "column",
                  gap: 14,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 12,
                  }}
                >
                  <span
                    style={{
                      fontFamily: FONT.mono,
                      fontSize: 11,
                      letterSpacing: "0.16em",
                      textTransform: "uppercase",
                      color: COLOR.cobaltLighter,
                    }}
                  >
                    {c.name}
                  </span>
                  <span
                    style={{
                      fontFamily: FONT.mono,
                      fontSize: 9.5,
                      letterSpacing: "0.14em",
                      color: "#5C606F",
                    }}
                  >
                    0{i + 1}
                  </span>
                </div>
                <p
                  style={{
                    margin: 0,
                    fontSize: 18,
                    lineHeight: 1.5,
                    color: "#D7DAE2",
                    fontWeight: 300,
                  }}
                >
                  {c.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
