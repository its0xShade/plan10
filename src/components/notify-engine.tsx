"use client";

import * as React from "react";
import { BellRing, Bell, Send } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { fa } from "@/lib/utils";
import { PLAN_EVENTS } from "@/lib/events-data";
import { toGregorian } from "@/lib/jalali";
import { DAY_LABEL, TARGET_HOURS, WEEKDAY_FA, dayType } from "@/lib/store";

/* ---------------- تنظیمات ---------------- */

export interface NotifySettings {
  morning: boolean;
  evening: boolean;
  deadlines: boolean;
}

export const DEFAULT_NOTIFY: NotifySettings = { morning: true, evening: true, deadlines: true };
const KEY = "plan10.notify";
const FIRED_KEY = "plan10.notify.fired";

export function readNotifySettings(): NotifySettings {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return { ...DEFAULT_NOTIFY, ...JSON.parse(raw) };
  } catch {}
  return DEFAULT_NOTIFY;
}

export function writeNotifySettings(s: NotifySettings) {
  try {
    localStorage.setItem(KEY, JSON.stringify(s));
  } catch {}
}

interface FiredMap {
  morning?: string;
  evening?: string;
  deadlines?: Record<string, string>;
}

function readFired(): FiredMap {
  try {
    const raw = localStorage.getItem(FIRED_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return {};
}

function saveFired(f: FiredMap) {
  try {
    // نگه‌داشتن حداکثر ۶۰ کلید تا رشته کوچک بماند
    if (f.deadlines && Object.keys(f.deadlines).length > 60) {
      const keep: Record<string, string> = {};
      const entries = Object.entries(f.deadlines).slice(-40);
      for (const [k, v] of entries) keep[k] = v;
      f.deadlines = keep;
    }
    localStorage.setItem(FIRED_KEY, JSON.stringify(f));
  } catch {}
}

/* ---------------- مجوز و نمایش ---------------- */

export type Perm = "granted" | "denied" | "default" | "unsupported";

export function permissionState(): Perm {
  if (typeof window === "undefined" || typeof Notification === "undefined") return "unsupported";
  return Notification.permission as Perm;
}

export async function requestPermission(): Promise<Perm> {
  try {
    return (await Notification.requestPermission()) as Perm;
  } catch {
    return "denied";
  }
}

/** نمایش اعلان — از سرویس‌ورکر، و در نبودش از خود صفحه. */
export async function showNotification(title: string, body: string, tag?: string) {
  const opts: NotificationOptions = { body, icon: "/icons/icon-192.png", tag, lang: "fa", dir: "rtl" };
  try {
    if ("serviceWorker" in navigator) {
      const reg = await Promise.race([
        navigator.serviceWorker.ready,
        new Promise<null>((r) => setTimeout(() => r(null), 1500)),
      ]);
      if (reg) {
        await reg.showNotification(title, opts);
        return;
      }
    }
  } catch {}
  try {
    new Notification(title, opts);
  } catch {}
}

/* ---------------- موتور زمان‌بندی ---------------- */

const iso = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

function runChecks() {
  if (permissionState() !== "granted") return;
  const s = readNotifySettings();
  if (!s.morning && !s.evening && !s.deadlines) return;

  const fired = readFired();
  const now = new Date();
  const today = iso(now);
  const mins = now.getHours() * 60 + now.getMinutes();
  let changed = false;

  // صبح: ۰۷:۰۰ تا ۱۲:۰۰ — یک بار در روز
  if (s.morning && mins >= 420 && mins < 720 && fired.morning !== today) {
    const dt = dayType(now);
    showNotification(
      "صبح بخیر — برنامه امروز",
      `${WEEKDAY_FA[now.getDay()]} است؛ ${DAY_LABEL[dt]} — هدف ${fa(TARGET_HOURS[dt])} ساعت یادگیری. اولین قدم را همین الان بردار.`,
      "plan10-morning",
    );
    fired.morning = today;
    changed = true;
  }

  // شب: از ۲۲:۳۰ — لاگ شبانه
  if (s.evening && mins >= 1350 && fired.evening !== today) {
    showNotification(
      "وقت لاگ شبانه",
      "خواب، انرژی، ساعت یادگیری و آب امروز را ثبت کن تا نمودارها به‌روز شن.",
      "plan10-evening",
    );
    fired.evening = today;
    changed = true;
  }

  // مهلت‌ها: ۷، ۳ و ۱ روز مانده
  if (s.deadlines) {
    const today0 = new Date(now);
    today0.setHours(0, 0, 0, 0);
    fired.deadlines = fired.deadlines ?? {};
    for (const ev of PLAN_EVENTS) {
      const g = toGregorian(ev.j[0], ev.j[1], ev.j[2]);
      const ev0 = new Date(g);
      ev0.setHours(0, 0, 0, 0);
      const diff = Math.round((ev0.getTime() - today0.getTime()) / 86400000);
      if (diff !== 1 && diff !== 3 && diff !== 7) continue;
      const dk = `${ev.id}#${diff}`;
      if (fired.deadlines[dk] === today) continue;
      showNotification(
        `مهلت نزدیک: ${fa(diff)} روز مانده`,
        `${ev.title}${ev.approx ? " — تاریخ تقریبی، از منبع رسمی چک کن" : ""}`,
        `plan10-dl-${ev.id}`,
      );
      fired.deadlines[dk] = today;
      changed = true;
    }
  }

  if (changed) saveFired(fired);
}

/** موتور زمان‌بندی — بی‌صدا در شل سایت نصب می‌شود. */
export function NotificationEngine() {
  React.useEffect(() => {
    const tick = () => {
      try {
        runChecks();
      } catch {}
    };
    tick();
    const timer = window.setInterval(tick, 60_000);
    const onVis = () => document.visibilityState === "visible" && tick();
    document.addEventListener("visibilitychange", onVis);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);
  return null;
}

/* ---------------- کارت تنظیمات ---------------- */

function Switch({
  checked,
  onChange,
  label,
  hint,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  hint: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-2.5">
      <div>
        <div className="text-sm font-medium">{label}</div>
        <div className="mt-0.5 text-xs text-muted-foreground">{hint}</div>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
          checked ? "bg-brand" : "bg-secondary"
        }`}
      >
        <span
          className={`absolute top-0.5 size-5 rounded-full bg-background shadow transition-all ${
            checked ? "start-0.5" : "start-5"
          }`}
        />
      </button>
    </div>
  );
}

/** کارت «یادآورها» برای صفحه تنظیمات. */
export function NotifySettingsCard() {
  const [perm, setPerm] = React.useState<Perm>("default");
  const [settings, setSettings] = React.useState<NotifySettings>(DEFAULT_NOTIFY);
  const [msg, setMsg] = React.useState<string | null>(null);

  React.useEffect(() => {
    setPerm(permissionState());
    setSettings(readNotifySettings());
  }, []);

  const update = (patch: Partial<NotifySettings>) => {
    const next = { ...settings, ...patch };
    setSettings(next);
    writeNotifySettings(next);
  };

  const enable = async () => {
    const p = await requestPermission();
    setPerm(p);
    setMsg(p === "granted" ? "فعال شد ✓" : p === "denied" ? "مرورگر مجوز نداد — از تنظیمات سایت در مرورگر بده." : null);
  };

  const test = async () => {
    const p = permissionState();
    if (p !== "granted") {
      const np = await requestPermission();
      setPerm(np);
      if (np !== "granted") return setMsg("برای اعلان آزمایشی اول مجوز لازمه.");
    }
    await showNotification("اعلان آزمایشی ✓", "یادآورهای برنامه ۱۰ ماهه درست کار می‌کنن.", "plan10-test");
    setMsg("ارسال شد — اگه ندیدی، اعلان‌های سایت را در مرورگر چک کن.");
  };

  const permBadge =
    perm === "granted" ? (
      <Badge variant="success">مجوز داده شده ✓</Badge>
    ) : perm === "denied" ? (
      <Badge variant="destructive">رد شده</Badge>
    ) : perm === "unsupported" ? (
      <Badge variant="secondary">پشتیبانی نمی‌شود</Badge>
    ) : (
      <Badge variant="secondary">در انتظار مجوز</Badge>
    );

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <BellRing className="size-5 text-brand" /> یادآورها (اعلان PWA)
          </CardTitle>
          {permBadge}
        </div>
      </CardHeader>
      <CardContent className="space-y-1 divide-y divide-border/60">
        <Switch
          checked={settings.morning}
          onChange={(v) => update({ morning: v })}
          label="برنامه صبح"
          hint="هر روز ساعت ۰۷:۰۰ — نوع روز و هدف ساعت امروز"
        />
        <Switch
          checked={settings.evening}
          onChange={(v) => update({ evening: v })}
          label="لاگ شبانه"
          hint="هر شب ساعت ۲۲:۳۰ — یادآوری ثبت خواب و انرژی"
        />
        <Switch
          checked={settings.deadlines}
          onChange={(v) => update({ deadlines: v })}
          label="هشدار مهلت‌ها"
          hint="۷، ۳ و ۱ روز مانده به رویدادهای تقویم (کنکور، امتحانات، ثبت‌نام)"
        />

        <div className="flex flex-wrap items-center gap-2 pt-3">
          {perm !== "granted" && perm !== "unsupported" && (
            <Button size="sm" onClick={enable}>
              <Bell /> فعال‌سازی اعلان‌ها
            </Button>
          )}
          <Button size="sm" variant="outline" onClick={test}>
            <Send /> اعلان آزمایشی
          </Button>
        </div>
        {msg && <p className="pt-2 text-xs text-muted-foreground">{msg}</p>}
        <p className="pt-2 text-xs leading-6 text-muted-foreground">
          یادآورها وقتی سایت بازه (یا نسخه نصب‌شده PWA در پس‌زمینه) کار می‌کنن و به اینترنت
          نیاز ندارن.
        </p>
      </CardContent>
    </Card>
  );
}
