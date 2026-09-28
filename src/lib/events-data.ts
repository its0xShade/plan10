import { toGregorian } from "@/lib/jalali";

export interface PlanEvent {
  id: string;
  title: string;
  /** تاریخ شمسی [سال، ماه، روز] */
  j: [number, number, number];
  cat: "کنکور" | "معدل" | "سربازی" | "دانشگاه" | "درآمد" | "برنامه";
  /** تاریخ تقریبی — باید از منبع رسمی چک بشه */
  approx?: boolean;
  note?: string;
}

/** مهلت‌ها و مناسبت‌های واقعی برنامه (از فایل‌های md استخراج شده) */
export const PLAN_EVENTS: PlanEvent[] = [
  { id: "start", title: "شروع برنامه ۱۰ ماهه — فاز ۱", j: [1405, 7, 1], cat: "برنامه", note: "مهر ۱۴۰۵" },
  { id: "reg", title: "ثبت‌نام کنکور سراسری (سنجش)", j: [1405, 8, 15], cat: "کنکور", approx: true, note: "آبان ۱۴۰۵ — تاریخ دقیق را از سایت سنجش چک کن" },
  { id: "gpa1", title: "پایان نیم‌سال اول — معدل ≥۱۶", j: [1405, 11, 1], cat: "معدل", note: "بهمن ۱۴۰۵ — میان‌ترم‌ها" },
  { id: "dip-reg", title: "پرسش از دفتر وظیفه (مسیر معافیت تحصیلی)", j: [1406, 10, 10], cat: "سربازی", note: "دی ۱۴۰۵ — طبق ترکر سربازی" },
  { id: "income", title: "شروع درآمد — فاز ۴ (اسفند)", j: [1405, 12, 1], cat: "درآمد", note: "اولین سفارش فریلنسری" },
  { id: "konkur-start", title: "شروع رسمی خواندن کنکور (۲–۳ ساعت/روز)", j: [1406, 1, 1], cat: "کنکور", note: "فروردین ۱۴۰۶ — فاز ۵" },
  { id: "apps-open", title: "پذیرش سوابق تحصیلی دانشگاه آزاد — پیگیری", j: [1406, 2, 15], cat: "دانشگاه", approx: true, note: "اردیبهشت ۱۴۰۶ — سایت azmoon.iau.ir.ir" },
  { id: "finals", title: "امتحانات نهایی دوازدهم ← معدل دیپلم", j: [1406, 3, 1], cat: "معدل", note: "خرداد ۱۴۰۶ — اولویت ۱: هر امتحان ≥۱۷" },
  { id: "diploma", title: "دریافت دیپلم (معدل ≥۱۶)", j: [1406, 3, 25], cat: "معدل", note: "خرداد ۱۴۰۶" },
  { id: "konkur", title: "آزمون کنکور سراسری", j: [1406, 4, 12], cat: "کنکور", approx: true, note: "تیر ۱۴۰۶ — تاریخ قطعی از سایت سنجش" },
  { id: "uni-reg", title: "ثبت‌نام دانشگاه (سوابق تحصیلی/آزاد)", j: [1406, 6, 1], cat: "دانشگاه", note: "مهر ۱۴۰۶ — پایان برنامه" },
];

const pad = (n: number) => String(n).padStart(2, "0");

/** رشته iCalendar برای افزودن به تقویم گوشی */
export function buildICS(events: PlanEvent[]): string {
  const now = new Date();
  const dtstamp =
    `${now.getUTCFullYear()}${pad(now.getUTCMonth() + 1)}${pad(now.getUTCDate())}` +
    `T${pad(now.getUTCHours())}${pad(now.getUTCMinutes())}${pad(now.getUTCSeconds())}Z`;

  // تا خط ۷۵ بایت تا می‌شود (بدون شکستن UTF-8)
  const fold = (line: string) => {
    const bytes = new TextEncoder().encode(line);
    if (bytes.length <= 75) return line;
    const parts: string[] = [];
    let cur = "";
    let curBytes = 0;
    for (const ch of line) {
      const b = new TextEncoder().encode(ch).length;
      if (curBytes + b > 74) {
        parts.push(cur);
        cur = " " + ch;
        curBytes = 1 + b;
      } else {
        cur += ch;
        curBytes += b;
      }
    }
    if (cur) parts.push(cur);
    return parts.join("\r\n");
  };

  const lines: string[] = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Plan10//FA//IR", "CALSCALE:GREGORIAN", "X-WR-CALNAME:برنامه ۱۰ ماهه"];

  events.forEach((ev, i) => {
    const [y, m, d] = ev.j;
    const g = toGregorian(y, m, d);
    const date = `${g.getFullYear()}${pad(g.getMonth() + 1)}${pad(g.getDate())}`;
    const end = new Date(g);
    end.setDate(end.getDate() + 1);
    const endDate = `${end.getFullYear()}${pad(end.getMonth() + 1)}${pad(end.getDate())}`;
    const desc = [ev.note, ev.approx ? "⚠ تاریخ تقریبی — از منبع رسمی چک کن" : ""].filter(Boolean).join(" — ");
    lines.push(
      "BEGIN:VEVENT",
      `UID:plan10-${ev.id}-${i}@plan10.local`,
      `DTSTAMP:${dtstamp}`,
      `DTSTART;VALUE=DATE:${date}`,
      `DTEND;VALUE=DATE:${endDate}`,
      fold(`SUMMARY:${ev.title}`),
      ...(desc ? [fold(`DESCRIPTION:${desc}`)] : []),
      "END:VEVENT",
    );
  });

  lines.push("END:VCALENDAR");
  return lines.join("\r\n");
}
