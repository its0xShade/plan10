import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  const bp = process.env.NEXT_PUBLIC_BASE_PATH || "";
  return {
    id: ".",
    name: "برنامه ۱۰ ماهه — از دوازدهم تا درآمد",
    short_name: "برنامه ۱۰ ماهه",
    description:
      "داشبورد برنامه‌ریزی: رودمپ بک‌اند پایتون، برنامه ماه‌به‌ماه، پیگیری عادات و KPI از مهر ۱۴۰۵ تا تیر ۱۴۰۶",
    start_url: ".",
    scope: ".",
    display: "standalone",
    display_override: ["standalone", "minimal-ui", "browser"],
    orientation: "portrait",
    background_color: "#0d0d12",
    theme_color: "#0d0d12",
    lang: "fa",
    dir: "rtl",
    categories: ["productivity", "education"],
    icons: [
      { src: `${bp}/icons/icon-192.png`, sizes: "192x192", type: "image/png", purpose: "any" },
      { src: `${bp}/icons/icon-512.png`, sizes: "512x512", type: "image/png", purpose: "any" },
      { src: `${bp}/icons/icon-maskable-512.png`, sizes: "512x512", type: "image/png", purpose: "maskable" },
      { src: `${bp}/icons/apple-touch-icon.png`, sizes: "180x180", type: "image/png", purpose: "any" },
    ],
    shortcuts: [
      { name: "صفحه امروز", short_name: "امروز", url: `${bp}/today` },
      { name: "رودمپ بک‌اند", short_name: "رودمپ", url: `${bp}/roadmap` },
      { name: "لاگ روزانه", short_name: "لاگ", url: `${bp}/log` },
      { name: "تایمر پومودورو", short_name: "پومودورو", url: `${bp}/pomodoro` },
    ],
  };
}
