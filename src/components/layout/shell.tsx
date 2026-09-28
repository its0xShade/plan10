"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { ScrollProgress } from "@/components/animations/scroll-progress";
import { Navbar } from "@/components/layout/navbar";
import { SiteFooter } from "@/components/layout/site-footer";
import { SearchDialog } from "@/components/shared/search-dialog";
import { NotificationEngine } from "@/components/shared/notify-engine";
import { MobileDock } from "@/components/layout/mobile-dock";

/** پوسته سایت: نوار بالای چسبان + محتوای اصلی + پابرگ (بدون سایدبار).
 *  محتوا با هر تغییر مسیر دوباره mount می‌شود تا انیمیشن ورود اجرا گردد. */
export function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // PWA: ثبت سرویس‌ورکر
  React.useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
  }, []);

  return (
    <div className="flex min-h-screen flex-col pb-[72px] md:pb-0">
      <ScrollProgress className="fixed inset-x-0 top-0 z-50" />
      <Navbar />
      <main key={pathname} className="page-enter mx-auto w-full max-w-6xl flex-1 px-4 pb-16 pt-8 sm:px-6">
        {children}
      </main>
      <SiteFooter />
      <SearchDialog />
      <NotificationEngine />
      <MobileDock />
    </div>
  );
}
