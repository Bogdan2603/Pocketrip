"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Pencil, Search, UserPlus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { ErrorState } from "@/components/page-heading";
import { sortPlans } from "@/components/plan-card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader } from "@/components/ui/dialog";
import { Field, Input, NativeSelect } from "@/components/ui/form";
import { Badge } from "@/components/ui/misc";
import { Table, TableSkeleton, Td, Th, Tr } from "@/components/ui/table";
import { api, ApiError, errorMessage } from "@/lib/api";
import { keys, usePlans, useSubscriptions, useUsers } from "@/lib/queries";
import { useSession } from "@/lib/session";
import type { User } from "@/lib/types";
import { initials } from "@/lib/utils";

export function UsersTab() {
  const users = useUsers();
  const plans = usePlans();
  const subs = useSubscriptions();
  const queryClient = useQueryClient();
  const { user: me } = useSession();
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<User | null>(null);
  const [open, setOpen] = useState(false);

  const activePlanId = useMemo(() => {
    const map = new Map<number, number>();
    subs.data?.filter((s) => s.status === "ACTIVE").forEach((s) => map.set(s.userId, s.planId));
    return map;
  }, [subs.data]);

  const changePlan = useMutation({
    mutationFn: ({ user, planId }: { user: User; planId: number }) => api.subscriptions.changePlan(user.id, planId),
    onSuccess: (_, { user, planId }) => {
      queryClient.invalidateQueries({ queryKey: keys.subscriptions });
      queryClient.invalidateQueries({ queryKey: keys.canGenerate(user.id) });
      const name = plans.data?.find((p) => p.id === planId)?.name;
      toast.success(`${user.displayName || user.email} e acum pe ${name ?? "noul plan"}.`);
    },
    onError: (error) => toast.error(errorMessage(error)),
  });

  const filtered = (users.data ?? [])
    .filter((u) => `${u.displayName ?? ""} ${u.email}`.toLowerCase().includes(query.trim().toLowerCase()))
    .sort((a, b) => a.id - b.id);

  if (users.error) return <ErrorState message={errorMessage(users.error)} onRetry={() => users.refetch()} />;

  return (
    <div className="sheet overflow-hidden">
      <div className="flex flex-col gap-3 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
        <label className="relative block sm:w-72">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-sheet-muted" />
          <span className="sr-only">Caută utilizatori</span>
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Caută după nume sau e-mail" className="pl-9" />
        </label>
        <Button
          onClick={() => {
            setEditing(null);
            setOpen(true);
          }}
        >
          <UserPlus /> Utilizator nou
        </Button>
      </div>
      {users.isLoading ? (
        <TableSkeleton cols={5} />
      ) : (
        <Table className="min-w-[760px]">
          <thead>
            <tr>
              <Th>Utilizator</Th>
              <Th>Rol</Th>
              <Th>Limbă</Th>
              <Th>Plan activ</Th>
              <Th />
            </tr>
          </thead>
          <tbody>
            {filtered.map((u) => {
              const planId = activePlanId.get(u.id);
              return (
                <Tr key={u.id}>
                  <Td>
                    <div className="flex items-center gap-3">
                      <span className="grid size-9 shrink-0 place-items-center rounded-full bg-sheet-soft font-mono text-[12px] font-semibold">
                        {initials(u.displayName, u.email)}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate font-semibold">
                          {u.displayName || "Fără nume"}
                          {u.id === me?.id && <span className="ml-2 font-mono text-[11px] font-normal text-sheet-muted">(tu)</span>}
                        </p>
                        <p className="truncate text-[13px] text-sheet-muted">{u.email}</p>
                      </div>
                    </div>
                  </Td>
                  <Td>{u.role === "ADMIN" ? <Badge tone="blue">Admin</Badge> : <Badge>User</Badge>}</Td>
                  <Td className="font-mono text-[13px] uppercase">{u.preferredLanguage}</Td>
                  <Td className="w-48">
                    <NativeSelect
                      aria-label={`Planul lui ${u.email}`}
                      value={planId ?? ""}
                      disabled={changePlan.isPending || !plans.data}
                      onChange={(e) => changePlan.mutate({ user: u, planId: Number(e.target.value) })}
                      className="h-9 text-[14px]"
                    >
                      {planId === undefined && <option value="">Fără plan</option>}
                      {sortPlans(plans.data).map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                      {planId !== undefined && !plans.data?.some((p) => p.id === planId) && (
                        <option value={planId}>Plan retras #{planId}</option>
                      )}
                    </NativeSelect>
                  </Td>
                  <Td className="w-0">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label={`Editează ${u.email}`}
                      onClick={() => {
                        setEditing(u);
                        setOpen(true);
                      }}
                    >
                      <Pencil />
                    </Button>
                  </Td>
                </Tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <Td colSpan={5} className="py-10 text-center text-sheet-muted">
                  Niciun utilizator găsit.
                </Td>
              </tr>
            )}
          </tbody>
        </Table>
      )}
      <UserDialog open={open} onOpenChange={setOpen} user={editing} />
    </div>
  );
}

/* ---------- formular ---------- */

const baseSchema = z.object({
  displayName: z.string().trim().max(100, "Maximum 100 de caractere."),
  email: z.email("Scrie o adresă de e-mail validă."),
  role: z.enum(["USER", "ADMIN"]),
  preferredLanguage: z.enum(["ro", "en"]),
  password: z.string(),
});

function UserDialog({ open, onOpenChange, user }: { open: boolean; onOpenChange: (o: boolean) => void; user: User | null }) {
  const queryClient = useQueryClient();
  const { user: me, signIn } = useSession();
  const schema = useMemo(
    () =>
      user
        ? baseSchema
        : baseSchema.extend({ password: z.string().min(8, "Parola are minimum 8 caractere.") }),
    [user],
  );
  const form = useForm<z.infer<typeof baseSchema>>({
    resolver: zodResolver(schema),
    defaultValues: { displayName: "", email: "", role: "USER", preferredLanguage: "ro", password: "" },
  });
  const { errors } = form.formState;

  useEffect(() => {
    if (!open) return;
    form.reset(
      user
        ? { displayName: user.displayName ?? "", email: user.email, role: user.role, preferredLanguage: user.preferredLanguage, password: "" }
        : { displayName: "", email: "", role: "USER", preferredLanguage: "ro", password: "" },
    );
  }, [open, user, form]);

  const save = useMutation({
    mutationFn: async (v: z.infer<typeof baseSchema>) => {
      const data = { displayName: v.displayName, email: v.email.trim(), role: v.role, preferredLanguage: v.preferredLanguage };
      if (user) return api.users.update(user.id, data);
      return api.users.create({ ...data, password: v.password });
    },
    onSuccess: (saved) => {
      queryClient.invalidateQueries({ queryKey: keys.users });
      if (saved.id === me?.id) signIn(saved);
      toast.success(user ? "Utilizatorul a fost actualizat." : `Contul pentru ${saved.email} a fost creat.`);
      onOpenChange(false);
    },
    onError: (error) => {
      if (error instanceof ApiError && error.status === 409) form.setError("email", { message: "Există deja un cont cu acest e-mail." });
      else toast.error(errorMessage(error));
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader
          title={user ? "Editează utilizatorul" : "Utilizator nou"}
          description={user ? user.email : "Contul nou nu primește automat un plan: alege-l după aceea din tabel."}
        />
        <form onSubmit={form.handleSubmit((v) => save.mutate(v))} noValidate className="grid gap-4 sm:grid-cols-2">
          <Field label="Nume afișat" htmlFor="u-name" error={errors.displayName?.message}>
            <Input id="u-name" {...form.register("displayName")} />
          </Field>
          <Field label="E-mail" htmlFor="u-email" error={errors.email?.message}>
            <Input id="u-email" type="email" aria-invalid={!!errors.email} {...form.register("email")} />
          </Field>
          <Field label="Rol" htmlFor="u-role">
            <NativeSelect id="u-role" {...form.register("role")} disabled={user?.id === me?.id}>
              <option value="USER">User</option>
              <option value="ADMIN">Admin</option>
            </NativeSelect>
          </Field>
          <Field label="Limbă" htmlFor="u-lang">
            <NativeSelect id="u-lang" {...form.register("preferredLanguage")}>
              <option value="ro">Română</option>
              <option value="en">English</option>
            </NativeSelect>
          </Field>
          {!user && (
            <Field label="Parolă" htmlFor="u-pass" error={errors.password?.message} className="sm:col-span-2">
              <Input id="u-pass" type="password" autoComplete="new-password" aria-invalid={!!errors.password} {...form.register("password")} />
            </Field>
          )}
          <DialogFooter className="sm:col-span-2">
            <DialogClose asChild>
              <Button variant="outline">Renunță</Button>
            </DialogClose>
            <Button type="submit" disabled={save.isPending}>
              {save.isPending && <Loader2 className="animate-spin" />}
              {user ? "Salvează" : "Creează contul"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
