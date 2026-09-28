import { Timer } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { PomodoroTimer } from "@/components/pomodoro";

export const metadata = { title: "تایمر پومودورو" };

export default function PomodoroPage() {
  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center gap-3">
        <Timer className="size-7 text-brand" />
        <div>
          <h1 className="text-2xl font-bold">تایمر پومودورو</h1>
          <p className="text-sm text-muted-foreground">
            سشن‌های تمرکز با استراحت کوتاه — سشن کامل‌شده خودکار در لاگ روزانه ثبت می‌شود
          </p>
        </div>
        <Badge variant="secondary" className="ms-auto">
          ثبت خودکار در لاگ ✓
        </Badge>
      </header>

      <PomodoroTimer />
    </div>
  );
}
