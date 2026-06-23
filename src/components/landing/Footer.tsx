import Image from "next/image";
import { CONTAINER, FONT, MAILTO } from "@/lib/landing/tokens";
import { CtaLink } from "./CtaLink";

export function Footer() {
  return (
    <footer
      style={{
        position: "relative",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        background: "#08090D",
      }}
    >
      <div style={CONTAINER}>
        <div
          style={{
            padding: "118px 0 0",
            display: "flex",
            flexDirection: "column",
            gap: 30,
            maxWidth: 760,
          }}
        >
          <h2
            style={{
              margin: 0,
              fontFamily: FONT.serif,
              fontWeight: 500,
              fontSize: "clamp(32px,5vw,60px)",
              lineHeight: 1.06,
              letterSpacing: "-0.01em",
              color: "#F1F2F5",
            }}
          >
            The market is a graph.
            <br />
            <span style={{ fontStyle: "italic", color: "#C9CCD6" }}>
              We&rsquo;re trading on it first.
            </span>
          </h2>
          <CtaLink height={52} padding="0 28px" style={{ alignSelf: "flex-start" }}>
            Get in touch <span style={{ fontSize: 18 }}>→</span>
          </CtaLink>
        </div>
        <div
          style={{
            margin: "90px 0 0",
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
              alt="RavenGraph"
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
              fontFamily: FONT.mono,
              fontSize: 12,
              color: "#5C606F",
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
