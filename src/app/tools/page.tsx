import { Wrench, ShieldCheck, WifiOff, UserRound } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { GridBackground } from "@/components/backgrounds/grid";
import { ToolsExplorer } from "@/components/tools-explorer";

export const metadata = { title: "ابزارها" };

export default function ToolsHubPage() {
  return (
    <div className="space-y-7">
      {/* هدر */}
      <section className="relative overflow-hidden rounded-2xl border border-border bg-card">
        <GridBackground />
        <div className="relative px-6 py-9 sm:px-10 sm:py-11">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Wrench className="size-4 text-brand" />
            جعبه‌ابزار برنامه
          </div>
          <h1 className="mt-3 text-2xl font-black leading-tight sm:text-3xl">
            هر ابزار، یک <span className="text-brand">صفحه مستقل</span>
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-muted-foreground">
            از رودمپ تعاملی تا لاگ شبانه — جستجو کن یا از روتین روز پیش برو؛ همه‌چیز در مرورگر
            خودت ذخیره می‌شه و آفلاین هم کار می‌کنه.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Badge variant="brand">۱۴ ابزار</Badge>
            <Badge variant="secondary">
              <UserRound className="size-3" /> بدون حساب کاربری
            </Badge>
            <Badge variant="secondary">
              <ShieldCheck className="size-3" /> ذخیره محلی
            </Badge>
            <Badge variant="outline">
              <WifiOff className="size-3" /> آفلاین
            </Badge>
          </div>
        </div>
      </section>

      {/* اکسپلورر: روتین + جستجو + فیلتر + کارت‌ها */}
      <ToolsExplorer />
    </div>
  );
}
