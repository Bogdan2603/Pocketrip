import type { ReactNode } from "react";

export function PageHeading({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl">
        {eyebrow && <p className="eyebrow mb-3 text-ink-3">{eyebrow}</p>}
        <h1 className="text-[34px] leading-[1.05] text-ink sm:text-[44px]">{title}</h1>
        {description && <p className="mt-3 text-[17px] leading-relaxed text-ink-2">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap gap-2.5">{actions}</div>}
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="sheet flex flex-col items-start gap-3 border-l-4 border-bad p-5 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="font-semibold">Nu am putut încărca datele</p>
        <p className="text-[15px] text-sheet-muted">{message}</p>
      </div>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="h-9 cursor-pointer rounded-lg border border-[#111]/20 px-3 text-sm font-semibold hover:bg-sheet-soft"
        >
          Încearcă din nou
        </button>
      )}
    </div>
  );
}
