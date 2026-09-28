import fs from "node:fs";
import path from "node:path";

export interface DocMeta {
  slug: string;
  title: string;
  persianTitle: string;
  description: string;
}

const DOCS: { slug: string; persianTitle: string; description: string }[] = [
  { slug: "00-MASTER-PLAN", persianTitle: "برنامه اصلی", description: "جدول روزانه نهایی، فازها و خطوط قرمز" },
  { slug: "01-MONTHLY-BREAKDOWN", persianTitle: "تفکیک ماه‌به‌ماه", description: "مهر ۱۴۰۵ تا تیر ۱۴۰۶، هفته به هفته" },
  { slug: "02-WEEKLY-TEMPLATE", persianTitle: "قالب هفتگی", description: "برنامه هفتگی + ترکر عادات + بازبینی" },
  { slug: "03-PYTHON-CURRICULUM", persianTitle: "مسیر یادگیری بک‌اند", description: "از توابع تا سطح استخدام" },
  { slug: "04-INCOME-STRATEGY", persianTitle: "استراتژی درآمد", description: "ایرانی + بین‌المللی تا ۲۰ میلیون" },
  { slug: "05-ENGLISH-PLAN", persianTitle: "برنامه زبان", description: "انگلیسی از صفر با ۳۰ دقیقه روزی" },
  { slug: "06-GPA-AND-KONKUR", persianTitle: "معدل و کنکور", description: "معدل ≥۱۶ + کنکور فقط از فروردین" },
  { slug: "07-SARBAZI-TRACKER", persianTitle: "پیگیری سربازی", description: "معافیت تحصیلی از مسیر دانشگاه" },
  { slug: "08-TRACKING-DASHBOARD", persianTitle: "داشبورد پیگیری", description: "KPI هفتگی و چک‌پوینت ماهانه" },
  { slug: "09-BACKEND-ROADMAP", persianTitle: "رودمپ بک‌اند", description: "۸ سطح از مبانی تا شغل حرفه‌ای" },
];

/** پوشه فایل‌های markdown برنامه — داخل خود پروژه (content/). فقط سمت سرور. */
export function contentDir(): string {
  return path.join(process.cwd(), "content");
}

export function listDocs(): DocMeta[] {
  return DOCS.map((d) => ({ ...d, title: d.persianTitle }));
}

export function getDoc(slug: string): { meta: DocMeta; body: string } | null {
  const meta = DOCS.find((d) => d.slug === slug);
  if (!meta) return null;
  const file = path.join(contentDir(), `${slug}.md`);
  if (!fs.existsSync(file)) return null;
  const body = fs.readFileSync(file, "utf8");
  return { meta: { ...meta, title: meta.persianTitle }, body };
}

export interface RoadmapSection {
  title: string;
  groups: { title: string; items: string[] }[];
  total: number;
}

/** رودمپ ۰۹ را به بخش/گروه/چک‌آیتم برای چک‌لیست تعاملی تبدیل می‌کند. فقط سمت سرور. */
export function getRoadmap(): RoadmapSection[] {
  const file = path.join(contentDir(), "09-BACKEND-ROADMAP.md");
  if (!fs.existsSync(file)) return [];
  const lines = fs.readFileSync(file, "utf8").split(/\r?\n/);

  const sections: RoadmapSection[] = [];
  let current: RoadmapSection | null = null;
  let groupTitle = "";

  for (const line of lines) {
    const h1 = line.match(/^#\s+(.+)$/);
    const h23 = line.match(/^#{2,3}\s+(.+)$/);
    const task = line.match(/^\s*- \[ \]\s+(.+)$/);

    if (h1) {
      // عنوان اصلی فایل و هر h1 → بخش جدید؛ ایموجی/نماد ابتدای عنوان حذف می‌شود
      const title = h1[1].replace(/^[^\p{L}]+/u, "").trim();
      current = { title, groups: [], total: 0 };
      sections.push(current);
      groupTitle = "";
      continue;
    }
    if (current && h23) {
      groupTitle = h23[1].replace(/^[#>\s]+/, "").trim();
      continue;
    }
    if (current && task) {
      let g = current.groups.find((x) => x.title === groupTitle);
      if (!g) {
        g = { title: groupTitle || "آیتم‌ها", items: [] };
        current.groups.push(g);
      }
      g.items.push(task[1].trim());
      current.total += 1;
    }
  }
  return sections.filter((s) => s.total > 0);
}
