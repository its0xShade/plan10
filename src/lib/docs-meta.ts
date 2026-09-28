import { Compass, CalendarRange, CalendarCheck, Code2, Map, Coins, Languages, GraduationCap, ShieldCheck, Activity, BookOpen } from "lucide-react";

/** رده و آیکون هر سند — بین صفحه مستندات و اکسپلورر مشترک است. */
export interface DocMetaLite {
  slug: string;
  persianTitle: string;
  description: string;
  cat: string;
  Icon: React.ComponentType<{ className?: string }>;
}

export const DOC_META: Record<string, { cat: string; Icon: React.ComponentType<{ className?: string }> }> = {
  "00-MASTER-PLAN": { cat: "نقشه کلان", Icon: Compass },
  "01-MONTHLY-BREAKDOWN": { cat: "نقشه کلان", Icon: CalendarRange },
  "02-WEEKLY-TEMPLATE": { cat: "نقشه کلان", Icon: CalendarCheck },
  "03-PYTHON-CURRICULUM": { cat: "مهارت بک‌اند", Icon: Code2 },
  "09-BACKEND-ROADMAP": { cat: "مهارت بک‌اند", Icon: Map },
  "04-INCOME-STRATEGY": { cat: "اهداف", Icon: Coins },
  "05-ENGLISH-PLAN": { cat: "اهداف", Icon: Languages },
  "06-GPA-AND-KONKUR": { cat: "اهداف", Icon: GraduationCap },
  "07-SARBAZI-TRACKER": { cat: "اهداف", Icon: ShieldCheck },
  "08-TRACKING-DASHBOARD": { cat: "پایش", Icon: Activity },
};

export const DOC_ORDER = [
  "00-MASTER-PLAN",
  "01-MONTHLY-BREAKDOWN",
  "02-WEEKLY-TEMPLATE",
  "03-PYTHON-CURRICULUM",
  "09-BACKEND-ROADMAP",
  "04-INCOME-STRATEGY",
  "05-ENGLISH-PLAN",
  "06-GPA-AND-KONKUR",
  "07-SARBAZI-TRACKER",
  "08-TRACKING-DASHBOARD",
];

export const docMeta = (slug: string) => DOC_META[slug] ?? { cat: "سند", Icon: BookOpen };

/** دسته‌ها به ترتیب نمایش */
export const DOC_CATS = ["نقشه کلان", "مهارت بک‌اند", "اهداف", "پایش"];
