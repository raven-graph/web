import type { ReactNode } from "react";
import { isValidElement } from "react";
import type { Components } from "react-markdown";

// Markdown overrides for long-form pages (notes, documentation). Styling is in
// globals.css under .rg-prose; these only add heading anchors and a scroll
// wrapper for wide tables.

type Props = { children?: ReactNode };

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
  h2: ({ children }: Props) => <h2 id={slugify(children)}>{children}</h2>,
  h3: ({ children }: Props) => <h3 id={slugify(children)}>{children}</h3>,
  table: ({ children }: Props) => (
    <div className="rg-table">
      <table>{children}</table>
    </div>
  ),
};
