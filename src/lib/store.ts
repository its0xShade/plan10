"use client";

import * as React from "react";

/** هوک ساده ذخیره‌سازی localStorage — SSR-safe (مقدار اولیه تا افکت اول همون است). */
export function useStore<T>(key: string, initial: T) {
  const [value, setValue] = React.useState<T>(initial);
  const ready = React.useRef(false);

  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw != null) setValue(JSON.parse(raw));
    } catch {}
    ready.current = true;
  }, [key]);

  const update = React.useCallback(
    (next: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const v = typeof next === "function" ? (next as (p: T) => T)(prev) : next;
        if (ready.current) {
          try {
            localStorage.setItem(key, JSON.stringify(v));
          } catch {}
        }
        return v;
      });
    },
    [key],
  );

  return [value, update] as const;
}

/* ---------------- تاریخ و هفته ---------------- */

const pad = (n: number) => String(n).padStart(2, "0");

export const toISO = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

export const todayISO = () => toISO(new Date());

export const fromISO = (s: string) => {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
};

export const WEEKDAY_FA = ["یکشنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنجشنبه", "جمعه", "شنبه"];

export type DayType = "school" | "thu" | "fri";

/** شنبه تا چهارشنبه = مدرسه، پنجشنه ≈ ۶۰٪، جمعه تعطیل */
export function dayType(d = new Date()): DayType {
  const w = d.getDay();
  if (w === 5) return "fri";
  if (w === 4) return "thu";
  return "school";
}

export const DAY_LABEL: Record<DayType, string> = {
  school: "روز مدرسه",
  thu: "پنجشنه نیمه‌تعطیل (۶۰٪)",
  fri: "جمعه تعطیل (۴۰٪ + خانواده)",
};

/** هدف ساعت یادگیری در هر نوع روز */
export const TARGET_HOURS: Record<DayType, number> = { school: 6, thu: 3.5, fri: 2.5 };

/** روزهای شنبه تا جمعه هفته‌ای که تاریخ داخلش است */
export function weekDates(d = new Date()): string[] {
  const sinceSat = (d.getDay() + 1) % 7;
  const sat = new Date(d);
  sat.setDate(d.getDate() - sinceSat);
  return Array.from({ length: 7 }, (_, i) => {
    const x = new Date(sat);
    x.setDate(sat.getDate() + i);
    return toISO(x);
  });
}

export const shortDay = (iso: string) => WEEKDAY_FA[fromISO(iso).getDay()].replace("شنبه", "ش").replace("یکشنبه", "ی").replace("دوشنبه", "د").replace("سه‌شنبه", "س").replace("چهارشنبه", "چ").replace("پنجشنبه", "پ").replace("جمعه", "ج");
