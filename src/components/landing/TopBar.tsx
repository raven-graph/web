import Image from "next/image";
import Link from "next/link";
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
          <Link
            href="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 11,
              textDecoration: "none",
            }}
          >
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
          </Link>
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
              A world model of markets
            </span>
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <Link
            href="/notes"
            style={{
              fontFamily: FONT.mono,
              fontSize: 11.5,
              letterSpacing: "0.12em",
              color: "#ECEDF1",
              textDecoration: "none",
              whiteSpace: "nowrap",
              display: "inline-flex",
              alignItems: "center",
              gap: 7,
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
            NOTES
          </Link>
          <span
            className="rg-topbar-status"
            style={{
              fontFamily: FONT.mono,
              fontSize: 11,
              letterSpacing: "0.08em",
              color: "#5C606F",
              whiteSpace: "nowrap",
            }}
          >
            RESEARCH LAB
          </span>
          <CtaLink
            href={MAILTO}
            className="rg-topbar-cta"
            height={38}
            padding="0 18px"
            fontSize={14}
            style={{ gap: 0, flex: "none", whiteSpace: "nowrap" }}
          >
            Contact
          </CtaLink>
        </div>
      </div>
    </div>
  );
}
