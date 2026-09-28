"use client";

import { useStore } from "@/lib/store";

/** ثبت خودکار پومودورو در لاگ — plan10.pomo: { "YYYY-MM-DD": { n, min } } */
export interface PomoDay {
  n?: number; // تعداد سشن کامل
  min?: number; // دقیقه جمع‌شده
}

export type PomoMap = Record<string, PomoDay>;

export const POMO_KEY = "plan10.pomo";

export function usePomoLog() {
  return useStore<PomoMap>(POMO_KEY, {});
}

/** افزودن یک سشن کامل به روز داده‌شده */
export function addSession(map: PomoMap, iso: string, minutes: number): PomoMap {
  const cur = map[iso] ?? {};
  return { ...map, [iso]: { n: (cur.n ?? 0) + 1, min: (cur.min ?? 0) + minutes } };
}

/** جمع امروز */
export const pomoToday = (map: PomoMap, iso: string): { n: number; min: number } => ({
  n: map[iso]?.n ?? 0,
  min: map[iso]?.min ?? 0,
});

/** جمع کل */
export const pomoTotal = (map: PomoMap): { n: number; min: number } =>
  Object.values(map).reduce<{ n: number; min: number }>(
    (a, d) => ({ n: a.n + (d.n ?? 0), min: a.min + (d.min ?? 0) }),
    { n: 0, min: 0 },
  );
