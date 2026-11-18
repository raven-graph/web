import Image from "next/image";
import Link from "next/link";
import { CONTAINER, FONT, MAILTO } from "@/lib/landing/tokens";

const navLink: React.CSSProperties = {
  fontFamily: FONT.sans,
  fontSize: 15,
  color: "#C7CAD3",
  textDecoration: "none",
  whiteSpace: "nowrap",
};

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
        <div style={{ display: "flex", alignItems: "baseline", gap: 14 }}>
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
              alt=""
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
            style={{
              fontFamily: FONT.sans,
              fontSize: 14,
              color: "#6B6F7C",
              whiteSpace: "nowrap",
            }}
          >
            A world model of markets
          </span>
        </div>
        <nav style={{ display: "flex", alignItems: "center", gap: 26 }}>
          <Link href="/notes" className="rg-nav" style={navLink}>
            Notes
          </Link>
          <a href={MAILTO} className="rg-nav" style={navLink}>
            Contact
          </a>
        </nav>
      </div>
    </div>
  );
}
