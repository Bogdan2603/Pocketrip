import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export const badgeVariants = cva(
  "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-0.5 font-mono text-[11px] font-medium tracking-wide uppercase [&_svg]:size-3",
  {
    variants: {
      tone: {
        ok: "bg-ok/12 text-ok",
        wait: "bg-wait/14 text-wait",
        bad: "bg-bad/10 text-bad",
        blue: "bg-route/10 text-route",
        sun: "bg-sun text-[#111]",
        neutral: "bg-[#111]/[0.06] text-sheet-muted",
        purple: "bg-cat-stay/12 text-cat-stay",
      },
    },
    defaultVariants: { tone: "neutral" },
  },
);

export function Badge({ className, tone, ...props }: ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ tone }), className)} {...props} />;
}

export function StatusDot({ tone }: { tone: "ok" | "wait" | "bad" }) {
  const color = { ok: "bg-ok", wait: "bg-wait", bad: "bg-bad" }[tone];
  return <span className={cn("inline-block size-1.5 rounded-full", color)} />;
}

export function Skeleton({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("animate-pulse rounded-md bg-current/10", className)} {...props} />;
}

export function Sheet({ className, ...props }: ComponentProps<"section">) {
  return <section className={cn("sheet", className)} {...props} />;
}

export function SheetTitle({ className, ...props }: ComponentProps<"h2">) {
  return <h2 className={cn("font-display text-xl font-extrabold tracking-tight", className)} {...props} />;
}

export function Progress({ value, max, className }: { value: number; max: number; className?: string }) {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;
  return (
    <div
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
      className={cn("h-2 overflow-hidden rounded-full bg-[#111]/[0.07]", className)}
    >
      <div className="h-full rounded-full bg-route transition-[width] duration-500" style={{ width: `${pct}%` }} />
    </div>
  );
}
