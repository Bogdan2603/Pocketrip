import type { SubscriptionStatus } from "./types";

export const STATUS_LABEL: Record<SubscriptionStatus, { label: string; tone: "ok" | "neutral" | "bad" }> = {
  ACTIVE: { label: "Activ", tone: "ok" },
  EXPIRED: { label: "Expirat", tone: "neutral" },
  CANCELLED: { label: "Anulat", tone: "bad" },
};
