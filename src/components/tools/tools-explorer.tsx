"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Search,
  Map,
  Brain,
  Code2,
  MessagesSquare,
  NotebookPen,
  Library,
  CalendarDays,
  Settings,
  LayoutDashboard,
  Layers,
  Type,
  Timer,
  CalendarCheck,
  Trophy,
  Sun,
  Coffee,
  MoonStar,
  Route,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { fa } from "@/lib/utils";

interface Tool {
  href: string;
  label: string;
  desc: string;
  Icon: React.ComponentType<{ className?: string }>;
  tint: string;
  tag: string;
  keys?: string[];
}

const TOOLS: { group: string; items: Tool[] }[] = [
  {
    group: "تمرین و یادگیری",
    items: [
      { href: "/today", label: "صفحه امروز", desc: "برنامه امروز + ثبت سریع لاگ + سؤال روز در یک صفحه", Icon: CalendarCheck, tint: "bg-brand/10 text-brand", tag: "هر روز" },
      { href: "/pomodoro", label: "تایمر پومودورو", desc: "سشن ۲۵ دقیقه‌ای با ثبت خودکار در لاگ روزانه", Icon: Timer, tint: "bg-orange-500/10 text-orange-500", tag: "تایمر" },
      { href: "/flashcards", label: "فلش‌کارت (SRS)", desc: "اصطلاحات بک‌اند و درس کتاب‌ها با مرور فاصله‌دار", Icon: Layers, tint: "bg-fuchsia-500/10 text-fuchsia-500", tag: "SM-2" },
      { href: "/typing", label: "تست سرعت تایپ", desc: "فارسی و انگلیسی — WPM، دقت و رکورد شخصی", Icon: Type, tint: "bg-indigo-500/10 text-indigo-500", tag: "WPM" },
      { href: "/quiz", label: "کوییز روزانه", desc: "سؤالات چهارگزینه‌ای از کل برنامه با مرور فاصله‌دار", Icon: Brain, tint: "bg-violet-500/10 text-violet-500", tag: "روزانه" },
      { href: "/leetcode", label: "تخته LeetCode", desc: "مسیر حل مسئله از آرایه تا گراف با وضعیت حل", Icon: Code2, tint: "bg-sky-500/10 text-sky-500", tag: "تعاملی" },
      { href: "/interview", label: "سؤالات مصاحبه", desc: "سناریوهای مصاحبه بک‌اند و پایتون با پاسخ کلیدی", Icon: MessagesSquare, tint: "bg-amber-500/10 text-amber-500", tag: "آمادگی شغل" },
    ],
  },
  {
    group: "پایش و برنامه",
    items: [
      { href: "/roadmap", label: "رودمپ تعاملی", desc: "۱۱۰ آیتم در ۸ سطح با فیلتر، جستجو و پیشرفت ذخیره‌شده", Icon: Map, tint: "bg-emerald-500/10 text-emerald-500", tag: "۸ سطح" },
      { href: "/log", label: "لاگ روزانه", desc: "خواب، انرژی، ساعت یادگیری و آب — پایه نمودارها", Icon: NotebookPen, tint: "bg-rose-500/10 text-rose-500", tag: "هر شب" },
      { href: "/books", label: "کتابخانه", desc: "لست ۱۰ کتاب برنامه با وضعیت خواندن", Icon: Library, tint: "bg-teal-500/10 text-teal-500", tag: "۱۰ کتاب" },
      { href: "/achievements", label: "نشان‌ها و استریک", desc: "رشته روزهای متوالی و ۲۰ نشان از پیشرفت تو", Icon: Trophy, tint: "bg-amber-500/10 text-amber-500", tag: "Achievement" },
      { href: "/calendar", label: "تقویم و مهلت‌ها", desc: "کنکور، معدل، سربازی و درآمد — با خروجی ICS", Icon: CalendarDays, tint: "bg-cyan-500/10 text-cyan-500", tag: "تقویم گوشی" },
    ],
  },
  {
    group: "سیستم",
    items: [
      { href: "/", label: "داشبورد", desc: "KPI های امروز، هشدار هفتگی و فاز فعلی برنامه", Icon: LayoutDashboard, tint: "bg-brand/10 text-brand", tag: "خانه" },
      { href: "/settings", label: "تنظیمات و بکاپ", desc: "بکاپ JSON، اهداف هفتگی، یادآورهای اعلانی و اکسنت رنگی", Icon: Settings, tint: "bg-orange-500/10 text-orange-500", tag: "بکاپ" },
    ],
  },
];

/** روتین پیشنهادی یک روز — از صبح تا شب */
const ROUTINE = [
  { href: "/today", label: "امروز", hint: "برنامه و لاگ سریع", Icon: Sun, time: "صبح" },
  { href: "/pomodoro", label: "پومودورو", hint: "سشن تمرین متمرکز", Icon: Coffee, time: "روز" },
  { href: "/quiz", label: "کوییز", hint: "مرور روزانه", Icon: Brain, time: "عصر" },
  { href: "/log", label: "لاگ شب", hint: "خواب و انرژی", Icon: MoonStar, time: "شب" },
];

const ALL = TOOLS.flatMap((g) => g.items);

export function ToolsExplorer() {
  const [q, setQ] = React.useState("");
  const [group, setGroup] = React.useState<string | null>(null);
  const query = q.trim().toLowerCase();

  const match = (t: Tool) =>
    !query ||
    t.label.toLowerCase().includes(query) ||
    t.desc.toLowerCase().includes(query) ||
    t.tag.toLowerCase().includes(query);

  const visible = TOOLS.map((g) => ({
    ...g,
    items: group && group !== g.group ? [] : g.items.filter(match),
  })).filter((g) => g.items.length > 0);

  const resultCount = visible.reduce((s, g) => s + g.items.length, 0);

  return (
    <div className="space-y-7">
      {/* روتین پیشنهادی روز */}
      <section>
        <div className="mb-3 flex items-center gap-3">
          <h2 className="text-sm font-bold text-muted-foreground">روتین پیشنهادی روز</h2>
          <span className="h-px flex-1 bg-border" />
          <Badge variant="secondary" className="text-xs">از صبح تا شب</Badge>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {ROUTINE.map((r) => (
            <Link key={r.href} href={r.href} className="group">
              <Card className="h-full transition-all duration-200 group-hover:-translate-y-0.5 group-hover:border-brand/50 group-hover:shadow-lg group-hover:shadow-brand/5">
                <CardContent className="flex items-start gap-4 p-5 pt-5">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand transition-all group-hover:scale-110">
                    <r.Icon className="size-5" />
                  </span>
                  <div className="min-w-0 flex-1 leading-tight">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-bold">{r.label}</span>
                      <span className="text-xs text-muted-foreground">{r.time}</span>
                    </div>
                    <div className="mt-1 truncate text-xs text-muted-foreground">{r.hint}</div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* جستجو + فیلتر گروه */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute inset-y-0 my-auto size-4 start-3 text-muted-foreground" />
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="جستجو در ابزارها… (مثلاً تایمر، بکاپ، تایپ)"
            aria-label="جستجو در ابزارها"
            className="h-10 w-full rounded-xl border border-border bg-background pe-4 ps-9 text-sm outline-none transition-colors focus:border-brand/60"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setGroup(null)}
            className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${
              group === null
                ? "border-brand/60 bg-brand/15 text-foreground"
                : "border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            همه {fa(ALL.length)}
          </button>
          {TOOLS.map((g) => (
            <button
              key={g.group}
              type="button"
              onClick={() => setGroup(group === g.group ? null : g.group)}
              className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${
                group === g.group
                  ? "border-brand/60 bg-brand/15 text-foreground"
                  : "border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {g.group} {fa(g.items.length)}
            </button>
          ))}
        </div>
      </div>

      <p className="-mt-4 text-xs text-muted-foreground">
        {resultCount === ALL.length
          ? `${fa(ALL.length)} ابزار · همه در مرورگر خودت ذخیره می‌شوند`
          : `${fa(resultCount)} از ${fa(ALL.length)} ابزار`}
        {query && ` — نتایج برای «${q.trim()}»`}
      </p>

      {/* نتایج گروه‌به‌گروه */}
      {visible.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-2 py-10 text-center">
            <Route className="size-7 text-muted-foreground" />
            <p className="text-sm font-bold">ابزاری با این جستجو پیدا نشد</p>
            <button
              type="button"
              onClick={() => {
                setQ("");
                setGroup(null);
              }}
              className="text-xs font-medium text-brand hover:underline"
            >
              پاک کردن فیلترها
            </button>
          </CardContent>
        </Card>
      ) : (
        visible.map((g) => (
          <section key={g.group}>
            <div className="mb-3 flex items-center gap-3">
              <h2 className="text-sm font-bold text-muted-foreground">{g.group}</h2>
              <span className="h-px flex-1 bg-border" />
              <Badge variant="secondary" className="text-xs">
                {g.items.length}
              </Badge>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {g.items.map((t) => (
                <Link key={t.href} href={t.href} className="group">
                  <Card className="relative h-full overflow-hidden transition-all duration-200 group-hover:-translate-y-0.5 group-hover:border-brand/50 group-hover:shadow-xl group-hover:shadow-brand/5">
                    <span className="absolute inset-x-0 top-0 h-0.5 origin-right scale-x-0 bg-gradient-to-l from-brand to-transparent transition-transform duration-300 group-hover:scale-x-100" />
                    <CardContent className="flex h-full flex-col p-6 pt-6">
                      <div className="flex items-start justify-between gap-3">
                        <span
                          className={`flex size-11 items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-110 ${t.tint}`}
                        >
                          <t.Icon className="size-5" />
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {t.tag}
                        </Badge>
                      </div>
                      <h3 className="mt-5 text-base font-bold">{t.label}</h3>
                      <p className="mt-1 flex-1 text-xs leading-6 text-muted-foreground">{t.desc}</p>
                      <span className="mt-5 inline-flex items-center gap-1 text-xs font-medium text-brand opacity-0 transition-opacity group-hover:opacity-100">
                        ورود <ArrowLeft className="size-3" />
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        ))
      )}
    </div>
  );
}
