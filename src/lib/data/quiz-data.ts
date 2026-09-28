export interface QuizQuestion {
  topic: string;
  q: string;
  options: [string, string, string, string];
  correct: 0 | 1 | 2 | 3;
  why: string;
}

/** بانک سؤال کوییز روزانه — هر روز ۵ سؤال تصادفی (ثابت برای همون روز) */
export const QUIZ_BANK: QuizQuestion[] = [
  { topic: "پایتون", q: "خروجی `print(type(lambda: 1))` چیست؟", options: ["<class 'function'>", "<class 'method'>", "<class 'builtin_function_or_method'>", "<class 'lambda'>"], correct: 0, why: "lambda یک شیء تابع معمولی (function) می‌سازد؛ تابع‌های built-in نوع دیگری دارند." },
  { topic: "پایتون", q: "GIL در پایتون چه چیزی را قفل می‌کند؟", options: ["حافظه شیء‌ها", "اجرای همزمان threadها روی هسته‌های CPU", "دسترسی به فایل‌ها", "اتصال‌های شبکه"], correct: 1, why: "GIL مانع اجرای همزمان چند thread پایتونی روی چند هسته می‌شود؛ برای موازی‌سازی CPU از multiprocessing استفاده کن." },
  { topic: "پایتون", q: "تفاوت generator و list در چیست؟", options: ["generator فقط اعداد دارد", "generator اعضا را تنها به‌هنگام نیاز می‌سازد (lazy)", "list سریع‌تر است", "تفاوتی ندارند"], correct: 1, why: "ژنراتور با yield مقادیر را یکی‌یکی تولید می‌کند و حافظه O(1) مصرف می‌کند." },
  { topic: "پایتون", q: "کدام مورد برای به‌اشتراک‌گذاری وضعیت بین درخواست‌های همزمان خطرناک است؟", options: ["متغیر سراسری mutable در ماژول", "متغیر داخل dependency با scope=request", "پارامتر get", "بدنه pydantic model"], correct: 0, why: "شیء سراسری بین همه درخواست‌ها مشترک است و race condition ایجاد می‌کند." },
  { topic: "پایتون", q: "عبارت `a += 1` وقتی a از نوع tuple باشد…", options: ["کار می‌کند", "خطا می‌دهد چون tuple تغییرناپذیر است", "یک کپی می‌سازد", "فقط داخل حلقه کار می‌کند"], correct: 1, why: "tuple نمی‌تواند درجا تغییر کند؛ += برای tuple هم در حالت محلی تعریف نشده و TypeError می‌دهد." },
  { topic: "FastAPI", q: "تفاوت `Depends(fastapi.Depends)` با متغیر سراسری چیست؟", options: ["هیچ", "Depends به‌ازای هر درخواست جداگانه اجرا می‌شود", "Depends سریع‌تر است", "Depends فقط در GET کار می‌کند"], correct: 1, why: "dependency ها به‌صورت پیش‌فرض per-request اجرا می‌شوند و state مشترک نمی‌سازند." },
  { topic: "FastAPI", q: "برای اعتبارسنجی ورودی، FastAPI از کدام کتابخانه استفاده می‌کند؟", options: ["Marshmallow", "Pydantic", "Cerberus", "JSON Schema دستی"], correct: 1, why: "مدل‌های Pydantic هم اعتبارسنجی و هم serialization را انجام می‌دهند." },
  { topic: "FastAPI", q: "وقتی یک endpoint async تعریف می‌کنی، باید…", options: ["حتماً threading استفاده کنی", "عملیات blocking مثل requests را در thread جدا اجرا کنی", "از jsonify کمک بگیری", "محدودیتی ندارد"], correct: 1, why: "کد async نباید event loop را بلاک کند؛ I/O بلاک را با run_in_executor یا httpx async انجام بده." },
  { topic: "FastAPI", q: "status code مناسب برای ایجاد موفق منبع؟", options: ["200", "201", "204", "301"], correct: 1, why: "201 Created برای ایجاد منبع جدید؛ 200 برای موفقیت معمول، 204 بدون بدنه." },
  { topic: "SQL", q: "ایندکس (INDEX) چه هزینه‌ای دارد؟", options: ["هیچ", "کند شدن INSERT/UPDATE/DELETE و حجم بیشتر", "کند شدن خواندن", "از بین رفتن تراکنش"], correct: 1, why: "ایندکس خواندن را تند می‌کند ولی نوشتن را کندتر و حجم جدول را بیشتر می‌کند." },
  { topic: "SQL", q: "ACID در دیتابیس به چه معناست؟", options: ["Atomicity, Consistency, Isolation, Durability", "Access, Cache, Index, Data", "Async, Concurrent, Independent, Distributed", "Add, Change, Insert, Delete"], correct: 0, why: "اَتمیک، سازگاری، ایزوله‌بودن، دوام — چهار ضمانت تراکنش." },
  { topic: "SQL", q: "تفاوت WHERE و HAVING در چیست؟", options: ["هیچ", "WHERE قبل و HAVING بعد از GROUP BY روی گروه‌ها فیلتر می‌کند", "فقط سینتکس", "HAVING برای جدول‌های بزرگ"], correct: 1, why: "WHERE روی سطرها، HAVING روی گروه‌های خروجی GROUP BY فیلتر می‌کند." },
  { topic: "SQL", q: "کدام کوئری سطرهای تکراری را حذف می‌کند؟", options: ["TRUNCATE", "DISTINCT / DELETE با self-join", "DROP", "ALTER"], correct: 1, why: "SELECT DISTINCT یا حذف با self-join بر اساس id کوچک‌تر." },
  { topic: "HTTP", q: "تفاوت GET و HEAD؟", options: ["هیچ", "HEAD مثل GET ولی بدون بدنه پاسخ", "HEAD فقط هدر می‌فرستد", "GET فقط JSON می‌پذیرد"], correct: 1, why: "HEAD همان هدرهای GET را برمی‌گرداند بدون بدنه — مناسب بررسی سلامت/حجم." },
  { topic: "HTTP", q: "کد وضعیت 429 یعنی…", options: ["پرداخت لازم است", "درخواست زیاد — محدودیت نرخ (rate limit)", "منبع حذف شده", "ورودی نامعتبر"], correct: 1, why: "Too Many Requests — کلاینت باید کندتر درخواست بدهد." },
  { topic: "HTTP", q: "CORS چه مشکلی را حل می‌کند؟", options: ["رمزگذاری", "امنیت دسترسی مرورگر از دامنه دیگر به API", "فشرده‌سازی", "load balancing"], correct: 1, why: "سیاست همان‌منبعی مرورگر را برای دامنه‌های مجاز باز می‌کند." },
  { topic: "HTTP", q: "تفاوت 401 و 403؟", options: ["هیچ", "401 = احراز هویت نشده، 403 = دسترسی ممنوع", "401 موقت است", "403 برای کلاینت"], correct: 1, why: "401 یعنی اول لاگین کن (هویت معلوم نیست)، 403 یعنی شناخته شدی ولی اجازه نداری." },
  { topic: "احراز هویت", q: "چرا JWT باید expire داشته باشد؟", options: ["برای سرعت", "چون اگر لو برود تا ابد معتبر می‌ماند", "الزام مرورگر", "برای کاهش حجم"], correct: 1, why: "JWT امضاشده قابل باطل‌کردن نیست؛ کوتاه‌بودن عمر + refresh token راه‌حل است." },
  { topic: "احراز هویت", q: "بهترین روش نگهداری رمز عبور؟", options: ["hash تک‌مرحله‌ای مثل md5", "bcrypt/scrypt/argon2 با salt", "رمزنگاری متقارن", "base64"], correct: 1, why: "تابع‌های KDF کند (bcrypt/argon2) با salt حمله brute-force را غیرعملی می‌کنند." },
  { topic: "احراز هویت", q: "نقش refresh token چیست؟", options: ["جایگزین JWT", "دریافت توکن کوتاه‌عمر جدید بدون ورود دوباره", "رمزگذاری درخواست", "ذخیره سشن سرور"], correct: 1, why: "access token کوتاه (مثلاً ۱۵ دقیقه)، refresh بلندمدت و قابل بازنشانی." },
  { topic: "Docker", q: "تفاوت Image و Container؟", options: ["یکی است", "Image الگو (فایل فقط‌خواندنی)، Container نمونه اجرایی آن", "Container سبک‌تر است", "Image اجرا می‌شود"], correct: 1, why: "از یک image می‌توان چند container اجرا کرد." },
  { topic: "Docker", q: "برای نگه‌داشتن داده بین restart های container از …", options: ["ENV", "Volume / bind mount", "Dockerfile", "Port"], correct: 1, why: "Volume خارج از چرخه عمر container ذخیره می‌کند." },
  { topic: "Docker", q: "دستور ساخت تصویر از Dockerfile؟", options: ["docker run", "docker build", "docker pull", "docker commit"], correct: 1, why: "docker build -t name:tag . تصویر می‌سازد؛ run از آن container اجرا می‌کند." },
  { topic: "Git", q: "تفاوت merge و rebase؟", options: ["هیچ", "rebase تاریخچه را خطی و تمیز می‌کند، merge یک commit ادغام می‌سازد", "merge خطرناک است", "rebase فقط برای tag"], correct: 1, why: "rebase روی branch عمومی نکن چون تاریخ را بازنویسی می‌کند." },
  { topic: "Git", q: "فرمان بازگردانی امن commit آخر به staging؟", options: ["git reset --hard HEAD~1", "git reset --soft HEAD~1", "git push --force", "git delete"], correct: 1, why: "soft تغییرات را نگه می‌دارد (staged)، hard همه‌چیز را پاک می‌کند." },
  { topic: "Git", q: "وقتی دو نفر همزمان یک فایل را تغییر دادند…", options: ["git همیشه خودش حل می‌کند", "merge conflict می‌دهد و باید دستی حل شود", "فایل حذف می‌شود", "commit دوم پاک می‌شود"], correct: 1, why: "تعارض را با باز کردن فایل، ادغام دستی و git add/commit حل کن." },
  { topic: "Redis", q: "Redis چیست؟", options: ["دیتابیس رابطه‌ای", "کش/حافظه کلید-مقدار در حافظه با انواع داده", "ابزار صف پیام", "سرور وب"], correct: 1, why: "برای کش، session، شمارنده و صف‌های سبک عالی است؛ ماندگاری هم دارد." },
  { topic: "Redis", q: "الگوی cache invalidation مناسب کتابخانه چیست؟", options: ["ذخیره ابدی", "TTL + باطل‌سازی هنگام نوشتن (write-through/invalidate)", "حذف کل keys هر روز", "بدون کش"], correct: 1, why: "هنگام آپدیت، کلید مرتبط را پاک یا تازه کن + TTL به‌عنوان کمربند ایمنی." },
  { topic: "طراحی API", q: "بهترین روش برای نسخه‌بندی API؟", options: ["هدر X-Version", "مسیر /v1/… یا هدر استاندارد Accept-Version", "پارامتر random", "بدون نسخه"], correct: 1, why: "نسخه در مسیر واضح‌ترین و رایج‌ترین رویکرد است؛ تغییر شکننده = نسخه جدید." },
  { topic: "طراحی API", q: "برای لیست بزرگ، صفحه‌بندی بهتر از OFFSET چیست؟", options: ["limit بالا", "keyset/cursor pagination", "بدون صفحه‌بندی", "跳"], correct: 1, why: "OFFSET روی داده بزرگ کند است؛ cursor بر اساس کلید قبلی سریع و پایدار است." },
  { topic: "امنیت", q: "مهم‌ترین راه پیشگیری از SQL Injection؟", options: ["فقط escape دستی", "استفاده از parameterized query / ORM", "WAF", "پنهان‌کردن خطاها"], correct: 1, why: "کوئری پارامتریک ورودی را داده می‌داند نه دستور." },
  { topic: "امنیت", q: "تست‌های واحد در پروژه بک‌اند چه چیزی را تضمین می‌کنند؟", options: ["زیبایی کد", "درستی منطق توابع در شرایط مرزی", "سرعت سرور", "طراحی UI"], correct: 1, why: "منطق خالص را بدون نیاز به سرور/دیتابیس کامل تست می‌کنند." },
  { topic: "مفاهیم", q: "REST باید … باشد.", options: ["stateful", "stateless", "async همیشه", "فقط JSON"], correct: 1, why: "هر درخواست باید مستقل باشد؛ وضعیت در سمت کلاینت/توکن نگه داشته می‌شود." },
  { topic: "مفاهیم", q: "تست یکپارچه‌سازی (integration) چه بخشی را پوشش می‌دهد؟", options: ["فقط توابع", "تعامل چند جزء مثل API + دیتابیس", "فقط CSS", "فقط سرور"], correct: 1, why: "مسیر واقعی درخواست تا دیتابیس/سرویس جانبی را بررسی می‌کند." },
  { topic: "مفاهیم", q: "کدام مورد «deferred import» یا lazy است؟", options: ["نصب همه چیز در اول راه‌اندازی", "بارگذاری ماژول فقط هنگام نیاز", "کپی کل دیتابیس", "تست هر کامیت"], correct: 1, why: "Lazy بارگذاری زمان راه‌اندازی و مصرف حافظه را کم می‌کند." },
];

/** انتخاب ۵ سؤال ثابت بر اساس تاریخ (هر روز ست جدید، برای همون روز ثابت) */
export function dailyQuestions(dateKey: string, count = 5): QuizQuestion[] {
  let h = 2166136261;
  for (const ch of dateKey) {
    h ^= ch.charCodeAt(0);
    h = Math.imul(h, 16777619);
  }
  const idx = Array.from({ length: QUIZ_BANK.length }, (_, i) => i);
  for (let i = idx.length - 1; i > 0; i--) {
    h = Math.imul(h ^ (h >>> 15), 2246822507);
    const j = Math.abs(h) % (i + 1);
    [idx[i], idx[j]] = [idx[j], idx[i]];
  }
  return idx.slice(0, count).map((i) => QUIZ_BANK[i]);
}
