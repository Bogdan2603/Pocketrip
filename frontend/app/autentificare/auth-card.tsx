"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2, LogIn, UserPlus } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { sortPlans } from "@/components/plan-card";
import { Button } from "@/components/ui/button";
import { Field, Input, NativeSelect } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/primitives";
import { api, ApiError, errorMessage } from "@/lib/api";
import { keys } from "@/lib/queries";
import { useSession } from "@/lib/session";

type Mode = "autentificare" | "cont-nou";

function safeNext(value: string | null) {
  // doar căi interne, ca să nu putem fi trimiși pe alt site
  return value && value.startsWith("/") && !value.startsWith("//") ? value : "/incarca";
}

export function AuthCard() {
  const params = useSearchParams();
  const [mode, setMode] = useState<Mode>(params.get("mod") === "cont-nou" ? "cont-nou" : "autentificare");
  const next = safeNext(params.get("next"));

  return (
    <div className="sheet mx-auto w-full max-w-[460px] p-6 sm:p-8">
      <Tabs value={mode} onValueChange={(v) => setMode(v as Mode)}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="autentificare">
            <LogIn /> Autentificare
          </TabsTrigger>
          <TabsTrigger value="cont-nou">
            <UserPlus /> Cont nou
          </TabsTrigger>
        </TabsList>
        <TabsContent value="autentificare" className="mt-7 outline-none">
          <LoginForm next={next} onSwitch={() => setMode("cont-nou")} />
        </TabsContent>
        <TabsContent value="cont-nou" className="mt-7 outline-none">
          <RegisterForm next={next} onSwitch={() => setMode("autentificare")} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

/* ---------- Autentificare ---------- */

const loginSchema = z.object({
  email: z.email("Scrie o adresă de e-mail validă."),
  password: z.string().min(1, "Scrie parola."),
});

function LoginForm({ next, onSwitch }: { next: string; onSwitch: () => void }) {
  const { signIn } = useSession();
  const router = useRouter();
  const form = useForm({ resolver: zodResolver(loginSchema), defaultValues: { email: "", password: "" } });
  const { errors, isSubmitting } = form.formState;

  const onSubmit = form.handleSubmit(async ({ email }) => {
    try {
      // Backend-ul nu are încă /api/auth: căutăm contul după e-mail.
      const users = await api.users.list();
      const user = users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
      if (!user) {
        form.setError("email", { message: "Nu există un cont cu acest e-mail." });
        return;
      }
      signIn(user);
      toast.success(`Bine ai revenit${user.displayName ? `, ${user.displayName.split(" ")[0]}` : ""}!`);
      router.push(next);
    } catch (error) {
      toast.error(errorMessage(error));
    }
  });

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-4">
      <div>
        <h2 className="font-display text-2xl font-extrabold tracking-tight">Bine ai revenit</h2>
        <p className="mt-1 text-[15px] text-sheet-muted">Intră în cont ca să-ți vezi călătoriile.</p>
      </div>
      <Field label="E-mail" htmlFor="login-email" error={errors.email?.message}>
        <Input id="login-email" type="email" autoComplete="email" placeholder="ana@exemplu.ro" aria-invalid={!!errors.email} {...form.register("email")} />
      </Field>
      <Field label="Parolă" htmlFor="login-password" error={errors.password?.message}>
        <Input id="login-password" type="password" autoComplete="current-password" aria-invalid={!!errors.password} {...form.register("password")} />
      </Field>
      <button
        type="button"
        className="-mt-1 cursor-pointer justify-self-end text-sm font-semibold text-route hover:underline"
        onClick={() => toast("Resetarea parolei vine în curând.", { icon: "✉️" })}
      >
        Ai uitat parola?
      </button>
      <Button type="submit" size="lg" disabled={isSubmitting}>
        {isSubmitting && <Loader2 className="animate-spin" />}
        Intră în cont
      </Button>
      <p className="text-center text-[15px] text-sheet-muted">
        Nu ai cont?{" "}
        <button type="button" onClick={onSwitch} className="squiggle squiggle-sheet cursor-pointer font-semibold text-sheet-ink">
          Creează unul gratuit
        </button>
      </p>
    </form>
  );
}

/* ---------- Cont nou ---------- */

const registerSchema = z.object({
  displayName: z.string().trim().min(2, "Numele are cel puțin 2 caractere.").max(100, "Maximum 100 de caractere."),
  email: z.email("Scrie o adresă de e-mail validă."),
  password: z.string().min(8, "Parola are minimum 8 caractere."),
  preferredLanguage: z.enum(["ro", "en"]),
});

function RegisterForm({ next, onSwitch }: { next: string; onSwitch: () => void }) {
  const { signIn } = useSession();
  const router = useRouter();
  const queryClient = useQueryClient();
  const form = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { displayName: "", email: "", password: "", preferredLanguage: "ro" as const },
  });
  const { errors, isSubmitting } = form.formState;

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      const user = await api.users.create({ ...values, email: values.email.trim(), role: "USER" });

      // Contul nou pornește pe planul gratuit.
      const free = sortPlans(await api.pricing().catch(() => [])).find((p) => Number(p.price) === 0);
      if (free) {
        await api.subscriptions.changePlan(user.id, free.id).catch(() => {
          toast.error("Contul e creat, dar nu am putut activa planul Free.");
        });
      }
      queryClient.invalidateQueries({ queryKey: keys.subscriptions });
      queryClient.invalidateQueries({ queryKey: keys.users });

      signIn(user);
      toast.success(free ? `Contul e gata. Ești pe planul ${free.name}.` : "Contul e gata!");
      router.push(next);
    } catch (error) {
      if (error instanceof ApiError && error.status === 409) {
        form.setError("email", { message: "Există deja un cont cu acest e-mail." });
      } else {
        toast.error(errorMessage(error));
      }
    }
  });

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-4">
      <div>
        <h2 className="font-display text-2xl font-extrabold tracking-tight">Creează cont</h2>
        <p className="mt-1 text-[15px] text-sheet-muted">Gratuit. Pornești pe planul Free, fără card.</p>
      </div>
      <Field label="Nume afișat" htmlFor="reg-name" error={errors.displayName?.message}>
        <Input id="reg-name" autoComplete="name" placeholder="Ana Popescu" aria-invalid={!!errors.displayName} {...form.register("displayName")} />
      </Field>
      <Field label="E-mail" htmlFor="reg-email" error={errors.email?.message}>
        <Input id="reg-email" type="email" autoComplete="email" placeholder="ana@exemplu.ro" aria-invalid={!!errors.email} {...form.register("email")} />
      </Field>
      <div className="grid gap-4 sm:grid-cols-[1fr_150px]">
        <Field label="Parolă" htmlFor="reg-password" error={errors.password?.message} hint="Minimum 8 caractere.">
          <Input id="reg-password" type="password" autoComplete="new-password" aria-invalid={!!errors.password} {...form.register("password")} />
        </Field>
        <Field label="Limba aplicației" htmlFor="reg-lang">
          <NativeSelect id="reg-lang" {...form.register("preferredLanguage")}>
            <option value="ro">Română</option>
            <option value="en">English</option>
          </NativeSelect>
        </Field>
      </div>
      <Button type="submit" size="lg" disabled={isSubmitting} className="mt-1">
        {isSubmitting && <Loader2 className="animate-spin" />}
        Creează contul
      </Button>
      <p className="text-center text-[13px] text-sheet-muted">
        Ai deja cont?{" "}
        <button type="button" onClick={onSwitch} className="cursor-pointer font-semibold text-sheet-ink hover:underline">
          Intră în cont
        </button>
      </p>
    </form>
  );
}
