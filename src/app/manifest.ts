import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "برنامه ۱۰ ماهه — از دوازدهم تا درآمد",
    short_name: "برنامه ۱۰ ماهه",
    description:
      "داشبورد برنامه‌ریزی: رودمپ بک‌اند پایتون، برنامه ماه‌به‌ماه، پیگیری عادات و KPI از مهر ۱۴۰۵ تا تیر ۱۴۰۶",
    start_url: "/",
    scope: "/",
    display: "standalone",
    display_override: ["standalone", "minimal-ui", "browser"],
    orientation: "portrait",
    background_color: "#0d0d12",
    theme_color: "#0d0d12",
    lang: "fa",
    dir: "rtl",
    categories: ["productivity", "education"],
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
      { src: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png", purpose: "any" },
    ],
    shortcuts: [
      { name: "صفحه امروز", short_name: "امروز", url: "/today" },
      { name: "رودمپ بک‌اند", short_name: "رودمپ", url: "/roadmap" },
      { name: "لاگ روزانه", short_name: "لاگ", url: "/log" },
      { name: "تایمر پومودورو", short_name: "پومودورو", url: "/pomodoro" },
    ],
  };
}
