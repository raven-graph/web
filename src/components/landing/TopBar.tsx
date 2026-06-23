import Image from "next/image";
import { COLOR, CONTAINER, FONT, MAILTO } from "@/lib/landing/tokens";
import { CtaLink } from "./CtaLink";

export function TopBar() {
  return (
    <div style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
      <div
        style={{
          ...CONTAINER,
          height: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
          <Image
            src="/icon-white-transparent.svg"
            alt="RavenGraph"
            width={22}
            height={22}
            style={{ opacity: 0.95 }}
          />
          <span
            style={{
              fontFamily: FONT.sans,
              fontWeight: 600,
              fontSize: 18,
              letterSpacing: "-0.01em",
              color: "#ECEDF1",
            }}
          >
            RavenGraph
          </span>
          <span
            className="rg-topbar-tag"
            style={{ display: "flex", alignItems: "center" }}
          >
            <span
              style={{
                width: 1,
                height: 15,
                background: "rgba(255,255,255,0.14)",
                margin: "0 3px",
              }}
            />
            <span
              style={{
                fontFamily: FONT.mono,
                fontSize: 10.5,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#5C606F",
                whiteSpace: "nowrap",
              }}
            >
              Graph-native hedge fund
            </span>
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <span
            className="rg-topbar-status"
            style={{
              fontFamily: FONT.mono,
              fontSize: 11,
              letterSpacing: "0.08em",
              color: "#5C606F",
              display: "inline-flex",
              alignItems: "center",
              gap: 7,
              whiteSpace: "nowrap",
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: COLOR.teal,
                animation: "rgblink 2.4s ease-in-out infinite",
              }}
            />
            SYSTEM LIVE
          </span>
          <CtaLink
            href={MAILTO}
            height={38}
            padding="0 18px"
            fontSize={14}
            style={{ gap: 0, flex: "none", whiteSpace: "nowrap" }}
          >
            Get in touch
          </CtaLink>
        </div>
      </div>
    </div>
  );
}
