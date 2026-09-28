"use client";

import * as React from "react";
import { useMounted } from "@/lib/use-mounted";
import { Pause, Play, RotateCcw, SkipForward, Timer, Coffee, Flame } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { todayISO, toISO } from "@/lib/store";
import { fa } from "@/lib/utils";
import { usePomoLog, addSession, pomoToday, pomoTotal } from "@/lib/pomo";
import { showNotification } from "@/components/notify-engine";

const FOCUS_CHOICES = [15, 25, 50];
const BREAK_CHOICES = [5, 10];

const mmss = (s: number) => `${fa(Math.floor(s / 60))}:${fa(String(s % 60).padStart(2, "0"))}`;

/** تایمر پومودورو — سشن کامل = ثبت خودکار در لاگ (plan10.pomo) */
export function PomodoroTimer() {
  const [focusMin, setFocusMin] = React.useState(25);
  const [breakMin, setBreakMin] = React.useState(5);
  const [mode, setMode] = React.useState<"focus" | "break">("focus");
  const [left, setLeft] = React.useState(25 * 60);
  const [running, setRunning] = React.useState(false);
  const [doneFlash, setDoneFlash] = React.useState(false);
  const mounted = useMounted();
  const [pomo, setPomo] = usePomoLog();

  const totalSec = (mode === "focus" ? focusMin : breakMin) * 60;
  const progress = totalSec ? (totalSec - left) / totalSec : 0;

  // موتور زمان‌سنجی
  React.useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => {
      setLeft((v) => Math.max(0, v - 1));
    }, 1000);
    return () => window.clearInterval(id);
  }, [running]);

  // پایان سشن
  React.useEffect(() => {
    if (left !== 0 || !running) return;
    setRunning(false);
    setDoneFlash(true);
    window.setTimeout(() => setDoneFlash(false), 2500);

    if (mode === "focus") {
      // ثبت خودکار سشن کامل در لاگ
      setPomo((prev) => addSession(prev, toISO(new Date()), focusMin));
      showNotification(
        "سشن کامل شد ✓",
        `${fa(focusMin)} دقیقه تمرکز ثبت شد — ${fa(breakMin)} دقیقه استراحت.`,
        "pomo-done",
      ).catch(() => {});
      setMode("break");
      setLeft(breakMin * 60);
      setRunning(true); // استراحت خودکار شروع می‌شود
    } else {
      showNotification("استراحت تمام شد", "آماده سشن بعدی — برگرد پای کار.", "pomo-back").catch(() => {});
      setMode("focus");
      setLeft(focusMin * 60);
    }
  }, [left, running, mode, focusMin, breakMin, setPomo]);

  const reset = () => {
    setRunning(false);
    setMode("focus");
    setLeft(focusMin * 60);
  };

  const changeFocus = (m: number) => {
    setFocusMin(m);
    if (mode === "focus" && !running) setLeft(m * 60);
  };
  const changeBreak = (m: number) => {
    setBreakMin(m);
    if (mode === "break" && !running) setLeft(m * 60);
  };

  const skip = () => {
    setRunning(false);
    if (mode === "focus") {
      setMode("break");
      setLeft(breakMin * 60);
    } else {
      setMode("focus");
      setLeft(focusMin * 60);
    }
  };

  const iso = todayISO();
  const today = mounted ? pomoToday(pomo, iso) : { n: 0, min: 0 };
  const total = mounted ? pomoTotal(pomo) : { n: 0, min: 0 };

  const R = 108;
  const C = 2 * Math.PI * R;

  return (
    <div className="grid gap-4 lg:grid-cols-[1.2fr_.8fr]">
      <Card className={doneFlash ? "border-brand shadow-[0_0_0_1px_var(--brand)]" : ""}>
        <CardHeader className="pb-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Timer className="size-5 text-brand" /> تایمر تمرکز
            </CardTitle>
            <Badge variant={mode === "focus" ? "brand" : "secondary"}>
              {mode === "focus" ? (
                <span className="flex items-center gap-1">
                  <Flame className="size-3" /> تمرکز
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  <Coffee className="size-3" /> استراحت
                </span>
              )}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-5 pt-2">
          {/* حلقه زمان */}
          <div className="relative">
            <svg width="248" height="248" viewBox="0 0 248 248" className="-rotate-90">
              <circle cx="124" cy="124" r={R} fill="none" strokeWidth="12" className="stroke-secondary" />
              <circle
                cx="124"
                cy="124"
                r={R}
                fill="none"
                strokeWidth="12"
                strokeLinecap="round"
                className="stroke-brand transition-[stroke-dashoffset] duration-1000 ease-linear"
                strokeDasharray={C}
                strokeDashoffset={C * (1 - progress)}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-4xl font-black tabular-nums" dir="ltr">
                {mmss(left)}
              </div>
              <div className="mt-1 text-xs text-muted-foreground">
                {mode === "focus" ? "سشن تمرکز" : "استراحت کوتاه"}
              </div>
              {doneFlash && <div className="mt-2 text-xs font-bold text-brand">ثبت شد ✓</div>}
            </div>
          </div>

          {/* کنترل‌ها */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            <Button variant="brand" onClick={() => setRunning((r) => !r)} className="min-w-28">
              {running ? <Pause /> : <Play />}
              {running ? "مکث" : "شروع"}
            </Button>
            <Button variant="outline" onClick={reset}>
              <RotateCcw /> ریست
            </Button>
            <Button variant="ghost" onClick={skip} className="text-muted-foreground">
              <SkipForward /> رد کردن
            </Button>
          </div>

          {/* طول سشن‌ها */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs">
            <span className="flex items-center gap-1.5">
              <span className="text-muted-foreground">تمرکز:</span>
              {FOCUS_CHOICES.map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => changeFocus(m)}
                  disabled={running}
                  className={`rounded-md border px-2 py-1 transition-colors disabled:opacity-40 ${
                    focusMin === m ? "border-brand bg-brand/10 text-brand" : "border-border hover:border-brand/50"
                  }`}
                >
                  {fa(m)} دقیقه
                </button>
              ))}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="text-muted-foreground">استراحت:</span>
              {BREAK_CHOICES.map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => changeBreak(m)}
                  disabled={running}
                  className={`rounded-md border px-2 py-1 transition-colors disabled:opacity-40 ${
                    breakMin === m ? "border-brand bg-brand/10 text-brand" : "border-border hover:border-brand/50"
                  }`}
                >
                  {fa(m)} دقیقه
                </button>
              ))}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* آمار + قوانین */}
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-3">
          <Card>
            <CardContent className="pt-5 text-center">
              <div className="text-2xl font-bold text-brand">{mounted ? fa(today.n) : "—"}</div>
              <div className="text-[11px] text-muted-foreground">سشن امروز</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-5 text-center">
              <div className="text-2xl font-bold">{mounted ? fa(today.min) : "—"}</div>
              <div className="text-[11px] text-muted-foreground">دقیقه امروز</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-5 text-center">
              <div className="text-2xl font-bold">{mounted ? fa(total.n) : "—"}</div>
              <div className="text-[11px] text-muted-foreground">کل سشن‌ها</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">قانون پومودورو</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-xs leading-6 text-muted-foreground">
            <p>• هر سشن {fa(focusMin)} دقیقه تمرکز بدون وقفه — گوشی در جای دیگر.</p>
            <p>• استراحت {fa(breakMin)} دقیقه: بلند شو، آب بخور، چشم‌ها را استراحت بده.</p>
            <p>• سشن کامل‌شده خودکار در لاگ ثبت می‌شود؛ «رد کردن» ثبت نمی‌کند.</p>
            <p>• بعد از ۴ سشن، یک استراحت بلند {fa(15)}–{fa(30)} دقیقه‌ای.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
