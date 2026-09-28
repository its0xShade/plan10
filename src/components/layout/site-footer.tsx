"use client";

import * as React from "react";
import Link from "next/link";
import { Route, ArrowUp, ShieldCheck, HardDrive, WifiOff, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fa } from "@/lib/utils";
import { toJalali } from "@/lib/jalali";
import { DOC_LINKS, TOOL_LINKS } from "@/lib/data/nav-data";
import { InstallChip } from "@/components/shared/install-prompt";

/** پابرگ — چهار ستون مرتب + نوار پایین با تاریخ شمسی و برگشت به بالا. */
export function SiteFooter() {
  const now = new Date();
  const year = fa(toJalali(now).jy);
  const today = new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(now);

  const quick = [
    { href: "/", label: "داشبورد" },
    { href: "/today", label: "امروز" },
    { href: "/roadmap", label: "رودمپ تعاملی" },
    { href: "/quiz", label: "کوییز روزانه" },
    { href: "/log", label: "لاگ روزانه" },
  ];
  const tools = TOOL_LINKS.filter((t) => !quick.some((q) => q.href === t.href));

  const linkClass =
    "group flex items-center gap-1.5 text-[13px] text-muted-foreground transition-colors hover:text-foreground";
  const arrowClass =
    "size-3 opacity-0 -translate-x-1 transition-all group-hover:opacity-100 group-hover:translate-x-0";

  const colTitle = "mb-2.5 flex items-center gap-2 text-xs font-bold text-foreground";
  const colDot = "size-1.5 rounded-full bg-brand";

  return (
    <footer className="relative border-t border-border bg-card">
      {/* خط گرادیان بالای پابرگ */}
      <span className="absolute inset-x-0 top-0 h-px bg-gradient-to-l from-transparent via-brand/50 to-transparent" />

      <div className="mx-auto max-w-6xl px-6 py-9">
        <div className="grid gap-8 lg:grid-cols-[1.15fr_2fr] lg:gap-10">
          {/* برند + وضعیت */}
          <div>
            <Link href="/" className="flex items-center gap-2.5">
              <span className="flex size-9 items-center justify-center rounded-lg bg-brand text-brand-foreground">
                <Route className="size-5" />
              </span>
              <span className="leading-tight">
                <span className="block text-sm font-bold">برنامه ۱۰ ماهه</span>
                <span className="block text-[11px] text-muted-foreground">
                  مهر ۱۴۰۵ ← تیر ۱۴۰۶ · از دوازدهم تا درآمد
                </span>
              </span>
            </Link>

            <p className="mt-3 max-w-sm text-xs leading-6 text-muted-foreground">
              بک‌اند پایتون، معدل بالای ۱۶ و اولین درآمد — همه‌چیز در مرورگر خودت ذخیره می‌شود؛
              بدون حساب، بدون سرور.
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border px-2.5 py-1 text-[11px] text-muted-foreground">
                <HardDrive className="size-3 text-brand" /> ذخیره محلی
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border px-2.5 py-1 text-[11px] text-muted-foreground">
                <ShieldCheck className="size-3 text-brand" /> بدون حساب
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border px-2.5 py-1 text-[11px] text-muted-foreground">
                <WifiOff className="size-3 text-brand" /> آفلاین
              </span>
              <InstallChip />
            </div>
          </div>

          {/* گروه‌های لینک */}
          <div className="grid grid-cols-2 gap-x-8 gap-y-6 sm:grid-cols-3">
            <nav aria-label="دسترسی سریع">
              <h3 className={colTitle}>
                <span className={colDot} /> دسترسی سریع
              </h3>
              <ul className="space-y-1.5">
                {quick.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className={linkClass}>
                      {l.label}
                      <ArrowLeft className={arrowClass} />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <nav aria-label="ابزارها">
              <h3 className={colTitle}>
                <span className={colDot} /> ابزارها
              </h3>
              <ul className="space-y-1.5">
                {tools.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className={linkClass}>
                      {l.label}
                      <ArrowLeft className={arrowClass} />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <nav aria-label="مستندات برنامه" className="col-span-2 sm:col-span-1">
              <h3 className={colTitle}>
                <span className={colDot} /> مستندات برنامه
              </h3>
              <ul className="grid grid-cols-2 gap-x-6 gap-y-1.5 sm:grid-cols-1 xl:grid-cols-2">
                {DOC_LINKS.map((l) => (
                  <li key={l.slug}>
                    <Link href={`/docs/${l.slug}`} className={linkClass}>
                      {l.label}
                      <ArrowLeft className={arrowClass} />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>

        {/* نوار پایین */}
        <div className="mt-8 flex flex-col gap-3 border-t border-border pt-4 text-[11px] text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} برنامه ۱۰ ماهه · هدف: {fa(20)} میلیون در ماه
          </p>
          <p className="text-muted-foreground/80">{today}</p>
          <div className="flex items-center gap-4">
            <span>ساخته‌شده با وایب‌فارسی</span>
            <Button
              variant="outline"
              size="sm"
              className="h-7 gap-1.5 rounded-full px-3 text-[11px]"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              <ArrowUp className="size-3" /> بالا
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
}
