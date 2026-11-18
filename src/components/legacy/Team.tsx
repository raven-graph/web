import { COLOR, CONTAINER, FONT } from "@/lib/landing/tokens";
import { Kicker } from "./Kicker";

const TEAM = [
  {
    name: "Mike Osorio",
    role: "CTO",
    bio: "Applied mathematician (Oxford). Led graph deep learning at JPMorgan.",
  },
  {
    name: "Gabriel Goulart",
    role: "CEO",
    bio: "Ten years shipping production ML. Previously Lead Data Scientist at Whop.",
  },
];

export function Team() {
  return (
    <section
      style={{
        position: "relative",
        borderTop: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div style={CONTAINER}>
        <div style={{ padding: "100px 0" }}>
          <Kicker label="Team" />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
              gap: 18,
              maxWidth: 880,
            }}
          >
            {TEAM.map((m) => (
              <div
                key={m.name}
                style={{
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 14,
                  background: "#0E0F17",
                  padding: 20,
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
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
                  {m.role}
                </span>
                <h3
                  style={{
                    margin: 0,
                    fontFamily: FONT.serif,
                    fontWeight: 500,
                    fontSize: 26,
                    lineHeight: 1.15,
                    letterSpacing: "-0.01em",
                    color: "#F1F2F5",
                  }}
                >
                  {m.name}
                </h3>
                <p
                  style={{
                    margin: 0,
                    fontSize: 16,
                    lineHeight: 1.5,
                    color: "#9CA0B0",
                    fontWeight: 300,
                  }}
                >
                  {m.bio}
                </p>
              </div>
            ))}
          </div>
          <p
            style={{
              margin: "34px 0 0",
              fontFamily: FONT.serif,
              fontWeight: 500,
              fontSize: "clamp(24px,3.2vw,36px)",
              lineHeight: 1.15,
              letterSpacing: "-0.01em",
              color: "#F1F2F5",
            }}
          >
            Two people.{" "}
            <span style={{ fontStyle: "italic", color: "#C9CCD6" }}>
              We think that&rsquo;s enough.
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}
