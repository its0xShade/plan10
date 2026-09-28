import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const dir = path.join(root, "content");
const outFile = path.join(root, "public/search-index.json");

// عنوان/توضیح اسناد از همان آرایه DOCS در src/lib/content.ts (منبع واحد)
const src = fs.readFileSync(path.join(root, "src/lib/content.ts"), "utf8");
const meta = new Map();
for (const m of src.matchAll(/\{\s*slug:\s*"([^"]+)",\s*persianTitle:\s*"([^"]+)",\s*description:\s*"([^"]+)"\s*\}/g)) {
  meta.set(m[1], { persianTitle: m[2], description: m[3] });
}

const docs = [];
for (const f of fs.readdirSync(dir).filter((x) => x.endsWith(".md")).sort()) {
  const slug = f.replace(/\.md$/, "");
  const lines = fs
    .readFileSync(path.join(dir, f), "utf8")
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  const t = meta.get(slug) ?? { persianTitle: slug, description: "" };
  docs.push({ slug, persianTitle: t.persianTitle, description: t.description, lines });
}

// رودمپ ۰۹ — همان پارسِ getRoadmap در content.ts
const roadmap = [];
const rmFile = path.join(dir, "09-BACKEND-ROADMAP.md");
if (fs.existsSync(rmFile)) {
  let cur = null;
  let group = "";
  for (const line of fs.readFileSync(rmFile, "utf8").split(/\r?\n/)) {
    const h1 = line.match(/^#\s+(.+)$/);
    const h23 = line.match(/^#{2,3}\s+(.+)$/);
    const task = line.match(/^\s*- \[ \]\s+(.+)$/);
    if (h1) {
      cur = { title: h1[1].replace(/^[^\p{L}]+/u, "").trim(), groups: [] };
      roadmap.push(cur);
      group = "";
      continue;
    }
    if (cur && h23) {
      group = h23[1].replace(/^[#>\s]+/, "").trim();
      continue;
    }
    if (cur && task) {
      let gg = cur.groups.find((x) => x.title === group);
      if (!gg) {
        gg = { title: group || "آیتم‌ها", items: [] };
        cur.groups.push(gg);
      }
      gg.items.push(task[1].trim());
    }
  }
}
const sections = roadmap.filter((s) => s.groups.some((gg) => gg.items.length > 0));

fs.mkdirSync(path.dirname(outFile), { recursive: true });
fs.writeFileSync(outFile, JSON.stringify({ docs, roadmap: sections }));
console.log(`search-index: ${docs.length} docs, ${sections.length} roadmap sections, ${fs.statSync(outFile).size} bytes`);
