"use client";

import * as React from "react";
import { useMounted } from "@/lib/use-mounted";
import Link from "next/link";
import { Layers, RotateCcw, Eye, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { FLASHCARDS, DECKS, type DeckId, type FlashCard } from "@/lib/data/flashcards-data";
import { useStore, toISO, fromISO } from "@/lib/store";
import { fa } from "@/lib/utils";

interface SrsCard {
  ease: number; // ضریب سهولت ۱.۳ تا ۲.۸
  interval: number; // فاصله روز
  due: string; // ISO تاریخ بعدی مرور
  reps: number;
}
type SrsMap = Record<string, SrsCard>;

const KEY = "plan10.srs";
const todayISOStr = () => toISO(new Date());
const addDays = (iso: string, n: number) => {
  const d = fromISO(iso);
  d.setDate(d.getDate() + n);
  return toISO(d);
};

const GRADES = [
  { id: "again", label: "دوباره", hint: "فراموش کردم", cls: "border-destructive/50 text-destructive hover:bg-destructive/10" },
  { id: "hard", label: "سخت", hint: "با زحمت", cls: "border-border text-muted-foreground hover:border-brand/50" },
  { id: "good", label: "خوب", hint: "بلدم", cls: "border-brand/50 text-brand hover:bg-brand/10" },
  { id: "easy", label: "آسان", hint: "خیلی راحت", cls: "border-emerald-500/50 text-emerald-600 hover:bg-emerald-500/10" },
] as const;

type GradeId = (typeof GRADES)[number]["id"];

/** محاسبه برنامه بعدی — SM-2 سبک */
function schedule(cur: SrsCard | undefined, g: GradeId): SrsCard {
  const ease = cur?.ease ?? 2.5;
  const interval = cur?.interval ?? 0;
  const reps = cur?.reps ?? 0;
  const today = todayISOStr();

  if (g === "again") {
    return { ease: Math.max(1.3, ease - 0.2), interval: 0, due: today, reps: 0 };
  }
  if (g === "hard") {
    const next = reps === 0 ? 1 : Math.max(1, Math.round(interval * 1.2));
    return { ease: Math.max(1.3, ease - 0.15), interval: next, due: addDays(today, next), reps };
  }
  if (g === "good") {
    const next = reps <= 0 ? 1 : reps === 1 ? 3 : Math.max(4, Math.round(interval * ease));
    return { ease, interval: next, due: addDays(today, next), reps: reps + 1 };
  }
  const next = Math.max(2, Math.round((interval || 1) * 2));
  return { ease: Math.min(2.8, ease + 0.15), interval: next, due: addDays(today, next), reps: reps + 1 };
}

const nextLabel = (cur: SrsCard | undefined, g: GradeId): string => {
  const s = schedule(cur, g);
  if (s.interval === 0) return "همان امروز";
  if (s.interval === 1) return "فردا";
  return `${fa(s.interval)} روز بعد`;
};

export default function FlashcardsPage() {
  const [srs, setSrs] = useStore<SrsMap>(KEY, {});
  const [deck, setDeck] = React.useState<DeckId | null>(null);
  const [queue, setQueue] = React.useState<FlashCard[]>([]);
  const [idx, setIdx] = React.useState(0);
  const [revealed, setRevealed] = React.useState(false);
  const [reviewed, setReviewed] = React.useState(0);
  const mounted = useMounted();

  const today = todayISOStr();
  const dueCount = (d: DeckId) =>
    FLASHCARDS.filter((c) => c.deck === d && (!srs[c.id] || srs[c.id].due <= today)).length;
  const learnedCount = Object.values(srs).filter((s) => s.interval >= 7).length;
  const reviewedTotal = Object.keys(srs).length;

  const start = (d: DeckId) => {
    const list = FLASHCARDS.filter((c) => c.deck === d).sort((a, b) => {
      const da = srs[a.id]?.due ?? "0";
      const db = srs[b.id]?.due ?? "0";
      return da < db ? -1 : da > db ? 1 : 0;
    });
    const due = list.filter((c) => !srs[c.id] || srs[c.id].due <= today);
    setQueue(due.length ? due : list);
    setDeck(d);
    setIdx(0);
    setRevealed(false);
    setReviewed(0);
  };

  const grade = (g: GradeId) => {
    const card = queue[idx];
    if (!card) return;
    setSrs((prev) => ({ ...prev, [card.id]: schedule(prev[card.id], g) }));
    setReviewed((r) => r + 1);
    setRevealed(false);
    if (g === "again") {
      // کارت فراموش‌شده دوباره انتهای صف می‌رود
      setQueue((q) => [...q, card]);
    }
    setIdx((i) => i + 1);
  };

  const card = queue[idx];
  const finished = deck !== null && idx >= queue.length;
  const progress = queue.length ? Math.round((reviewed / (reviewed + (queue.length - idx))) * 100) : 0;

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center gap-3">
        <Layers className="size-7 text-brand" />
        <div>
          <h1 className="text-2xl font-bold">فلش‌کارت (SRS)</h1>
          <p className="text-sm text-muted-foreground">
            مرور فاصله‌دار — هر کارت در زمان مناسب برمی‌گردد؛ برنامه‌ریزی SM-2 سبک
          </p>
        </div>
        <Badge variant="secondary" className="ms-auto">
          {mounted ? `${fa(learnedCount)} یادگرفته` : "…"}
        </Badge>
      </header>

      {/* آمار سه‌تایی */}
      <div className="grid grid-cols-3 gap-3">
        <Card>
          <CardContent className="pt-5 text-center">
            <div className="text-2xl font-bold text-brand">
              {mounted ? fa(dueCount("backend") + dueCount("books")) : "—"}
            </div>
            <div className="text-[11px] text-muted-foreground">آماده مرور امروز</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 text-center">
            <div className="text-2xl font-bold">{mounted ? fa(learnedCount) : "—"}</div>
            <div className="text-[11px] text-muted-foreground">کارت تثبیت‌شده (≥۷ روز)</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 text-center">
            <div className="text-2xl font-bold">{mounted ? fa(reviewedTotal) : "—"}</div>
            <div className="text-[11px] text-muted-foreground">کارت دیده‌شده</div>
          </CardContent>
        </Card>
      </div>

      {/* انتخاب دک */}
      {deck === null && (
        <div className="grid gap-4 sm:grid-cols-2">
          {DECKS.map((d) => (
            <button key={d.id} type="button" onClick={() => start(d.id)} className="group text-start">
              <Card className="relative h-full overflow-hidden transition-all duration-200 group-hover:-translate-y-0.5 group-hover:border-brand/50 group-hover:shadow-xl group-hover:shadow-brand/5">
                <span className="absolute inset-x-0 top-0 h-0.5 origin-right scale-x-0 bg-gradient-to-l from-brand to-transparent transition-transform duration-300 group-hover:scale-x-100" />
                <CardContent className="p-5 pt-6">
                  <div className="flex items-center justify-between">
                    <span className="flex size-11 items-center justify-center rounded-xl bg-brand/10 text-brand transition-transform group-hover:scale-110">
                      <Layers className="size-5" />
                    </span>
                    <Badge variant="brand">{mounted ? `${fa(dueCount(d.id))} آماده` : "…"}</Badge>
                  </div>
                  <h2 className="mt-3 text-base font-bold">{d.title}</h2>
                  <p className="mt-1 text-xs text-muted-foreground">{d.desc}</p>
                  <p className="mt-3 text-[11px] text-muted-foreground">
                    {fa(FLASHCARDS.filter((c) => c.deck === d.id).length)} کارت
                  </p>
                </CardContent>
              </Card>
            </button>
          ))}
        </div>
      )}

      {/* جلسه مرور */}
      {deck !== null && !finished && card && (
        <Card>
          <CardHeader className="pb-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <CardTitle className="text-base">
                {DECKS.find((d) => d.id === deck)?.title}
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => setDeck(null)}>
                  <RotateCcw /> خروج
                </Button>
                <Badge variant="secondary">
                  {fa(idx + 1)} از {fa(queue.length + reviewed - idx > 0 ? queue.length : idx + 1)}
                </Badge>
              </div>
            </div>
            <Progress value={progress} showValue={false} size="sm" />
          </CardHeader>
          <CardContent className="space-y-4 pt-3">
            {/* کارت */}
            <div className="rounded-2xl border border-border bg-secondary/40 p-6 text-center" key={card.id + String(revealed)}>
              <div className="page-enter">
                {!revealed ? (
                  <>
                    <p className="text-base font-bold leading-8">{card.q}</p>
                    {card.hint && (
                      <p className="mt-3 text-xs text-muted-foreground">راهنما: {card.hint}</p>
                    )}
                  </>
                ) : (
                  <>
                    <p className="text-sm font-medium leading-8 text-foreground">{card.a}</p>
                    <p className="mt-3 text-xs text-muted-foreground">این پاسخ را چقدر بلد بودی؟</p>
                  </>
                )}
              </div>
            </div>

            {!revealed ? (
              <Button variant="brand" className="w-full" onClick={() => setRevealed(true)}>
                <Eye /> نمایش پاسخ
              </Button>
            ) : (
              <div className="grid grid-cols-4 gap-2">
                {GRADES.map((g) => (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => grade(g.id)}
                    className={`rounded-xl border px-2 py-3 text-center transition-colors ${g.cls}`}
                  >
                    <div className="text-sm font-bold">{g.label}</div>
                    <div className="mt-0.5 text-[10px] opacity-70">{nextLabel(srs[card.id], g.id)}</div>
                  </button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* پایان جلسه */}
      {deck !== null && finished && (
        <Card className="border-brand/50 bg-brand/5">
          <CardContent className="flex flex-col items-center gap-3 py-8 text-center">
            <Sparkles className="size-8 text-brand" />
            <div className="text-lg font-bold">جلسه مرور تمام شد ✓</div>
            <p className="text-sm text-muted-foreground">
              {fa(reviewed)} کارت مرور شد — کارت‌ها طبق برنامه برمی‌گردن.
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              <Button variant="brand" size="sm" onClick={() => start(deck)}>
                <RotateCcw /> مرور دوباره
              </Button>
              <Button variant="outline" size="sm" onClick={() => setDeck(null)}>
                انتخاب دک دیگر
              </Button>
            </div>
            <Link href="/today" className="text-xs text-muted-foreground hover:text-foreground">
              بازگشت به امروز ←
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
