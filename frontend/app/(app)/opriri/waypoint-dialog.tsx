"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader } from "@/components/ui/dialog";
import { Field, Input } from "@/components/ui/form";
import { api, errorMessage } from "@/lib/api";
import { keys } from "@/lib/queries";
import type { Waypoint } from "@/lib/types";

const schema = z.object({
  name: z.string().trim().min(2, "Numele are cel puțin 2 caractere.").max(120, "Maximum 120 de caractere."),
  city: z.string().trim().min(2, "Scrie orașul.").max(80, "Maximum 80 de caractere."),
  countryCode: z
    .string()
    .trim()
    .regex(/^[A-Za-z]{2}$/, "Codul țării are 2 litere (ex. IT, RO).")
    .transform((v) => v.toUpperCase()),
});

type FormIn = z.input<typeof schema>;
type FormOut = z.output<typeof schema>;

export function WaypointDialog({
  open,
  onOpenChange,
  waypoint,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** null = oprire nouă */
  waypoint: Waypoint | null;
}) {
  const queryClient = useQueryClient();
  const form = useForm<FormIn, unknown, FormOut>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", city: "", countryCode: "" },
  });
  const { errors } = form.formState;

  useEffect(() => {
    if (open) form.reset(waypoint ? { name: waypoint.name, city: waypoint.city, countryCode: waypoint.countryCode } : { name: "", city: "", countryCode: "" });
  }, [open, waypoint, form]);

  const save = useMutation({
    mutationFn: (data: FormOut) => (waypoint ? api.waypoints.update(waypoint.id, data) : api.waypoints.create(data)),
    onSuccess: (saved) => {
      queryClient.invalidateQueries({ queryKey: keys.waypoints });
      toast.success(waypoint ? `„${saved.name}” a fost actualizată.` : `„${saved.name}” a fost adăugată.`);
      onOpenChange(false);
    },
    onError: (error) => toast.error(errorMessage(error)),
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader
          title={waypoint ? "Editează oprirea" : "Oprire nouă"}
          description={waypoint ? "Schimbările se văd imediat în listă." : "Un loc pe care vrei să-l vizitezi: muzeu, restaurant, hotel."}
        />
        <form onSubmit={form.handleSubmit((data) => save.mutate(data))} noValidate className="grid gap-4">
          <Field label="Nume" htmlFor="wp-name" error={errors.name?.message}>
            <Input id="wp-name" placeholder="Colosseum" autoFocus aria-invalid={!!errors.name} {...form.register("name")} />
          </Field>
          <div className="grid gap-4 sm:grid-cols-[1fr_120px]">
            <Field label="Oraș" htmlFor="wp-city" error={errors.city?.message}>
              <Input id="wp-city" placeholder="Roma" aria-invalid={!!errors.city} {...form.register("city")} />
            </Field>
            <Field label="Țara" htmlFor="wp-cc" error={errors.countryCode?.message}>
              <Input
                id="wp-cc"
                placeholder="IT"
                maxLength={2}
                className="font-mono uppercase"
                aria-invalid={!!errors.countryCode}
                {...form.register("countryCode")}
              />
            </Field>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Renunță</Button>
            </DialogClose>
            <Button type="submit" disabled={save.isPending}>
              {save.isPending && <Loader2 className="animate-spin" />}
              {waypoint ? "Salvează" : "Adaugă oprirea"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
