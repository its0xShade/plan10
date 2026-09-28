"use client";

import * as React from "react";
import { useMounted } from "@/lib/use-mounted";
import { CalendarCheck, Dumbbell, Flame, Languages, Moon, Route, School, TriangleAlert } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  useStore,
  todayISO,
  weekDates,
  fromISO,
  dayType,
  DAY_LABEL,
  WEEKDAY_FA,
} from "@/lib/store";
import { useTargets, targetOfDay } from "@/lib/targets";
import { fa } from "@/lib/utils";
import type { DayLog } from "@/app/log/page";

const SCHOOL_DAY = [
  { time: "۷:۰۰ – ۱۴:۳۰", task: "مدرسه — سرمایه‌گذاری معدل", icon: School },
  { time: "۱۵:۰۰ – ۱۷:۳۰", task: "بک‌اند — سشن ۱ (۲.۵ ساعت)", icon: Route },
  { time: "۱۷:۳۰ – ۱۸:۱۵", task: "کالستنیکس (۴۵ دقیقه)", icon: Dumbbell },
  { time: "۱۹:۰۰ – ۲۱:۱۵", task: "بک‌اند — سشن ۲ (۲.۲۵ ساعت)", icon: Route },
  { time: "۲۱:۱۵ – ۲۱:۴۵", task: "زبان انگلیسی (۳۰ دقیقه)", icon: Languages },
  { time: "۲۳:۰۰", task: "خواب — ۷ ساعت غیرقابل مذاکره", icon: Moon },
];

const HOLIDAY = [
  { time: "۹:۰۰ – ۱۲:۰۰", task: "سشن ۱ (۳ ساعت)", icon: Route },
  { time: "۱۳:۳۰ – ۱۶:۳۰", task: "سشن ۲ (۳ ساعت)", icon: Route },
  { time: "۱۶:۳۰ – ۱۷:۱۵", task: "ورزش", icon: Dumbbell },
  { time: "۱۷:۱۵ – ۲۰:۱۵", task: "سشن ۳ + زبان (۳ ساعت)", icon: Languages },
  { time: "۲۰:۱۵", task: "بازبینی هفتگی (پنجشنبه)", icon: Flame },
];

/** نشان «امروز چه روزی است» — بعد از mount (تاریخ دستگاه) */
export function DayTypeBadge() {
  const mounted = useMounted();
  let txt: string | null = null;
  if (mounted) {
    const d = new Date();
    txt = `${WEEKDAY_FA[d.getDay()]} ${fa(
      new Intl.DateTimeFormat("fa-IR-u-ca-persian", { day: "numeric", month: "long" }).format(d),
    )} — ${DAY_LABEL[dayType(d)]}`;
  }
  if (!txt) return <Badge variant="brand">امروز…</Badge>;
  return <Badge variant="brand">{txt}</Badge>;
}

/** دو کارت برنامه روز — کارت امروز هایلایت می‌شود */
export function ScheduleCards() {
  const [targets] = useTargets();
  const mounted = useMounted();
  const active: "school" | "holiday" | null = mounted
    ? dayType() === "school" ? "school" : "holiday"
    : null;

  const card = (
    kind: "school" | "holiday",
    title: React.ReactNode,
    desc: string,
    rows: typeof SCHOOL_DAY,
  ) => (
    <Card className={active === kind ? "border-brand/60 shadow-[0_0_0_1px_var(--brand)]" : ""}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {title}
          {active === kind && (
            <Badge variant="brand" className="ms-auto">
              <CalendarCheck className="size-3" /> برنامه امروز
            </Badge>
          )}
        </CardTitle>
        <CardDescription>{desc}</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2.5">
          {rows.map((r) => (
            <li key={r.time} className="flex items-start gap-3 text-sm">
              <r.icon className="mt-1 size-4 shrink-0 text-muted-foreground" />
              <div>
                <div className="font-medium">{r.task}</div>
                <div className="text-xs text-muted-foreground">{r.time}</div>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );

  return (
    <>
      {card("school", <><School className="size-4 text-brand" /> روز مدرسه</>, `شنبه تا چهارشنبه — ۴.۷۵ ساعت بک‌اند · هدف خودت: ${fa(targets.school)} ساعت`, SCHOOL_DAY)}
      {card("holiday", <><Flame className="size-4 text-brand" /> روز تعطیل</>, `پنجشنه ${fa(targets.thu)} ساعت · جمعه ${fa(targets.fri)} ساعت — برنامه تو`, HOLIDAY)}
    </>
  );
}

/** هشدار زیر هدف هفتگی — قرمز وقتی کمتر از ۸۰٪ِ هدفِ سپری‌شده باشی */
export function WeeklyHoursWarning() {
  const [logs] = useStore<Record<string, DayLog>>("plan10.log", {});
  const [targets] = useTargets();
  const mounted = useMounted();
  if (!mounted) return null;

  const week = weekDates();
  const nowIso = todayISO();
  const elapsed = week.filter((iso) => iso <= nowIso);
  const done = week.reduce((a, iso) => a + (logs[iso]?.lh ?? 0), 0);
  const target = elapsed.reduce((a, iso) => a + targetOfDay(dayType(fromISO(iso)), targets), 0);
  const due = target * 0.8;
  const under = done < due;
  const pct = target ? Math.min(100, Math.round((done / target) * 100)) : 0;

  return (
    <Card className={under ? "border-destructive/60 bg-destructive/5" : "border-emerald-500/50 bg-emerald-500/5"}>
      <CardContent className="flex flex-wrap items-center gap-4 pt-5">
        <span
          className={`flex size-10 shrink-0 items-center justify-center rounded-full ${
            under ? "bg-destructive/15 text-destructive" : "bg-emerald-500/15 text-emerald-500"
          }`}
        >
          {under ? <TriangleAlert className="size-5" /> : <CalendarCheck className="size-5" />}
        </span>
        <div className="min-w-0 flex-1">
          <div className="text-sm font-bold">
            {under
              ? `هشدار: زیر هدف هفته — ${fa(Math.round(done * 10) / 10)} از ${fa(Math.round(due * 10) / 10)} ساعت لازم (تا امروز)`
              : `در مسیر هفته — ${fa(Math.round(done * 10) / 10)} از ${fa(Math.round(target * 10) / 10)} ساعت هدف کل`}
          </div>
          <div className="mt-1.5">
            <Progress
              value={pct}
              max={100}
              showValue={false}
              size="sm"
              className={under ? "[&>div]:bg-destructive" : ""}
            />
          </div>
        </div>
        <Badge variant={under ? "destructive" : "success"}>{fa(pct)}٪</Badge>
      </CardContent>
    </Card>
  );
}
