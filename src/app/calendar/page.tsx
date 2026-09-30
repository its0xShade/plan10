"use client";

import * as React from "react";
import { AlertTriangle, CalendarDays, Download, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PLAN_EVENTS, buildICS, type PlanEvent } from "@/lib/data/events-data";
import { JALALI_MONTHS, toJalali } from "@/lib/jalali";
import { useStore } from "@/lib/store";
import { fa } from "@/lib/utils";

const CAT_CLS: Record<PlanEvent["cat"], string> = {
  کنکور: "border-sky-500/40 text-sky-500",
  معدل: "border-emerald-500/40 text-emerald-500",
  سربازی: "border-violet-500/40 text-violet-500",
  دانشگاه: "border-amber-500/40 text-amber-500",
  درآمد: "border-brand/50 text-brand",
  برنامه: "border-border text-muted-foreground",
};

export default function CalendarPage() {
  const [custom, setCustom] = useStore<PlanEvent[]>("plan10.events", []);
  const [title, setTitle] = React.useState("");
  const [jy, setJy] = React.useState(1405);
  const [jm, setJm] = React.useState(7);
  const [jd, setJd] = React.useState(1);

  const events = [...PLAN_EVENTS, ...custom].sort((a, b) =>
    `${a.j[0]}-${String(a.j[1]).padStart(2, "0")}-${String(a.j[2]).padStart(2, "0")}`.localeCompare(
      `${b.j[0]}-${String(b.j[1]).padStart(2, "0")}-${String(b.j[2]).padStart(2, "0")}`,
    ),
  );

  const groups = new Map<string, PlanEvent[]>();
  for (const ev of events) {
    const key = `${ev.j[0]} ${JALALI_MONTHS[ev.j[1] - 1]}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(ev);
  }

  const download = () => {
    const blob = new Blob([buildICS(events)], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "plan10.ics";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 3000);
  };

  const addEvent = () => {
    if (!title.trim()) return;
    setCustom([
      ...custom,
      {
        id: `custom-${Date.now()}`,
        title: title.trim(),
        j: [jy, jm, jd],
        cat: "برنامه",
      },
    ]);
    setTitle("");
  };

  const today = toJalali(new Date());
  const todayJ = `${today.jy}/${today.jm}/${today.jd}`;

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center gap-3">
        <CalendarDays className="size-7 text-brand" />
        <div>
          <h1 className="text-2xl font-bold">تقویم برنامه و مهلت‌ها</h1>
          <p className="text-sm text-muted-foreground">
            {fa(events.length)} رویداد شمسی — با دکمه زیر به تقویم گوشی اضافه کن (فایل .ics)
          </p>
        </div>
        <Button className="ms-auto" onClick={download}>
          <Download className="size-4" />
          دانلود فایل تقویم (.ics)
        </Button>
      </header>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">افزودن رویداد شخصی</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap items-end gap-3">
          <label className="min-w-52 flex-1">
            <span className="mb-1 block text-xs text-muted-foreground">عنوان</span>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addEvent()}
              placeholder="مثلاً: تحویل پروژه پایتون"
              className="w-full rounded-lg border border-border bg-background px-3 py-1.5 text-sm outline-none focus:border-brand/50"
            />
          </label>
          {(
            [
              ["سال", jy, setJy, 1404, 1410],
              ["ماه", jm, setJm, 1, 12],
              ["روز", jd, setJd, 1, 31],
            ] as const
          ).map(([label, val, setter, min, max]) => (
            <label key={label}>
              <span className="mb-1 block text-xs text-muted-foreground">{label}</span>
              <input
                type="number"
                value={val}
                min={min}
                max={max}
                onChange={(e) => setter(Number(e.target.value))}
                className="w-20 rounded-lg border border-border bg-background px-2 py-1.5 text-sm outline-none focus:border-brand/50"
                dir="ltr"
              />
            </label>
          ))}
          <Button onClick={addEvent}>
            <Plus className="size-4" />
            افزودن
          </Button>
          <span className="w-full text-[11px] text-muted-foreground">تاریخ امروز: {fa(todayJ)} (شمسی)</span>
        </CardContent>
      </Card>

      <div className="space-y-6">
        {[...groups.entries()].map(([month, list]) => (
          <div key={month}>
            <h2 className="mb-2 text-sm font-bold text-muted-foreground">{month}</h2>
            <div className="space-y-2">
              {list.map((ev) => (
                <Card key={ev.id}>
                  <CardContent className="flex flex-wrap items-center gap-3 pt-4">
                    <span className="flex size-11 shrink-0 flex-col items-center justify-center rounded-lg border border-border text-center leading-none">
                      <b className="text-sm">{fa(ev.j[2])}</b>
                      <span className="mt-0.5 text-[10px] text-muted-foreground">{JALALI_MONTHS[ev.j[1] - 1].slice(0, 4)}</span>
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-medium leading-6">{ev.title}</span>
                      {ev.note && <span className="block text-xs leading-6 text-muted-foreground">{ev.note}</span>}
                    </span>
                    <Badge variant="outline" className={CAT_CLS[ev.cat]}>
                      {ev.cat}
                    </Badge>
                    {ev.approx && (
                      <span className="flex items-center gap-1 text-[11px] text-amber-500">
                        <AlertTriangle className="size-3.5" />
                        تقریبی
                      </span>
                    )}
                    {ev.id.startsWith("custom-") && (
                      <button
                        type="button"
                        aria-label="حذف"
                        className="text-xs text-muted-foreground hover:text-destructive"
                        onClick={() => setCustom(custom.filter((c) => c.id !== ev.id))}
                      >
                        ✕
                      </button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs leading-6 text-muted-foreground">
        رخدادهایی که «تقریبی» علامت خورده‌اند (ثبت‌نام سنجش، کنکور، آزاد) را بعداً با تاریخ رسمی سایت‌های سنجش و
        azmoon اصلاح کن. فایل .ics در گوشی با «افزودن به تقویم» باز می‌شود.
      </p>
    </div>
  );
}
