import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const euro = new Intl.NumberFormat("ro-RO", {
  style: "currency",
  currency: "EUR",
  currencyDisplay: "narrowSymbol",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatEuro(value: number | null | undefined) {
  return euro.format(Number(value ?? 0));
}

const dateFmt = new Intl.DateTimeFormat("ro-RO", { day: "2-digit", month: "short", year: "numeric" });

/** Formatează o dată ISO (yyyy-mm-dd) fără să o mute din cauza fusului orar. */
export function formatDate(iso: string | null | undefined) {
  if (!iso) return "—";
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return iso;
  return dateFmt.format(new Date(y, m - 1, d));
}

export function limitLabel(value: number | null | undefined) {
  return value == null ? "nelimitat" : String(value);
}

export function initials(name: string | null | undefined, email?: string) {
  const source = (name ?? "").trim() || (email ?? "").split("@")[0] || "?";
  const parts = source.split(/\s+/).filter(Boolean);
  const letters = parts.length > 1 ? parts[0][0] + parts[parts.length - 1][0] : source.slice(0, 2);
  return letters.toUpperCase();
}

export function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1).replace(".", ",")} MB`;
}
