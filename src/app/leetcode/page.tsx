"use client";

import * as React from "react";
import { Code2, ExternalLink, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart } from "@/components/charts";
import { LEET_PROBLEMS, LEET_GROUPS, LEET_DIFF_LABEL, type LeetProblem } from "@/lib/leetcode-data";
import { useStore } from "@/lib/store";
import { fa } from "@/lib/utils";

type State = { s?: "a" | "d"; at?: number };

const DIFF_CLS: Record<LeetProblem["d"], string> = {
  E: "text-emerald-500",
  M: "text-amber-500",
  H: "text-destructive",
};

export default function LeetCodePage() {
  const [state, setState] = useStore<Record<string, State>>("plan10.leetcode", {});
  const [group, setGroup] = React.useState("همه");
  const [q, setQ] = React.useState("");

  const cycle = (slug: string) => {
    const cur = state[slug]?.s;
    const next: Record<string, State> = { ...state };
    if (!cur) next[slug] = { s: "a" };
    // eslint-disable-next-line react-hooks/purity -- Date.now داخل event handler است نه رندر
    else if (cur === "a") next[slug] = { s: "d", at: Date.now() };
    else delete next[slug];
    setState(next);
  };

  const solved = (d?: LeetProblem["d"]) =>
    LEET_PROBLEMS.filter((p) => (!d || p.d === d) && state[p.s]?.s === "d").length;
  const attempted = LEET_PROBLEMS.filter((p) => state[p.s]?.s === "a").length;
  const total = LEET_PROBLEMS.length;

  const list = LEET_PROBLEMS.filter(
    (p) =>
      (group === "همه" || p.g === group) &&
      (!q || p.t.toLowerCase().includes(q.toLowerCase())),
  );

  // نمودار هفتگی: ۸ هفته اخیر — زمان mount (پایدار بین رندرها)
  const [now] = React.useState(() => Date.now());
  const weekMs = 7 * 86400000;
  const weeks = Array.from({ length: 8 }, (_, i) => 7 - i);
  const weekly = weeks.map((back) => {
    const from = now - (back + 1) * weekMs;
    const to = now - back * weekMs;
    return Object.values(state).filter((v) => v.s === "d" && v.at && v.at > from && v.at <= to).length;
  });

  const pct = Math.round((solved() / total) * 100);

  return (
    <div className="space-y-6">
      <header className="flex items-center gap-3">
        <Code2 className="size-7 text-brand" />
        <div>
          <h1 className="text-2xl font-bold">تخته LeetCode</h1>
          <p className="text-sm text-muted-foreground">
            {fa(total)} سؤال پرتکرار مصاحبه — کلیک: بی‌تلاش ← تلاش‌شده ← حل‌شده
          </p>
        </div>
      </header>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Card>
          <CardContent className="pt-5 text-center">
            <div className="text-2xl font-bold text-brand">
              {fa(solved())}/{fa(total)}
            </div>
            <div className="text-xs text-muted-foreground">حل‌شده ({fa(pct)}٪)</div>
            <Progress value={pct} className="mt-2 h-1.5" />
          </CardContent>
        </Card>
        {(["E", "M", "H"] as const).map((d) => (
          <Card key={d}>
            <CardContent className="pt-5 text-center">
              <div className={`text-2xl font-bold ${DIFF_CLS[d]}`}>
                {fa(solved(d))}/{fa(LEET_PROBLEMS.filter((p) => p.d === d).length)}
              </div>
              <div className="text-xs text-muted-foreground">{LEET_DIFF_LABEL[d]}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="pt-5">
          <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
            <span>حل‌شده در هر هفته (۸ هفته اخیر)</span>
            <span>{fa(attempted)} در حال تلاش</span>
          </div>
          <BarChart height={90} labels={weeks.map((w) => (w === 0 ? "الان" : `${fa(w)}هفته`))} values={weekly} />
        </CardContent>
      </Card>

      <div className="flex flex-wrap items-center gap-3">
        <Tabs
          value={group}
          defaultValue={group}
          onValueChange={setGroup}
          className="min-w-0"
        >
          <TabsList className="max-w-full overflow-x-auto">
            <TabsTrigger value="همه">همه</TabsTrigger>
            {LEET_GROUPS.map((g) => (
              <TabsTrigger key={g} value={g}>
                {g}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <div className="relative ms-auto w-full max-w-52">
          <Search className="absolute end-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="جستجوی عنوان…"
            className="w-full rounded-lg border border-border bg-background pe-8 ps-3 py-1.5 text-sm outline-none focus:border-brand/50"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
        {list.map((p) => {
          const st = state[p.s]?.s;
          return (
            <button
              key={p.s}
              type="button"
              onClick={() => cycle(p.s)}
              className={`flex items-center gap-3 rounded-lg border px-3 py-2.5 text-start transition-colors ${
                st === "d"
                  ? "border-emerald-500/40 bg-emerald-500/10"
                  : st === "a"
                    ? "border-amber-500/40 bg-amber-500/10"
                    : "border-border hover:border-brand/40 hover:bg-accent/50"
              }`}
            >
              <span
                className={`flex size-5 shrink-0 items-center justify-center rounded-full border text-[10px] font-bold ${
                  st === "d"
                    ? "border-emerald-500 bg-emerald-500 text-background"
                    : st === "a"
                      ? "border-amber-500 text-amber-500"
                      : "border-border text-muted-foreground"
                }`}
              >
                {st === "d" ? "✓" : st === "a" ? "…" : ""}
              </span>
              <span className="min-w-0 flex-1 truncate text-sm font-medium" dir="ltr">
                {p.t}
              </span>
              <Badge variant="outline" className={`shrink-0 ${DIFF_CLS[p.d]}`}>
                {LEET_DIFF_LABEL[p.d]}
              </Badge>
              <a
                href={`https://leetcode.com/problems/${p.s}/`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="shrink-0 text-muted-foreground hover:text-brand"
                title="باز کردن در LeetCode"
              >
                <ExternalLink className="size-3.5" />
              </a>
            </button>
          );
        })}
      </div>
    </div>
  );
}
