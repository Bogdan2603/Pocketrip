"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { ErrorState } from "@/components/page-heading";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { NativeSelect } from "@/components/ui/form";
import { Table, TableSkeleton, Td, Th, Tr } from "@/components/ui/table";
import { api, errorMessage } from "@/lib/api";
import { STATUS_LABEL } from "@/lib/labels";
import { keys, usePlans, useSubscriptions, useUsers } from "@/lib/queries";
import type { Subscription, SubscriptionStatus } from "@/lib/types";
import { cn, formatDate } from "@/lib/utils";

const FILTERS: { value: SubscriptionStatus | "ALL"; label: string }[] = [
  { value: "ALL", label: "Toate" },
  { value: "ACTIVE", label: "Active" },
  { value: "CANCELLED", label: "Anulate" },
  { value: "EXPIRED", label: "Expirate" },
];

const STATUS_STYLE: Record<SubscriptionStatus, string> = {
  ACTIVE: "border-ok/40 bg-ok/8 text-ok font-semibold",
  CANCELLED: "border-bad/30 bg-bad/5 text-bad",
  EXPIRED: "",
};

export function SubscriptionsTab() {
  const subs = useSubscriptions();
  const users = useUsers();
  const plans = usePlans();
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<SubscriptionStatus | "ALL">("ALL");
  const [deleting, setDeleting] = useState<Subscription | null>(null);

  const userLabel = (id: number) => {
    const u = users.data?.find((x) => x.id === id);
    return u ? { name: u.displayName || "Fără nume", email: u.email } : { name: `Utilizator #${id}`, email: "" };
  };
  const planName = (id: number) => plans.data?.find((p) => p.id === id)?.name ?? `Plan retras #${id}`;

  const invalidate = (userId: number) => {
    queryClient.invalidateQueries({ queryKey: keys.subscriptions });
    queryClient.invalidateQueries({ queryKey: keys.canGenerate(userId) });
  };

  const setStatus = useMutation({
    mutationFn: ({ sub, status }: { sub: Subscription; status: SubscriptionStatus }) => {
      const { id, ...rest } = sub;
      return api.subscriptions.update(id, { ...rest, status });
    },
    onSuccess: (saved) => {
      invalidate(saved.userId);
      toast.success(`Abonamentul #${saved.id} e acum ${STATUS_LABEL[saved.status].label.toLowerCase()}.`);
    },
    // Baza de date permite un singur abonament activ pe utilizator.
    onError: (error) => toast.error(errorMessage(error)),
  });

  const remove = useMutation({
    mutationFn: (sub: Subscription) => api.subscriptions.remove(sub.id),
    onSuccess: (_, sub) => {
      invalidate(sub.userId);
      toast.success(`Abonamentul #${sub.id} a fost șters.`);
      setDeleting(null);
    },
    onError: (error) => toast.error(errorMessage(error)),
  });

  if (subs.error) return <ErrorState message={errorMessage(subs.error)} onRetry={() => subs.refetch()} />;

  const rows = (subs.data ?? [])
    .filter((s) => filter === "ALL" || s.status === filter)
    .sort((a, b) => b.id - a.id);

  return (
    <div className="sheet overflow-hidden">
      <div className="flex flex-wrap gap-2 px-6 py-5">
        {FILTERS.map((f) => {
          const count = f.value === "ALL" ? subs.data?.length : subs.data?.filter((s) => s.status === f.value).length;
          return (
            <button
              key={f.value}
              type="button"
              onClick={() => setFilter(f.value)}
              aria-pressed={filter === f.value}
              className={cn(
                "inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-full border px-3 text-sm font-semibold transition-colors",
                filter === f.value ? "border-sun bg-sun" : "border-sheet-line text-sheet-muted hover:text-sheet-ink",
              )}
            >
              {f.label}
              {count !== undefined && <span className="font-mono text-[11px] opacity-60">{count}</span>}
            </button>
          );
        })}
      </div>
      {subs.isLoading ? (
        <TableSkeleton cols={5} />
      ) : (
        <Table className="min-w-[760px]">
          <thead>
            <tr>
              <Th>#</Th>
              <Th>Utilizator</Th>
              <Th>Plan</Th>
              <Th>Din</Th>
              <Th>Până la</Th>
              <Th>Stare</Th>
              <Th />
            </tr>
          </thead>
          <tbody>
            {rows.map((s) => {
              const u = userLabel(s.userId);
              return (
                <Tr key={s.id}>
                  <Td className="font-mono text-[13px] text-sheet-muted">{s.id}</Td>
                  <Td>
                    <p className="font-semibold">{u.name}</p>
                    <p className="text-[13px] text-sheet-muted">{u.email}</p>
                  </Td>
                  <Td>{planName(s.planId)}</Td>
                  <Td className="font-mono text-[13px]">{formatDate(s.startDate)}</Td>
                  <Td className="font-mono text-[13px]">{formatDate(s.endDate)}</Td>
                  <Td className="w-40">
                    <NativeSelect
                      aria-label={`Starea abonamentului ${s.id}`}
                      value={s.status}
                      disabled={setStatus.isPending}
                      onChange={(e) => setStatus.mutate({ sub: s, status: e.target.value as SubscriptionStatus })}
                      className={cn("h-9 text-[14px]", STATUS_STYLE[s.status])}
                    >
                      <option value="ACTIVE">Activ</option>
                      <option value="CANCELLED">Anulat</option>
                      <option value="EXPIRED">Expirat</option>
                    </NativeSelect>
                  </Td>
                  <Td className="w-0">
                    <Button variant="danger-ghost" size="icon-sm" aria-label={`Șterge abonamentul ${s.id}`} onClick={() => setDeleting(s)}>
                      <Trash2 />
                    </Button>
                  </Td>
                </Tr>
              );
            })}
            {rows.length === 0 && (
              <tr>
                <Td colSpan={7} className="py-10 text-center text-sheet-muted">
                  Niciun abonament aici.
                </Td>
              </tr>
            )}
          </tbody>
        </Table>
      )}
      <ConfirmDialog
        open={!!deleting}
        onOpenChange={(o) => !o && setDeleting(null)}
        title={`Ștergi abonamentul #${deleting?.id}?`}
        description="Rândul dispare definitiv din istoric. Ca să schimbi doar planul cuiva, folosește tabul Utilizatori."
        confirmLabel="Șterge definitiv"
        pending={remove.isPending}
        onConfirm={() => deleting && remove.mutate(deleting)}
      />
    </div>
  );
}
