"use client";

import * as React from "react";
import { useStore, type DayType } from "@/lib/store";

/** اهداف هفتگی قابل تنظیم — به‌جای مقادیر ثابت.
 *  school/thu/fri = ساعت یادگیری در هر نوع روز · lang/sport = ساعت در هفته. */
export interface WeeklyTargets {
  school: number;
  thu: number;
  fri: number;
  lang: number;
  sport: number;
}

export const TARGETS_KEY = "plan10.targets";

export const DEFAULT_TARGETS: WeeklyTargets = {
  school: 6,
  thu: 3.5,
  fri: 2.5,
  lang: 3.5,
  sport: 5,
};

/** هوک اهداف — مقدار با تنظیمات کاربر ادغام می‌شود. */
export function useTargets(): [WeeklyTargets, (patch: Partial<WeeklyTargets>) => void] {
  const [raw, setRaw] = useStore<Partial<WeeklyTargets>>(TARGETS_KEY, {});
  const targets = React.useMemo<WeeklyTargets>(() => ({ ...DEFAULT_TARGETS, ...raw }), [raw]);
  const patch = React.useCallback(
    (p: Partial<WeeklyTargets>) => setRaw((prev) => ({ ...DEFAULT_TARGETS, ...prev, ...p })),
    [setRaw],
  );
  return [targets, patch];
}

/** ساعت هدف یک روز خاص بر اساس اهداف */
export const targetOfDay = (dt: DayType, t: WeeklyTargets): number => t[dt] ?? DEFAULT_TARGETS[dt];

/** جمع ساعت هدف یک هفته شنبه‌تا‌جمعه */
export const weekTargetOf = (t: WeeklyTargets): number => 5 * t.school + t.thu + t.fri;
