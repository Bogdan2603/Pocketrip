"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreditCard, History, Loader2, LogOut, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { ErrorState, PageHeading } from "@/components/page-heading";
import { PlanCard, PlanCardSkeleton, sortPlans } from "@/components/plan-card";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Field, Input, NativeSelect } from "@/components/ui/form";
import { Badge, SheetTitle } from "@/components/ui/misc";
import { api, ApiError, errorMessage } from "@/lib/api";
import { keys, sortUserSubscriptions, useActivePlan, useCanGenerate, usePlans, useSubscriptions } from "@/lib/queries";
import { useSession } from "@/lib/session";
import { STATUS_LABEL } from "@/lib/labels";
import type { Plan, User } from "@/lib/types";
import { cn, formatDate, formatEuro, initials } from "@/lib/utils";

const SECTIONS = [
  { id: "profil", label: "Profil", icon: UserRound },
  { id: "abonament", label: "Abonament", icon: CreditCard },
  { id: "istoric", label: "Istoric abonamente", icon: History },
];

export function AccountScreen() {
  const { user, signOut } = useSession();
  const router = useRouter();
  const [current, setCurrent] = useState("profil");

  // Evidențiem în meniu secțiunea vizibilă.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setCurrent(visible[0].target.id);
      },
      { rootMargin: "-120px 0px -55% 0px" },
    );
    SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  if (!user) return null;

  return (
    <>
      <PageHeading eyebrow="Setări" title="Contul meu" />
      <div className="grid items-start gap-8 lg:grid-cols-[220px_1fr]">
        <nav className="flex gap-1 overflow-x-auto lg:sticky lg:top-24 lg:flex-col">
          {SECTIONS.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              aria-current={current === s.id ? "true" : undefined}
              className="flex shrink-0 items-center gap-2.5 rounded-lg px-3 py-2 text-[15px] font-medium text-ink-2 transition-colors hover:bg-ink/[0.06] hover:text-ink aria-[current=true]:bg-ink/[0.08] aria-[current=true]:text-ink"
            >
              <s.icon className="size-4" /> {s.label}
            </a>
          ))}
          <button
            type="button"
            onClick={() => {
              signOut();
              toast.success("Te-ai deconectat.");
              router.push("/");
            }}
            className="flex shrink-0 cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-[15px] font-medium text-ink-2 hover:bg-bad/10 hover:text-[#ff8a80] lg:mt-4"
          >
            <LogOut className="size-4" /> Ieși din cont
          </button>
        </nav>

        <div className="grid min-w-0 gap-6">
          <ProfileSection user={user} />
          <SubscriptionSection user={user} />
          <HistorySection user={user} />
        </div>
      </div>
    </>
  );
}

/* ---------- Profil ---------- */

const profileSchema = z.object({
  displayName: z.string().trim().min(2, "Numele are cel puțin 2 caractere.").max(100, "Maximum 100 de caractere."),
  email: z.email("Scrie o adresă de e-mail validă."),
  preferredLanguage: z.enum(["ro", "en"]),
});

function ProfileSection({ user }: { user: User }) {
  const { signIn } = useSession();
  const queryClient = useQueryClient();
  const form = useForm({
    resolver: zodResolver(profileSchema),
    values: { displayName: user.displayName ?? "", email: user.email, preferredLanguage: user.preferredLanguage },
  });
  const { errors, isDirty } = form.formState;

  const save = useMutation({
    mutationFn: (values: z.infer<typeof profileSchema>) => api.users.update(user.id, { ...values, role: user.role }),
    onSuccess: (updated) => {
      signIn(updated);
      queryClient.invalidateQueries({ queryKey: keys.users });
      toast.success("Profilul a fost salvat.");
    },
    onError: (error) => {
      if (error instanceof ApiError && error.status === 409) form.setError("email", { message: "E-mailul e folosit de alt cont." });
      else toast.error(errorMessage(error));
    },
  });

  return (
    <section id="profil" className="sheet scroll-mt-24 p-6 sm:p-8">
      <div className="mb-6 flex items-center gap-4">
        <span className="grid size-14 place-items-center rounded-full bg-sun font-mono text-lg font-semibold">
          {initials(user.displayName, user.email)}
        </span>
        <div>
          <SheetTitle>Profil</SheetTitle>
          <p className="text-[15px] text-sheet-muted">
            {user.role === "ADMIN" ? <Badge tone="blue">Administrator</Badge> : "Cum apari în aplicație."}
          </p>
        </div>
      </div>
      <form onSubmit={form.handleSubmit((v) => save.mutate(v))} noValidate className="grid gap-4 sm:grid-cols-2">
        <Field label="Nume afișat" htmlFor="p-name" error={errors.displayName?.message}>
          <Input id="p-name" autoComplete="name" aria-invalid={!!errors.displayName} {...form.register("displayName")} />
        </Field>
        <Field label="Limba aplicației" htmlFor="p-lang">
          <NativeSelect id="p-lang" {...form.register("preferredLanguage")}>
            <option value="ro">Română</option>
            <option value="en">English</option>
          </NativeSelect>
        </Field>
        <Field label="E-mail" htmlFor="p-email" error={errors.email?.message} className="sm:col-span-2">
          <Input id="p-email" type="email" autoComplete="email" aria-invalid={!!errors.email} {...form.register("email")} />
        </Field>
        <div className="flex items-center justify-end gap-3 sm:col-span-2">
          {isDirty && (
            <Button variant="ghost" onClick={() => form.reset()}>
              Anulează
            </Button>
          )}
          <Button type="submit" disabled={!isDirty || save.isPending}>
            {save.isPending && <Loader2 className="animate-spin" />}
            Salvează
          </Button>
        </div>
      </form>
    </section>
  );
}

/* ---------- Abonament ---------- */

function SubscriptionSection({ user }: { user: User }) {
  const queryClient = useQueryClient();
  const plans = usePlans();
  const active = useActivePlan(user.id);
  const canGenerate = useCanGenerate(user.id);
  const [target, setTarget] = useState<Plan | null>(null);

  const change = useMutation({
    mutationFn: (plan: Plan) => api.subscriptions.changePlan(user.id, plan.id),
    onSuccess: (_, plan) => {
      queryClient.invalidateQueries({ queryKey: keys.subscriptions });
      queryClient.invalidateQueries({ queryKey: keys.canGenerate(user.id) });
      toast.success(`Ai trecut pe planul ${plan.name}.`);
      setTarget(null);
    },
    onError: (error) => toast.error(errorMessage(error)),
  });

  const sorted = sortPlans(plans.data);
  const currentPrice = Number(active.plan?.price ?? 0);

  return (
    <section id="abonament" className="sheet scroll-mt-24 p-6 sm:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <SheetTitle>Abonament</SheetTitle>
          {active.plan && active.subscription ? (
            <p className="mt-1 text-[15px] text-sheet-muted">
              Plan <b className="text-sheet-ink">{active.plan.name}</b>, {formatEuro(active.plan.price)}/lună · activ din{" "}
              {formatDate(active.subscription.startDate)}
            </p>
          ) : !active.isLoading ? (
            <p className="mt-1 text-[15px] text-sheet-muted">Nu ai un abonament activ. Alege un plan mai jos.</p>
          ) : null}
        </div>
        {active.plan && (
          <div className="rounded-xl bg-sheet-soft px-4 py-3 text-[14px]">
            <p className="text-sheet-muted">Generări incluse acum</p>
            <p className="font-semibold">
              {canGenerate.isLoading ? "…" : canGenerate.data ? (
                <span className="text-ok">Disponibile</span>
              ) : (
                <span className="text-wait">Limită atinsă · extra {formatEuro(active.plan.extraPrice)}</span>
              )}
            </p>
          </div>
        )}
      </div>

      {plans.error ? (
        <div className="mt-6">
          <ErrorState message={errorMessage(plans.error)} onRetry={() => plans.refetch()} />
        </div>
      ) : (
        <div className="mt-6 grid gap-4 md:grid-cols-[repeat(auto-fit,minmax(220px,1fr))] [&_.sheet]:shadow-none [&_.sheet]:ring-1 [&_.sheet]:ring-sheet-line">
          {plans.isLoading
            ? [0, 1, 2].map((i) => <PlanCardSkeleton key={i} />)
            : sorted.map((plan) => {
                const isCurrent = plan.id === active.plan?.id;
                const upgrade = Number(plan.price) > currentPrice;
                return (
                  <PlanCard
                    key={plan.id}
                    plan={plan}
                    current={isCurrent}
                    compact
                    action={
                      <Button
                        className="w-full"
                        variant={isCurrent ? "outline" : upgrade && plan.mapEnabled ? "primary" : "outline"}
                        disabled={isCurrent}
                        onClick={() => setTarget(plan)}
                      >
                        {isCurrent ? "Planul tău" : upgrade ? `Treci la ${plan.name}` : `Trec la ${plan.name}`}
                      </Button>
                    }
                  />
                );
              })}
        </div>
      )}
      <p className="mt-5 text-[13px] text-sheet-muted">
        Generările extra se plătesc separat, doar când le folosești. Abonamentul se reînnoiește lunar.
      </p>

      <ConfirmDialog
        open={!!target}
        onOpenChange={(open) => !open && setTarget(null)}
        tone="primary"
        title={`Treci pe ${target?.name}?`}
        description={
          <>
            Noul plan costă <b className="font-mono text-sheet-ink">{formatEuro(target?.price)}</b> pe lună și se aplică
            de azi. {active.plan ? `Abonamentul ${active.plan.name} se anulează.` : ""}
          </>
        }
        confirmLabel={`Da, trec pe ${target?.name ?? ""}`}
        pending={change.isPending}
        onConfirm={() => target && change.mutate(target)}
      />
    </section>
  );
}

/* ---------- Istoric ---------- */

function HistorySection({ user }: { user: User }) {
  const subs = useSubscriptions();
  const plans = usePlans();
  const mine = sortUserSubscriptions(subs.data, user.id);
  const planName = (id: number) => plans.data?.find((p) => p.id === id)?.name ?? `Plan #${id}`;

  return (
    <section id="istoric" className="sheet scroll-mt-24 p-6 sm:p-8">
      <SheetTitle>Istoric abonamente</SheetTitle>
      <p className="mt-1 text-[15px] text-sheet-muted">Fiecare schimbare de plan rămâne aici.</p>

      {subs.error ? (
        <div className="mt-5">
          <ErrorState message={errorMessage(subs.error)} onRetry={() => subs.refetch()} />
        </div>
      ) : subs.isLoading ? (
        <div className="mt-5 grid gap-2">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-11 animate-pulse rounded-lg bg-sheet-soft" />
          ))}
        </div>
      ) : mine.length === 0 ? (
        <p className="mt-5 rounded-xl bg-sheet-soft p-5 text-center font-hand text-xl text-sheet-muted">încă nimic aici</p>
      ) : (
        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[520px] text-left text-[15px]">
            <thead>
              <tr className="border-b border-sheet-line font-mono text-[11px] tracking-wider text-sheet-muted uppercase">
                <th className="py-2 pr-4 font-medium">Plan</th>
                <th className="py-2 pr-4 font-medium">Din</th>
                <th className="py-2 pr-4 font-medium">Până la</th>
                <th className="py-2 font-medium">Stare</th>
              </tr>
            </thead>
            <tbody>
              {mine.map((s) => (
                <tr key={s.id} className={cn("border-b border-sheet-line last:border-0", s.status === "ACTIVE" && "font-semibold")}>
                  <td className="py-3 pr-4">{planName(s.planId)}</td>
                  <td className="py-3 pr-4 font-mono text-[13px]">{formatDate(s.startDate)}</td>
                  <td className="py-3 pr-4 font-mono text-[13px]">{formatDate(s.endDate)}</td>
                  <td className="py-3">
                    <Badge tone={STATUS_LABEL[s.status]?.tone ?? "neutral"}>{STATUS_LABEL[s.status]?.label ?? s.status}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
