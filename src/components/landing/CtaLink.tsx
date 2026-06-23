"use client";

import React, { useState } from "react";
import { COLOR, FONT, MAILTO } from "@/lib/landing/tokens";

interface CtaLinkProps {
  children: React.ReactNode;
  height?: number;
  padding?: string;
  fontSize?: number;
  href?: string;
  style?: React.CSSProperties;
}

/** Primary cobalt CTA link → mailto. Darkens to #1E47E0 on hover. */
export function CtaLink({
  children,
  height = 50,
  padding = "0 26px",
  fontSize = 16,
  href = MAILTO,
  style,
}: CtaLinkProps) {
  const [hover, setHover] = useState(false);
  return (
    <a
      href={href}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 9,
        height,
        padding,
        borderRadius: 8,
        background: hover ? COLOR.cobaltHover : COLOR.cobalt,
        color: "#fff",
        fontFamily: FONT.sans,
        fontWeight: 600,
        fontSize,
        textDecoration: "none",
        transition: "background .2s",
        ...style,
      }}
    >
      {children}
    </a>
  );
}
