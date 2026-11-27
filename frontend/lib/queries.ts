"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "./api";
import type { Plan, Subscription } from "./types";

export const keys = {
  pricing: ["pricing"] as const,
  plans: ["plans"] as const,
  users: ["users"] as const,
  subscriptions: ["subscriptions"] as const,
  waypoints: ["waypoints"] as const,
  canGenerate: (userId: number) => ["can-generate", userId] as const,
};

export function usePricing() {
  return useQuery({ queryKey: keys.pricing, queryFn: api.pricing, staleTime: 60_000 });
}

export function usePlans() {
  return useQuery({ queryKey: keys.plans, queryFn: api.plans.list });
}

export function useUsers() {
  return useQuery({ queryKey: keys.users, queryFn: api.users.list });
}

export function useSubscriptions() {
  return useQuery({ queryKey: keys.subscriptions, queryFn: api.subscriptions.list });
}

export function useWaypoints() {
  return useQuery({ queryKey: keys.waypoints, queryFn: api.waypoints.list });
}

export function useCanGenerate(userId: number | undefined) {
  return useQuery({
    queryKey: keys.canGenerate(userId ?? 0),
    queryFn: () => api.generations.canGenerate(userId!),
    enabled: !!userId,
    retry: false,
  });
}

/** Abonamentele unui utilizator, cel activ primul, apoi cele mai noi. */
export function sortUserSubscriptions(subs: Subscription[] | undefined, userId: number | undefined) {
  if (!subs || !userId) return [];
  return subs
    .filter((s) => s.userId === userId)
    .sort((a, b) => {
      if (a.status === "ACTIVE" && b.status !== "ACTIVE") return -1;
      if (b.status === "ACTIVE" && a.status !== "ACTIVE") return 1;
      return b.startDate.localeCompare(a.startDate) || b.id - a.id;
    });
}

/** Planul activ al utilizatorului, cu tot cu abonament. */
export function useActivePlan(userId: number | undefined) {
  const subs = useSubscriptions();
  const plans = usePlans();
  const subscription = subs.data?.find((s) => s.userId === userId && s.status === "ACTIVE") ?? null;
  const plan: Plan | null = (subscription && plans.data?.find((p) => p.id === subscription.planId)) ?? null;

  // Planul poate fi șters (soft delete) și să nu mai apară în listă.
  const orphan = useQuery({
    queryKey: ["plans", subscription?.planId],
    queryFn: () => api.plans.get(subscription!.planId),
    enabled: !!subscription && !!plans.data && !plan,
  });

  return {
    subscription,
    plan: plan ?? orphan.data ?? null,
    isLoading: subs.isLoading || plans.isLoading,
    error: subs.error ?? plans.error,
  };
}
