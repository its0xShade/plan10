import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  Brain,
  CalendarDays,
  FileText,
  Flame,
  Map,
  NotebookPen,
  ShieldCheck,
  Wrench,
  Timer,
  Layers,
  Type,
  Trophy,
  CalendarCheck,
} from "lucide-react";
import { DashboardStats } from "@/components/blocks/dashboard-stats";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {  } from "@/components/ui/progress";
import { ProgressRing } from "@/components/animations/progress-ring";
import { GridBackground } from "@/components/backgrounds/grid";
import { SpotlightBackground } from "@/components/backgrounds/spotlight";
import { Stepper } from "@/components/ui/stepper";
import { listDocs, getRoadmap } from "@/lib/content";
import { fa } from "@/lib/utils";
import { DayTypeBadge, ScheduleCards, WeeklyHoursWarning } from "@/components/today-panel";
import { RoadmapWidget, WeekCompare, LogTrendCharts, WeekGoalsCard } from "@/components/dashboard-widgets";
import { StreakChip } from "@/components/streak-achievements";

const START = new Date("2026-09-22T00:00:00");
const END = new Date("2027-06-21T00:00:00");

const PHASES = [
  { label: "مهر–آبان", description: "میان‌بُر پایتون + Git" },
  { label: "آذر", description: "الگوریتم + لینوکس + VPS" },
  { label: "دی–بهمن", description: "FastAPI + دیتابیس + Auth" },
  { label: "اسفند", description: "Docker + CI/CD + پرتفولیو" },
  { label: "فروردین–اردیبهشت", description: "درآمد + شروع کنکور" },
  { label: "خرداد–تیر", description: "معدل ← کنکور ← ۲۰ میلیون" },
];

function phaseIndex(d: Date): number {
  if (d < new Date("2026-11-22")) return 0;
  if (d < new Date("2026-12-22")) return 1; // آذر
  if (d < new Date("2027-02-19")) return 2; // دی–بهمن
  if (d < new Date("2027-03-21")) return 3; // اسفند
  if (d < new Date("2027-05-22")) return 4; // فروردین–اردیبهشت
  return 5;
}

/** نوار دسترسی سریع — زیر هیرو */
const QUICK: { href: string; label: string; hint: string; Icon: React.ComponentType<{ className?: string }> }[] = [
  { href: "/today", label: "امروز", hint: "همه‌چیز یک‌جا", Icon: CalendarCheck },
  { href: "/roadmap", label: "رودمپ", hint: "۱۱۰ آیتم · ۸ سطح", Icon: Map },
  { href: "/quiz", label: "کوییز", hint: "هر روز", Icon: Brain },
  { href: "/log", label: "لاگ", hint: "هر شب", Icon: NotebookPen },
  { href: "/pomodoro", label: "پومودورو", hint: "۲۵ دقیقه", Icon: Timer },
  { href: "/flashcards", label: "فلش‌کارت", hint: "مرور SRS", Icon: Layers },
  { href: "/typing", label: "تایپ", hint: "تست WPM", Icon: Type },
  { href: "/achievements", label: "نشان‌ها", hint: "استریک و مدال", Icon: Trophy },
  { href: "/calendar", label: "تقویم", hint: "مهلت‌ها", Icon: CalendarDays },
  { href: "/docs", label: "مستندات", hint: "۱۰ سند", Icon: BookOpen },
  { href: "/tools", label: "ابزارها", hint: "۱۴ ابزار", Icon: Wrench },
];

export default function Home() {
  const now = new Date();
  const elapsed = Math.min(100, Math.max(0, ((now.getTime() - START.getTime()) / (END.getTime() - START.getTime())) * 100));
  const daysLeft = Math.max(0, Math.ceil((END.getTime() - now.getTime()) / 86400000));
  const docs = listDocs();
  const phase = PHASES[phaseIndex(now)];

  return (
    <div className="space-y-6">
      {/* هیرو — ستون محتوا + پنل شیشه‌ای پیشرفت */}
      <section className="relative overflow-hidden rounded-2xl border border-border bg-card">
        <SpotlightBackground />
        <GridBackground />
        {/* درخشش گرادیان گوشه‌ها */}
        <span className="pointer-events-none absolute -top-24 start-1/4 size-64 rounded-full bg-brand/15 blur-3xl" />
        <span className="pointer-events-none absolute -bottom-28 -end-10 size-56 rounded-full bg-brand/10 blur-3xl" />
        <div className="relative grid gap-8 px-6 py-10 sm:px-10 sm:py-14 lg:grid-cols-[1.15fr_.85fr] lg:items-center">
          {/* سمت محتوا */}
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="brand">مهر ۱۴۰۵ ← تیر ۱۴۰۶</Badge>
              <Badge variant="secondary">۱۰ ماه · ~۴۱ ساعت در هفته</Badge>
              <DayTypeBadge />
              <StreakChip />
            </div>
            <h1 className="mt-4 max-w-2xl text-3xl font-black leading-tight sm:text-4xl lg:text-[2.6rem]">
              از دوازدهم تا{" "}
              <span className="bg-gradient-to-l from-brand via-brand to-emerald-400 bg-clip-text text-transparent">
                درآمد
              </span>{" "}
              — یک برنامه، پنج هدف
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
              بک‌اند پایتون روزی ۴.۷۵ ساعت، معدل بالای ۱۶ بدون کنکور تا فروردین، زبان و ورزش سرِ
              جای خودشون، و ماه دهم: {fa(20)} میلیون تومان درآمد.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/roadmap">
                <Button variant="brand">
                  رودمپ تعاملی
                  <ArrowLeft className="size-4" />
                </Button>
              </Link>
              <Link href="/docs/00-MASTER-PLAN">
                <Button variant="secondary">برنامه اصلی</Button>
              </Link>
              <Link href="/tools">
                <Button variant="ghost" className="text-muted-foreground">
                  همه ابزارها
                </Button>
              </Link>
            </div>
            <p className="mt-5 flex items-center gap-1.5 text-xs text-muted-foreground">
              <ShieldCheck className="size-3.5 text-brand" />
              همه‌چیز در مرورگر خودت ذخیره می‌شه — بدون حساب کاربری، بدون سرور.
            </p>
          </div>

          {/* پنل پیشرفت — شیشه‌ای */}
          <Card className="relative overflow-hidden border-border/70 bg-card/70 backdrop-blur-xl">
            <span className="absolute inset-x-0 top-0 h-px bg-gradient-to-l from-transparent via-brand to-transparent" />
            <CardHeader className="pb-1">
              <CardDescription className="text-xs font-semibold uppercase tracking-widest text-brand">
                پیشرفت برنامه
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-5 pt-2">
              <ProgressRing value={Math.round(elapsed)} size={148} stroke={11} label="سپری‌شده" />
              <dl className="w-full divide-y divide-border/70 text-sm">
                <div className="flex items-center justify-between py-2.5">
                  <dt className="text-muted-foreground">فاز فعلی</dt>
                  <dd className="flex items-center gap-2 font-semibold">
                    {phase.label}
                    <span className="text-xs font-normal text-muted-foreground">{phase.description}</span>
                  </dd>
                </div>
                <div className="flex items-center justify-between py-2.5">
                  <dt className="text-muted-foreground">باقی‌مانده تا پایان</dt>
                  <dd className="font-semibold">{fa(daysLeft)} روز</dd>
                </div>
                <div className="flex items-center justify-between py-2.5">
                  <dt className="text-muted-foreground">هدف هفتگی</dt>
                  <dd className="font-semibold">{fa(41)} ساعت یادگیری</dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* دسترسی سریع */}
      <section>
        <div className="mb-3 flex items-center gap-3">
          <h2 className="text-sm font-bold text-muted-foreground">دسترسی سریع</h2>
          <span className="h-px flex-1 bg-border" />
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {QUICK.map((q) => (
            <Link key={q.href} href={q.href} className="group">
              <Card className="h-full transition-all duration-200 group-hover:-translate-y-0.5 group-hover:border-brand/50 group-hover:shadow-lg group-hover:shadow-brand/5">
                <CardContent className="flex flex-col gap-3 p-5 pt-5">
                  <span className="flex size-10 items-center justify-center rounded-xl bg-brand/10 text-brand transition-all group-hover:scale-110 group-hover:bg-brand group-hover:text-brand-foreground">
                                      <q.Icon className="size-5" />
                  </span>
                  <div className="leading-tight">
                    <div className="text-sm font-bold">{q.label}</div>
                    <div className="text-xs text-muted-foreground">{q.hint}</div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* KPI ها */}
      <DashboardStats
        items={[
          { label: "یادگیری بک‌اند در هفته", value: fa(41), unit: "ساعت", delta: 0, trend: [12, 18, 22, 30, 34, 38, 41] },
          { label: "هدف درآمد ماه دهم", value: fa(20), unit: "میلیون تومان", trend: [0, 0, 2, 5, 10, 15, 20] },
          { label: "ساعت تجمعی تا پایان", value: fa(1600), unit: "ساعت", trend: [40, 160, 340, 560, 900, 1250, 1600] },
          { label: "زمان باقی‌مانده", value: fa(daysLeft), unit: "روز" },
        ]}
      />

      {/* هشدار زیر هدف هفتگی */}
      <WeeklyHoursWarning />

      {/* ویجت‌های زنده: رودمپ، مقایسه هفته، نمودارهای لاگ */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <RoadmapWidget sections={getRoadmap()} />
        </div>
        <div className="space-y-6">
          <WeekCompare />
          <LogTrendCharts />
        </div>
      </div>

      {/* فازها */}
      <Card>
        <CardHeader>
          <CardTitle>شش فاز برنامه</CardTitle>
          <CardDescription>مرحله فعلی با رنگ مشخص شده — از مهر تا کنکور</CardDescription>
        </CardHeader>
        <CardContent>
          <Stepper steps={PHASES} current={phaseIndex(now)} orientation="horizontal" />
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* پیشرفت زمانی */}
        <Card>
          <CardHeader>
            <CardTitle>پیشرفت زمانی برنامه</CardTitle>
            <CardDescription>از ۱ مهر ۱۴۰۵ تا پایان کنکور</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <ProgressRing value={Math.round(elapsed)} size={140} stroke={10} label="سپری‌شده" />
            <div className="w-full">
              <WeekGoalsCard />
            </div>
          </CardContent>
        </Card>

        <ScheduleCards />
      </div>

      {/* مستندات */}
      <section>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold">مستندات برنامه</h2>
            <Badge variant="outline">{fa(docs.length)} فایل</Badge>
          </div>
          <Link
            href="/docs"
            className="inline-flex items-center gap-1 text-sm font-medium text-brand hover:underline"
          >
            مشاهده همه در صفحه مستندات
            <ArrowLeft className="size-3.5" />
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {docs.map((d) => (
            <Link key={d.slug} href={`/docs/${d.slug}`} className="group">
              <Card className="relative h-full overflow-hidden transition-all duration-200 group-hover:-translate-y-0.5 group-hover:border-brand/50 group-hover:shadow-xl group-hover:shadow-brand/5">
                <span className="absolute inset-x-0 top-0 h-0.5 origin-right scale-x-0 bg-gradient-to-l from-brand to-transparent transition-transform duration-300 group-hover:scale-x-100" />
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{d.persianTitle}</CardTitle>
                    <FileText className="size-4 text-muted-foreground transition-colors group-hover:text-brand" />
                  </div>
                  <CardDescription className="text-xs">{d.description}</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <span className="inline-flex items-center gap-1 text-xs text-brand opacity-0 transition-opacity group-hover:opacity-100">
                    باز کردن <ArrowLeft className="size-3" />
                  </span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* خطوط قرمز */}
      <Card className="border-brand/30 bg-brand/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Flame className="size-4 text-brand" /> خطوط قرمز — غیرقابل مذاکره
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 text-sm">
            <Badge variant="outline">موبایل ≤ {fa(20)} دقیقه/روز</Badge>
            <Badge variant="outline">بدون اینستاگرام</Badge>
            <Badge variant="outline">خواب {fa(7)} ساعت</Badge>
            <Badge variant="outline">هر روز یک commit</Badge>
            <Badge variant="outline">بازبینی پنجشنبه‌ها</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
