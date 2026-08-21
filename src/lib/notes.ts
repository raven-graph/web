import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const NOTES_DIR = path.join(process.cwd(), "content", "notes");

export type Note = {
  slug: string;
  title: string;
  date: string;
  summary: string;
  readingMinutes: number;
  content: string;
};

function parseNote(filename: string): Note {
  const slug = filename.replace(/\.md$/, "");
  const raw = fs.readFileSync(path.join(NOTES_DIR, filename), "utf8");
  const { data, content } = matter(raw);
  const date =
    data.date instanceof Date
      ? data.date.toISOString().slice(0, 10)
      : String(data.date ?? "");
  return {
    slug,
    title: String(data.title ?? slug),
    date,
    summary: String(data.summary ?? ""),
    readingMinutes: Math.max(1, Math.round(content.split(/\s+/).length / 220)),
    content,
  };
}

export function getAllNotes(): Note[] {
  return fs
    .readdirSync(NOTES_DIR)
    .filter((f) => f.endsWith(".md"))
    .map(parseNote)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getNote(slug: string): Note | null {
  const filename = `${slug}.md`;
  if (!fs.existsSync(path.join(NOTES_DIR, filename))) return null;
  return parseNote(filename);
}
