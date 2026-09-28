/** جست‌وجوی سمت کلاینت روی ایندکس ساخته‌شده در build — جایگزین /api/search برای خروجی استاتیک. */

export interface SearchIndex {
  docs: { slug: string; persianTitle: string; description: string; lines: string[] }[];
  roadmap: { title: string; groups: { title: string; items: string[] }[] }[];
}

export interface Hit {
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

export function searchDocs(q: string, idx: SearchIndex): Hit[] {
  const tokens = q.toLowerCase().split(/\s+/).filter(Boolean);
  if (tokens.length === 0 || q.trim().length < 2) return [];
  const matches = (hay: string) => {
    const lower = hay.toLowerCase();
    return tokens.every((t) => lower.includes(t));
  };
  const hits: Hit[] = [];

  for (const d of idx.docs) {
    const href = `/docs/${d.slug}`;
    if (matches(d.persianTitle) || matches(d.slug) || matches(d.description)) {
      hits.push({ source: "doc", title: d.persianTitle, snippet: d.description, href });
    }
    let heading = "";
    let perDoc = 0;
    for (const line of d.lines) {
      if (perDoc >= 3) break;
      const hm = line.match(/^#{1,4}\s+(.+)$/);
      if (hm) heading = hm[1].replace(/^[^\p{L}]+/u, "").trim();
      const listy = line.startsWith("|") || line.startsWith("-");
      if ((hm || listy) && matches(line)) {
        hits.push({ source: "doc", title: d.persianTitle, context: heading, snippet: snippet(line, tokens), href });
        perDoc++;
      }
    }
  }

  let perRoadmap = 0;
  for (const sec of idx.roadmap) {
    if (perRoadmap >= 8) break;
    if (matches(sec.title)) {
      hits.push({ source: "roadmap", title: "رودمپ بک‌اند", context: sec.title, snippet: sec.title, href: "/roadmap" });
      perRoadmap++;
      continue;
    }
    for (const grp of sec.groups) {
      if (perRoadmap >= 8) break;
      if (matches(grp.title)) {
        hits.push({ source: "roadmap", title: "رودمپ بک‌اند", context: `${sec.title} ← ${grp.title}`, snippet: grp.title, href: "/roadmap" });
        perRoadmap++;
        continue;
      }
      for (const item of grp.items) {
        if (perRoadmap >= 8) break;
        if (matches(item)) {
          hits.push({ source: "roadmap", title: "رودمپ بک‌اند", context: `${sec.title} ← ${grp.title}`, snippet: snippet(item, tokens), href: "/roadmap" });
          perRoadmap++;
        }
      }
    }
  }
  return hits.slice(0, 20);
}
