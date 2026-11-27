"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Check, Loader2, Minus, Pencil, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { ErrorState } from "@/components/page-heading";
import { sortPlans } from "@/components/plan-card";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader } from "@/components/ui/dialog";
import { Field, Input } from "@/components/ui/form";
import { Switch } from "@/components/ui/primitives";
import { Table, TableSkeleton, Td, Th, Tr } from "@/components/ui/table";
import { api, errorMessage } from "@/lib/api";
import { keys, usePlans } from "@/lib/queries";
import type { Plan, PlanInput } from "@/lib/types";
import { formatEuro, limitLabel } from "@/lib/utils";

export function PlansTab() {
  const plans = usePlans();
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<Plan | null>(null);
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState<Plan | null>(null);

  const remove = useMutation({
    mutationFn: (plan: Plan) => api.plans.remove(plan.id),
    onSuccess: (_, plan) => {
      queryClient.invalidateQueries({ queryKey: keys.plans });
      queryClient.invalidateQueries({ queryKey: keys.pricing });
      toast.success(`Planul ${plan.name} a fost retras.`);
      setDeleting(null);
    },
    onError: (error) => toast.error(errorMessage(error)),
  });

  if (plans.error) return <ErrorState message={errorMessage(plans.error)} onRetry={() => plans.refetch()} />;

  return (
    <div className="sheet overflow-hidden">
      <div className="flex items-center justify-between gap-4 px-6 py-5">
        <div>
          <p className="font-display text-lg font-extrabold tracking-tight">Planuri active</p>
          <p className="text-[14px] text-sheet-muted">Un plan retras dispare de pe pagina de prețuri, dar abonații îl păstrează.</p>
        </div>
        <Button
          onClick={() => {
            setEditing(null);
            setOpen(true);
          }}
        >
          <Plus /> Plan nou
        </Button>
      </div>
      {plans.isLoading ? (
        <TableSkeleton cols={6} />
      ) : (
        <Table className="min-w-[760px]">
          <thead>
            <tr>
              <Th>Plan</Th>
              <Th className="text-right">Preț / lună</Th>
              <Th className="text-right">Pe zi</Th>
              <Th className="text-right">Pe lună</Th>
              <Th className="text-center">PDF</Th>
              <Th className="text-center">Hartă</Th>
              <Th className="text-right">Extra</Th>
              <Th />
            </tr>
          </thead>
          <tbody>
            {sortPlans(plans.data).map((plan) => (
              <Tr key={plan.id}>
                <Td>
                  <span className="font-semibold">{plan.name}</span>
                  <span className="ml-2 font-mono text-[11px] text-sheet-muted">#{plan.id}</span>
                </Td>
                <Td className="text-right font-mono">{formatEuro(plan.price)}</Td>
                <Td className="text-right font-mono">{limitLabel(plan.maxUsesPerDay)}</Td>
                <Td className="text-right font-mono">{limitLabel(plan.maxUsesPerMonth)}</Td>
                <Td className="text-center">
                  <Bool on={plan.pdfExportEnabled} />
                </Td>
                <Td className="text-center">
                  <Bool on={plan.mapEnabled} />
                </Td>
                <Td className="text-right font-mono">{formatEuro(plan.extraPrice)}</Td>
                <Td className="w-0 whitespace-nowrap">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label={`Editează ${plan.name}`}
                    onClick={() => {
                      setEditing(plan);
                      setOpen(true);
                    }}
                  >
                    <Pencil />
                  </Button>
                  <Button variant="danger-ghost" size="icon-sm" aria-label={`Retrage ${plan.name}`} onClick={() => setDeleting(plan)}>
                    <Trash2 />
                  </Button>
                </Td>
              </Tr>
            ))}
            {plans.data?.length === 0 && (
              <tr>
                <Td colSpan={8} className="py-10 text-center text-sheet-muted">
                  Niciun plan. Adaugă primul plan.
                </Td>
              </tr>
            )}
          </tbody>
        </Table>
      )}

      <PlanDialog open={open} onOpenChange={setOpen} plan={editing} />
      <ConfirmDialog
        open={!!deleting}
        onOpenChange={(o) => !o && setDeleting(null)}
        title={`Retragi planul ${deleting?.name}?`}
        description="Planul nu mai apare la prețuri și nu mai poate fi ales. Abonamentele existente rămân neschimbate."
        confirmLabel="Retrage planul"
        pending={remove.isPending}
        onConfirm={() => deleting && remove.mutate(deleting)}
      />
    </div>
  );
}

function Bool({ on }: { on: boolean }) {
  return on ? (
    <Check className="mx-auto size-4 text-ok" strokeWidth={3} aria-label="da" />
  ) : (
    <Minus className="mx-auto size-4 text-[#b5bac6]" aria-label="nu" />
  );
}

/* ---------- formular ---------- */

const money = (max: number) =>
  z
    .string()
    .trim()
    .regex(/^\d+([.,]\d{1,2})?$/, "Ex. 4,99")
    .refine((v) => Number(v.replace(",", ".")) <= max, `Maximum ${max}`);

const limit = z
  .string()
  .trim()
  .regex(/^\d*$/, "Doar cifre (gol = nelimitat)")
  .refine((v) => v === "" || Number(v) > 0, "Trebuie să fie peste 0");

const schema = z
  .object({
    name: z.string().trim().min(2, "Minimum 2 caractere.").max(50, "Maximum 50 de caractere."),
    price: money(9999.99),
    extraPrice: money(99.99),
    maxUsesPerDay: limit,
    maxUsesPerMonth: limit,
    mapEnabled: z.boolean(),
    pdfExportEnabled: z.boolean(),
  })
  .refine((v) => !v.maxUsesPerDay || !v.maxUsesPerMonth || Number(v.maxUsesPerMonth) >= Number(v.maxUsesPerDay), {
    path: ["maxUsesPerMonth"],
    message: "Limita lunară nu poate fi sub cea zilnică.",
  });

type FormValues = z.infer<typeof schema>;

const toText = (n: number | null | undefined) => (n == null ? "" : String(n).replace(".", ","));
const toNumber = (s: string) => Number(s.replace(",", "."));

function toInput(v: FormValues): PlanInput {
  return {
    name: v.name,
    price: toNumber(v.price),
    extraPrice: toNumber(v.extraPrice),
    maxUsesPerDay: v.maxUsesPerDay ? Number(v.maxUsesPerDay) : null,
    maxUsesPerMonth: v.maxUsesPerMonth ? Number(v.maxUsesPerMonth) : null,
    mapEnabled: v.mapEnabled,
    pdfExportEnabled: v.pdfExportEnabled,
  };
}

const EMPTY: FormValues = {
  name: "",
  price: "",
  extraPrice: "0,50",
  maxUsesPerDay: "",
  maxUsesPerMonth: "",
  mapEnabled: false,
  pdfExportEnabled: false,
};

function PlanDialog({ open, onOpenChange, plan }: { open: boolean; onOpenChange: (o: boolean) => void; plan: Plan | null }) {
  const queryClient = useQueryClient();
  const form = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: EMPTY });
  const { errors } = form.formState;

  useEffect(() => {
    if (!open) return;
    form.reset(
      plan
        ? {
            name: plan.name,
            price: toText(plan.price),
            extraPrice: toText(plan.extraPrice),
            maxUsesPerDay: toText(plan.maxUsesPerDay),
            maxUsesPerMonth: toText(plan.maxUsesPerMonth),
            mapEnabled: plan.mapEnabled,
            pdfExportEnabled: plan.pdfExportEnabled,
          }
        : EMPTY,
    );
  }, [open, plan, form]);

  const save = useMutation({
    mutationFn: (v: FormValues) => (plan ? api.plans.update(plan.id, toInput(v)) : api.plans.create(toInput(v))),
    onSuccess: (saved) => {
      queryClient.invalidateQueries({ queryKey: keys.plans });
      queryClient.invalidateQueries({ queryKey: keys.pricing });
      toast.success(plan ? `Planul ${saved.name} a fost actualizat.` : `Planul ${saved.name} a fost creat.`);
      onOpenChange(false);
    },
    onError: (error) => toast.error(errorMessage(error)),
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader title={plan ? `Editează ${plan.name}` : "Plan nou"} description="Lasă limitele goale pentru generări nelimitate." />
        <form onSubmit={form.handleSubmit((v) => save.mutate(v))} noValidate className="grid gap-4 sm:grid-cols-2">
          <Field label="Nume" htmlFor="pl-name" error={errors.name?.message} className="sm:col-span-2">
            <Input id="pl-name" placeholder="Premium" aria-invalid={!!errors.name} {...form.register("name")} />
          </Field>
          <Field label="Preț pe lună (€)" htmlFor="pl-price" error={errors.price?.message}>
            <Input id="pl-price" inputMode="decimal" placeholder="4,99" className="font-mono" aria-invalid={!!errors.price} {...form.register("price")} />
          </Field>
          <Field label="Generare extra (€)" htmlFor="pl-extra" error={errors.extraPrice?.message}>
            <Input id="pl-extra" inputMode="decimal" placeholder="0,50" className="font-mono" aria-invalid={!!errors.extraPrice} {...form.register("extraPrice")} />
          </Field>
          <Field label="Generări pe zi" htmlFor="pl-day" error={errors.maxUsesPerDay?.message}>
            <Input id="pl-day" inputMode="numeric" placeholder="nelimitat" className="font-mono" aria-invalid={!!errors.maxUsesPerDay} {...form.register("maxUsesPerDay")} />
          </Field>
          <Field label="Generări pe lună" htmlFor="pl-month" error={errors.maxUsesPerMonth?.message}>
            <Input id="pl-month" inputMode="numeric" placeholder="nelimitat" className="font-mono" aria-invalid={!!errors.maxUsesPerMonth} {...form.register("maxUsesPerMonth")} />
          </Field>
          <div className="grid gap-2 rounded-xl bg-sheet-soft p-4 sm:col-span-2">
            <Controller
              control={form.control}
              name="pdfExportEnabled"
              render={({ field }) => (
                <label className="flex cursor-pointer items-center justify-between gap-4 text-[15px] font-semibold">
                  Export PDF
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </label>
              )}
            />
            <Controller
              control={form.control}
              name="mapEnabled"
              render={({ field }) => (
                <label className="flex cursor-pointer items-center justify-between gap-4 text-[15px] font-semibold">
                  Traseu pe hartă
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </label>
              )}
            />
          </div>
          <DialogFooter className="sm:col-span-2">
            <DialogClose asChild>
              <Button variant="outline">Renunță</Button>
            </DialogClose>
            <Button type="submit" disabled={save.isPending}>
              {save.isPending && <Loader2 className="animate-spin" />}
              {plan ? "Salvează" : "Creează planul"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
