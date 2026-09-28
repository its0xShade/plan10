import * as React from "react";
import { fa } from "@/lib/utils";

export interface Series {
  name: string;
  color: string;
  values: (number | null)[];
}

/** نمودار خطی چندسری — SVG سبک، اعداد فارسی، تولتیپ با hover */
export function LineChart({
  labels,
  series,
  min,
  max,
  height = 150,
  suffix = "",
}: {
  labels: string[];
  series: Series[];
  min?: number;
  max?: number;
  height?: number;
  suffix?: string;
}) {
  const W = 600;
  const H = height;
  const padX = 30;
  const padY = 14;

  const all = series.flatMap((s) => s.values).filter((v): v is number => v != null);
  if (all.length === 0) {
    return <div className="py-8 text-center text-sm text-muted-foreground">هنوز داده‌ای ثبت نشده.</div>;
  }
  const lo = min ?? Math.min(...all, 0);
  const hi = max ?? (Math.max(...all) * 1.1 || 1);
  const x = (i: number) => padX + (i * (W - padX * 2)) / Math.max(labels.length - 1, 1);
  const y = (v: number) => H - padY - ((v - lo) / (hi - lo || 1)) * (H - padY * 2);

  const ticks = [lo, (lo + hi) / 2, hi];
  const labelEvery = Math.ceil(labels.length / 8);

  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img">
        {ticks.map((t, i) => (
          <g key={i}>
            <line x1={padX} x2={W - padX} y1={y(t)} y2={y(t)} className="stroke-border" strokeDasharray="3 4" />
            <text x={padX - 5} y={y(t) + 4} textAnchor="end" className="fill-muted-foreground" fontSize="10">
              {fa(Math.round(t * 10) / 10)}
            </text>
          </g>
        ))}
        {labels.map((l, i) =>
          i % labelEvery === 0 ? (
            <text key={i} x={x(i)} y={H - 2} textAnchor="middle" className="fill-muted-foreground" fontSize="9">
              {l}
            </text>
          ) : null,
        )}
        {series.map((s) => {
          // قطعه‌قطعه روی null
          const segs: string[] = [];
          let cur: string[] = [];
          s.values.forEach((v, i) => {
            if (v == null) {
              if (cur.length) segs.push(cur.join(" "));
              cur = [];
            } else {
              cur.push(`${x(i)},${y(v)}`);
            }
          });
          if (cur.length) segs.push(cur.join(" "));
          return (
            <g key={s.name}>
              {segs.map((pts, i) => (
                <polyline key={i} points={pts} fill="none" stroke={s.color} strokeWidth="2" strokeLinejoin="round" />
              ))}
              {s.values.map((v, i) =>
                v == null ? null : (
                  <circle key={i} cx={x(i)} cy={y(v)} r="3" fill={s.color}>
                    <title>{`${labels[i]} — ${s.name}: ${v}${suffix}`}</title>
                  </circle>
                ),
              )}
            </g>
          );
        })}
      </svg>
      <div className="mt-1 flex flex-wrap justify-center gap-4 text-[11px] text-muted-foreground">
        {series.map((s) => (
          <span key={s.name} className="inline-flex items-center gap-1.5">
            <span className="size-2.5 rounded-full" style={{ background: s.color }} />
            {s.name}
          </span>
        ))}
      </div>
    </div>
  );
}

/** نمودار میله‌ای ساده */
export function BarChart({
  labels,
  values,
  color = "var(--brand)",
  height = 120,
  highlight = [],
}: {
  labels: string[];
  values: number[];
  color?: string;
  height?: number;
  highlight?: number[];
}) {
  const W = 600;
  const H = height;
  const padY = 12;
  const hi = Math.max(...values, 1);
  const bw = (W - 20) / values.length;
  const labelEvery = Math.ceil(labels.length / 10);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img">
      <line x1="10" x2={W - 10} y1={H - padY} y2={H - padY} className="stroke-border" />
      {values.map((v, i) => {
        const h = ((v / hi) * (H - padY * 2)) || 0;
        const isHi = highlight.includes(i);
        return (
          <g key={i}>
            <rect
              x={10 + i * bw + bw * 0.15}
              y={H - padY - h}
              width={bw * 0.7}
              height={h}
              rx="3"
              fill={isHi ? "var(--destructive)" : color}
            >
              <title>{`${labels[i]}: ${v}`}</title>
            </rect>
            {i % labelEvery === 0 && (
              <text x={10 + i * bw + bw / 2} y={H - 2} textAnchor="middle" className="fill-muted-foreground" fontSize="9">
                {labels[i]}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

/** نمودار پراکندگی (همبستگی) */
export function ScatterPlot({
  points,
  xLabel,
  yLabel,
}: {
  points: { x: number; y: number; title?: string }[];
  xLabel: string;
  yLabel: string;
}) {
  const W = 600;
  const H = 170;
  const padX = 30;
  const padY = 18;
  if (points.length < 3) {
    return <div className="py-6 text-center text-sm text-muted-foreground">حداقل ۳ روز داده مشترک لازمه.</div>;
  }
  const xs = points.map((p) => p.x);
  const ys = points.map((p) => p.y);
  const xlo = Math.min(...xs) - 0.5;
  const xhi = Math.max(...xs) + 0.5;
  const ylo = Math.min(...ys) - 0.5;
  const yhi = Math.max(...ys) + 0.5;
  const x = (v: number) => padX + ((v - xlo) / (xhi - xlo || 1)) * (W - padX * 2);
  const y = (v: number) => H - padY - ((v - ylo) / (yhi - ylo || 1)) * (H - padY * 2);

  // خط رگرسیون ساده
  const n = points.length;
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = ys.reduce((a, b) => a + b, 0) / n;
  const cov = points.reduce((a, p) => a + (p.x - mx) * (p.y - my), 0);
  const varx = points.reduce((a, p) => a + (p.x - mx) ** 2, 0);
  const slope = varx ? cov / varx : 0;
  const inter = my - slope * mx;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img">
      <line x1={padX} x2={W - padX} y1={H - padY} y2={H - padY} className="stroke-border" />
      <line x1={padX} x2={padX} y1={8} y2={H - padY} className="stroke-border" />
      <line
        x1={x(xlo)}
        y1={y(slope * xlo + inter)}
        x2={x(xhi)}
        y2={y(slope * xhi + inter)}
        stroke="var(--brand)"
        strokeWidth="1.5"
        strokeDasharray="5 4"
        opacity="0.7"
      />
      {points.map((p, i) => (
        <circle key={i} cx={x(p.x)} cy={y(p.y)} r="4.5" fill="var(--brand-strong)" opacity="0.85">
          <title>{p.title ?? `${p.x} / ${p.y}`}</title>
        </circle>
      ))}
      <text x={W - padX} y={H - 4} textAnchor="end" className="fill-muted-foreground" fontSize="10">
        {xLabel}
      </text>
      <text x={padX} y={12} textAnchor="start" className="fill-muted-foreground" fontSize="10">
        {yLabel}
      </text>
    </svg>
  );
}

/** ضریب همبستگی پیرسون */
export function pearson(xs: number[], ys: number[]): number | null {
  const n = Math.min(xs.length, ys.length);
  if (n < 3) return null;
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = ys.reduce((a, b) => a + b, 0) / n;
  let num = 0;
  let dx = 0;
  let dy = 0;
  for (let i = 0; i < n; i++) {
    num += (xs[i] - mx) * (ys[i] - my);
    dx += (xs[i] - mx) ** 2;
    dy += (ys[i] - my) ** 2;
  }
  const den = Math.sqrt(dx * dy);
  return den ? num / den : null;
}
