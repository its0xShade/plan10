/** متن‌های تست تایپ — فارسی و انگلیسی (تک‌خطی، بدون Enter). */
export const TYPING_TEXTS = {
  fa: [
    "یادگیری برنامه‌نویسی مثل ورزش است؛ هر روز کمی تمرین کن تا عضله بسازی و بعد مسافت زیادی بدوی.",
    "مهم‌ترین مهارت بک‌اند نوشتن کد سریع نیست، بلکه فهم درست مسئله و طراحی سیستمی است که فردا قابل نگهداری باشد.",
    "هفته‌های اول سخت‌ترین بخش مسیرند؛ اگر پنج روز پیاپی تمرین کنی، مغزت عادت می‌کند و ادامه خودکار می‌شود.",
    "کد تمیز یعنی کدی که شش ماه بعد خودت هم بتوانی بدون دندان‌به‌هم‌کشیدن بخوانی و تغییر بدهی.",
    "تمرکز عمیق دو ساعته از ده ساعت حواس‌پرتی ارزشمندتر است؛ گوشی را در اتاق دیگر بگذار و تایمر را روشن کن.",
    "هر اشتباه در تایپ یک فرصت یادگیری است؛ سرعت زمانی می‌آید که دقت اول شده باشد.",
  ],
  en: [
    "The quick brown fox jumps over the lazy dog while the backend server keeps handling requests.",
    "Write clean code, test it well, and never trust the input that comes from the user.",
    "A good developer reads documentation first and searches the error message second.",
    "Caching makes the system fast, but invalidating the cache makes the system correct.",
    "Small steps every day compound into results that look like talent to everyone else.",
    "Functions should do one thing, do it well, and do only that single thing.",
  ],
} as const;

export type TypingMode = keyof typeof TYPING_TEXTS;

export const MODE_LABEL: Record<TypingMode, string> = { fa: "فارسی", en: "English" };
