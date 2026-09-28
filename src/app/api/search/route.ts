import { getDoc, getRoadmap, listDocs } from "@/lib/content";

export const dynamic = "force-dynamic";

interface Hit {
  source: "doc" | "roadmap";
  title: string;
  context?: string;
  snippet: string;
  href: string;
}

function snippet(line: string, tokens: string[]): string {
  const clean = line.replace(/^#{1,6}\s+/, "").replace(/[`*_>|]/g, "").trim();
  const lower = clean.toLowerCase();
  let idx = lower.length;
  for (const t of tokens) {
    const i = lower.indexOf(t);
    if (i >= 0) idx = Math.min(idx, i);
  }
  const start = Math.max(0, idx - 60);
  const end = Math.min(clean.length, idx + 120);
  return (start > 0 ? "…" : "") + clean.slice(start, end) + (end < clean.length ? "…" : "");
}

export async function GET(request: Request) {
  const q = new URL(request.url).searchParams.get("q")?.trim() ?? "";
  const tokens = q.toLowerCase().split(/\s+/).filter(Boolean);

  if (tokens.length === 0 || q.length < 2) {
    return Response.json({ results: [] as Hit[] });
  }

  const matches = (hay: string) => {
    const lower = hay.toLowerCase();
    return tokens.every((t) => lower.includes(t));
  };

  const hits: Hit[] = [];

  // ۱) مستندات — اول عنوان فایل، بعد خطوط
  for (const meta of listDocs()) {
    const href = `/docs/${meta.slug}`;
    if (matches(meta.persianTitle) || matches(meta.slug) || matches(meta.description)) {
      hits.push({ source: "doc", title: meta.persianTitle, snippet: meta.description, href });
    }
    const doc = getDoc(meta.slug);
    if (!doc) continue;

    let heading = "";
    let perDoc = 0;
    for (const line of doc.body.split(/\r?\n/)) {
      if (perDoc >= 3) break;
      const hm = line.match(/^#{1,4}\s+(.+)$/);
      if (hm) {
        heading = hm[1].replace(/^[^\p{L}]+/u, "").trim();
        if (matches(line) && perDoc < 3) {
          hits.push({ source: "doc", title: meta.persianTitle, context: heading, snippet: snippet(line, tokens), href });
          perDoc++;
        }
        continue;
      }
      if (line.trim().startsWith("|") || line.trim().startsWith("-")) {
        if (matches(line) && perDoc < 3) {
          hits.push({ source: "doc", title: meta.persianTitle, context: heading, snippet: snippet(line, tokens), href });
          perDoc++;
        }
      }
    }
  }

  // ۲) رودمپ — سطح/گروه/آیتم‌ها
  let perRoadmap = 0;
  for (const sec of getRoadmap()) {
    if (perRoadmap >= 8) break;
    if (matches(sec.title)) {
      hits.push({ source: "roadmap", title: "رودمپ بک‌اند", context: sec.title, snippet: sec.title, href: "/roadmap" });
      perRoadmap++;
      continue;
    }
    for (const g of sec.groups) {
      if (perRoadmap >= 8) break;
      for (const item of g.items) {
        if (perRoadmap >= 8) break;
        if (matches(item)) {
          hits.push({ source: "roadmap", title: "رودمپ بک‌اند", context: `${sec.title} ← ${g.title}`, snippet: snippet(item, tokens), href: "/roadmap" });
          perRoadmap++;
        }
      }
    }
  }

  return Response.json({ results: hits.slice(0, 20) });
}
