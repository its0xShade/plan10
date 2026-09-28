"use client";

import * as React from "react";
import { Moon, Sun, Sparkles } from "lucide-react";

type Theme = "paper" | "graphite" | "midnight";
const CYCLE: Theme[] = ["paper", "graphite", "midnight"];
const LABEL: Record<Theme, string> = {
  paper: "تم روشن (کاغذ)",
  graphite: "تم تیره (گرافیت)",
  midnight: "تم مشکی مطلق (OLED)",
};
const ICON: Record<Theme, React.ReactNode> = {
  paper: <Sun className="size-4" />,
  graphite: <Moon className="size-4" />,
  midnight: <Sparkles className="size-4" />,
};

const read = (): Theme => {
  if (typeof document === "undefined") return "graphite";
  const t = document.documentElement.dataset.theme;
  return t === "paper" ? "paper" : t === "midnight" ? "midnight" : "graphite";
};

const apply = (t: Theme) => {
  if (t === "graphite") document.documentElement.removeAttribute("data-theme");
  else document.documentElement.setAttribute("data-theme", t);
  try {
    localStorage.setItem("theme", t);
  } catch {}
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", t === "midnight" ? "#000000" : t === "paper" ? "#faf9f4" : "#0d0d12");
};

/** تعویض تم: کاغذ ← گرافیت ← مشکی مطلق (حلقه‌ای).
 *  variant="row"  → ردیف متن‌دار (فوتر/کشو) | variant="icon" → آیکون گرد (نوار بالا) */
export function ThemeToggle({ variant = "row" }: { variant?: "row" | "icon" }) {
  const [theme, setTheme] = React.useState<Theme>("graphite");
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    setTheme(read());
  }, []);

  const cycle = () => {
    const next = CYCLE[(CYCLE.indexOf(theme) + 1) % CYCLE.length];
    setTheme(next);
    apply(next);
  };

  if (variant === "icon") {
    return (
      <button
        type="button"
        onClick={cycle}
        aria-label={`تم فعلی: ${LABEL[theme]} — برای تم بعدی`}
        title={LABEL[theme]}
        data-no-print
        className="flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {mounted ? ICON[theme] : <Sun className="size-4.5" />}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={cycle}
      aria-label={`تم فعلی: ${LABEL[theme]} — برای تم بعدی`}
      data-no-print
      className="flex w-full items-center justify-between rounded-md px-2.5 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
    >
      <span className="flex items-center gap-2.5">
        {mounted ? ICON[theme] : <Sun className="size-4" />}
        <span>{LABEL[theme]}</span>
      </span>
      <span className="flex gap-1">
        {CYCLE.map((t) => (
          <span
            key={t}
            className={`size-1.5 rounded-full transition-colors ${mounted && theme === t ? "bg-brand" : "bg-border"}`}
          />
        ))}
      </span>
    </button>
  );
}
