/* سرویس‌ورکر برنامه ۱۰ ماهه — استاتیک کش‌اول، صفحات شبکه‌اول با فالبک آفلاین */
const CACHE = "plan10-v2";
const SHELL = ["./", "today", "roadmap", "log", "pomodoro", "docs", "tools"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => Promise.allSettled(SHELL.map((url) => cache.add(url))))
      .catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

/* کلیک روی اعلان: فوکوس به پنجره باز، وگرنه باز کردن سایت */
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((list) => {
      for (const client of list) {
        if ("focus" in client) return client.focus();
      }
      return self.clients.openWindow("/");
    })
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET" || new URL(req.url).origin !== self.location.origin) return;
  const url = new URL(req.url);
  /* پیش‌رندر RSC را کش نکن تا ناوبری تازه بماند */
  if (url.searchParams.has("_rsc")) return;

  /* استاتیک تغییرناپذیر (هش‌دار): کش‌اول */
  const immutable =
    url.pathname.startsWith("/_next/static/") ||
    url.pathname.startsWith("/icons/") ||
    url.pathname.startsWith("/assets/") ||
    /\.(?:png|jpe?g|webp|svg|ico|woff2?)$/.test(url.pathname);

  if (req.mode === "navigate" && !immutable) {
    /* شبکه اول؛ آفلاین از کش همین مسیر، وگرنه کش صفحه خانه */
    event.respondWith(
      fetch(req)
        .then((res) => {
          if (res.ok) {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
          }
          return res;
        })
        .catch(() => caches.match(req).then((r) => r || caches.match("./")))
    );
    return;
  }

  /* بقیه درخواست‌ها: کش‌اول، در صورت نبود از شبکه و کردن */
  event.respondWith(
    caches.match(req).then(
      (hit) =>
        hit ||
        fetch(req).then((res) => {
          if (res.ok) {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
          }
          return res;
        })
    )
  );
});
