"use client";

import * as React from "react";
import { useMounted } from "@/lib/use-mounted";
import Link from "next/link";
import { ArrowDownLeft, ArrowUpRight, Minus, Map, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { LineChart, BarChart } from "@/components/shared/charts";
import { useStore, weekDates, shortDay, toISO } from "@/lib/store";
import type { DayLog } from "@/app/log/page";
import { fa } from "@/lib/utils";
import type { RoadmapLite } from "@/components/achievements/streak-achievements";
import { useTargets, weekTargetOf } from "@/lib/targets";

/* ————————————————— ویجت پیشرفت رودمپ برای صفحه اول ————————————————— */

export function RoadmapWidget({ sections }: { sections: RoadmapLite[] }) {
  const [done] = useStore<Record<string, boolean>>("roadmap-done-v1", {});
  const mounted = useMounted();

  const total = sections.reduce((a, s) => a + s.total, 0);
  const keys = Object.keys(done).filter((k) => done[k]);
  const perSection = sections.map((s) => ({
    ...s,
    done: keys.filter((k) => k.startsWith(s.title + "::")).length,
  }));
  const current = perSection.find((s) => s.done < s.total) ?? null;
  const pct = total ? Math.round((keys.length / total) * 100) : 0;

  return (
    <Card className="relative overflow-hidden">
      <span className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-l from-brand to-transparent" />
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <Map className="size-5 text-brand" /> پیشرفت رودمپ
          </CardTitle>
          <Link href="/roadmap" className="text-xs font-medium text-brand hover:underline">
            باز کردن ←
          </Link>
        </div>
        <CardDescription className="text-xs">
          {mounted ? (
            <>
              {fa(keys.length)} از {fa(total)} آیتم — {perSection.filter((s) => s.done >= s.total).length} سطح
              کامل
            </>
          ) : (
            "در حال بارگذاری…"
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 pt-2">
        <div className="flex items-center gap-3">
          <span className="text-3xl font-black text-brand">{mounted ? `${fa(pct)}٪` : "—"}</span>
          <div className="flex-1">
            <Progress value={mounted ? pct : 0} showValue={false} size="sm" />
          </div>
        </div>
        {current && (
          <div className="flex items-center justify-between rounded-lg border border-border bg-secondary/50 px-3 py-2 text-xs">
            <span className="text-muted-foreground">سطح فعلی:</span>
            <span className="font-semibold">{current.title}</span>
            <Badge variant="brand">
              {fa(current.done)}/{fa(current.total)}
            </Badge>
          </div>
        )}
        {mounted && perSection.every((s) => s.done >= s.total) && (
          <div className="rounded-lg bg-brand/10 px-3 py-2 text-center text-xs font-bold text-brand">
            رودمپ کامل شد — فاتح! 🏆
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/* ————————————————— مقایسه هفته با هفته ————————————————— */

function DeltaBadge({ now, prev, unit }: { now: number; prev: number; unit: string }) {
  const diff = Math.round((now - prev) * 10) / 10;
  const up = diff > 0;
  const flat = Math.abs(diff) < 0.05;
  return (
    <span
      className={`inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-[11px] font-bold ${
        flat
          ? "bg-secondary text-muted-foreground"
          : up
            ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
            : "bg-destructive/15 text-destructive"
      }`}
      title={`این هفته ${fa(now)} ${unit} — هفته قبل ${fa(prev)} ${unit}`}
    >
      {flat ? <Minus className="size-3" /> : up ? <ArrowUpRight className="size-3" /> : <ArrowDownLeft className="size-3" />}
      {flat ? "بدون تغییر" : `${up ? "+" : "−"}${fa(Math.abs(diff))} ${unit}`}
    </span>
  );
}

const avg = (arr: number[]) => (arr.length ? Math.round((arr.reduce((a, b) => a + b, 0) / arr.length) * 10) / 10 : 0);

/** کارت مقایسه این هفته در برابر هفته قبل — خواب، انرژی، ساعت یادگیری */
export function WeekCompare() {
  const [logs] = useStore<Record<string, DayLog>>("plan10.log", {});
  const mounted = useMounted();

  const thisWeek = weekDates();
  const prevDate = new Date();
  prevDate.setDate(prevDate.getDate() - 7);
  const prevWeek = weekDates(prevDate);

  const sumLh = (wk: string[]) => Math.round(wk.reduce((a, iso) => a + (logs[iso]?.lh ?? 0), 0) * 10) / 10;
  const avgField = (wk: string[], f: "sl" | "en") =>
    avg(wk.map((iso) => logs[iso]?.[f] ?? 0).filter((v) => v > 0));

  const rows = [
    { label: "ساعت یادگیری", now: sumLh(thisWeek), prev: sumLh(prevWeek), unit: "ساعت" },
    { label: "میانگین خواب", now: avgField(thisWeek, "sl"), prev: avgField(prevWeek, "sl"), unit: "ساعت" },
    { label: "میانگین انرژی", now: avgField(thisWeek, "en"), prev: avgField(prevWeek, "en"), unit: "از ۵" },
  ];

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <TrendingUp className="size-5 text-brand" /> این هفته در برابر هفته قبل
        </CardTitle>
        <CardDescription className="text-xs">بر اساس لاگ روزانه — فرق مثبت یعنی بهتر شدن</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3 pt-2 sm:grid-cols-3">
        {rows.map((r) => (
          <div key={r.label} className="rounded-xl border border-border bg-secondary/40 p-3">
            <div className="text-[11px] text-muted-foreground">{r.label}</div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl font-black">{mounted ? fa(r.now) : "—"}</span>
              <span className="text-[11px] text-muted-foreground">{r.unit}</span>
            </div>
            <div className="mt-1.5">
              {mounted ? (
                <DeltaBadge now={r.now} prev={r.prev} unit={r.unit === "از ۵" ? "" : r.unit} />
              ) : (
                <span className="text-[11px] text-muted-foreground">…</span>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

/* ————————————————— نمودارهای واقعی لاگ روی داشبورد ————————————————— */

const lastDays = (n: number): string[] => {
  const out: string[] = [];
  const d = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const x = new Date(d);
    x.setDate(d.getDate() - i);
    out.push(toISO(x));
  }
  return out;
};

/** سه نمودار لاگ: روحیه/انرژی، ساعت یادگیری ۷ روز، روند ۳۰ روز */
export function LogTrendCharts() {
  const [logs] = useStore<Record<string, DayLog>>("plan10.log", {});
  const mounted = useMounted();

  const w7 = lastDays(7);
  const m30 = lastDays(30);
  const labels7 = w7.map(shortDay);

  const mood = w7.map((iso) => logs[iso]?.mo ?? null);
  const energy = w7.map((iso) => logs[iso]?.en ?? null);
  const lh7 = w7.map((iso) => logs[iso]?.lh ?? 0);

  // ۳۰ روز → ۶ بلوک ۵ روزه برای خوانایی
  const blocks: { label: string; value: number }[] = [];
  for (let i = 0; i < 6; i++) {
    const chunk = m30.slice(i * 5, i * 5 + 5);
    const sum = chunk.reduce((a, iso) => a + (logs[iso]?.lh ?? 0), 0);
    blocks.push({ label: shortDay(chunk[0]), value: Math.round(sum * 10) / 10 });
  }

  const hasAny = Object.keys(logs).length > 0;

  if (!mounted || !hasAny) {
    return (
      <Card>
        <CardContent className="py-8 pt-8 text-center text-sm text-muted-foreground">
          {mounted
            ? "هنوز داده‌ای در لاگ نیست — امروز را ثبت کن تا نمودارها ساخته بشن."
            : "در حال بارگذاری نمودارها…"}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <Card>
        <CardHeader className="pb-1">
          <CardTitle className="text-sm">روحیه و انرژی — ۷ روز اخیر</CardTitle>
        </CardHeader>
        <CardContent>
          <LineChart
            labels={labels7}
            min={0}
            max={5.5}
            series={[
              { name: "روحیه", color: "var(--brand)", values: mood },
              { name: "انرژی", color: "#38bdf8", values: energy },
            ]}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-1">
          <CardTitle className="text-sm">ساعت یادگیری — ۷ روز اخیر</CardTitle>
        </CardHeader>
        <CardContent>
          <BarChart labels={labels7} values={lh7} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-1">
          <CardTitle className="text-sm">روند ۳۰ روز (بلوک ۵ روزه)</CardTitle>
        </CardHeader>
        <CardContent>
          <BarChart labels={blocks.map((b) => b.label)} values={blocks.map((b) => b.value)} color="#34d399" />
        </CardContent>
      </Card>
    </div>
  );
}

/* ————————————————— اهداف هفتگی قابل تنظیم (صفحه اول) ————————————————— */

export function WeekGoalsCard() {
  const [targets] = useTargets();
  const [logs] = useStore<Record<string, DayLog>>("plan10.log", {});
  const mounted = useMounted();

  const week = weekDates();
  const done = week.reduce((a, iso) => a + (logs[iso]?.lh ?? 0), 0);
  const goal = weekTargetOf(targets);
  const pct = goal ? Math.min(100, Math.round((done / goal) * 100)) : 0;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between text-sm">
          <span>اهداف هفتگی من</span>
          <Link href="/settings" className="text-xs font-medium text-brand hover:underline">
            ویرایش اهداف
          </Link>
        </CardTitle>
        <CardDescription className="text-xs">جای مقادیر ثابت — خودت تنظیمشان کن</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 pt-2">
        <div>
          <Progress
            label="بک‌اند (ساعت یادگیری ثبت‌شده)"
            value={mounted ? Math.round(done * 10) / 10 : 0}
            max={goal}
            showValue={false}
            size="sm"
          />
          <p className="mt-1 text-xs text-muted-foreground">
            {mounted ? `${fa(Math.round(done * 10) / 10)} از ${fa(goal)} ساعت` : "…"} — {fa(pct)}٪
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline">زبان: {fa(targets.lang)} ساعت/هفته</Badge>
          <Badge variant="outline">ورزش: {fa(targets.sport)} ساعت/هفته</Badge>
          <Badge variant="secondary">مدرسه: {fa(targets.school)} ساعت/روز</Badge>
        </div>
      </CardContent>
    </Card>
  );
}
