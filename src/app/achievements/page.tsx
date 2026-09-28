import { Trophy } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getRoadmap } from "@/lib/content";
import { AchievementPanel } from "@/components/achievements/streak-achievements";
import { fa } from "@/lib/utils";

export const metadata = { title: "نشان‌ها و استریک" };

export default function AchievementsPage() {
  const sections = getRoadmap().map((s) => ({ title: s.title, total: s.total }));

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center gap-3">
        <Trophy className="size-7 text-brand" />
        <div>
          <h1 className="text-2xl font-bold">نشان‌ها و استریک</h1>
          <p className="text-sm text-muted-foreground">
            رشته روزهای متوالی و نشان‌هایی که با پیشرفت واقعی باز می‌شن — از اولین تیک تا صددروزه
          </p>
        </div>
        <Badge variant="secondary" className="ms-auto">
          {fa(sections.length)} سطح رودمپ
        </Badge>
      </header>

      <AchievementPanel sections={sections} />
    </div>
  );
}
