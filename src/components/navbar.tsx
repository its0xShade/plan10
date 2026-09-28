"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  Search,
  Route,
  LayoutDashboard,
  Map,
  BookOpen,
  Wrench,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet } from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/theme-toggle";
import { AccentDropdown, AccentSwatches } from "@/components/accent-picker";
import { cn } from "@/lib/utils";

function openSearch() {
  window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", ctrlKey: true }));
}

interface TopLink {
  href: string;
  label: string;
  Icon: React.ComponentType<{ className?: string }>;
}

const TOP_LINKS: TopLink[] = [
  { href: "/", label: "داشبورد", Icon: LayoutDashboard },
  { href: "/roadmap", label: "رودمپ تعاملی", Icon: Map },
  { href: "/docs", label: "مستندات", Icon: BookOpen },
  { href: "/tools", label: "ابزارها", Icon: Wrench },
];

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

/** نوار بالا — هدر چسبان: لوگو در راست، لینک‌های مستقیم در وسط، ابزارها در چپ؛ موبایل کشو از راست. */
export function Navbar() {
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();

  const topLink = ({ href, label, Icon }: TopLink) => (
    <li key={href}>
      <Link
        href={href}
        aria-current={isActive(pathname, href) ? "page" : undefined}
        className={cn(
          "relative flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent",
          isActive(pathname, href) ? "text-foreground" : "text-muted-foreground",
        )}
      >
        <Icon className="size-4" />
        {label}
        {isActive(pathname, href) && (
          <span className="absolute inset-x-3 -bottom-[13px] h-0.5 rounded-full bg-brand" />
        )}
      </Link>
    </li>
  );

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-border bg-background/85 pt-[env(safe-area-inset-top)] backdrop-blur-xl">
        <nav
          aria-label="ناوبری اصلی"
          className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6"
        >
          {/* لوگو — اول در ترتیب خواندن (راست در RTL) */}
          <Link href="/" className="flex shrink-0 items-center gap-2.5">
            <span className="flex size-9 items-center justify-center rounded-lg bg-brand text-brand-foreground">
              <Route className="size-5" />
            </span>
            <span className="hidden leading-tight sm:block">
              <span className="block text-sm font-bold">برنامه ۱۰ ماهه</span>
              <span className="block text-[11px] text-muted-foreground">بک‌اند · معدل · درآمد</span>
            </span>
          </Link>

          {/* لینک‌های مستقیم — بدون کشویی، هر کدام صفحه خودش */}
          <ul className="hidden items-center gap-1 md:flex">{TOP_LINKS.map(topLink)}</ul>

          {/* ابزارها — در چپ */}
          <div className="hidden items-center gap-2 md:flex">
            <Button
              variant="ghost"
              size="sm"
              onClick={openSearch}
              className="gap-2 text-muted-foreground"
            >
              <Search />
              جستجو
              <kbd
                className="rounded border border-border bg-secondary px-1.5 py-0.5 font-mono text-[10px]"
                dir="ltr"
              >
                Ctrl K
              </kbd>
            </Button>
            <AccentDropdown />
            <ThemeToggle variant="icon" />
          </div>

          {/* دکمه موبایل */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label="باز کردن منو"
            onClick={() => setOpen(true)}
          >
            <Menu />
          </Button>
        </nav>
      </header>

      {/* کشوی موبایل — از سمت راست */}
      <Sheet
        open={open}
        onOpenChange={setOpen}
        title={
          <span className="flex items-center gap-2">
            <span className="flex size-7 items-center justify-center rounded-md bg-brand text-brand-foreground">
              <Route className="size-4" />
            </span>
            برنامه ۱۰ ماهه
          </span>
        }
      >
        <Button
          variant="outline"
          className="mb-4 w-full justify-between text-muted-foreground"
          onClick={() => {
            setOpen(false);
            openSearch();
          }}
        >
          <span className="flex items-center gap-2">
            <Search />
            جستجو در برنامه…
          </span>
          <kbd className="rounded border border-border bg-secondary px-1.5 font-mono text-[10px]" dir="ltr">
            Ctrl K
          </kbd>
        </Button>

        <ul className="flex flex-col gap-1">{TOP_LINKS.map(topLink)}</ul>

        <div className="mt-auto space-y-2 border-t border-border pt-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs text-muted-foreground">اکسنت رنگی</span>
            <AccentSwatches />
          </div>
          <ThemeToggle />
        </div>
      </Sheet>
    </>
  );
}
