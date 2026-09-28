import { toJalali } from "@/lib/jalali";

/** بکاپ JSON کل داده‌های برنامه در localStorage — خروجی و بازیابی. */

export const BACKUP_APP = "plan10-backup";
export const BACKUP_VERSION = 1;

const EXPLICIT = new Set(["theme", "roadmap-done-v1"]);
const isOurs = (k: string) => EXPLICIT.has(k) || k.startsWith("plan10");

export interface BackupFile {
  app: string;
  version: number;
  exportedAt: string;
  data: Record<string, string>;
}

/** جمع‌آوری همه کلیدهای برنامه از localStorage (مقادیر خام رشته). */
export function collectBackup(): BackupFile {
  const data: Record<string, string> = {};
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (!k || !isOurs(k)) continue;
    const v = localStorage.getItem(k);
    if (v != null) data[k] = v;
  }
  return { app: BACKUP_APP, version: BACKUP_VERSION, exportedAt: new Date().toISOString(), data };
}

/** اعتبارسنجی فایل بکاپ قبل از بازیابی. */
export function isBackupFile(x: unknown): x is BackupFile {
  if (!x || typeof x !== "object") return false;
  const o = x as Record<string, unknown>;
  if (o.app !== BACKUP_APP) return false;
  if (typeof o.version !== "number" || o.version > BACKUP_VERSION) return false;
  if (!o.data || typeof o.data !== "object") return false;
  return Object.values(o.data as Record<string, unknown>).every((v) => typeof v === "string");
}

/** بازیابی: نوشتن کلیدها در localStorage — تعداد نوشته‌شده را برمی‌گرداند. */
export function applyBackup(data: Record<string, string>): number {
  let n = 0;
  for (const [k, v] of Object.entries(data)) {
    if (!isOurs(k) || typeof v !== "string") continue;
    try {
      localStorage.setItem(k, v);
      n++;
    } catch {}
  }
  return n;
}

const LABELS: Record<string, string> = {
  theme: "تم رابط کاربری",
  "plan10.accent": "اکسنت رنگی",
  "roadmap-done-v1": "رودمپ بک‌اند",
  "plan10.log": "لاگ روزانه و ژورنال",
  "plan10.quiz": "کوییز روزانه",
  "plan10.leetcode": "تخته LeetCode",
  "plan10.books": "کتابخانه",
  "plan10.events": "رویدادهای تقویم",
  "plan10.notify": "یادآورها",
  "plan10.notify.fired": "تاریخچه اعلان‌ها",
  "plan10.targets": "اهداف هفتگی قابل تنظیم",
  "plan10.pomo": "سشن‌های پومودورو",
  "plan10.srs": "زمان‌بندی فلش‌کارت (SRS)",
  "plan10.typing": "رکورد تست تایپ",
};

export interface BackupItem {
  label: string;
  detail: string;
}

/** توضیخ محتوای بکاپ برای نمایش قبل از بازیابی. */
export function describeBackup(data: Record<string, string>): BackupItem[] {
  const known: BackupItem[] = [];
  const rest: BackupItem[] = [];
  for (const [k, v] of Object.entries(data)) {
    let detail = "";
    try {
      const p = JSON.parse(v);
      if (p && typeof p === "object") detail = `${Object.keys(p).length} رکورد`;
      else detail = String(p);
    } catch {
      detail = v.length > 40 ? `${v.length} نویسه` : v;
    }
    const item = { label: LABELS[k] ?? k, detail };
    (LABELS[k] ? known : rest).push(item);
  }
  return [...known, ...rest];
}

/** نام فایل با تاریخ شمسی: plan10-backup-1405-07-04.json */
export function backupFilename(): string {
  const { jy, jm, jd } = toJalali(new Date());
  const p = (n: number) => String(n).padStart(2, "0");
  return `plan10-backup-${jy}-${p(jm)}-${p(jd)}.json`;
}
