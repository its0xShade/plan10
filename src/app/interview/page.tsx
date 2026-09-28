"use client";

import * as React from "react";
import { MessagesSquare, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Accordion, type AccordionItem } from "@/components/ui/accordion";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { INTERVIEW_BANK } from "@/lib/interview-data";
import { fa } from "@/lib/utils";

const TOPICS = ["همه", ...new Set(INTERVIEW_BANK.map((i) => i.topic))];

const LEVEL_CLS: Record<string, string> = {
  پایه: "text-emerald-500 border-emerald-500/40",
  متوسط: "text-amber-500 border-amber-500/40",
  پیشرفته: "text-destructive border-destructive/40",
};

export default function InterviewPage() {
  const [topic, setTopic] = React.useState("همه");
  const [q, setQ] = React.useState("");

  const filtered = INTERVIEW_BANK.filter(
    (i) =>
      (topic === "همه" || i.topic === topic) &&
      (!q || i.q.includes(q) || i.a.includes(q)),
  );

  const items: AccordionItem[] = filtered.map((i, idx) => ({
    id: String(idx),
    title: (
      <span className="flex w-full items-center justify-between gap-3">
        <span className="text-sm font-medium leading-6">{i.q}</span>
        <span className="flex shrink-0 items-center gap-2">
          <Badge variant="outline" className={LEVEL_CLS[i.level]}>
            {i.level}
          </Badge>
          <Badge variant="secondary" className="hidden sm:inline">
            {i.topic}
          </Badge>
        </span>
      </span>
    ),
    content: <p className="text-sm leading-7 text-muted-foreground">{i.a}</p>,
  }));

  return (
    <div className="space-y-6">
      <header className="flex items-center gap-3">
        <MessagesSquare className="size-7 text-brand" />
        <div>
          <h1 className="text-2xl font-bold">بانک سؤالات مصاحبه</h1>
          <p className="text-sm text-muted-foreground">
            {fa(INTERVIEW_BANK.length)} سؤال مصاحبه بک‌اند جونیور با پاسخ مهندسی‌شده — روی هر سؤال کلیک کن
          </p>
        </div>
      </header>

      <div className="flex flex-wrap items-center gap-3">
        <Tabs
          value={topic}
          defaultValue={topic}
          onValueChange={setTopic}
          className="min-w-0"
        >
          <TabsList className="max-w-full overflow-x-auto">
            {TOPICS.map((t) => (
              <TabsTrigger key={t} value={t}>
                {t}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <div className="relative ms-auto w-full max-w-52">
          <Search className="absolute end-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="جستجو در سؤال‌ها…"
            className="w-full rounded-lg border border-border bg-background pe-8 ps-3 py-1.5 text-sm outline-none focus:border-brand/50"
          />
        </div>
      </div>

      {items.length === 0 ? (
        <div className="py-10 text-center text-sm text-muted-foreground">سؤالی پیدا نشد.</div>
      ) : (
        <Accordion items={items} multiple />
      )}
    </div>
  );
}
