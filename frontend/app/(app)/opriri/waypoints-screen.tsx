"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MapPin, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState, type ReactNode } from "react";
import toast from "react-hot-toast";
import { ErrorState, PageHeading } from "@/components/page-heading";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { api, errorMessage } from "@/lib/api";
import { keys, useWaypoints } from "@/lib/queries";
import type { Waypoint } from "@/lib/types";
import { cn } from "@/lib/utils";
import { WaypointDialog } from "./waypoint-dialog";

export function WaypointsScreen() {
  const waypoints = useWaypoints();
  const queryClient = useQueryClient();
  const [query, setQuery] = useState("");
  const [country, setCountry] = useState<string | null>(null);
  const [editing, setEditing] = useState<Waypoint | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState<Waypoint | null>(null);

  const countries = useMemo(() => {
    const counts = new Map<string, number>();
    for (const w of waypoints.data ?? []) counts.set(w.countryCode, (counts.get(w.countryCode) ?? 0) + 1);
    return [...counts.entries()].sort((a, b) => b[1] - a[1]);
  }, [waypoints.data]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (waypoints.data ?? [])
      .filter((w) => !country || w.countryCode === country)
      .filter((w) => !q || `${w.name} ${w.city} ${w.countryCode}`.toLowerCase().includes(q))
      .sort((a, b) => a.city.localeCompare(b.city, "ro") || a.name.localeCompare(b.name, "ro"));
  }, [waypoints.data, query, country]);

  const remove = useMutation({
    mutationFn: (w: Waypoint) => api.waypoints.remove(w.id),
    onSuccess: (_, w) => {
      queryClient.invalidateQueries({ queryKey: keys.waypoints });
      toast.success(`„${w.name}” a fost ștearsă.`);
      setDeleting(null);
    },
    onError: (error) => toast.error(errorMessage(error)),
  });

  const openNew = () => {
    setEditing(null);
    setDialogOpen(true);
  };

  return (
    <>
      <PageHeading
        eyebrow="Locuri salvate"
        title="Opriri"
        description="Locurile pe care vrei să le vezi în călătorii: muzee, restaurante, hoteluri."
        actions={
          <Button onClick={openNew}>
            <Plus /> Oprire nouă
          </Button>
        }
      />

      {waypoints.error ? (
        <ErrorState message={errorMessage(waypoints.error)} onRetry={() => waypoints.refetch()} />
      ) : (
        <>
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <label className="relative block sm:w-80">
              <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ink-3" />
              <span className="sr-only">Caută</span>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Caută după nume sau oraș"
                className="h-10 w-full rounded-lg border border-line bg-desk-raised/60 pr-3 pl-9 text-[15px] text-ink outline-none placeholder:text-ink-3 focus:border-route focus:ring-4 focus:ring-route/20"
              />
            </label>
            {countries.length > 1 && (
              <div className="flex flex-wrap gap-2">
                <Chip active={!country} onClick={() => setCountry(null)}>
                  Toate
                </Chip>
                {countries.map(([cc, n]) => (
                  <Chip key={cc} active={country === cc} onClick={() => setCountry(country === cc ? null : cc)}>
                    <span className="font-mono">{cc}</span>
                    <span className="opacity-60">{n}</span>
                  </Chip>
                ))}
              </div>
            )}
          </div>

          {waypoints.isLoading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }, (_, i) => (
                <div key={i} className="sheet h-[120px] animate-pulse opacity-60" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="sheet flex flex-col items-center px-6 py-14 text-center">
              <span className="grid size-14 place-items-center rounded-2xl bg-route/10 text-route">
                <MapPin className="size-6" />
              </span>
              <p className="mt-4 font-display text-xl font-extrabold tracking-tight">
                {waypoints.data?.length ? "Nicio oprire nu se potrivește" : "Încă n-ai nicio oprire"}
              </p>
              <p className="mt-1 font-hand text-xl text-sheet-muted">
                {waypoints.data?.length ? "încearcă altă căutare" : "prima e mereu cea mai frumoasă"}
              </p>
              {!waypoints.data?.length && (
                <Button className="mt-5" onClick={openNew}>
                  <Plus /> Adaugă prima oprire
                </Button>
              )}
            </div>
          ) : (
            <motion.ul layout className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence initial={false}>
                {filtered.map((w, i) => (
                  <motion.li
                    key={w.id}
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0, transition: { delay: Math.min(i, 8) * 0.03 } }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    className="sheet group flex gap-4 p-5"
                  >
                    <span className="relative grid size-10 shrink-0 place-items-center">
                      <MapPin className="size-10 fill-route text-route" strokeWidth={1.2} />
                      <span className="absolute top-[9px] font-mono text-[11px] font-bold text-white">{i + 1}</span>
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-display text-lg leading-tight font-extrabold tracking-tight">{w.name}</p>
                      <p className="mt-1 flex items-center gap-2 text-[15px] text-sheet-muted">
                        <span className="truncate">{w.city}</span>
                        <span className="rounded bg-sheet-soft px-1.5 font-mono text-[11px] font-semibold text-sheet-ink">
                          {w.countryCode}
                        </span>
                      </p>
                    </div>
                    <div className="flex shrink-0 flex-col gap-1 opacity-100 transition-opacity sm:opacity-0 sm:group-focus-within:opacity-100 sm:group-hover:opacity-100">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        aria-label={`Editează ${w.name}`}
                        onClick={() => {
                          setEditing(w);
                          setDialogOpen(true);
                        }}
                      >
                        <Pencil />
                      </Button>
                      <Button variant="danger-ghost" size="icon-sm" aria-label={`Șterge ${w.name}`} onClick={() => setDeleting(w)}>
                        <Trash2 />
                      </Button>
                    </div>
                  </motion.li>
                ))}
              </AnimatePresence>
            </motion.ul>
          )}
        </>
      )}

      <WaypointDialog open={dialogOpen} onOpenChange={setDialogOpen} waypoint={editing} />

      <ConfirmDialog
        open={!!deleting}
        onOpenChange={(open) => !open && setDeleting(null)}
        title="Ștergi oprirea?"
        description={
          <>
            <b className="text-sheet-ink">{deleting?.name}</b> din {deleting?.city} dispare definitiv din listă.
          </>
        }
        confirmLabel="Șterge"
        pending={remove.isPending}
        onConfirm={() => deleting && remove.mutate(deleting)}
      />
    </>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-full border px-3 text-sm font-semibold transition-colors",
        active ? "border-sun bg-sun text-[#111]" : "border-line text-ink-2 hover:border-ink/40 hover:text-ink",
      )}
    >
      {children}
    </button>
  );
}
