import Image from "next/image";
import { CONTAINER, FONT, MAILTO } from "@/lib/landing/tokens";

export function Footer() {
  return (
    <footer
      style={{
        borderTop: "1px solid rgba(255,255,255,0.06)",
        background: "#08090D",
      }}
    >
      <div style={CONTAINER}>
        <div style={{ padding: "72px 0 0", maxWidth: 720 }}>
          <p
            style={{
              margin: 0,
              fontFamily: FONT.serif,
              fontWeight: 500,
              fontSize: "clamp(24px,3vw,30px)",
              lineHeight: 1.25,
              color: "#F1F2F5",
            }}
          >
            If you think markets are a graph, talk to us.
          </p>
          <p
            style={{
              margin: "14px 0 0",
              fontFamily: FONT.serif,
              fontSize: 19,
              lineHeight: 1.6,
            }}
          >
            <a href={MAILTO} className="rg-link">
              Talk to the founders
            </a>
          </p>
        </div>
        <div
          style={{
            margin: "64px 0 0",
            padding: "26px 0",
            borderTop: "1px solid rgba(255,255,255,0.06)",
            display: "flex",
            flexWrap: "wrap",
            gap: 16,
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Image
              src="/icon-white-transparent.svg"
              alt=""
              width={20}
              height={20}
              style={{ opacity: 0.9 }}
            />
            <span
              style={{
                fontFamily: FONT.sans,
                fontWeight: 600,
                fontSize: 16,
                letterSpacing: "-0.01em",
                color: "#E8E9EE",
              }}
            >
              RavenGraph
            </span>
          </div>
          <a
            href={MAILTO}
            style={{
              fontFamily: FONT.sans,
              fontSize: 14,
              color: "#6B6F7C",
              textDecoration: "none",
            }}
          >
            gabriel@ravengraph.com
          </a>
        </div>
      </div>
    </footer>
  );
}
