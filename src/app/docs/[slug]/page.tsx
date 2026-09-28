import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowLeft, ArrowRight, FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PrintButton } from "@/components/shared/print-button";
import { Mermaid, SlidesPlayer } from "@/components/shared/md-views";
import { getDoc, listDocs } from "@/lib/content";

/** برای خروجی استاتیک (output: export) — همه اسناد در زمان build پرچسب می‌شوند. */
export function generateStaticParams() {
  return listDocs().map((d) => ({ slug: d.slug }));
}
import { cn } from "@/lib/utils";

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";
/** مسیرهای مطلق داخل محتوا (assets/docs) را به مسیر پایهٔ استقرار پیشوند می‌زند. */
const withBase = (u?: string | Blob | null): string | undefined =>
  typeof u === "string" && u.startsWith("/") ? `${BASE_PATH}${u}` : typeof u === "string" ? u : undefined;

const mdComponents = {
  h1: (props: React.ComponentProps<"h1">) => (
    <h1 className="mt-8 mb-4 text-2xl font-black first:mt-0" {...props} />
  ),
  h2: (props: React.ComponentProps<"h2">) => (
    <h2 className="mt-7 mb-3 border-b border-border pb-2 text-xl font-bold" {...props} />
  ),
  h3: (props: React.ComponentProps<"h3">) => (
    <h3 className="mt-5 mb-2 text-lg font-bold text-brand" {...props} />
  ),
  h4: (props: React.ComponentProps<"h4">) => (
    <h4 className="mt-4 mb-2 text-base font-bold" {...props} />
  ),
  p: (props: React.ComponentProps<"p">) => <p className="my-3 leading-[1.9]" {...props} />,
  a: (props: React.ComponentProps<"a">) => (
    <a
      className="text-brand underline underline-offset-4 hover:opacity-80"
      {...props}
      href={withBase(props.href)}
    />
  ),
  strong: (props: React.ComponentProps<"strong">) => (
    <strong className="font-bold text-foreground" {...props} />
  ),
  ul: (props: React.ComponentProps<"ul">) => (
    <ul className="my-3 list-disc space-y-1.5 ps-5 marker:text-brand" {...props} />
  ),
  ol: (props: React.ComponentProps<"ol">) => (
    <ol className="my-3 list-decimal space-y-1.5 ps-5 marker:text-brand" {...props} />
  ),
  li: (props: React.ComponentProps<"li">) => <li className="leading-[1.9]" {...props} />,
  blockquote: (props: React.ComponentProps<"blockquote">) => (
    <blockquote
      className="my-4 rounded-e-xl border-s-4 border-brand/60 bg-brand/5 py-2 ps-4 pe-2 text-foreground/90"
      {...props}
    />
  ),
  hr: () => <hr className="my-6 border-border" />,
  code: ({ className, children, ...props }: React.ComponentProps<"code">) => (
    <code
      className={cn(
        "rounded bg-secondary px-1.5 py-0.5 font-mono text-[0.85em] text-foreground",
        className,
      )}
      dir="ltr"
      {...props}
    >
      {children}
    </code>
  ),
  pre: (props: React.ComponentProps<"pre">) => {
    const child = Array.isArray(props.children) ? props.children[0] : props.children;
    const childProps = (child as { props?: { className?: string; children?: unknown } })?.props;
    const cls = childProps?.className ?? "";
    const text = String(childProps?.children ?? "");
    if (cls.includes("language-mermaid")) return <Mermaid code={text} />;
    if (cls.includes("language-slides")) return <SlidesPlayer raw={text} />;
    return (
      <pre
        className="my-4 overflow-x-auto rounded-xl border border-border bg-black/40 p-4 text-sm leading-7"
        dir="ltr"
        {...props}
      />
    );
  },
  img: (props: React.ComponentProps<"img">) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
          className="my-4 rounded-xl border border-border bg-card/60 p-2 shadow-sm"
          loading="lazy"
          {...props}
          src={withBase(props.src)}
          alt={props.alt || ""}
        />
  ),
  table: (props: React.ComponentProps<"table">) => (
    <div className="my-4 overflow-x-auto rounded-xl border border-border">
      <table className="w-full border-collapse text-sm" {...props} />
    </div>
  ),
  th: (props: React.ComponentProps<"th">) => (
    <th
      className="border-b border-border bg-secondary px-3 py-2.5 text-start text-xs font-bold text-foreground"
      {...props}
    />
  ),
  td: (props: React.ComponentProps<"td">) => (
    <td className="border-b border-border/60 px-3 py-2.5 align-top" {...props} />
  ),
  tr: (props: React.ComponentProps<"tr">) => (
    <tr className="transition-colors hover:bg-accent/40" {...props} />
  ),
  input: (props: React.ComponentProps<"input">) => (
    <input className="ms-2 accent-[var(--brand)]" disabled {...props} />
  ),
};

export default async function DocPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const doc = getDoc(slug);
  if (!doc) notFound();

  const siblings = listDocs();
  const idx = siblings.findIndex((d) => d.slug === slug);
  const prev = idx > 0 ? siblings[idx - 1] : null;
  const next = idx < siblings.length - 1 ? siblings[idx + 1] : null;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <FileText className="size-5 text-brand" />
          <h1 className="text-xl font-black">{doc.meta.persianTitle}</h1>
          <Badge variant="outline" className="font-mono text-[10px]" dir="ltr">
            {doc.meta.slug}.md
          </Badge>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden text-xs text-muted-foreground sm:inline">{doc.meta.description}</span>
          <PrintButton />
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <article className="text-[15px] text-foreground/90">
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>
              {doc.body}
            </ReactMarkdown>
          </article>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between gap-3">
        {prev ? (
          <Link
            href={`/docs/${prev.slug}`}
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-brand"
          >
            <ArrowRight className="size-4" /> {prev.persianTitle}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            href={`/docs/${next.slug}`}
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-brand"
          >
            {next.persianTitle} <ArrowLeft className="size-4" />
          </Link>
        ) : (
          <span />
        )}
      </div>
    </div>
  );
}
