"use client";

import * as React from "react";
import { useMounted } from "@/lib/use-mounted";
import Link from "next/link";
import {
  CalendarDays,
  Droplet,
  Minus,
  Moon,
  Plus,
  Flame,
  Timer,
  Brain,
  Layers,
  Type as TypeIcon,
  CalendarClock,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { DayTypeBadge, ScheduleCards, WeeklyHoursWarning } from "@/components/today-panel";
import { StreakChip } from "@/components/streak-achievements";
import { useStore, todayISO, dayType, DAY_LABEL, WEEKDAY_FA } from "@/lib/store";
import type { DayLog } from "@/app/log/page";
import { useTargets, targetOfDay } from "@/lib/targets";
import { usePomoLog, pomoToday } from "@/lib/pomo";
import { calcStreak } from "@/lib/streak";
import { dailyQuestions } from "@/lib/quiz-data";
import { PLAN_EVENTS } from "@/lib/events-data";
import { toGregorian, formatJalali } from "@/lib/jalali";
import { fa } from "@/lib/utils";

/* ————— تیکرهای کوچک ۱ تا ۵ ————— */
function Scale15({ label, value, onPick }: { label: string; value?: number; onPick: (v: number) => void }) {
  return (
    <div>
      <div className="mb-1 text-xs text-muted-foreground">{label}</div>
      <div className="flex gap-1.5">
        {[1, 2, 3, 4, 5].map((v) => (
          <button
            key={v}
            type="button"
            onClick={() => onPick(v)}
            aria-label={`${label} ${v}`}
            className={`size-7 rounded-lg border text-xs font-bold transition-colors ${
              value === v ? "border-brand bg-brand text-brand-foreground" : "border-border hover:border-brand/50"
            }`}
          >
            {fa(v)}
          </button>
        ))}
      </div>
    </div>
  );
}

const QUICK_TOOLS = [
  { href: "/pomodoro", label: "پومودورو", Icon: Timer },
  { href: "/flashcards", label: "فلش‌کارت SRS", Icon: Layers },
  { href: "/typing", label: "تست تایپ", Icon: TypeIcon },
  { href: "/quiz", label: "کوییز کامل", Icon: Brain },
];

export default function TodayPage() {
  const today = todayISO();
  const [logs, setLogs] = useStore<Record<string, DayLog>>("plan10.log", {});
  const [targets] = useTargets();
  const [pomo] = usePomoLog();
  const mounted = useMounted();
  const [picked, setPicked] = React.useState<number | null>(null);

  const log = logs[today] ?? {};
  const set = (patch: Partial<DayLog>) => setLogs((prev) => ({ ...prev, [today]: { ...prev[today], ...patch } }));

  const dt = dayType();
  const target = targetOfDay(dt, targets);
  const learned = log.lh ?? 0;
  const pct = Math.min(100, Math.round((learned / target) * 100));

  const streak = React.useMemo(() => calcStreak(logs), [logs]);
  const pT = mounted ? pomoToday(pomo, today) : { n: 0, min: 0 };

  const question = dailyQuestions(today)[0];

  // نزدیک‌ترین مهلت‌های پیش‌رو
  const upcoming = React.useMemo(() => {
    const now = new Date();
    return PLAN_EVENTS.map((ev) => {
      const g = toGregorian(ev.j[0], ev.j[1], ev.j[2]);
      const diff = Math.round((g.getTime() - new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()) / 86400000);
      return { ev, diff, g };
    })
      .filter((x) => x.diff >= 0)
      .sort((a, b) => a.diff - b.diff)
      .slice(0, 3);
  }, []);

  let dateTxt = "";
  if (mounted) {
    const d = new Date();
    dateTxt = `${WEEKDAY_FA[d.getDay()]} ${formatJalali(d, { weekday: false, year: true })}`;
  }

  return (
    <div className="space-y-6">
      {/* هدر */}
      <header className="flex flex-wrap items-center gap-3">
        <CalendarDays className="size-7 text-brand" />
        <div>
          <h1 className="text-2xl font-bold">امروز</h1>
          <p className="text-sm text-muted-foreground">
            {dateTxt || "…"} — {DAY_LABEL[dt]} — هدف {fa(target)} ساعت
          </p>
        </div>
        <div className="ms-auto flex flex-wrap items-center gap-2">
          <StreakChip />
          <DayTypeBadge />
        </div>
      </header>

      {/* هشدار هفتگی */}
      <WeeklyHoursWarning />

      <div className="grid gap-4 lg:grid-cols-3">
        {/* ستون اصلی */}
        <div className="space-y-4 lg:col-span-2">
          {/* برنامه امروز */}
          <div className="grid gap-4 sm:grid-cols-2">
            <ScheduleCards />
          </div>

          {/* ثبت سریع لاگ */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">ثبت سریع امروز</CardTitle>
              <CardDescription className="text-xs">
                همان داده‌های لاگ — کامل‌ترش در صفحه لاگ ثبت می‌شه
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-2">
              <div className="flex flex-wrap items-end gap-4">
                <label className="block">
                  <span className="mb-1 block text-xs text-muted-foreground">خواب (دیشب)</span>
                  <input
                    type="number"
                    inputMode="decimal"
                    step={0.5}
                    max={14}
                    value={log.sl ?? ""}
                    onChange={(e) => set({ sl: e.target.value === "" ? undefined : Number(e.target.value) })}
                    className="w-24 rounded-lg border border-border bg-background px-2 py-1.5 text-sm outline-none focus:border-brand/50"
                    dir="ltr"
                  />
                </label>
                <label className="block">
                  <span className="mb-1 block text-xs text-muted-foreground">ساعت یادگیری</span>
                  <input
                    type="number"
                    inputMode="decimal"
                    step={0.5}
                    max={24}
                    value={log.lh ?? ""}
                    onChange={(e) => set({ lh: e.target.value === "" ? undefined : Number(e.target.value) })}
                    className="w-24 rounded-lg border border-border bg-background px-2 py-1.5 text-sm outline-none focus:border-brand/50"
                    dir="ltr"
                  />
                </label>
                <div className="flex flex-wrap gap-x-6 gap-y-2">
                  <Scale15 label="انرژی" value={log.en} onPick={(v) => set({ en: v })} />
                  <Scale15 label="روحیه" value={log.mo} onPick={(v) => set({ mo: v })} />
                </div>
              </div>

              <div className="flex items-center justify-between rounded-lg border border-border px-3 py-2">
                <span className="flex items-center gap-2 text-sm">
                  <Droplet className="size-4 text-sky-400" />
                  آب: <b>{fa(log.wa ?? 0)}</b> از {fa(8)} لیوان
                </span>
                <span className="flex gap-1.5">
                  <Button variant="outline" size="icon" className="size-7" aria-label="کم"
                    onClick={() => set({ wa: Math.max(0, (log.wa ?? 0) - 1) })}>
                    <Minus className="size-3.5" />
                  </Button>
                  <Button variant="outline" size="icon" className="size-7" aria-label="زیاد"
                    onClick={() => set({ wa: Math.min(20, (log.wa ?? 0) + 1) })}>
                    <Plus className="size-3.5" />
                  </Button>
                </span>
              </div>

              <div>
                <span className="mb-1 block text-xs text-muted-foreground">
                  <Moon className="inline size-3" /> یادداشت روز
                </span>
                <textarea
                  value={log.nt ?? ""}
                  onChange={(e) => set({ nt: e.target.value })}
                  rows={2}
                  placeholder="امروز چه گذشت؟ چه یاد گرفتی؟"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm leading-7 outline-none focus:border-brand/50"
                />
              </div>
            </CardContent>
          </Card>

          {/* نمونه سؤال کوییز امروز */}
          {question && (
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between gap-2">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Brain className="size-5 text-brand" /> سؤال امروز
                  </CardTitle>
                  <Link href="/quiz" className="text-xs font-medium text-brand hover:underline">
                    کوییز کامل ({fa(5)} سؤال) ←
                  </Link>
                </div>
                <CardDescription className="text-xs">{question.topic}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 pt-2">
                <p className="text-sm font-medium leading-7">{question.q}</p>
                <div className="grid gap-2 sm:grid-cols-2">
                  {question.options.map((o, i) => {
                    const chosen = picked === i;
                    const correct = i === question.correct;
                    const show = picked !== null;
                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setPicked(i)}
                        disabled={show}
                        className={`flex items-center justify-between gap-2 rounded-lg border px-3 py-2 text-start text-xs transition-colors ${
                          show && correct
                            ? "border-emerald-500/60 bg-emerald-500/10"
                            : show && chosen
                              ? "border-destructive/60 bg-destructive/10"
                              : "border-border hover:border-brand/50"
                        }`}
                      >
                        <span>{o}</span>
                        {show && correct && <CheckCircle2 className="size-4 shrink-0 text-emerald-500" />}
                        {show && chosen && !correct && <XCircle className="size-4 shrink-0 text-destructive" />}
                      </button>
                    );
                  })}
                </div>
                {picked !== null && (
                  <p className="rounded-lg bg-secondary/60 px-3 py-2 text-xs leading-6 text-muted-foreground">
                    {question.why}
                  </p>
                )}
                {picked !== null && (
                  <Button variant="outline" size="sm" onClick={() => setPicked(null)}>
                    دوباره امتحان کن
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* ستون کناری */}
        <div className="space-y-4">
          {/* پیشرفت امروز */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">پیشرفت امروز</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-2">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>یادگیری</span>
                <span className="font-bold text-foreground">
                  {fa(Math.round(learned * 10) / 10)} از {fa(target)} ساعت
                </span>
              </div>
              <Progress value={pct} showValue={false} size="sm" />
              <div className="flex items-center justify-between rounded-lg border border-border px-3 py-2 text-xs">
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <Timer className="size-3.5" /> پومودورو امروز
                </span>
                <span className="font-semibold">
                  {mounted ? `${fa(pT.n)} سشن · ${fa(pT.min)} دقیقه` : "—"}
                </span>
              </div>
              <Link href="/pomodoro">
                <Button variant="brand" size="sm" className="w-full">
                  شروع سشن تمرکز
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* استریک */}
          <Card className={streak.current > 0 ? "border-brand/50 bg-brand/5" : ""}>
            <CardContent className="flex items-center gap-4 pt-5">
              <span className="flex size-11 items-center justify-center rounded-xl bg-brand/15 text-brand">
                <Flame className="size-6" />
              </span>
              <div className="flex-1">
                <div className="text-xl font-black">{fa(streak.current)} روز پیوسته</div>
                <div className="text-[11px] text-muted-foreground">بهترین: {fa(streak.best)} روز</div>
              </div>
              <Link href="/achievements" className="text-xs font-medium text-brand hover:underline">
                نشان‌ها ←
              </Link>
            </CardContent>
          </Card>

          {/* نزدیک‌ترین مهلت‌ها */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm">
                <CalendarClock className="size-4 text-brand" /> نزدیک‌ترین مهلت‌ها
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 pt-2">
              {upcoming.map(({ ev, diff }) => (
                <div key={ev.id} className="flex items-center justify-between gap-2 rounded-lg border border-border px-3 py-2 text-xs">
                  <span className="min-w-0 flex-1 truncate">{ev.title}</span>
                  <Badge variant={diff <= 7 ? "destructive" : "secondary"} className="shrink-0">
                    {diff === 0 ? "امروز" : `${fa(diff)} روز`}
                  </Badge>
                </div>
              ))}
              {upcoming.length === 0 && (
                <div className="py-2 text-center text-xs text-muted-foreground">مهلتی باقی نمانده.</div>
              )}
              <Link href="/calendar" className="block text-center text-xs font-medium text-brand hover:underline">
                تقویم کامل ←
              </Link>
            </CardContent>
          </Card>

          {/* ابزارهای سریع */}
          <div className="grid grid-cols-2 gap-3">
            {QUICK_TOOLS.map((t) => (
              <Link key={t.href} href={t.href} className="group">
                <Card className="transition-all duration-200 group-hover:-translate-y-0.5 group-hover:border-brand/50">
                  <CardContent className="flex flex-col items-center gap-1.5 p-3 pt-3 text-center">
                    <t.Icon className="size-5 text-brand" />
                    <span className="text-[11px] font-bold">{t.label}</span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
