"use client";

import * as React from "react";
import { Palette } from "lucide-react";
import { cn } from "@/lib/utils";

const ACCENTS = [
  { id: "gold", name: "کهربایی", color: "#fbbf24" },
  { id: "teal", name: "فیروزه‌ای", color: "#2dd4bf" },
  { id: "green", name: "سبز", color: "#4ade80" },
  { id: "blue", name: "آبی", color: "#60a5fa" },
  { id: "rose", name: "رز", color: "#fb7185" },
];

/** وضعیت اکسنت مشترک بین کشوی هدر و ردیف موبایل. */
function useAccent() {
  const [acc, setAcc] = React.useState("gold");
  React.useEffect(() => {
    setAcc(localStorage.getItem("plan10.accent") || "gold");
  }, []);
  const pick = (id: string) => {
    setAcc(id);
    try {
      localStorage.setItem("plan10.accent", id);
    } catch {}
    document.documentElement.setAttribute("data-accent", id);
  };
  const current = ACCENTS.find((a) => a.id === acc) ?? ACCENTS[0];
  return { acc, pick, current };
}

/** ردیف افقی رنگ‌ها — برای کشوی موبایل. */
export function AccentSwatches({ className }: { className?: string }) {
  const { acc, pick } = useAccent();
  return (
    <span className={cn("flex items-center gap-1.5", className)} data-no-print>
      {ACCENTS.map((a) => (
        <button
          key={a.id}
          type="button"
          title={a.name}
          aria-label={`اکسنت ${a.name}`}
          onClick={() => pick(a.id)}
          className={cn(
            "size-4 rounded-full border transition-transform hover:scale-110",
            acc === a.id
              ? "scale-110 border-foreground/60 outline outline-1 outline-offset-2 outline-foreground/40"
              : "border-border",
          )}
          style={{ background: a.color }}
        />
      ))}
    </span>
  );
}

/** انتخاب اکسنت — دکمه طراحی در نوار بالا با منوی کشویی. */
export function AccentDropdown() {
  const { acc, pick, current } = useAccent();
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative" data-no-print>
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`اکسنت رنگی — ${current.name}`}
        onClick={() => setOpen((o) => !o)}
        className="flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <span className="relative">
          <Palette className="size-4.5" />
          <span
            className="absolute -bottom-0.5 -end-0.5 size-2 rounded-full border border-background"
            style={{ background: current.color }}
          />
        </span>
      </button>
      <div
        role="menu"
        className={cn(
          "absolute top-full end-0 z-50 mt-2 w-44 origin-top rounded-xl border border-border bg-popover p-3 shadow-2xl transition-all duration-200",
          open ? "scale-100 opacity-100" : "pointer-events-none scale-95 opacity-0",
        )}
      >
        <div className="mb-2.5 text-xs font-semibold text-muted-foreground">اکسنت رنگی</div>
        <div className="grid grid-cols-5 gap-2">
          {ACCENTS.map((a) => (
            <button
              key={a.id}
              type="button"
              role="menuitem"
              title={a.name}
              aria-label={`اکسنت ${a.name}`}
              onClick={() => {
                pick(a.id);
                setOpen(false);
              }}
              className={cn(
                "mx-auto size-7 rounded-full border transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                acc === a.id
                  ? "scale-110 border-foreground/60 ring-2 ring-foreground/60 ring-offset-2 ring-offset-popover"
                  : "border-border",
              )}
              style={{ background: a.color }}
            />
          ))}
        </div>
        <div className="mt-2.5 text-center text-[11px] text-muted-foreground">{current.name}</div>
      </div>
    </div>
  );
}
