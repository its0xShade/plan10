"use client";

import * as React from "react";
import { useMounted } from "@/lib/use-mounted";
import { Settings, Download, Upload, Database, ShieldCheck, FileJson } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { NotifySettingsCard } from "@/components/notify-engine";
import { useTargets, DEFAULT_TARGETS, type WeeklyTargets } from "@/lib/targets";
import { CardDescription } from "@/components/ui/card";
import { RotateCcw, Target } from "lucide-react";
import { fa } from "@/lib/utils";
import { formatJalali } from "@/lib/jalali";
import {
  applyBackup,
  backupFilename,
  collectBackup,
  describeBackup,
  isBackupFile,
  type BackupFile,
} from "@/lib/backup";

/** کارت بکاپ: دانلود JSON + بازیابی با پیش‌نمایش. */
function BackupCard() {
  const [preview, setPreview] = React.useState<{ name: string; file: BackupFile } | null>(null);
  const [msg, setMsg] = React.useState<{ ok: boolean; text: string } | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const exportNow = () => {
    try {
      const b = collectBackup();
      const n = Object.keys(b.data).length;
      if (n === 0) return setMsg({ ok: false, text: "هنوز داده‌ای برای بکاپ وجود نداره." });
      const blob = new Blob([JSON.stringify(b, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = backupFilename();
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 4000);
      setMsg({ ok: true, text: `دانلود شد: ${fa(n)} کلید (${backupFilename()})` });
    } catch {
      setMsg({ ok: false, text: "ساخت فایل بکاپ شکست خورد." });
    }
  };

  const onFile = async (f: File | undefined) => {
    if (!f) return;
    setMsg(null);
    setPreview(null);
    try {
      const parsed = JSON.parse(await f.text());
      if (!isBackupFile(parsed)) throw new Error("bad");
      setPreview({ name: f.name, file: parsed });
    } catch {
      setMsg({ ok: false, text: "فایل معتبر نیست — فایل بکاپ همین سایت باشه." });
    }
  };

  const restore = () => {
    if (!preview) return;
    const n = Object.keys(preview.file.data).length;
    if (!confirm(`کلیدهای بکاپ (${fa(n)} مورد) جایگزین داده‌های فعلی بشن؟`)) return;
    const written = applyBackup(preview.file.data);
    setMsg({ ok: true, text: `بازیابی شد (${fa(written)} کلید) — صفحه رفرش می‌شه…` });
    setTimeout(() => location.reload(), 900);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <FileJson className="size-5 text-brand" /> بکاپ JSON
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <Button size="sm" onClick={exportNow}>
            <Download /> دانلود بکاپ
          </Button>
          <Button size="sm" variant="outline" onClick={() => inputRef.current?.click()}>
            <Upload /> بازیابی از فایل
          </Button>
          <input
            ref={inputRef}
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={(e) => {
              void onFile(e.target.files?.[0]);
              e.target.value = "";
            }}
          />
        </div>

        {preview && (
          <div className="rounded-lg border border-brand/40 bg-accent/30 p-3">
            <div className="mb-1 flex flex-wrap items-center gap-2 text-sm">
              <Badge variant="brand">آماده بازیابی</Badge>
              <span className="font-medium">{preview.name}</span>
            </div>
            <p className="mb-2 text-xs text-muted-foreground">
              تهیه‌شده در {formatJalali(new Date(preview.file.exportedAt), { weekday: true })} ·{" "}
              {fa(Object.keys(preview.file.data).length)} کلید
            </p>
            <ul className="mb-3 grid gap-1 text-xs text-muted-foreground sm:grid-cols-2">
              {describeBackup(preview.file.data).map((it) => (
                <li key={it.label} className="flex items-center justify-between gap-2 rounded border border-border/60 px-2 py-1">
                  <span>{it.label}</span>
                  <span className="text-foreground/70">{it.detail}</span>
                </li>
              ))}
            </ul>
            <Button size="sm" onClick={restore}>
              <ShieldCheck /> بازیابی (جایگزینی)
            </Button>
          </div>
        )}

        {msg && (
          <p className={`text-xs ${msg.ok ? "text-success" : "text-destructive"}`}>{msg.text}</p>
        )}
        <p className="text-xs leading-6 text-muted-foreground">
          بکاپ شامل رودمپ، لاگ و ژورنال، کوییز، LeetCode، کتابخانه، تقویم، یادآورها و تنظیمات تم
          است — همه در همین مرورگر.
        </p>
      </CardContent>
    </Card>
  );
}

/** کارت وضعیت فعلی داده‌ها. */
function DataStatusCard() {
  const mounted = useMounted();
  const items = mounted ? describeBackup(collectBackup().data) : [];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Database className="size-5 text-brand" /> وضعیت داده‌ها
        </CardTitle>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground">هنوز داده‌ای ذخیره نشده.</p>
        ) : (
          <ul className="grid gap-1.5 text-sm sm:grid-cols-2">
            {items.map((it) => (
              <li
                key={it.label}
                className="flex items-center justify-between gap-2 rounded-lg border border-border/60 px-3 py-2"
              >
                <span>{it.label}</span>
                <span className="text-xs text-muted-foreground">{it.detail}</span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

/** کارت اهداف هفتگی — به‌جای مقادیر ثابت ۴۱ ساعت و غیره. */
function TargetsCard() {
  const [targets, setTargets] = useTargets();
  const weeklyTotal = 5 * targets.school + targets.thu + targets.fri;

  const FIELDS: { key: keyof WeeklyTargets; label: string; suffix: string }[] = [
    { key: "school", label: "ساعت یادگیری هر روز مدرسه", suffix: "ساعت/روز" },
    { key: "thu", label: "پنجشنبه (تعطیل)", suffix: "ساعت" },
    { key: "fri", label: "جمعه (تعطیل)", suffix: "ساعت" },
    { key: "lang", label: "زبان انگلیسی", suffix: "ساعت/هفته" },
    { key: "sport", label: "ورزش / کالستنیکس", suffix: "ساعت/هفته" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-base">
          <span className="flex items-center gap-2">
            <Target className="size-5 text-brand" /> اهداف هفتگی قابل تنظیم
          </span>
          <Button variant="ghost" size="sm" onClick={() => setTargets(DEFAULT_TARGETS)}>
            <RotateCcw /> پیش‌فرض
          </Button>
        </CardTitle>
        <CardDescription>
          جمع روزهای مدرسه‌ای: <b className="text-foreground">{fa(weeklyTotal)} ساعت/هفته</b> — هشدارها و
          نمودارها از همین‌جا حساب می‌کنند
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-2">
          {FIELDS.map((f2) => (
            <label key={f2.key} className="block">
              <span className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
                {f2.label}
                <span className="text-[10px]">{f2.suffix}</span>
              </span>
              <input
                type="number"
                inputMode="decimal"
                step={0.5}
                min={0}
                max={24}
                value={targets[f2.key]}
                onChange={(e) => {
                  const v = Number(e.target.value);
                  setTargets({ [f2.key]: Number.isFinite(v) && v >= 0 ? v : 0 });
                }}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-brand/50"
                dir="ltr"
              />
            </label>
          ))}
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          هر تغییر فوراً ذخیره می‌شود و در بکاپ JSON هم قرار می‌گیرد.
        </p>
      </CardContent>
    </Card>
  );
}

export default function SettingsPage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-black">
          <Settings className="size-6 text-brand" /> تنظیمات، بکاپ و یادآورها
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          اعلان‌ها، خروجی/ورودی JSON و وضعیت داده‌های این مرورگر — همه یک‌جا.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <TargetsCard />
        <BackupCard />
        <NotifySettingsCard />
        <div className="lg:col-span-2">
          <DataStatusCard />
        </div>
      </div>
    </div>
  );
}
