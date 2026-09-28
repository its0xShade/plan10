"use client";

import * as React from "react";
import {
  Check,
  CheckCheck,
  ChevronDown,
  RotateCcw,
  Search,
  Trophy,
  Target,
  ListChecks,
  Circle,
  ArrowDown,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn, fa } from "@/lib/utils";
import type { RoadmapSection } from "@/lib/content";

const STORAGE_KEY = "roadmap-done-v1";

type Status = "all" | "todo" | "done";

/** شماره سطح از عنوان («سطح ۳: …») */
function levelNum(title: string) {
  const m = title.match(/سطح\s*([۰-۹0-9]+)/);
  return m ? m[1] : "✓"; // بخش‌های غیرسطح (مثل معیارها) عدد جعلی نسازند
}

/** بازه هفته‌ها از عنوان («(هفته ۱–۸)») */
function weeksOf(title: string): string | null {
  const m = title.match(/هفته\s*([۰-۹\d]+\s*[–-]\s*[۰-۹\d]+)/);
  return m ? `هفته ${m[1]}` : null;
}

export function RoadmapChecklist({ sections }: { sections: RoadmapSection[] }) {
  const [done, setDone] = React.useState<Record<string, boolean>>({});
  const [loaded, setLoaded] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [status, setStatus] = React.useState<Status>("all");
  const [openMap, setOpenMap] = React.useState<Record<string, boolean>>({});
  const refs = React.useRef<Record<string, HTMLDivElement | null>>({});

  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setDone(JSON.parse(raw));
    } catch {}
    setLoaded(true);
  }, []);

  React.useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(done));
    } catch {}
  }, [done, loaded]);

  // پیش‌فرض: اولین سطح ناتمام باز است
  React.useEffect(() => {
    if (sections.length === 0 || Object.keys(openMap).length > 0) return;
    for (const sec of sections) {
      const d = sec.groups.reduce(
        (s, g) => s + g.items.filter((it) => done[`${sec.title}::${it}`]).length,
        0,
      );
      if (d < sec.total) {
        setOpenMap({ [sec.title]: true });
        return;
      }
    }
    setOpenMap({ [sections[0].title]: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sections]);

  const key = (secTitle: string, item: string) => `${secTitle}::${item}`;
  // تیک فقط کلید می‌سازه؛ برداشتن تیک کلید رو حذف می‌کنه تا داده تمیز بمونه
  const toggle = (k: string) =>
    setDone((d) => {
      const n = { ...d };
      if (n[k]) delete n[k];
      else n[k] = true;
      return n;
    });

  const stats = sections.map((sec) => {
    const doneCount = sec.groups.reduce(
      (s, g) => s + g.items.filter((it) => done[key(sec.title, it)]).length,
      0,
    );
    return { sec, doneCount, total: sec.total, pct: sec.total ? Math.round((doneCount / sec.total) * 100) : 0 };
  });

  const grandTotal = stats.reduce((s, x) => s + x.total, 0);
  const grandDone = stats.reduce((s, x) => s + x.doneCount, 0);
  const grandPct = grandTotal ? Math.round((grandDone / grandTotal) * 100) : 0;
  const isLevel = (t: string) => /سطح\s*[۰-۹0-9]/.test(t);
  const levelStats = stats.filter((x) => isLevel(x.sec.title));
  const fullLevels = levelStats.filter((x) => x.pct === 100).length;
  const remaining = grandTotal - grandDone;
  const current = stats.find((x) => x.pct < 100);

  const filtered = query.trim() !== "" || status !== "all";
  const q = query.trim().toLowerCase();

  const itemVisible = (secTitle: string, item: string) => {
    const isDone = !!done[key(secTitle, item)];
    if (status === "todo" && isDone) return false;
    if (status === "done" && !isDone) return false;
    if (q && !item.toLowerCase().includes(q)) return false;
    return true;
  };

  const visibleStats = stats.filter((st) =>
    st.sec.groups.some((g) => g.items.some((it) => itemVisible(st.sec.title, it))),
  );

  const isOpen = (title: string) => filtered || !!openMap[title];
  const flip = (title: string) => setOpenMap((m) => ({ ...m, [title]: !m[title] }));

  const toggleAll = (sec: RoadmapSection, value: boolean) => {
    setDone((d) => {
      const next = { ...d };
      for (const g of sec.groups) {
        for (const it of g.items) {
          const k = key(sec.title, it);
          if (value) next[k] = true;
          else delete next[k];
        }
      }
      return next;
    });
  };

  const scrollTo = (title: string) => {
    refs.current[title]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const reset = () => {
    if (confirm("همه تیک‌ها پاک بشه؟")) setDone({});
  };

  if (sections.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6 text-sm text-muted-foreground">
          فایل رودمپ پیدا نشد — مطمئن شو ۰۹-BACKEND-ROADMAP.md کنار سایت هست.
        </CardContent>
      </Card>
    );
  }

  const chip = (s: Status, label: string) => (
    <button
      key={s}
      type="button"
      onClick={() => setStatus(s)}
      className={cn(
        "rounded-full border px-3 py-1 text-xs transition-colors",
        status === s
          ? "border-brand/60 bg-brand/15 text-foreground"
          : "border-border text-muted-foreground hover:text-foreground",
      )}
    >
      {label}
    </button>
  );

  return (
    <div className="space-y-5">
      {/* ---------- آمار کلی ---------- */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Card className={grandPct === 100 ? "border-success/50" : "border-brand/30"}>
          <CardContent className="pt-5">
            <div className="text-xs text-muted-foreground">پیشرفت کلی</div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-3xl font-black">{fa(grandPct)}٪</span>
              <span className="text-xs text-muted-foreground">
                {fa(grandDone)} از {fa(grandTotal)}
              </span>
            </div>
            <Progress value={grandPct} size="sm" showValue={false} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-5">
            <div className="text-xs text-muted-foreground">سطح‌های کامل</div>
            <div className="mt-1 flex items-center gap-2">
              <span className="text-3xl font-black">
                {fa(fullLevels)}
                <span className="text-base text-muted-foreground"> / {fa(levelStats.length)}</span>
              </span>
              {fullLevels > 0 && fullLevels === levelStats.length ? (
                <Trophy className="size-5 text-success" />
              ) : fullLevels > 0 ? (
                <CheckCheck className="size-5 text-brand" />
              ) : null}
            </div>
            <div className="mt-2 text-[11px] text-muted-foreground">سطحی که ۱۰۰٪ بشه کامله</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-5">
            <div className="text-xs text-muted-foreground">باقی‌مانده</div>
            <div className="mt-1 text-3xl font-black">{fa(remaining)}</div>
            <div className="mt-2 text-[11px] text-muted-foreground">آیتم تا پایان رودمپ</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-5">
            <div className="text-xs text-muted-foreground">سطح فعلی</div>
            <div className="mt-1 truncate text-sm font-bold">
              {current ? current.sec.title : "تمام شد 🎉"}
            </div>
            {current && (
              <button
                type="button"
                onClick={() => scrollTo(current.sec.title)}
                className="mt-1 flex items-center gap-1 text-xs text-brand hover:underline"
              >
                <ArrowDown className="size-3.5" /> برو به سطح
              </button>
            )}
          </CardContent>
        </Card>
      </div>

      {grandPct === 100 && (
        <div className="flex items-center gap-3 rounded-xl border border-success/50 bg-success/10 px-4 py-3">
          <Trophy className="size-5 text-success" />
          <span className="text-sm font-bold">رودمپ کامل شد — از صفر تا شغل، همه تیک‌ها خورد.</span>
        </div>
      )}

      {/* ---------- نوار سطح‌ها (پیمایش) ---------- */}
      <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
        {stats.map((st) => (
          <button
            key={st.sec.title}
            type="button"
            onClick={() => scrollTo(st.sec.title)}
            className={cn(
              "group flex shrink-0 items-center gap-2 rounded-lg border px-2.5 py-1.5 text-xs transition-colors",
              st.pct === 100
                ? "border-success/50 bg-success/10"
                : current?.sec.title === st.sec.title
                  ? "border-brand/60 bg-brand/10"
                  : "border-border hover:border-brand/40",
            )}
          >
            <span className="font-black">{levelNum(st.sec.title)}</span>
            <span className="h-1.5 w-10 overflow-hidden rounded-full bg-secondary">
              <span
                className="block h-full rounded-full bg-brand transition-all"
                style={{ width: `${st.pct}%` }}
              />
            </span>
            <span className="text-muted-foreground">{fa(st.pct)}٪</span>
          </button>
        ))}
      </div>

      {/* ---------- جستجو و فیلتر ---------- */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative">
          <Search className="pointer-events-none absolute inset-y-0 end-2.5 my-auto size-4 text-muted-foreground" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="جستجو در آیتم‌های رودمپ…"
            className="h-9 w-64 rounded-lg border border-input bg-background/60 ps-3 pe-9 text-sm outline-none focus:border-brand/60"
          />
        </div>
        {chip("all", "همه")}
        {chip("todo", "انجام‌نشده")}
        {chip("done", "انجام‌شده")}
        <span className="ms-auto text-xs text-muted-foreground">
          {filtered
            ? `${fa(
                visibleStats.reduce(
                  (s, st) =>
                    s + st.sec.groups.reduce((t, g) => t + g.items.filter((it) => itemVisible(st.sec.title, it)).length, 0),
                  0,
                ),
              )} نتیجه`
            : "تیک‌ها خودکار ذخیره می‌شن ✓"}
        </span>
      </div>

      {filtered && visibleStats.length === 0 && (
        <Card>
          <CardContent className="pt-6 text-sm text-muted-foreground">
            نتیجه‌ای پیدا نشد — جستجو رو عوض کن.
          </CardContent>
        </Card>
      )}

      {/* ---------- سطح‌ها ---------- */}
      <div className="space-y-4">
        {visibleStats.map((st) => {
          const { sec } = st;
          const expanded = isOpen(sec.title);
          const allDone = st.pct === 100;
          const someDone = st.doneCount > 0;
          const weeks = weeksOf(sec.title);

          return (
            <div
              key={sec.title}
              ref={(el) => {
                refs.current[sec.title] = el;
              }}
              className="scroll-mt-24"
            >
            <Card
              className={cn(
                "transition-colors",
                allDone && "border-success/50",
                !someDone && !allDone && "opacity-95",
              )}
            >
              <CardHeader className="pb-2">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    aria-expanded={expanded}
                    aria-label={expanded ? "بستن سطح" : "باز کردن سطح"}
                    onClick={() => flip(sec.title)}
                    className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                  >
                    <ChevronDown className={cn("size-4 transition-transform", expanded && "rotate-180")} />
                  </button>
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-brand/15 text-sm font-black text-brand">
                    {levelNum(sec.title)}
                  </span>
                  <CardTitle className="min-w-0 flex-1 truncate text-base">{sec.title}</CardTitle>
                  {weeks && <Badge variant="outline">{weeks}</Badge>}
                  {allDone && <Badge variant="success">کامل ✓</Badge>}
                  <Badge variant={someDone || allDone ? "brand" : "secondary"}>
                    {fa(st.doneCount)}/{fa(st.total)}
                  </Badge>
                  <span className="w-10 text-end text-xs text-muted-foreground">{fa(st.pct)}٪</span>
                  <button
                    type="button"
                    title={allDone ? "لغو تیک‌های این سطح" : "علامت‌زدن همه سطح"}
                    aria-label={allDone ? "لغو تیک‌های این سطح" : "علامت‌زدن همه سطح"}
                    onClick={() => toggleAll(sec, !allDone)}
                    className={cn(
                      "rounded-md p-1.5 transition-colors",
                      allDone
                        ? "text-success hover:bg-success/15"
                        : "text-muted-foreground hover:bg-accent hover:text-foreground",
                    )}
                  >
                    <CheckCheck className="size-4" />
                  </button>
                </div>
                <Progress value={st.pct} size="sm" showValue={false} className="mt-1" />
              </CardHeader>

              {expanded && (
                <CardContent className="space-y-5">
                  {sec.groups.map((g) => {
                    const visibleItems = g.items.filter((it) => itemVisible(sec.title, it));
                    if (visibleItems.length === 0) return null;
                    return (
                      <div key={g.title}>
                        <h3 className="mb-2 flex items-center gap-2 text-sm font-bold text-brand">
                          <Target className="size-4" /> {g.title}
                          <span className="font-normal text-muted-foreground">
                            ({fa(visibleItems.length)})
                          </span>
                        </h3>
                        <div className="grid gap-1.5 sm:grid-cols-2">
                          {visibleItems.map((item) => {
                            const k = key(sec.title, item);
                            const isDone = !!done[k];
                            return (
                              <button
                                key={k}
                                type="button"
                                onClick={() => toggle(k)}
                                className={`flex items-start gap-2.5 rounded-lg border border-border/60 px-3 py-2 text-start text-sm transition-colors hover:border-brand/40 hover:bg-accent/40 ${
                                  isDone ? "opacity-60" : ""
                                }`}
                              >
                                <span
                                  aria-hidden
                                  className={cn(
                                    "mt-0.5 flex size-4 shrink-0 items-center justify-center rounded border transition-colors",
                                    isDone
                                      ? "border-primary bg-primary text-primary-foreground"
                                      : "border-input bg-background/60",
                                  )}
                                >
                                  {isDone ? <Check className="size-3" /> : <Circle className="size-2.5 opacity-40" />}
                                </span>
                                <span className={isDone ? "line-through decoration-muted-foreground" : ""}>
                                  {item}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              )}
            </Card>
            </div>
          );
        })}
      </div>

      {/* ---------- پاورقی ---------- */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          <ListChecks className="inline size-3.5" /> ذخیره خودکار در این مرورگر — از تنظیمات، بکاپ
          بگیر.
        </span>
        <Button variant="ghost" size="sm" onClick={reset}>
          <RotateCcw className="size-3.5" /> شروع دوباره
        </Button>
      </div>
    </div>
  );
}
