import { Map } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getRoadmap } from "@/lib/content";
import { RoadmapChecklist } from "@/components/roadmap/roadmap-checklist";
import { fa } from "@/lib/utils";

export default function RoadmapPage() {
  const sections = getRoadmap();
  const total = sections.reduce((s, x) => s + x.total, 0);
  const levels = sections.filter((s) => /سطح\s*[۰-۹0-9]/.test(s.title)).length;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-black">
            <Map className="size-6 text-brand" /> رودمپ تعاملی بک‌اند
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {fa(total)} آیتم در {fa(levels)} سطح — با جستجو و فیلتر پیش بر، تیک‌ها خودکار
            ذخیره می‌مونه.
          </p>
        </div>
        <Badge variant="brand">از صفر تا شغل</Badge>
      </div>

      <RoadmapChecklist sections={sections} />
    </div>
  );
}
