"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { FileText, Map, Search } from "lucide-react";
import { fa } from "@/lib/utils";
import { searchDocs, type SearchIndex } from "@/lib/search";

interface Hit {
  source: "doc" | "roadmap";
  title: string;
  context?: string;
  snippet: string;
  href: string;
}

let indexPromise: Promise<SearchIndex> | null = null;
/** ایندکس ساخته‌شده در build را یک بار دانلود می‌کند. */
function loadIndex(): Promise<SearchIndex> {
  if (!indexPromise) {
    indexPromise = fetch(`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/search-index.json`).then(
      (r) => r.json() as Promise<SearchIndex>,
    );
  }
  return indexPromise;
}

/** جستجوی سراسری — با Ctrl/⌘+K باز می‌شود. */
export function SearchDialog() {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [q, setQ] = React.useState("");
  const [results, setResults] = React.useState<Hit[]>([]);
  const [active, setActive] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  // میان‌بر صفحه‌کلید
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  React.useEffect(() => {
    if (open) {
      setActive(0);
      setTimeout(() => inputRef.current?.focus(), 30);
    } else {
      setQ("");
      setResults([]);
    }
  }, [open]);

  // جستجوی debounced
  React.useEffect(() => {
    if (!open || q.trim().length < 2) {
      setResults([]);
      return;
    }
    setLoading(true);
    const t = setTimeout(async () => {
      try {
        const idx = await loadIndex();
        setResults(searchDocs(q.trim(), idx));
        setActive(0);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 180);
    return () => clearTimeout(t);
  }, [q, open]);

  const go = (hit: Hit) => {
    setOpen(false);
    router.push(hit.href);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter" && results[active]) {
      e.preventDefault();
      go(results[active]);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-start justify-center bg-black/60 px-4 pt-[12vh] backdrop-blur-sm"
      onClick={() => setOpen(false)}
      data-no-print
    >
      <div
        className="w-full max-w-xl overflow-hidden rounded-2xl border border-border bg-popover shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="جستجو"
      >
        {/* ورودی */}
        <div className="flex items-center gap-2.5 border-b border-border px-4 py-3">
          <Search className="size-4 shrink-0 text-muted-foreground" />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="جستجو در ۱۰ مستند و رودمپ… (مثلاً JWT، سربازی، Docker)"
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
          <kbd className="hidden shrink-0 rounded border border-border bg-secondary px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground sm:block">
            Esc
          </kbd>
        </div>

        {/* نتایج */}
        <div className="max-h-[50vh] overflow-y-auto p-2">
          {q.trim().length < 2 && (
            <div className="px-3 py-6 text-center text-sm text-muted-foreground">
              برای جستجو تایپ کن — جستجو هم مستندات و هم {fa(96)} آیتم رودمپ را پوشش می‌دهد.
            </div>
          )}
          {q.trim().length >= 2 && !loading && results.length === 0 && (
            <div className="px-3 py-6 text-center text-sm text-muted-foreground">نتیجه‌ای پیدا نشد.</div>
          )}
          {loading && <div className="px-3 py-4 text-center text-sm text-muted-foreground">در حال جستجو…</div>}

          {results.map((hit, i) => (
            <button
              key={`${hit.href}-${i}-${hit.snippet.slice(0, 20)}`}
              type="button"
              onClick={() => go(hit)}
              onMouseEnter={() => setActive(i)}
              className={`flex w-full items-start gap-3 rounded-lg px-3 py-2.5 text-start transition-colors ${
                i === active ? "bg-accent" : "hover:bg-accent/60"
              }`}
            >
              <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-md bg-secondary text-muted-foreground">
                {hit.source === "doc" ? <FileText className="size-3.5" /> : <Map className="size-3.5" />}
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">{hit.title}</span>
                  {hit.context && <span className="truncate">← {hit.context}</span>}
                </span>
                <span className="mt-0.5 block truncate text-sm">{hit.snippet}</span>
              </span>
            </button>
          ))}
        </div>

        {/* پاورقی */}
        <div className="flex items-center justify-between border-t border-border px-4 py-2 text-[11px] text-muted-foreground">
          <span>برای حرکت ↑ ↓ و ورود Enter</span>
          <span className="font-mono" dir="ltr">
            Ctrl + K
          </span>
        </div>
      </div>
    </div>
  );
}
