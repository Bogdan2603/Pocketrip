"use client";

import Link from "next/link";
import { ErrorState } from "@/components/page-heading";
import { PlanCard, PlanCardSkeleton, sortPlans } from "@/components/plan-card";
import { Button } from "@/components/ui/button";
import { errorMessage } from "@/lib/api";
import { usePricing } from "@/lib/queries";
import { useSession } from "@/lib/session";
import { formatEuro } from "@/lib/utils";

export function Pricing() {
  const pricing = usePricing();
  const { user } = useSession();
  const plans = sortPlans(pricing.data);
  const extra = plans.find((p) => Number(p.extraPrice) > 0)?.extraPrice;
  const target = user ? "/cont#abonament" : "/autentificare?mod=cont-nou";

  if (pricing.error) {
    return <ErrorState message={errorMessage(pricing.error)} onRetry={() => pricing.refetch()} />;
  }

  return (
    <>
      <div className="grid justify-center gap-5 md:grid-cols-[repeat(auto-fit,minmax(260px,350px))]">
        {pricing.isLoading
          ? [0, 1, 2].map((i) => <PlanCardSkeleton key={i} />)
          : plans.map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                action={
                  <Button asChild className="w-full" variant={plan.mapEnabled ? "primary" : "outline"} size="lg">
                    <Link href={target}>
                      {Number(plan.price) === 0 ? "Începe gratuit" : `Alege ${plan.name}`}
                    </Link>
                  </Button>
                }
              />
            ))}
      </div>
      {!pricing.isLoading && plans.length === 0 && (
        <p className="sheet p-6 text-center text-sheet-muted">Încă nu există planuri definite.</p>
      )}
      <p className="mt-6 text-center text-[15px] text-ink-2">
        {extra != null && (
          <>
            Ai terminat generările incluse? Mai poți face una extra cu{" "}
            <b className="font-mono text-ink">{formatEuro(extra)}</b>.{" "}
          </>
        )}
        Abonamentele se reînnoiesc lunar și le poți anula oricând.
      </p>
    </>
  );
}
