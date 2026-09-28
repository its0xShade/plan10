"use client";

import * as React from "react";
import { useMounted } from "@/lib/use-mounted";
import { Type, RotateCcw, Play, Trophy } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { TYPING_TEXTS, MODE_LABEL, type TypingMode } from "@/lib/typing-texts";
import { useStore } from "@/lib/store";
import { fa } from "@/lib/utils";

interface TypingBest {
  best?: { fa?: number; en?: number };
}

const DURATIONS = [30, 60, 120];
const pickText = (mode: TypingMode) => {
  const arr = TYPING_TEXTS[mode];
  return arr[Math.floor(Math.random() * arr.length)];
};

export default function TypingPage() {
  const [typing, setTyping] = useStore<TypingBest>("plan10.typing", {});
  const [mode, setMode] = React.useState<TypingMode>("fa");
  const [duration, setDuration] = React.useState(60);
  const [phase, setPhase] = React.useState<"idle" | "run" | "done">("idle");
  const [text, setText] = React.useState(() => pickText("fa"));
  const [value, setValue] = React.useState("");
  const [left, setLeft] = React.useState(60);
  const [startedAt, setStartedAt] = React.useState<number | null>(null);
  const mounted = useMounted();

  const chars = React.useMemo(() => [...text], [text]);
  const typed = [...value];

  const correct = typed.filter((c, i) => c === chars[i]).length;
  const accuracy = typed.length ? Math.round((correct / typed.length) * 100) : 100;
  const elapsedMin = startedAt ? Math.max((duration - left) / 60000, 1 / 60) : 0;
  const liveWpm = startedAt ? Math.round((correct / 5) / Math.max(elapsedMin, 1 / 60)) : 0;

  const finish = React.useCallback(() => {
    setPhase("done");
    const wpm = Math.round(correct / 5 / Math.max((duration || 1) / 60, 1 / 60));
    setTyping((prev) => {
      const best = { ...(prev.best ?? {}) };
      if ((best[mode] ?? 0) < wpm) best[mode] = wpm;
      return { ...prev, best };
    });
    setLeft(0);
  }, [correct, duration, mode, setTyping]);

  // شمارش معکوس
  React.useEffect(() => {
    if (phase !== "run") return;
    const id = window.setInterval(() => {
      if (startedAt === null) return;
      const elapsed = (Date.now() - startedAt) / 1000;
      const remain = Math.max(0, duration - elapsed);
      setLeft(Math.ceil(remain));
      if (remain <= 0) finish();
    }, 200);
    return () => window.clearInterval(id);
  }, [phase, startedAt, duration, finish]);


  const start = () => {
    setText(pickText(mode));
    setValue("");
    setLeft(duration);
    setStartedAt(null);
    setPhase("run");
    window.setTimeout(() => document.getElementById("typing-input")?.focus(), 50);
  };

  const onChange = (v: string) => {
    if (phase !== "run") return;
    if (startedAt === null) setStartedAt(Date.now());
    const clean = v.replace(/\n/g, "");
    setValue(clean);
    if ([...clean].length >= chars.length) finish();
  };

  const best = typing.best?.[mode] ?? 0;
  const isRun = phase === "run";
  const isDone = phase === "done";
  const finalWpm = isDone ? Math.round(correct / 5 / Math.max(duration / 60, 1 / 60)) : 0;

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center gap-3">
        <Type className="size-7 text-brand" />
        <div>
          <h1 className="text-2xl font-bold">تست سرعت تایپ</h1>
          <p className="text-sm text-muted-foreground">
            فارسی یا انگلیسی — دقت را حفظ کن، سرعت خودش می‌آید
          </p>
        </div>
        <Badge variant="secondary" className="ms-auto">
          بهترین شما: {mounted ? `${fa(best)} WPM` : "…"}
        </Badge>
      </header>

      {/* تنظیمات */}
      {!isRun && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">تنظیمات</CardTitle>
            <CardDescription className="text-xs">زبان و مدت را انتخاب کن</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap items-center gap-6 pt-2">
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">زبان:</span>
              {(Object.keys(TYPING_TEXTS) as TypingMode[]).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMode(m)}
                  disabled={isDone}
                  className={`rounded-lg border px-3 py-1.5 text-sm transition-colors disabled:opacity-50 ${
                    mode === m ? "border-brand bg-brand/10 text-brand" : "border-border hover:border-brand/50"
                  }`}
                >
                  {MODE_LABEL[m]}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">مدت:</span>
              {DURATIONS.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDuration(d)}
                  disabled={isDone}
                  className={`rounded-lg border px-3 py-1.5 text-sm transition-colors disabled:opacity-50 ${
                    duration === d ? "border-brand bg-brand/10 text-brand" : "border-border hover:border-brand/50"
                  }`}
                >
                  {fa(d)} ثانیه
                </button>
              ))}
            </div>
            <Button variant="brand" onClick={start} className="ms-auto">
              {isDone ? <RotateCcw /> : <Play />}
              {isDone ? "دوباره" : "شروع"}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* نوار زنده */}
      {isRun && (
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: "زمان", value: `${fa(left)} ث` },
            { label: "سرعت (WPM)", value: fa(liveWpm) },
            { label: "دقت", value: `${fa(accuracy)}٪` },
            { label: "پیشرفت", value: `${fa(Math.min(100, Math.round((typed.length / chars.length) * 100)))}٪` },
          ].map((s) => (
            <Card key={s.label}>
              <CardContent className="py-4 text-center">
                <div className="text-xl font-black tabular-nums" dir="ltr">{s.value}</div>
                <div className="text-[10px] text-muted-foreground">{s.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* متن + ورودی */}
      {phase !== "idle" && (
        <Card className={isDone ? "border-brand/50" : ""}>
          <CardContent className="space-y-4 pt-5">
            <div
              className="rounded-xl border border-border bg-secondary/40 p-5 text-lg leading-9"
              style={{ fontFamily: mode === "fa" ? "var(--font-sans)" : "var(--font-mono)" }}
              aria-label="متن هدف"
            >
              {chars.map((c, i) => {
                let cls = "text-muted-foreground";
                if (i < typed.length) cls = typed[i] === c ? "text-foreground" : "bg-destructive/25 text-destructive rounded";
                else if (i === typed.length && isRun) cls = "border-b-2 border-brand text-foreground";
                return (
                  <span key={i} className={cls}>
                    {c}
                  </span>
                );
              })}
            </div>

            {isRun && (
              <textarea
                id="typing-input"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                autoFocus
                spellCheck={false}
                autoComplete="off"
                aria-label="اینجا تایپ کن"
                className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-base outline-none focus:border-brand/50"
                placeholder="شروع تایپ… (timer با اولین حرف شروع می‌شود)"
              />
            )}

            {isDone && (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  { label: "سرعت نهایی", value: `${fa(finalWpm)} WPM`, hot: finalWpm >= best },
                  { label: "دقت", value: `${fa(accuracy)}٪` },
                  { label: "کاراکتر صحیح", value: fa(correct) },
                  { label: "بهترین قبلی", value: `${fa(best)} WPM` },
                ].map((s) => (
                  <div key={s.label} className="rounded-xl border border-border bg-secondary/40 p-3 text-center">
                    <div className={`text-xl font-black ${s.hot ? "text-brand" : ""}`}>{s.value}</div>
                    <div className="text-[10px] text-muted-foreground">{s.label}</div>
                  </div>
                ))}
                {finalWpm > best && (
                  <div className="col-span-full flex items-center justify-center gap-2 rounded-xl bg-brand/10 py-2 text-sm font-bold text-brand">
                    <Trophy className="size-4" /> رکورد جدید ثبت شد!
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
