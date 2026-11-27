import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

// Câmpuri gândite pentru foile albe.

const fieldBase =
  "w-full rounded-lg border border-sheet-line bg-white px-3 text-[15px] text-sheet-ink outline-none transition-[border-color,box-shadow] placeholder:text-[#9aa1b0] hover:border-[#cdd2de] focus:border-route focus:ring-4 focus:ring-route/12 disabled:cursor-not-allowed disabled:bg-sheet-soft disabled:text-sheet-muted aria-invalid:border-bad aria-invalid:focus:ring-bad/12";

export function Input({ className, ...props }: ComponentProps<"input">) {
  return <input className={cn(fieldBase, "h-10", className)} {...props} />;
}

export function NativeSelect({ className, children, ...props }: ComponentProps<"select">) {
  return (
    <div className="relative">
      <select
        className={cn(
          fieldBase,
          "h-10 cursor-pointer appearance-none bg-[url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%235b6273' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")] bg-[length:12px] bg-[position:right_12px_center] bg-no-repeat pr-9",
          className,
        )}
        {...props}
      >
        {children}
      </select>
    </div>
  );
}

export function Label({ className, ...props }: ComponentProps<"label">) {
  return <label className={cn("text-sm font-semibold text-sheet-ink", className)} {...props} />;
}

export function Field({
  label,
  htmlFor,
  error,
  hint,
  children,
  className,
}: {
  label: ReactNode;
  htmlFor: string;
  error?: string;
  hint?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("grid gap-1.5", className)}>
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {error ? (
        <p role="alert" className="text-[13px] font-medium text-bad">
          {error}
        </p>
      ) : hint ? (
        <p className="text-[13px] text-sheet-muted">{hint}</p>
      ) : null}
    </div>
  );
}
