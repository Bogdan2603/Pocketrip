import { Check, FileDown, Map as MapIcon, Minus } from "lucide-react";
import type { ReactNode } from "react";
import type { Plan } from "@/lib/types";
import { cn, formatEuro, limitLabel } from "@/lib/utils";

export function planTagline(plan: Plan) {
  if (plan.mapEnabled) return "Programul, PDF-ul și traseul desenat pe hartă.";
  if (plan.pdfExportEnabled) return "Pentru cine pleacă des și vrea programul pe hârtie.";
  if (Number(plan.price) === 0) return "Ca să vezi cum e. Fără card.";
  return "Programul tău, organizat automat.";
}

export function PlanCard({
  plan,
  current,
  action,
  compact,
}: {
  plan: Plan;
  current?: boolean;
  action?: ReactNode;
  compact?: boolean;
}) {
  const featured = plan.mapEnabled;
  const features: { label: ReactNode; on: boolean; icon?: ReactNode }[] = [
    {
      label: (
        <>
          <b className="font-mono font-semibold">{limitLabel(plan.maxUsesPerDay)}</b> generări pe zi
        </>
      ),
      on: true,
    },
    {
      label: (
        <>
          <b className="font-mono font-semibold">{limitLabel(plan.maxUsesPerMonth)}</b> generări pe lună
        </>
      ),
      on: true,
    },
    { label: "Export PDF", on: plan.pdfExportEnabled, icon: <FileDown /> },
    { label: "Traseu pe hartă", on: plan.mapEnabled, icon: <MapIcon /> },
  ];

  return (
    <article
      className={cn(
        "sheet relative flex flex-col p-6 transition-transform duration-300",
        featured && "ring-2 ring-route",
        current && "ring-2 ring-sun",
        !compact && "hover:-translate-y-1",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-display text-[22px] font-extrabold tracking-tight">{plan.name}</h3>
        {current ? (
          <span className="rounded-full bg-sun px-2.5 py-1 font-mono text-[11px] font-semibold tracking-wide uppercase">
            Planul tău
          </span>
        ) : featured ? (
          <span className="rounded-full bg-route px-2.5 py-1 font-mono text-[11px] font-semibold tracking-wide text-white uppercase">
            Cu hartă
          </span>
        ) : null}
      </div>
      {!compact && <p className="mt-1.5 min-h-[44px] text-[15px] text-sheet-muted">{planTagline(plan)}</p>}
      <p className="mt-4 flex items-baseline gap-1.5">
        <span className="font-display text-[40px] leading-none font-extrabold tracking-tight">
          {formatEuro(plan.price)}
        </span>
        <span className="text-sheet-muted">/ lună</span>
      </p>
      <ul className="mt-5 grid gap-2.5 border-t border-dashed border-sheet-line pt-5 text-[15px]">
        {features.map((f, i) => (
          <li key={i} className={cn("flex items-center gap-2.5", !f.on && "text-[#a3a9b6] line-through decoration-[#c8ccd6]")}>
            <span
              className={cn(
                "grid size-5 shrink-0 place-items-center rounded-full [&_svg]:size-3",
                f.on ? "bg-ok/12 text-ok" : "bg-[#111]/5 text-[#a3a9b6]",
              )}
            >
              {f.on ? <Check strokeWidth={3} /> : <Minus strokeWidth={3} />}
            </span>
            {f.label}
          </li>
        ))}
      </ul>
      <p className="mt-4 font-mono text-[12px] text-sheet-muted">Generare extra: {formatEuro(plan.extraPrice)}</p>
      {action && <div className="mt-5 flex flex-1 items-end">{action}</div>}
    </article>
  );
}

export function PlanCardSkeleton() {
  return (
    <div className="sheet flex flex-col gap-4 p-6 text-sheet-ink">
      <div className="h-6 w-24 animate-pulse rounded bg-[#111]/8" />
      <div className="h-4 w-3/4 animate-pulse rounded bg-[#111]/6" />
      <div className="h-10 w-32 animate-pulse rounded bg-[#111]/8" />
      <div className="grid gap-2.5 pt-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-4 w-2/3 animate-pulse rounded bg-[#111]/6" />
        ))}
      </div>
      <div className="mt-4 h-10 animate-pulse rounded-lg bg-[#111]/8" />
    </div>
  );
}

/** Planurile în ordinea prețului, ca pe pagina de prezentare. */
export function sortPlans(plans: Plan[] | undefined) {
  return [...(plans ?? [])].sort((a, b) => Number(a.price) - Number(b.price) || a.id - b.id);
}
