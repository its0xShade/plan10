import * as React from "react";

const emptySubscribe = () => () => {};

/**
 * آیا کامپوننت بعد از هایدیشن mount شده؟
 * جایگزین `useState(false)` + `useEffect(() => setMounted(true))` می‌شود
 * بدون setState داخل effect (قانون react-hooks/set-state-in-effect).
 * سرور همیشه false برمی‌گرداند؛ کلاینت بعد از هایدیشن true → بدون hydration mismatch.
 */
export function useMounted(): boolean {
  return React.useSyncExternalStore(emptySubscribe, () => true, () => false);
}
