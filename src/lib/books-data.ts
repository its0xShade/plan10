export interface BookSeed {
  id: string;
  title: string;
  author: string;
  pages: number;
}

/** ۱۰ کتاب هدف (قابل ویرایش/افزودن از صفحه کتابخانه) */
export const BOOKS_SEED: BookSeed[] = [
  { id: "atomic", title: "عادت‌های اتمی", author: "جیمز کلیر", pages: 320 },
  { id: "deepwork", title: "کار عمیق (Deep Work)", author: "کال نیوپورت", pages: 304 },
  { id: "cleancode", title: "Clean Code", author: "رابرت سی. مارتین", pages: 464 },
  { id: "pragmatic", title: "The Pragmatic Programmer", author: "هانت و توماس", pages: 352 },
  { id: "thinking", title: "هنر شفاف اندیشیدن", author: "رولف دوبلی", pages: 208 },
  { id: "lean", title: "استارتاپ ناب (The Lean Startup)", author: "اریک ریس", pages: 336 },
  { id: "zero", title: "از صفر به یک (Zero to One)", author: "پیتر تیل", pages: 224 },
  { id: "7habits", title: "۷ عادت افراد بسیار مؤثر", author: "استیون کاوی", pages: 372 },
  { id: "ddia", title: "طراحی سیستم‌های داده‌محور (DDIA)", author: "مارتین کلپمن", pages: 616 },
  { id: "showyourwork", title: "کارت را نشان بده (Show Your Work!)", author: "آستین کلین", pages: 224 },
];
