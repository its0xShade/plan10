"use client";

import * as React from "react";
import { useMounted } from "@/lib/use-mounted";
import Link from "next/link";
import {
  Flame,
  Lock,
  Trophy,
  BookOpen,
  Brain,
  Map as MapIcon,
  GraduationCap,
  Timer,
  PenLine,
  Type,
  Star,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useStore } from "@/lib/store";
import type { DayLog } from "@/app/log/page";
import { calcStreak } from "@/lib/streak";
import { usePomoLog } from "@/lib/pomo";
import { BOOKS_SEED } from "@/lib/data/books-data";
import { fa } from "@/lib/utils";

export interface RoadmapLite {
  title: string;
  total: number;
}

interface Facts {
  logDays: number;
  logNotes: number;
  totalLearn: number;
  streak: { current: number; best: number; todayPending: boolean };
  quizDays: number;
  roadmapDone: number;
  roadmapTotal: number;
  levelsDone: number;
  booksDone: number;
  booksTotal: number;
  pomoN: number;
  typingBest: number;
}

interface Ach {
  id: string;
  title: string;
  desc: string;
  Icon: React.ComponentType<{ className?: string }>;
  check: (f: Facts) => { on: boolean; prog?: [number, number] };
}

const ACHIEVEMENTS: Ach[] = [
  { id: "first-log", title: "اولین قدم", desc: "اولین روز ثبت‌شده در لاگ", Icon: PenLine,
    check: (f) => ({ on: f.logDays >= 1, prog: [Math.min(f.logDays, 1), 1] }) },
  { id: "streak-7", title: "هفته پیوسته", desc: "۷ روز متوالی ثبت", Icon: Flame,
    check: (f) => ({ on: f.streak.best >= 7, prog: [Math.min(f.streak.best, 7), 7] }) },
  { id: "streak-30", title: "ماه پیوسته", desc: "۳۰ روز متوالی ثبت", Icon: Flame,
    check: (f) => ({ on: f.streak.best >= 30, prog: [Math.min(f.streak.best, 30), 30] }) },
  { id: "streak-100", title: "صددروزه", desc: "۱۰۰ روز متوالی — اوج تعهد", Icon: Trophy,
    check: (f) => ({ on: f.streak.best >= 100, prog: [Math.min(f.streak.best, 100), 100] }) },
  { id: "log-50", title: "نیم‌سال ثبت", desc: "۵۰ روز لاگ", Icon: PenLine,
    check: (f) => ({ on: f.logDays >= 50, prog: [Math.min(f.logDays, 50), 50] }) },
  { id: "notes-10", title: "وقت‌شناس قلم", desc: "۱۰ یادداشت روزانه", Icon: Star,
    check: (f) => ({ on: f.logNotes >= 10, prog: [Math.min(f.logNotes, 10), 10] }) },
  { id: "learn-100", title: "صد ساعت", desc: "۱۰۰ ساعت یادگیری جمع‌شده", Icon: GraduationCap,
    check: (f) => ({ on: f.totalLearn >= 100, prog: [Math.min(f.totalLearn, 100), 100] }) },
  { id: "learn-500", title: "پانصد ساعت", desc: "۵۰۰ ساعت یادگیری جمع‌شده", Icon: GraduationCap,
    check: (f) => ({ on: f.totalLearn >= 500, prog: [Math.min(f.totalLearn, 500), 500] }) },
  { id: "quiz-first", title: "اولین کوییز", desc: "یک روز کوییز ثبت شد", Icon: Brain,
    check: (f) => ({ on: f.quizDays >= 1, prog: [Math.min(f.quizDays, 1), 1] }) },
  { id: "quiz-30", title: "۳۰ روز کوییز", desc: "۳۰ روز مرور روزانه", Icon: Brain,
    check: (f) => ({ on: f.quizDays >= 30, prog: [Math.min(f.quizDays, 30), 30] }) },
  { id: "roadmap-first", title: "اولین تیک", desc: "اولین آیتم رودمپ تیک خورد", Icon: MapIcon,
    check: (f) => ({ on: f.roadmapDone >= 1, prog: [Math.min(f.roadmapDone, 1), 1] }) },
  { id: "roadmap-25", title: "یک‌چهارم راه", desc: "۲۵ آیتم از رودمپ", Icon: MapIcon,
    check: (f) => ({ on: f.roadmapDone >= 25, prog: [Math.min(f.roadmapDone, 25), 25] }) },
  { id: "roadmap-50", title: "نصف راه", desc: "۵۰ آیتم از رودمپ", Icon: MapIcon,
    check: (f) => ({ on: f.roadmapDone >= 50, prog: [Math.min(f.roadmapDone, 50), 50] }) },
  { id: "roadmap-all", title: "فاتح رودمپ", desc: "هر ۱۱۰ آیتم تیک خورد", Icon: Trophy,
    check: (f) => ({ on: f.roadmapDone >= f.roadmapTotal && f.roadmapTotal > 0, prog: [f.roadmapDone, f.roadmapTotal] }) },
  { id: "level-complete", title: "سطح تمام‌شده", desc: "یک کل سطح رودمپ کامل شد", Icon: Star,
    check: (f) => ({ on: f.levelsDone >= 1, prog: [Math.min(f.levelsDone, 3), 3] }) },
  { id: "book-first", title: "اولین کتاب", desc: "یک کتاب تا ۱۰۰٪ خوانده شد", Icon: BookOpen,
    check: (f) => ({ on: f.booksDone >= 1, prog: [Math.min(f.booksDone, 1), 1] }) },
  { id: "books-3", title: "سه‌کتابی", desc: "۳ کتاب تمام‌شده", Icon: BookOpen,
    check: (f) => ({ on: f.booksDone >= 3, prog: [Math.min(f.booksDone, 3), 3] }) },
  { id: "pomo-1", title: "اولین سشن", desc: "یک سشن پومودورو کامل شد", Icon: Timer,
    check: (f) => ({ on: f.pomoN >= 1, prog: [Math.min(f.pomoN, 1), 1] }) },
  { id: "pomo-50", title: "پنجاه سشن", desc: "۵۰ سشن تمرکز کامل", Icon: Timer,
    check: (f) => ({ on: f.pomoN >= 50, prog: [Math.min(f.pomoN, 50), 50] }) },
  { id: "typing-40", title: "تایپیست", desc: "۴۰ کلمه در دقیقه در تست تایپ", Icon: Type,
    check: (f) => ({ on: f.typingBest >= 40, prog: [Math.min(f.typingBest, 40), 40] }) },
];

/** چیپ کوچک استریک — برای هدر صفحات */
export function StreakChip() {
  const [logs] = useStore<Record<string, DayLog>>("plan10.log", {});
  const mounted = useMounted();
  if (!mounted) return null;
  const s = calcStreak(logs);
  if (s.current === 0) return null;
  return (
    <Badge variant="brand" className="gap-1">
      <Flame className="size-3" /> {fa(s.current)} روز پیوسته
    </Badge>
  );
}

/** پنل کامل استریک + نشان‌ها */
export function AchievementPanel({ sections }: { sections: RoadmapLite[] }) {
  const [logs] = useStore<Record<string, DayLog>>("plan10.log", {});
  const [quiz] = useStore<Record<string, number>>("plan10.quiz", {});
  const [rdone] = useStore<Record<string, boolean>>("roadmap-done-v1", {});
  const [booksState] = useStore<{ prog: Record<string, number>; custom: { id: string }[] }>(
    "plan10.books",
    { prog: {}, custom: [] },
  );
  const [pomo] = usePomoLog();
  const [typing] = useStore<{ best?: { fa?: number; en?: number } }>("plan10.typing", {});
  const mounted = useMounted();

  const logEntries = Object.values(logs);
  const roadmapTotal = sections.reduce((a, s) => a + s.total, 0);
  const keys = Object.keys(rdone).filter((k) => rdone[k]);
  const levelsDone = sections.filter(
    (s) => keys.filter((k) => k.startsWith(s.title + "::")).length >= s.total,
  ).length;
  const booksDone = Object.values(booksState.prog).filter((v) => v >= 100).length;

  const facts: Facts = {
    logDays: logEntries.length,
    logNotes: logEntries.filter((l) => l.nt).length,
    totalLearn: Math.round(logEntries.reduce((a, l) => a + (l.lh ?? 0), 0)),
    streak: calcStreak(logs),
    quizDays: Object.keys(quiz).length,
    roadmapDone: keys.length,
    roadmapTotal,
    levelsDone,
    booksDone,
    booksTotal: BOOKS_SEED.length + booksState.custom.length,
    pomoN: Object.values(pomo).reduce((a, d) => a + (d.n ?? 0), 0),
    typingBest: Math.max(typing.best?.fa ?? 0, typing.best?.en ?? 0),
  };

  const unlocked = ACHIEVEMENTS.filter((a) => a.check(facts).on).length;

  if (!mounted) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Card key={i} className="h-32 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* کارت استریک */}
      <Card className={facts.streak.current > 0 ? "border-brand/50 bg-brand/5" : ""}>
        <CardContent className="flex flex-wrap items-center gap-5 pt-5">
          <span
            className={`flex size-16 shrink-0 items-center justify-center rounded-2xl ${
              facts.streak.current > 0 ? "bg-brand/15 text-brand" : "bg-secondary text-muted-foreground"
            }`}
          >
            <Flame className="size-8" />
          </span>
          <div className="min-w-0">
            <div className="text-3xl font-black">
              {fa(facts.streak.current)} <span className="text-base font-bold text-muted-foreground">روز پیوسته</span>
            </div>
            <div className="mt-1 text-sm text-muted-foreground">
              بهترین رکورد: {fa(facts.streak.best)} روز — {fa(facts.logDays)} روز ثبت‌شده در مجموع
            </div>
          </div>
          <div className="ms-auto flex flex-col items-end gap-2">
            {facts.streak.todayPending && (
              <Badge variant="destructive">امروز هنوز ثبت نشده</Badge>
            )}
            <Link href="/log" className="inline-flex min-h-8 items-center text-sm font-medium text-brand hover:underline">
              ثبت امروز ←
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* شمارنده نشان‌ها */}
      <div className="flex items-center gap-3">
        <h2 className="text-lg font-bold">نشان‌ها</h2>
        <Badge variant="brand">
          {fa(unlocked)} از {fa(ACHIEVEMENTS.length)}
        </Badge>
        <span className="h-px flex-1 bg-border" />
      </div>

      {/* شبکه نشان‌ها */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {ACHIEVEMENTS.map((a) => {
          const { on, prog } = a.check(facts);
          const pct = prog && prog[1] ? Math.min(100, Math.round((prog[0] / prog[1]) * 100)) : on ? 100 : 0;
          return (
            <Card
              key={a.id}
              className={`relative overflow-hidden transition-all ${
                on ? "border-brand/50 bg-brand/5" : "opacity-75"
              }`}
            >
              <CardContent className="flex h-full flex-col gap-3 p-4 pt-5">
                <div className="flex items-start justify-between">
                  <span
                    className={`flex size-10 items-center justify-center rounded-xl ${
                      on ? "bg-brand text-brand-foreground" : "bg-secondary text-muted-foreground"
                    }`}
                  >
                    {on ? <a.Icon className="size-5" /> : <Lock className="size-4" />}
                  </span>
                  {on && <Trophy className="size-4 text-brand" />}
                </div>
                <div>
                  <div className={`text-sm font-bold ${on ? "" : "text-muted-foreground"}`}>{a.title}</div>
                  <div className="mt-0.5 text-[11px] leading-5 text-muted-foreground">{a.desc}</div>
                </div>
                {prog && (
                  <div className="mt-auto">
                    <div className="mb-1 flex justify-between text-[11px] text-muted-foreground">
                      <span>{on ? "تمام شد ✓" : `${fa(prog[0])} از ${fa(prog[1])}`}</span>
                      <span>{fa(pct)}٪</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-secondary">
                      <div
                        className={`h-full rounded-full transition-all ${on ? "bg-brand" : "bg-muted-foreground/50"}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
