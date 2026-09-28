"use client";

import * as React from "react";
import { Download } from "lucide-react";

type PromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

/** چیپ «نصب اپ» پابرگ: روی اندروید/دسکتاپ از beforeinstallprompt استفاده می‌کند؛
 *  روی iOS راهنمای «افزودن به صفحه اصلی» را نشان می‌دهد. در حالت نصب‌شده پنهان است. */
export function InstallChip() {
  const [evt, setEvt] = React.useState<PromptEvent | null>(null);
  const [ready, setReady] = React.useState(false);
  const [isIOS, setIsIOS] = React.useState(false);
  const [showHint, setShowHint] = React.useState(false);

  React.useEffect(() => {
    const installed =
      window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as { standalone?: boolean }).standalone === true;
    if (installed) return; // نصب‌شده → بدون دکمه
    setIsIOS(/iP(hone|ad|od)/.test(navigator.userAgent) && !("MSStream" in window));
    const onPrompt = (e: Event) => {
      e.preventDefault();
      setEvt(e as PromptEvent);
    };
    const onInstalled = () => setReady(false);
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    setReady(true);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const onClick = async () => {
    if (evt) {
      evt.prompt();
      const choice = await evt.userChoice;
      if (choice) setEvt(null);
    } else if (isIOS) {
      setShowHint((v) => !v);
    }
  };

  if (!ready || (!evt && !isIOS)) return null;

  return (
    <>
      <button
        type="button"
        onClick={onClick}
        aria-expanded={showHint}
        className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-brand/40 bg-brand/10 px-2.5 py-1 text-[11px] font-medium text-brand transition-colors hover:bg-brand/20"
      >
        <Download className="size-3" aria-hidden />
        نصب اپ
      </button>
      {showHint && !evt ? (
        <p className="basis-full text-[10px] leading-5 text-muted-foreground">
          در سافاری: دکمه اشتراک‌گذاری ⇩ سپس «افزودن به صفحه اصلی».
        </p>
      ) : null}
    </>
  );
}
