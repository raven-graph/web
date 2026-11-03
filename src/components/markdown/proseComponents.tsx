import type { CSSProperties, ReactNode } from "react";
import { isValidElement } from "react";
import type { Components } from "react-markdown";
import { COLOR, FONT } from "@/lib/landing/tokens";

// Shared markdown styling for long-form pages (notes, documentation).

type Props = { children?: ReactNode; className?: string };

const bodyText: CSSProperties = {
  margin: "0 0 24px",
  fontSize: 16.5,
  lineHeight: 1.75,
  color: "#A9ADBB",
  fontWeight: 300,
};

function textOf(node: ReactNode): string {
  if (node == null || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(textOf).join("");
  if (isValidElement<{ children?: ReactNode }>(node)) {
    return textOf(node.props.children);
  }
  return "";
}

// GitHub-style heading slug, so in-document links like #status-and-reason work.
function slugify(node: ReactNode): string {
  return textOf(node)
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
}

export const proseComponents: Components = {
  h2: ({ children }: Props) => (
    <h2
      id={slugify(children)}
      style={{
        margin: "56px 0 20px",
        fontFamily: FONT.serif,
        fontWeight: 500,
        fontSize: "clamp(24px,2.8vw,32px)",
        lineHeight: 1.25,
        letterSpacing: "-0.01em",
        color: "#F1F2F5",
        scrollMarginTop: 24,
      }}
    >
      {children}
    </h2>
  ),
  h3: ({ children }: Props) => (
    <h3
      id={slugify(children)}
      style={{
        margin: "40px 0 16px",
        fontFamily: FONT.sans,
        fontWeight: 600,
        fontSize: 19,
        lineHeight: 1.35,
        color: "#ECEDF1",
        scrollMarginTop: 24,
      }}
    >
      {children}
    </h3>
  ),
  p: ({ children }: Props) => <p style={bodyText}>{children}</p>,
  strong: ({ children }: Props) => (
    <strong style={{ fontWeight: 600, color: "#ECEDF1" }}>{children}</strong>
  ),
  a: ({ href, children }: Props & { href?: string }) => (
    <a href={href} style={{ color: COLOR.cobaltLight, textDecoration: "underline" }}>
      {children}
    </a>
  ),
  ul: ({ children }: Props) => (
    <ul style={{ ...bodyText, paddingLeft: 24 }}>{children}</ul>
  ),
  ol: ({ children }: Props) => (
    <ol style={{ ...bodyText, paddingLeft: 24 }}>{children}</ol>
  ),
  li: ({ children }: Props) => <li style={{ margin: "0 0 10px" }}>{children}</li>,
  blockquote: ({ children }: Props) => (
    <blockquote
      style={{
        margin: "0 0 24px",
        padding: "4px 0 4px 22px",
        borderLeft: `2px solid ${COLOR.cobalt}`,
        fontStyle: "italic",
        color: "#C9CCD6",
      }}
    >
      {children}
    </blockquote>
  ),
  hr: () => (
    <hr
      style={{
        margin: "52px 0",
        border: "none",
        borderTop: "1px solid rgba(255,255,255,0.08)",
      }}
    />
  ),
  pre: ({ children }: Props) => (
    <pre
      style={{
        margin: "0 0 24px",
        padding: "18px 20px",
        background: "#11131C",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: 6,
        overflowX: "auto",
        fontFamily: FONT.mono,
        fontSize: 13.5,
        lineHeight: 1.65,
        color: "#C9CCD6",
      }}
    >
      {children}
    </pre>
  ),
  code: ({ children, className }: Props) => {
    // Fenced blocks carry a language class or a trailing newline; the <pre>
    // wrapper styles those, so only inline code gets the pill treatment.
    const isBlock = /language-/.test(className ?? "") || textOf(children).includes("\n");
    if (isBlock) return <code style={{ fontFamily: FONT.mono }}>{children}</code>;
    return (
      <code
        style={{
          fontFamily: FONT.mono,
          fontSize: "0.88em",
          background: "#11131C",
          padding: "2px 6px",
          borderRadius: 4,
          color: "#D5D8E1",
        }}
      >
        {children}
      </code>
    );
  },
  table: ({ children }: Props) => (
    <div style={{ margin: "0 0 28px", overflowX: "auto" }}>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          fontSize: 14.5,
          lineHeight: 1.6,
          color: "#A9ADBB",
          fontWeight: 300,
        }}
      >
        {children}
      </table>
    </div>
  ),
  th: ({ children }: Props) => (
    <th
      style={{
        textAlign: "left",
        padding: "10px 14px 10px 0",
        borderBottom: "1px solid rgba(255,255,255,0.14)",
        fontFamily: FONT.mono,
        fontSize: 11,
        fontWeight: 500,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        color: "#7A7F8F",
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </th>
  ),
  td: ({ children }: Props) => (
    <td
      style={{
        padding: "12px 14px 12px 0",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        verticalAlign: "top",
      }}
    >
      {children}
    </td>
  ),
};
