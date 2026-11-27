"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ArrowRight,
  CircleAlert,
  FileImage,
  FileText,
  Loader2,
  Lock,
  Map as MapIcon,
  Sparkles,
  Upload,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useId, useRef, useState, type DragEvent, type ReactNode } from "react";
import toast from "react-hot-toast";
import { PageHeading } from "@/components/page-heading";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Field, Input } from "@/components/ui/form";
import { Badge, Skeleton } from "@/components/ui/misc";
import { api, ApiError, errorMessage } from "@/lib/api";
import { keys, useActivePlan, useCanGenerate } from "@/lib/queries";
import { useSession } from "@/lib/session";
import type { GenerationResult } from "@/lib/types";
import { cn, formatBytes, formatEuro, limitLabel } from "@/lib/utils";

const ACCEPTED = ["application/pdf", "image/jpeg", "image/png"];
const ACCEPTED_EXT = /\.(pdf|jpe?g|png)$/i;
const MAX_BYTES = 10 * 1024 * 1024;

type DocFile = { id: string; file: File; problem?: string };
type Done = GenerationResult & { tripName: string; documents: number; at: Date };

function checkFile(file: File): string | undefined {
  if (!ACCEPTED.includes(file.type) && !ACCEPTED_EXT.test(file.name)) return "Format neacceptat: doar PDF, JPG sau PNG.";
  if (file.size > MAX_BYTES) return "Fișierul are peste 10 MB.";
  return undefined;
}

export function GenerateScreen() {
  const { user } = useSession();
  const queryClient = useQueryClient();
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);

  const [tripName, setTripName] = useState("");
  const [files, setFiles] = useState<DocFile[]>([]);
  const [dragging, setDragging] = useState(false);
  const [extraOffer, setExtraOffer] = useState<number | null>(null);
  const [history, setHistory] = useState<Done[]>([]);

  const active = useActivePlan(user?.id);
  const canGenerate = useCanGenerate(user?.id);
  const noSubscription = canGenerate.error instanceof ApiError && canGenerate.error.status === 404;

  const valid = files.filter((f) => !f.problem);

  const addFiles = (list: FileList | null) => {
    if (!list?.length) return;
    const incoming = Array.from(list).map((file) => ({
      id: `${file.name}-${file.size}-${file.lastModified}`,
      file,
      problem: checkFile(file),
    }));
    setFiles((prev) => {
      const seen = new Set(prev.map((f) => f.id));
      return [...prev, ...incoming.filter((f) => !seen.has(f.id))];
    });
  };

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragging(false);
    addFiles(e.dataTransfer.files);
  };

  const generate = useMutation({
    mutationFn: (acceptExtra: boolean) => api.generations.request(user!.id, valid.length, acceptExtra),
    onSuccess: (result) => {
      setExtraOffer(null);
      const name = tripName.trim() || "Călătorie fără nume";
      setHistory((h) => [{ ...result, tripName: name, documents: valid.length, at: new Date() }, ...h]);
      setFiles([]);
      setTripName("");
      queryClient.invalidateQueries({ queryKey: keys.canGenerate(user!.id) });
      toast.success(
        result.outcome === "EXTRA"
          ? `Program generat. Generare extra: ${formatEuro(result.price)}.`
          : "Programul e gata!",
      );
    },
    onError: (error) => {
      if (error instanceof ApiError && error.status === 402) {
        const body = error.body as GenerationResult | null;
        setExtraOffer(Number(body?.price ?? active.plan?.extraPrice ?? 0));
        return;
      }
      setExtraOffer(null);
      toast.error(errorMessage(error));
    },
  });

  const plan = active.plan;

  return (
    <>
      <PageHeading
        eyebrow="Călătorie nouă"
        title="Încarcă documentele"
        description="Pune biletele și rezervările. Le citim, scoatem orele, adresele și codurile, apoi facem programul pe zile."
      />

      <div className="grid items-start gap-6 lg:grid-cols-[1fr_340px]">
        {/* coloana principală */}
        <div className="sheet p-5 sm:p-7">
          <Field label="Numele călătoriei" htmlFor="trip-name" hint="Îl vezi pe pagina călătoriei și în PDF.">
            <Input
              id="trip-name"
              value={tripName}
              onChange={(e) => setTripName(e.target.value)}
              placeholder="Roma, 3 zile"
              maxLength={80}
            />
          </Field>

          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            data-active={dragging}
            className={cn(
              "dropzone-border mt-6 flex flex-col items-center rounded-xl px-6 py-10 text-center transition-colors",
              dragging ? "bg-route/[0.04]" : "bg-sheet-soft/60",
            )}
          >
            <motion.span
              animate={dragging ? { y: -4, scale: 1.06 } : { y: 0, scale: 1 }}
              className="grid size-14 place-items-center rounded-2xl bg-white text-route shadow-[0_0_0_1px_rgb(0_0_0/0.06),0_6px_16px_-8px_rgb(0_0_0/0.3)]"
            >
              <Upload className="size-6" />
            </motion.span>
            <p className="mt-4 font-display text-lg font-extrabold tracking-tight">Trage aici biletele și rezervările</p>
            <p className="mt-1 text-[15px] text-sheet-muted">PDF, JPG sau PNG · maximum 10 MB pe fișier</p>
            <input
              ref={inputRef}
              id={inputId}
              type="file"
              multiple
              accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
              className="sr-only"
              onChange={(e) => {
                addFiles(e.target.files);
                e.target.value = "";
              }}
            />
            <Button className="mt-5" onClick={() => inputRef.current?.click()}>
              Alege fișiere
            </Button>
          </div>
          <p className="mt-3 flex items-center gap-2 text-[13px] text-sheet-muted">
            <Lock className="size-3.5" /> Fișierele nu se păstrează: le citim și le ștergem imediat.
          </p>

          {files.length > 0 && (
            <div className="mt-6">
              <div className="mb-2 flex items-center justify-between">
                <p className="eyebrow text-sheet-muted">
                  {files.length} {files.length === 1 ? "fișier" : "fișiere"}
                </p>
                <button type="button" onClick={() => setFiles([])} className="cursor-pointer text-sm font-semibold text-sheet-muted hover:text-bad">
                  Golește lista
                </button>
              </div>
              <ul className="grid gap-2">
                <AnimatePresence initial={false}>
                  {files.map(({ id, file, problem }) => {
                    const isPdf = file.type === "application/pdf" || /\.pdf$/i.test(file.name);
                    const Icon = isPdf ? FileText : FileImage;
                    return (
                      <motion.li
                        key={id}
                        layout
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: 16, transition: { duration: 0.15 } }}
                        className={cn(
                          "flex items-center gap-3 rounded-xl border bg-white p-3",
                          problem ? "border-bad/30" : "border-sheet-line",
                        )}
                      >
                        <span
                          className={cn(
                            "grid size-10 shrink-0 place-items-center rounded-lg",
                            problem ? "bg-bad/10 text-bad" : isPdf ? "bg-bad/8 text-[#c0392b]" : "bg-route/10 text-route",
                          )}
                        >
                          <Icon className="size-5" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-mono text-[13px] font-medium">{file.name}</p>
                          <p className={cn("text-[13px]", problem ? "text-bad" : "text-sheet-muted")}>
                            {problem ?? `${isPdf ? "PDF" : "Imagine"} · ${formatBytes(file.size)}`}
                          </p>
                        </div>
                        {problem ? <Badge tone="bad">De verificat</Badge> : <Badge tone="blue">Pregătit</Badge>}
                        <button
                          type="button"
                          aria-label={`Elimină ${file.name}`}
                          onClick={() => setFiles((prev) => prev.filter((f) => f.id !== id))}
                          className="grid size-8 shrink-0 cursor-pointer place-items-center rounded-lg text-sheet-muted hover:bg-sheet-soft hover:text-sheet-ink"
                        >
                          <X className="size-4" />
                        </button>
                      </motion.li>
                    );
                  })}
                </AnimatePresence>
              </ul>
            </div>
          )}
        </div>

        {/* coloana dreaptă */}
        <aside className="grid gap-5 lg:sticky lg:top-24">
          <div className="sheet p-5">
            <div className="flex items-center justify-between">
              <p className="eyebrow text-sheet-muted">Planul tău</p>
              {plan && (
                <Link href="/cont#abonament" className="text-sm font-semibold text-route hover:underline">
                  Schimbă
                </Link>
              )}
            </div>
            {active.isLoading ? (
              <Skeleton className="mt-2 h-7 w-28 text-[#111]" />
            ) : plan ? (
              <>
                <p className="mt-1 font-display text-2xl font-extrabold tracking-tight">{plan.name}</p>
                <dl className="mt-4 grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-sheet-soft p-3">
                    <dt className="text-[13px] text-sheet-muted">Pe zi</dt>
                    <dd className="font-mono text-xl font-semibold">{limitLabel(plan.maxUsesPerDay)}</dd>
                  </div>
                  <div className="rounded-xl bg-sheet-soft p-3">
                    <dt className="text-[13px] text-sheet-muted">Pe lună</dt>
                    <dd className="font-mono text-xl font-semibold">{limitLabel(plan.maxUsesPerMonth)}</dd>
                  </div>
                </dl>
              </>
            ) : (
              <p className="mt-1 text-[15px] text-sheet-muted">Nu ai un abonament activ.</p>
            )}

            <div className="mt-4">
              {canGenerate.isLoading ? (
                <Skeleton className="h-11 w-full text-[#111]" />
              ) : noSubscription ? (
                <Notice tone="bad">
                  Ai nevoie de un plan activ ca să generezi.{" "}
                  <Link href="/cont#abonament" className="font-semibold underline">
                    Alege un plan
                  </Link>
                </Notice>
              ) : canGenerate.error ? (
                <Notice tone="bad">{errorMessage(canGenerate.error)}</Notice>
              ) : canGenerate.data ? (
                <Notice tone="ok">Mai ai generări incluse în plan.</Notice>
              ) : (
                <Notice tone="wait">
                  Ai folosit generările incluse. Următoarea costă{" "}
                  <b className="font-mono">{formatEuro(plan?.extraPrice)}</b>.
                </Notice>
              )}
            </div>

            <p className="mt-4 text-[13px] leading-relaxed text-sheet-muted">
              O generare = un program făcut din documentele tale. Cele eșuate nu se numără.
            </p>

            <Button
              size="lg"
              className="mt-4 w-full"
              disabled={valid.length === 0 || generate.isPending || noSubscription}
              onClick={() => generate.mutate(false)}
            >
              {generate.isPending ? <Loader2 className="animate-spin" /> : <Sparkles />}
              Generează programul
            </Button>
            {valid.length === 0 && (
              <p className="mt-2 text-center text-[13px] text-sheet-muted">Adaugă cel puțin un document.</p>
            )}
            {plan && Number(plan.extraPrice) > 0 && (
              <p className="mt-3 text-center font-mono text-[12px] text-sheet-muted">
                După limită: {formatEuro(plan.extraPrice)} / generare extra
              </p>
            )}
          </div>

          {plan && !plan.mapEnabled && (
            <div className="sheet overflow-hidden">
              <div className="flex gap-4 p-5">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-route/10 text-route">
                  <MapIcon className="size-5" />
                </span>
                <div>
                  <p className="font-display text-lg font-extrabold tracking-tight">Vrei și harta?</p>
                  <p className="mt-1 text-[14px] leading-relaxed text-sheet-muted">
                    Cu Premium vezi opririle pe hartă, legate în ordinea zilei, cu durata fiecărui drum.
                  </p>
                  <Link href="/cont#abonament" className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-route hover:underline">
                    Vezi planurile <ArrowRight className="size-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          )}
        </aside>
      </div>

      {history.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-4 text-2xl text-ink">Generate acum</h2>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {history.map((g) => (
              <motion.li
                key={`${g.generationId}-${g.at.getTime()}`}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="sheet p-5"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="font-display text-lg leading-tight font-extrabold tracking-tight">{g.tripName}</p>
                  {g.outcome === "EXTRA" ? (
                    <Badge tone="wait">Extra · {formatEuro(g.price)}</Badge>
                  ) : (
                    <Badge tone="ok">Inclus</Badge>
                  )}
                </div>
                <p className="mt-2 font-mono text-[12px] text-sheet-muted">
                  #{g.generationId} · {g.documents} {g.documents === 1 ? "document" : "documente"} ·{" "}
                  {g.at.toLocaleTimeString("ro-RO", { hour: "2-digit", minute: "2-digit" })}
                </p>
              </motion.li>
            ))}
          </ul>
        </section>
      )}

      <ConfirmDialog
        open={extraOffer !== null}
        onOpenChange={(open) => !open && setExtraOffer(null)}
        title="Ai folosit generările incluse"
        description={
          <>
            Ai atins limita planului pentru azi sau pentru luna aceasta. Poți face totuși programul cu o generare extra
            de <b className="font-mono text-sheet-ink">{formatEuro(extraOffer)}</b>.
          </>
        }
        tone="primary"
        confirmLabel={`Generează cu ${formatEuro(extraOffer)}`}
        pending={generate.isPending}
        onConfirm={() => generate.mutate(true)}
      >
        <p className="flex items-center gap-2 rounded-lg bg-sheet-soft p-3 text-[13px] text-sheet-muted">
          <CircleAlert className="size-4 shrink-0" /> Dacă generarea eșuează, nu plătești.
        </p>
      </ConfirmDialog>
    </>
  );
}

function Notice({ tone, children }: { tone: "ok" | "wait" | "bad"; children: ReactNode }) {
  const styles = {
    ok: "bg-ok/10 text-[#146b43]",
    wait: "bg-wait/12 text-[#7c5306]",
    bad: "bg-bad/10 text-[#9b2a22]",
  }[tone];
  const dot = { ok: "bg-ok", wait: "bg-wait", bad: "bg-bad" }[tone];
  return (
    <p className={cn("flex items-start gap-2.5 rounded-xl px-3 py-2.5 text-[14px] leading-snug", styles)}>
      <span className={cn("mt-[7px] size-2 shrink-0 rounded-full", dot)} />
      <span>{children}</span>
    </p>
  );
}
