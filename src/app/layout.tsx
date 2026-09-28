import type { Metadata, Viewport } from "next";
import { Vazirmatn } from "next/font/google";
import { Shell } from "@/components/shell";
import "./globals.css";

const vazirmatn = Vazirmatn({
  variable: "--font-vazirmatn",
  subsets: ["arabic"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "برنامه ۱۰ ماهه — از دوازدهم تا درآمد",
  description:
    "داشبورد برنامه‌ریزی: رودمپ بک‌اند پایتون، برنامه ماه‌به‌ماه، پیگیری عادات و KPI از مهر ۱۴۰۵ تا تیر ۱۴۰۶",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/icons/icon-192.png",
    apple: "/icons/apple-touch-icon.png",
  },
  appleWebApp: {
    capable: true,
    title: "برنامه ۱۰ ماهه",
    statusBarStyle: "black-translucent",
  },
};

export const viewport: Viewport = {
  themeColor: "#0d0d12",
};

/** تم ذخیره‌شده را قبل از اولین رنگ اعمال می‌کند تا چشمک نزند. */
const themeInit = `try{var t=localStorage.getItem("theme");if(t==="paper"||t==="midnight"){document.documentElement.setAttribute("data-theme",t);}else{document.documentElement.removeAttribute("data-theme");}var a=localStorage.getItem("plan10.accent");if(a&&a!=="gold")document.documentElement.setAttribute("data-accent",a);else document.documentElement.removeAttribute("data-accent");var m=document.querySelector('meta[name="theme-color"]');if(m){m.setAttribute('content', t==='midnight'?'#000000':(t==='paper'?'#faf9f4':'#0d0d12'));}}catch(e){}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning className={`${vazirmatn.variable} h-full antialiased`}>
      <body className="min-h-full">
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
        <Shell>{children}</Shell>
      </body>
    </html>
  );
}
