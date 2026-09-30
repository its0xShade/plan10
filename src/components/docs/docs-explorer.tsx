"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, Search, FileText, Timer } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DOC_CATS, docMeta } from "@/lib/data/docs-meta";
import { fa } from "@/lib/utils";

export interface DocCardData {
  slug: string;
  persianTitle: string;
  description: string;
  minutes: number;
  words: number;
}

/** اکسپلورر مستندات — جستجو + فیلتر دسته + زمان مطالعه (کلاینت). */
export function DocsExplorer({ docs }: { docs: DocCardData[] }) {
  const [q, setQ] = React.useState("");
  const [cat, setCat] = React.useState<string | null>(null);

  const query = q.trim().toLowerCase();
  const filtered = docs.filter((d) => {
    if (cat && docMeta(d.slug).cat !== cat) return false;
    if (!query) return true;
    return (
      d.persianTitle.toLowerCase().includes(query) ||
      d.description.toLowerCase().includes(query) ||
      d.slug.toLowerCase().includes(query)
    );
  });

  const totalMinutes = docs.reduce((s, d) => s + d.minutes, 0);

  return (
    <>
      {/* نوار ابزار: جستجو + دسته‌ها */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute inset-y-0 my-auto size-4 start-3 text-muted-foreground" />
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="جستجو در ده سند… (مثلاً معدل، FastAPI، درآمد)"
            aria-label="جستجو در مستندات"
            className="h-10 w-full rounded-xl border border-border bg-background pe-4 ps-9 text-sm outline-none transition-colors focus:border-brand/60"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setCat(null)}
            className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${
              cat === null
                ? "border-brand/60 bg-brand/15 text-foreground"
                : "border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            همه {fa(docs.length)}
          </button>
          {DOC_CATS.map((c) => {
            const n = docs.filter((d) => docMeta(d.slug).cat === c).length;
            if (!n) return null;
            return (
              <button
                key={c}
                type="button"
                onClick={() => setCat(cat === c ? null : c)}
                className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${
                  cat === c
                    ? "border-brand/60 bg-brand/15 text-foreground"
                    : "border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {c} {fa(n)}
              </button>
            );
          })}
        </div>
      </div>

      {/* شمارنده نتیجه */}
      <p className="text-xs text-muted-foreground">
        {filtered.length === docs.length
          ? `${fa(docs.length)} سند · ~${fa(totalMinutes)} دقیقه مطالعه کل`
          : `${fa(filtered.length)} از ${fa(docs.length)} سند`}
        {query && ` — نتایج برای «${q.trim()}»`}
      </p>

      {/* کارت‌ها */}
      {filtered.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-2 py-10 text-center">
            <FileText className="size-7 text-muted-foreground" />
            <p className="text-sm font-bold">سندی با این جستجو پیدا نشد</p>
            <p className="text-xs text-muted-foreground">عبارت دیگری امتحان کن یا فیلتر دسته را بردار.</p>
            <button
              type="button"
              onClick={() => {
                setQ("");
                setCat(null);
              }}
              className="mt-1 text-xs font-medium text-brand hover:underline"
            >
              پاک کردن فیلترها
            </button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((d) => {
            const m = docMeta(d.slug);
            const num = d.slug.slice(0, 2);
            return (
              <Link key={d.slug} href={`/docs/${d.slug}`} className="group">
                <Card className="relative h-full overflow-hidden transition-all duration-200 group-hover:-translate-y-0.5 group-hover:border-brand/50 group-hover:shadow-xl group-hover:shadow-brand/5">
                  <span className="absolute inset-x-0 top-0 h-0.5 origin-right scale-x-0 bg-gradient-to-l from-brand to-transparent transition-transform duration-300 group-hover:scale-x-100" />
                  <CardContent className="flex h-full flex-col p-6 pt-6">
                    <div className="flex items-start justify-between gap-3">
                      <span className="flex size-10 items-center justify-center rounded-xl bg-brand/10 text-brand transition-colors group-hover:bg-brand group-hover:text-brand-foreground">
                        <m.Icon className="size-5" />
                      </span>
                      <span
                        className="font-mono text-2xl font-black text-muted-foreground/25 transition-colors group-hover:text-brand/40"
                        dir="ltr"
                      >
                        {num}
                      </span>
                    </div>
                    <div className="mt-5 flex items-center gap-2">
                      <span className="text-[11px] font-semibold text-brand">{m.cat}</span>
                      <span className="h-px flex-1 bg-border" />
                      <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                        <Timer className="size-3" />
                        {fa(d.minutes)} دقیقه
                      </span>
                    </div>
                    <h2 className="mt-3 text-base font-bold leading-7">{d.persianTitle}</h2>
                    <p className="mt-1 flex-1 text-xs leading-6 text-muted-foreground">{d.description}</p>
                    <div className="mt-5 flex items-center justify-between">
                      <div className="flex gap-1.5">
                        <Badge variant="outline" className="text-xs">نمودار</Badge>
                        <Badge variant="outline" className="text-xs">اسلاید</Badge>
                      </div>
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-brand opacity-0 transition-opacity group-hover:opacity-100">
                        خواندن <ArrowLeft className="size-3" />
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
}
