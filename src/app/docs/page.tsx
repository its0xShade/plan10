import { BookOpen, Sparkles, Timer, Layers } from "lucide-react";
import { listDocs, getDoc } from "@/lib/content";
import { Badge } from "@/components/ui/badge";
import { GridBackground } from "@/components/backgrounds/grid";
import { DocsExplorer, type DocCardData } from "@/components/docs-explorer";
import { DOC_ORDER } from "@/lib/docs-meta";
import { fa } from "@/lib/utils";

export const metadata = { title: "مستندات" };

/** زمان مطالعه از تعداد واژه‌ها (~۱۸۰ واژه در دقیقه) */
function minutesOf(body: string): { minutes: number; words: number } {
  const words = body.trim().split(/\s+/).filter(Boolean).length;
  return { minutes: Math.max(1, Math.round(words / 180)), words };
}

export default function DocsHubPage() {
  const docs = listDocs();
  const cards: DocCardData[] = DOC_ORDER.flatMap((slug) => {
    const d = docs.find((x) => x.slug === slug);
    if (!d) return [];
    const { minutes, words } = minutesOf(getDoc(slug)?.body ?? "");
    return [{ slug: d.slug, persianTitle: d.persianTitle, description: d.description, minutes, words }];
  });
  const totalMinutes = cards.reduce((s, d) => s + d.minutes, 0);

  return (
    <div className="space-y-6">
      {/* هدر صفحه */}
      <section className="relative overflow-hidden rounded-2xl border border-border bg-card">
        <GridBackground />
        <div className="relative px-6 py-9 sm:px-10 sm:py-11">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <BookOpen className="size-4 text-brand" />
            مستندات برنامه
          </div>
          <h1 className="mt-3 text-2xl font-black leading-tight sm:text-3xl">
            ده سند، از <span className="text-brand">نقشه</span> تا اجرا
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-muted-foreground">
            هر سند با نمودار زنده، اسلاید و تصویر آماده شده — از برنامه اصلی و تفکیک ماهانه تا
            رودمپ بک‌اند و داشبورد پایش. جستجو کن، دسته را فیلتر کن، هر سند را بخوان.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Badge variant="brand">{fa(docs.length)} فایل</Badge>
            <Badge variant="secondary">
              <Timer className="size-3" /> ~{fa(totalMinutes)} دقیقه مطالعه
            </Badge>
            <Badge variant="secondary">
              <Sparkles className="size-3" /> نمودار Mermaid زنده
            </Badge>
            <Badge variant="outline">
              <Layers className="size-3" /> اسلایدشو
            </Badge>
            <Badge variant="outline">قابل چاپ</Badge>
          </div>
        </div>
      </section>

      {/* اکسپلورر: جستجو + فیلتر + کارت‌ها */}
      <DocsExplorer docs={cards} />
    </div>
  );
}
