export interface InterviewQA {
  topic: string;
  level: "پایه" | "متوسط" | "پیشرفته";
  q: string;
  a: string;
}

/** بانک سؤالات مصاحبه بک‌اند جونیور — پاسخ کوتاه و مصاحبه‌پسند */
export const INTERVIEW_BANK: InterviewQA[] = [
  { topic: "پایتون", level: "پایه", q: "تفاوت لیست و tuple چیست؟", a: "لیست mutable و tuple immutable است؛ tuple سریع‌تر و hashable است (برای کلید dict/ست)" },
  { topic: "پایتون", level: "پایه", q: "dict و set از نظر ساختار داخلی چه شباهتی دارند؟", a: "هر دو hash table هستند؛ dict جفت کلید-مقدار و set فقط کلید یکتا نگه می‌دارد. دسترسی O(1) میانگین." },
  { topic: "پایتون", level: "متوسط", q: "GIL چیست و چه زمانی مشکل‌ساز می‌شود؟", a: "قفلی که اجرای همزمان bytecode دو thread را در یک لحظه ممنوع می‌کند. برای I/O مشکلی نیست (await می‌دهد) ولی محاسبات CPU-bound موازی نمی‌شود — راه‌حل: multiprocessing یا worker در زبان دیگر." },
  { topic: "پایتون", level: "متوسط", q: "asyncio چطور کار می‌کند؟", a: "یک event loop تک‌نخست (single-threaded) دارد؛ coroutine ها تا نقطه await تحویل می‌دهند و loop درخواست‌های I/O را همزمان پیگیری می‌کند. بنابراین کد async نباید blocking باشد." },
  { topic: "پایتون", level: "متوسط", q: "decorator چیست؟ مثال بزن.", a: "تابعی که تابع دیگری را می‌گیرد و با return wrapper رفتارش را تغییر می‌دهد؛ مثال @login_required برای کنترل دسترسی یا @lru_cache برای کش." },
  { topic: "پایتون", level: "پایه", q: "تفاوت is و == چیست؟", a: "is هویت (همان شیء در حافظه)، == مقادیر را مقایسه می‌کند. برای None همیشه از is استفاده کن." },
  { topic: "پایتون", level: "پیشرفته", q: "مموری لیک در پایتون چطور پیش می‌آید؟", a: "referência‌های چرخه‌ای (مثلاً exception با traceback که به frame وصل است) + نگه‌داشتن reference در سراسری/کش. راه‌حل: del، weakref، محدودکردن کش." },
  { topic: "FastAPI", level: "پایه", q: "چرا FastAPI سریع است؟", a: "اسناد OpenAPI خودکار از type hints + اعتبارسنجی Pydantic در مرز ورودی (زبان‌های کامپایل‌شده پشت پرده) و پایه ASGI با uvicorn." },
  { topic: "FastAPI", level: "متوسط", q: "scope های Depends چیست؟", a: "پیش‌فرض request یعنی به‌ازای هر درخواست؛ با yield در dependency می‌توان cleanup داشت؛ برای state مشترک نباید از سراسری mutable استفاده کرد." },
  { topic: "FastAPI", level: "متوسط", q: "BackgroundTasks کی مناسب است؟", a: "کارهای کوتاه‌بعد از پاسخ (ارسال ایمیل، لاگ) که نیاز به صف قوی ندارند؛ برای کار طولانی/مطمئن باید Celery/RQ با Redis باشد." },
  { topic: "FastAPI", level: "پایه", q: "تفاوت Pydantic v1 و v2؟", a: "v2 با Rust بازنویسی شده (سریع‌تر)، تغییر در الگوهای validator (field_validator) و Config به model_config." },
  { topic: "دیتابیس", level: "پایه", q: "ایندکس کی بسازیم؟", a: "روی ستون‌هایی که در WHERE/JOIN/ORDER BY پرتکرارند (به‌ویژه کلید اصلی/خارجی)؛ نه روی هر ستون — هر ایندکس هزینه نوشتن دارد." },
  { topic: "دیتابیس", level: "متوسط", q: "N+1 query چیست؟", a: "یک کوئری برای لیست + به‌ازای هر سطر یک کوئری روابط. راه‌حل: eager loading (join یا selectin در SQLAlchemy)." },
  { topic: "دیتابیس", level: "متوسط", q: "سطوح ایزوله‌سازی تراکنش را نام ببر.", a: "Read Uncommitted (dirty)، Read Committed، Repeatable Read، Serializable — هزینه/دقت رابطه معکوس دارند؛ پیش‌فرض اکثر DB ها Read Committed." },
  { topic: "دیتابیس", level: "متوسط", q: "ORM چه چیزی را از دست می‌دهیم؟", a: "کنترل دقیق کوئری و بهینگی — راه‌حل: کوئری اختصاصی/بهینه برای مسیرهای حساس + بررسی EXPLAIN." },
  { topic: "دیتابیس", level: "پایه", q: "نرمال‌سازی ۳NF خلاصه چیست؟", a: "هر ستون وابسته به کلید اصلی باشد، نه به کلید دیگر؛ حذف وابستگی‌های جزئی و تکرار — با trade-off گاهی denormalize برای سرعت." },
  { topic: "HTTP/شبکه", level: "پایه", q: "مسیر یک درخواست HTTP از مرورگر تا سرور؟", a: "DNS → TCP handshake → (TLS) → ارسال request → پردازش سرور (nginx → app) → response. سپس render." },
  { topic: "HTTP/شبکه", level: "متوسط", q: "HTTP/2 چه بهبودی دارد؟", a: "multiplexing چند درخواست روی یک TCP، هدر فشرده‌شده (HPACK)، server push و اولویت‌بندی جریان‌ها." },
  { topic: "HTTP/شبکه", level: "پایه", q: "Cookie و Token تفاوت؟", a: "cookie سمت مرورگر به‌صورت خودکار ارسال می‌شود (خطر CSRF)، توکن در هدر Authorization و معمولاً stateless است (خطر نگهداری در کلاینت)." },
  { topic: "احراز هویت", level: "متوسط", q: "طراحی JWT با refresh token چگونه است؟", a: "access کوتاه‌عمر (۱۵ دقیقه) در هدر؛ refresh بلندمدت در httpOnly cookie، هنگام انقضا با POST /refresh توکن جدید، refresh چرخشی (rotation) و بازنشانی در خروج." },
  { topic: "احراز هویت", level: "پایه", q: "چه چیزی داخل JWT می‌رود؟", a: "header (الگوریتم)، payload اطلاعات غیرحساس (sub، exp، role) و امضا. رمز عبور/اطلاعات حساس هرگز." },
  { topic: "احراز هویت", level: "پیشرفته", q: "اگر توکن لو برود چه کنیم؟", a: "کوتاه‌کردن عمر، لیست سیاه (denylist در Redis) برای logout/اختصاص، refresh rotation و اعلام به کاربر؛ بهتر از همه mfa." },
  { topic: "Docker/DevOps", level: "پایه", q: "چرا multi-stage build؟", a: "وابستگی‌های build در مرحله اول می‌مانند و تصویر نهایی فقط runtime را می‌گیرد — امن‌تر و کوچک‌تر." },
  { topic: "Docker/DevOps", level: "متوسط", q: "health check در کانتینر چیست؟", a: "دستوری که Docker به‌صورت دوره‌ای اجرا می‌کند؛ خرابی → restart/حذف از load balancer. در FastAPI معمولاً GET /health." },
  { topic: "Docker/DevOps", level: "پایه", q: "env در Docker چطور مدیریت می‌شود؟", a: "از env_file یا environment در run/compose؛ هرگز secret داخل image (build arg) — از secret manager یا فایل محلی .env خارج‌شده از git." },
  { topic: "طراحی", level: "متوسط", q: "rate limiting چطور پیاده می‌شود؟", a: "الگوریتم token bucket / sliding window با شمارنده در Redis (INCR + EXPIRE) یا middleware در سطح لبه (nginx/Caddy)." },
  { topic: "طراحی", level: "متوسط", q: "صف پیام کی لازم است؟", a: "وقتی پردازش نباید پاسخ API را معطل کند یا باید تکرار شود: ایمیل، تبدیل ویدیو، webhook — با DLQ برای پیام‌های شکست‌خورده." },
  { topic: "طراحی", level: "پایه", q: "load balancer و reverse proxy فرق؟", a: "reverse proxy درخواست را به بک‌اند می‌برد (nginx)، load balancer بین چند نمونه توزیع می‌کند — nginx هر دو را انجام می‌دهد." },
  { topic: "تست", level: "پایه", q: "pytest چه مزیتی دارد؟", a: "فیکسچرها، parametrize، assertion شفاف و افزونه‌ها؛ تست‌ها با تابع معمولی نوشته می‌شوند." },
  { topic: "تست", level: "متوسط", q: "mock کی لازم است؟", a: "وقتی وابستگی خارجی (پرداخت، API بیرونی، زمان) نباید واقعاً صدا زده شود؛ بقیه جاها تست واقعی بهتر است." },
  { topic: "تست", level: "متوسط", q: "تست‌های e2e چه پوششی می‌دهند؟", a: "سناریوی کامل کاربر از رابط تا دیتابیس — کندتر و شکننده‌ترند؛ ترکیب با unit/integration لازم است." },
  { topic: "رفتاری", level: "پایه", q: "آخرین چیزی که یاد گرفتی؟", a: "پاسخ نمونه: «هفته پیش مفهوم connection pool را عمیق خواندم و در FastAPI پیاده‌کردم» — نشان از یادگیری مستمر می‌دهد." },
  { topic: "رفتاری", level: "متوسط", q: "با یک باگ سرسخت چه می‌کنی؟", a: "کوچک‌سازی، بازتولید، چاپ گام‌به‌گام/لاگ، خواندن کد وابسته، بعد از ۳۰ دقیقه تلاش متمرکز درخواست نظر می‌کنم." },
  { topic: "رفتاری", level: "پایه", q: "کد چرا کامیت می‌کنی؟", a: "تاریخچه قابل بازگشت، بازبینی و همکاری — کامیت‌های کوچک با پیام معنادار؛ هر تغییر مستقل یک کامیت." },
  { topic: "پروژه‌محور", level: "متوسط", q: "پرتفولیویت چه پروژه‌هایی دارد؟", a: "پاسخ با پروژه‌های واقعی: API احراز هویت، سیستم نظرات با Redis، ابزار خط فرمان — هر کدام با تست، README و استقرار." },
  { topic: "پروژه‌محور", level: "پایه", q: "پروژه‌ای که بیشتر از همه یادت داد؟", a: "مسئله، انتخاب tech، چالش اصلی و راه‌حلش را ساختاری بگو — ستاره داستان یادگیری توست." },
];
