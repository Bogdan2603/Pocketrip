import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export function Table({ className, ...props }: ComponentProps<"table">) {
  return (
    <div className="overflow-x-auto">
      <table className={cn("w-full text-left text-[15px]", className)} {...props} />
    </div>
  );
}

export function Th({ className, ...props }: ComponentProps<"th">) {
  return (
    <th
      className={cn(
        "border-b border-sheet-line px-4 py-3 font-mono text-[11px] font-medium tracking-wider whitespace-nowrap text-sheet-muted uppercase first:pl-6 last:pr-6",
        className,
      )}
      {...props}
    />
  );
}

export function Td({ className, ...props }: ComponentProps<"td">) {
  return <td className={cn("px-4 py-3 align-middle first:pl-6 last:pr-6", className)} {...props} />;
}

export function Tr({ className, ...props }: ComponentProps<"tr">) {
  return <tr className={cn("border-b border-sheet-line transition-colors last:border-0 hover:bg-sheet-soft/70", className)} {...props} />;
}

export function TableSkeleton({ rows = 4, cols = 5 }: { rows?: number; cols?: number }) {
  return (
    <div className="grid gap-3 p-6">
      {Array.from({ length: rows }, (_, r) => (
        <div key={r} className="grid gap-4" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
          {Array.from({ length: cols }, (_, c) => (
            <div key={c} className="h-5 animate-pulse rounded bg-sheet-soft" />
          ))}
        </div>
      ))}
    </div>
  );
}
