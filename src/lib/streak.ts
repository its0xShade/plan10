import { toISO, fromISO } from "@/lib/store";

/** رشته روزهای متوالی ثبت‌شده (لاگ) — استریک فعلی و بهترین استریک. */
export interface Streak {
  current: number;
  best: number;
  /** آیا امروز هنوز ثبت نشده (برای نمایش «امروز را ثبت کن») */
  todayPending: boolean;
}


/** روزی «ثبت‌شده» حساب می‌شود که حداقل یک فیلد معتبر داشته باشد. */
function hasEntry(log: unknown): boolean {
  if (!log || typeof log !== "object") return false;
  return Object.values(log as Record<string, unknown>).some(
    (v) => v !== undefined && v !== null && v !== "" && v !== 0,
  );
}

export function calcStreak(logs: Record<string, unknown>): Streak {
  const days = Object.keys(logs).filter((k) => hasEntry(logs[k]));
  if (days.length === 0) return { current: 0, best: 0, todayPending: true };

  const set = new Set(days);
  const today = new Date();

  // بهترین استریک: مرور روزهای ثبت‌شده به ترتیب
  const sorted = [...days].sort();
  let best = 1;
  let run = 1;
  for (let i = 1; i < sorted.length; i++) {
    const prev = fromISO(sorted[i - 1]);
    const cur = fromISO(sorted[i]);
    const diff = Math.round((cur.getTime() - prev.getTime()) / 86400000);
    if (diff === 1) run++;
    else run = 1;
    if (run > best) best = run;
  }

  // استریک فعلی: از امروز (یا دیروز اگر امروز ثبت نشده) به عقب
  const cursor = new Date(today);
  if (!set.has(toISO(cursor))) {
    cursor.setDate(cursor.getDate() - 1);
    if (!set.has(toISO(cursor))) return { current: 0, best, todayPending: !set.has(toISO(today)) };
  }
  let current = 0;
  while (set.has(toISO(cursor))) {
    current++;
    cursor.setDate(cursor.getDate() - 1);
  }

  return { current, best, todayPending: !set.has(toISO(today)) };
}

/** فاصله روز بین دو تاریخ ISO */
export const dayDiff = (aISO: string, bISO: string) =>
  Math.round((fromISO(aISO).getTime() - fromISO(bISO).getTime()) / 86400000);
