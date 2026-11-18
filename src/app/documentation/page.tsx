import fs from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { TopBar } from "@/components/landing/TopBar";
import { Footer } from "@/components/landing/Footer";
import { proseComponents } from "@/components/markdown/proseComponents";

export const metadata: Metadata = {
  title: "Spread API documentation · RavenGraph",
  description:
    "Reference for the RavenGraph Spread API: hourly USDT/BRL gap predictions for Mercado Bitcoin, Foxbit and OKX against Binance.",
  // Shared by direct link only: not linked from the site and kept out of search.
  robots: { index: false, follow: false },
};

const DOC_PATH = path.join(process.cwd(), "content", "documentation", "spread-api.md");

function loadDoc() {
  const raw = fs.readFileSync(DOC_PATH, "utf8");
  // The first "# " line is the page title; the rest is the body.
  const match = raw.match(/^#\s+(.+)\n/m);
  const title = match ? match[1].trim() : "Spread API";
  const body = match ? raw.replace(match[0], "") : raw;
  const sections = [...body.matchAll(/^##\s+(.+)$/gm)].map((m) => {
    const label = m[1].trim();
    const id = label
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");
    return { label, id };
  });
  return { title, body, sections };
}

export default function DocumentationPage() {
  const { title, body, sections } = loadDoc();
  return (
    <div className="rg-world">
      <TopBar />
      <main className="rg-wrap rg-read">
        <article>
          <h1>{title}</h1>
          {sections.length > 0 && (
            <nav aria-label="On this page" className="rg-toc">
              <h2>On this page</h2>
              <ul>
                {sections.map((s) => (
                  <li key={s.id}>
                    <a href={`#${s.id}`}>{s.label}</a>
                  </li>
                ))}
              </ul>
            </nav>
          )}
          <div className="rg-prose">
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={proseComponents}>
              {body}
            </ReactMarkdown>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}
