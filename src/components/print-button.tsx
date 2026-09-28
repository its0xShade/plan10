"use client";

import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";

/** چاپ / ذخیره PDF — استایل چاپ از globals.css (@media print) می‌آید. */
export function PrintButton() {
  return (
    <Button variant="secondary" size="sm" onClick={() => window.print()} data-no-print>
      <Printer className="size-4" />
      چاپ / PDF
    </Button>
  );
}
