"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight, Presentation } from "lucide-react";
import { fa } from "@/lib/utils";

/** رندر نمودار Mermaid از بلوک ```mermaid — تم با حالت فعلی سایت هماهنگ می‌شود */
export function Mermaid({ code }: { code: string }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [err, setErr] = React.useState<string | null>(null);

  React.useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const mermaid = (await import("mermaid")).default;
        const dark = document.documentElement.getAttribute("data-theme") !== "paper";
        mermaid.initialize({
          startOnLoad: false,
          theme: dark ? "dark" : "neutral",
          fontFamily: "Vazirmatn, Tahoma, sans-serif",
          flowchart: { htmlLabels: true, curve: "basis" },
          themeVariables: dark
            ? { primaryColor: "#17171d", primaryTextColor: "#f4f4f5", primaryBorderColor: "#3f3f4a", lineColor: "#fbbf24", secondaryColor: "#1f1f26", tertiaryColor: "#121216" }
            : { primaryColor: "#ffffff", primaryTextColor: "#1c1c1a", primaryBorderColor: "#c9c9c4", lineColor: "#b45309", secondaryColor: "#f6f6f4", tertiaryColor: "#ffffff" },
        });
        const id = "mmd" + Math.random().toString(36).slice(2, 10);
        const { svg } = await mermaid.render(id, code.trim());
        if (alive && ref.current) {
          ref.current.innerHTML = svg;
          setErr(null);
        }
      } catch (e) {
        if (alive) setErr(String(e).slice(0, 200));
      }
    })();
    return () => {
      alive = false;
    };
  }, [code]);

  if (err) {
    return (
      <div className="my-4 rounded-xl border border-destructive/40 bg-destructive/5 p-3 text-xs text-destructive" dir="ltr">
        mermaid render error: {err}
      </div>
    );
  }

  return (
    <div ref={ref} className="my-4 flex justify-center overflow-x-auto rounded-xl border border-border bg-card p-4" />
  );
}

interface SlideFrame {
  title: string;
  body: string[];
}

/** اسلایدهای تعاملی از بلوک ```slides — جداکننده اسلایدها: خط --- */
export function SlidesPlayer({ raw }: { raw: string }) {
  const frames: SlideFrame[] = React.useMemo(
    () =>
      raw
        .trim()
        .split(/^\s*---\s*$/m)
        .map((chunk) => {
          const lines = chunk.split("\n").map((l) => l.trim()).filter(Boolean);
          const titleLine = lines[0] ?? "";
          return {
            title: titleLine.replace(/^#+\s*/, ""),
            body: lines.slice(1).map((l) => l.replace(/^[-*]\s*/, "").replace(/\*\*/g, "")),
          };
        })
        .filter((f) => f.title || f.body.length),
    [raw],
  );

  const [i, setI] = React.useState(0);
  const n = frames.length;
  const cur = frames[Math.min(i, n - 1)];

  if (n === 0) return null;

  const go = (d: number) => setI((v) => Math.min(n - 1, Math.max(0, v + d)));

  return (
    <div
      data-no-print
      tabIndex={0}
      role="region"
      aria-label="اسلایدها"
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") go(-1);
        if (e.key === "ArrowRight") go(1);
      }}
      className="my-4 overflow-hidden rounded-2xl border border-brand/30 bg-gradient-to-br from-card via-card to-brand/5 outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
    >
      <div className="flex items-center gap-2 border-b border-border/70 px-4 py-2 text-xs text-muted-foreground">
        <Presentation className="size-4 text-brand" />
        اسلایدشو
        <span className="ms-auto font-mono" dir="ltr">
          {i + 1} / {n}
        </span>
      </div>

      <div className="min-h-44 px-6 py-5 sm:min-h-40">
        <h4 className="mb-3 text-lg font-black leading-7 sm:text-xl">{cur.title}</h4>
        {cur.body.length > 0 && (
          <ul className="space-y-2">
            {cur.body.map((line, bi) => (
              <li key={bi} className="flex items-start gap-2 text-sm leading-7 sm:text-[15px]">
                <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-brand" />
                <span>{line}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex items-center gap-2 border-t border-border/70 px-4 py-2.5">
        <button
          type="button"
          onClick={() => go(-1)}
          disabled={i === 0}
          aria-label="اسلاید قبلی"
          className="flex size-7 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-brand/50 hover:text-foreground disabled:opacity-40"
        >
          <ChevronRight className="size-4" />
        </button>
        <button
          type="button"
          onClick={() => go(1)}
          disabled={i === n - 1}
          aria-label="اسلاید بعدی"
          className="flex size-7 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-brand/50 hover:text-foreground disabled:opacity-40"
        >
          <ChevronLeft className="size-4" />
        </button>
        <span className="mx-auto flex gap-1.5">
          {frames.map((_, di) => (
            <button
              key={di}
              type="button"
              aria-label={`اسلاید ${fa(di + 1)}`}
              onClick={() => setI(di)}
              className={`size-2 rounded-full transition-colors ${di === i ? "bg-brand" : "bg-border hover:bg-muted-foreground/50"}`}
            />
          ))}
        </span>
        <span className="text-[11px] text-muted-foreground">کلیدهای ← →</span>
      </div>
    </div>
  );
}
