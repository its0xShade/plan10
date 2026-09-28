"use client";

import * as React from "react";
import { BookOpenText, Droplet, Minus, Moon, Plus, Search, Scale } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, BarChart, ScatterPlot, pearson } from "@/components/charts";
import {
  useStore,
  todayISO,
  weekDates,
  dayType,
  DAY_LABEL,
  shortDay,
  fromISO,
} from "@/lib/store";
import { useTargets, targetOfDay } from "@/lib/targets";
import { StreakChip } from "@/components/streak-achievements";
import { fa } from "@/lib/utils";
import Link from "next/link";

export interface DayLog {
  sl?: number; // خواب ساعت
  en?: number; // انرژی ۱-۵
  mo?: number; // روحیه ۱-۵
  lh?: number; // ساعت یادگیری
  wa?: number; // لیوان آب
  wt?: number; // وزن
  nt?: string; // یادداشت روز
}

type Logs = Record<string, DayLog>;

const N = 14;

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
            className={`size-8 rounded-lg border text-xs font-bold transition-colors ${
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

function NumInput({
  label,
  value,
  onChange,
  step = 1,
  min = 0,
  max = 24,
  suffix,
}: {
  label: string;
  value?: number;
  onChange: (v: number | undefined) => void;
  step?: number;
  min?: number;
  max?: number;
  suffix?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs text-muted-foreground">{label}</span>
      <span className="flex items-center gap-1.5">
        <input
          type="number"
          inputMode="decimal"
          value={value ?? ""}
          step={step}
          min={min}
          max={max}
          onChange={(e) => onChange(e.target.value === "" ? undefined : Number(e.target.value))}
          className="w-20 rounded-lg border border-border bg-background px-2 py-1.5 text-sm outline-none focus:border-brand/50"
          dir="ltr"
        />
        {suffix && <span className="text-xs text-muted-foreground">{suffix}</span>}
      </span>
    </label>
  );
}

export default function LogPage() {
  const [logs, setLogs] = useStore<Logs>("plan10.log", {});
  const [targets] = useTargets();
  const today = todayISO();
  const todayLog = logs[today] ?? {};
  const [journalQ, setJournalQ] = React.useState("");

  const set = (patch: Partial<DayLog>) =>
    setLogs((prev) => ({ ...prev, [today]: { ...prev[today], ...patch } }));

  const days = React.useMemo(() => {
    const out: string[] = [];
    const d = new Date();
    for (let i = N - 1; i >= 0; i--) {
      const x = new Date(d);
      x.setDate(d.getDate() - i);
      out.push(
        `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, "0")}-${String(x.getDate()).padStart(2, "0")}`,
      );
    }
    return out;
  }, []);

  const labels = days.map((iso) => shortDay(iso));
  const seriesMood = days.map((iso) => logs[iso]?.mo ?? null);
  const seriesEnergy = days.map((iso) => logs[iso]?.en ?? null);
  const seriesSleep = days.map((iso) => logs[iso]?.sl ?? null);
  const learnVals = days.map((iso) => logs[iso]?.lh ?? 0);
  const learnTargets = days.map((iso) => targetOfDay(dayType(fromISO(iso)), targets));
  const underIdx = days
    .map((iso, i) => ((logs[iso]?.lh ?? 0) < learnTargets[i] ? i : -1))
    .filter((i) => i >= 0);

  // آب ۷ روز
  const w7 = days.slice(-7);
  const waterVals = w7.map((iso) => logs[iso]?.wa ?? 0);

  // وزن
  const weightEntries = Object.entries(logs)
    .filter(([, v]) => typeof v.wt === "number")
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-16);
  const lastWeight = weightEntries.length ? (weightEntries[weightEntries.length - 1][1].wt as number) : null;

  // همبستگی روحیه/انرژی با ساعت یادگیری
  const pairs = Object.entries(logs).filter(
    ([, v]) => typeof v.mo === "number" && typeof v.en === "number" && typeof v.lh === "number",
  );
  const xs = pairs.map(([, v]) => ((v.mo as number) + (v.en as number)) / 2);
  const ys = pairs.map(([, v]) => v.lh as number);
  const r = pearson(xs, ys);
  const rLabel =
    r === null
      ? null
      : Math.abs(r) >= 0.6
        ? "همبستگی قوی"
        : Math.abs(r) >= 0.3
          ? "همبستگی متوسط"
          : "همبستگی ضعیف";
  const scatterPts = xs.map((x, i) => ({
    x,
    y: ys[i],
    title: `میانگین روحیه/انرژی ${x} — یادگیری ${ys[i]} ساعت`,
  }));

  // جستجوی یادداشت‌ها
  const journalHits = journalQ
    ? Object.entries(logs)
        .filter(([, v]) => v.nt && v.nt.includes(journalQ))
        .sort(([a], [b]) => b.localeCompare(a))
    : [];

  const dt = dayType();
  const week = weekDates();
  const weekLearn = week.reduce((a, iso) => a + (logs[iso]?.lh ?? 0), 0);
  const weekTarget = week.reduce((a, iso) => a + targetOfDay(dayType(fromISO(iso)), targets), 0);

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center gap-3">
        <BookOpenText className="size-7 text-brand" />
        <div>
          <h1 className="text-2xl font-bold">لاگ روزانه</h1>
          <p className="text-sm text-muted-foreground">خواب، انرژی، روحیه، یادگیری، آب، وزن و یادداشت روز — همه خودکار ذخیره می‌شود</p>
        </div>
        <StreakChip />
        <Badge variant="secondary" className="ms-auto">
          امروز: {DAY_LABEL[dt]} — هدف {fa(targetOfDay(dt, targets))} ساعت
        </Badge>
      </header>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* فرم امروز */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">امروز را ثبت کن</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap items-end gap-4">
              <NumInput label="خواب (دیشب)" value={todayLog.sl} onChange={(v) => set({ sl: v })} step={0.5} max={14} suffix="ساعت" />
              <NumInput label="ساعت یادگیری" value={todayLog.lh} onChange={(v) => set({ lh: v })} step={0.5} max={24} suffix="ساعت" />
              <NumInput label="وزن" value={todayLog.wt} onChange={(v) => set({ wt: v })} step={0.1} max={250} min={20} suffix="کیلو" />
            </div>

            <div className="flex flex-wrap gap-6">
              <Scale15 label="انرژی" value={todayLog.en} onPick={(v) => set({ en: v })} />
              <Scale15 label="روحیه" value={todayLog.mo} onPick={(v) => set({ mo: v })} />
            </div>

            <div className="flex items-center justify-between rounded-lg border border-border px-3 py-2">
              <span className="flex items-center gap-2 text-sm">
                <Droplet className="size-4 text-sky-400" />
                آب امروز: <b>{fa(todayLog.wa ?? 0)}</b> از {fa(8)} لیوان
              </span>
              <span className="flex gap-1.5">
                <Button
                  variant="outline"
                  size="icon"
                  className="size-7"
                  onClick={() => set({ wa: Math.max(0, (todayLog.wa ?? 0) - 1) })}
                  aria-label="کم"
                >
                  <Minus className="size-3.5" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="size-7"
                  onClick={() => set({ wa: Math.min(20, (todayLog.wa ?? 0) + 1) })}
                  aria-label="زیاد"
                >
                  <Plus className="size-3.5" />
                </Button>
              </span>
            </div>

            <div>
              <span className="mb-1 block text-xs text-muted-foreground">
                <Moon className="inline size-3" /> یادداشت روز (جستجو بعدی دارد)
              </span>
              <textarea
                value={todayLog.nt ?? ""}
                onChange={(e) => set({ nt: e.target.value })}
                rows={3}
                placeholder="امروز چه گذشت؟ چه یاد گرفتی؟ الگویی دیدی؟"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm leading-7 outline-none focus:border-brand/50"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-secondary/60 px-3 py-2 text-xs leading-6 text-muted-foreground">
              <span>
                این هفته: <b className="text-foreground">{fa(Math.round(weekLearn * 10) / 10)}</b> از{" "}
                <b className="text-foreground">{fa(weekTarget)}</b> ساعت هدف
              </span>
              <Link href="/settings" className="font-medium text-brand hover:underline">
                تنظیم اهداف ←
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* نمودارها */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">روحیه و انرژی ({fa(N)} روز اخیر — از ۵)</CardTitle>
            </CardHeader>
            <CardContent>
              <LineChart
                labels={labels}
                min={0}
                max={5.5}
                series={[
                  { name: "روحیه", color: "var(--brand)", values: seriesMood },
                  { name: "انرژی", color: "#38bdf8", values: seriesEnergy },
                ]}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">خواب (ساعت)</CardTitle>
            </CardHeader>
            <CardContent>
              <LineChart
                labels={labels}
                min={0}
                max={Math.max(9, ...seriesSleep.filter((v): v is number => v != null))}
                series={[{ name: "خواب", color: "#a78bfa", values: seriesSleep }]}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">ساعت یادگیری روزانه — قرمز = زیر هدف همون روز</CardTitle>
        </CardHeader>
        <CardContent>
          <BarChart labels={labels} values={learnVals} highlight={underIdx} />
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">آب ({fa(7)} روز — هدف ۸)</CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart labels={w7.map((i) => shortDay(i))} values={waterVals} color="#38bdf8" height={90} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">
              <Scale className="inline size-4" /> روند وزن
            </CardTitle>
          </CardHeader>
          <CardContent>
            {lastWeight !== null && (
              <div className="mb-1 text-xs text-muted-foreground">
                آخرین: <b className="text-foreground">{fa(lastWeight)}</b> کیلو — پایه‌گیری تا عید، بعد کات
              </div>
            )}
            <LineChart
              labels={weightEntries.map(([iso]) => shortDay(iso))}
              min={Math.min(...(weightEntries.map(([, v]) => v.wt as number).length ? weightEntries.map(([, v]) => v.wt as number) : [70])) - 1}
              max={Math.max(...(weightEntries.map(([, v]) => v.wt as number).length ? weightEntries.map(([, v]) => v.wt as number) : [70])) + 1}
              series={[{ name: "وزن (کیلو)", color: "#34d399", values: weightEntries.map(([, v]) => v.wt ?? null) }]}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">همبستگی روحیه/انرژی ← ساعت یادگیری</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-1 text-xs text-muted-foreground">
              {r === null ? (
                "حداقل ۳ روز با ثبت کامل لازمه."
              ) : (
                <>
                  r = <b className="text-foreground">{fa(Math.round(Math.abs(r) * 100) / 100)}</b> — {rLabel}{" "}
                  {r >= 0 ? "(رو به بالا ↑)" : "(رو به پایین ↓)"}
                </>
              )}
            </div>
            <ScatterPlot points={scatterPts} xLabel="روحیه/انرژی (۱–۵)" yLabel="ساعت یادگیری" />
          </CardContent>
        </Card>
      </div>

      {/* جستجوی یادداشت‌ها */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">جستجو در یادداشت‌های روزانه</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="relative">
            <Search className="absolute end-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={journalQ}
              onChange={(e) => setJournalQ(e.target.value)}
              placeholder="مثلاً: JWT، باگ، ورزش…"
              className="w-full rounded-lg border border-border bg-background pe-8 ps-3 py-2 text-sm outline-none focus:border-brand/50"
            />
          </div>
          {journalQ &&
            (journalHits.length === 0 ? (
              <div className="py-3 text-center text-sm text-muted-foreground">یادداشتی با این عبارت پیدا نشد.</div>
            ) : (
              <div className="space-y-2">
                {journalHits.map(([iso, v]) => (
                  <div key={iso} className="rounded-lg border border-border px-3 py-2 text-sm leading-7">
                    <span className="me-2 text-xs text-muted-foreground">{iso}</span>
                    {v.nt}
                  </div>
                ))}
              </div>
            ))}
          {!journalQ && (
            <div className="py-2 text-center text-xs text-muted-foreground">
              {fa(Object.values(logs).filter((v) => v.nt).length)} یادداشت ثبت شده — عبارتی بنویس تا پیدا کنی.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
