"use client";

import { useQuery } from "@tanstack/react-query";
import { createContext, use, useCallback, useEffect, useMemo, type ReactNode } from "react";
import { api, ApiError } from "./api";
import { createLocalStore } from "./local-store";
import type { User } from "./types";

/*
 * Backend-ul nu are încă un endpoint de autentificare (nici sesiuni, nici JWT).
 * Până apare, „sesiunea” e utilizatorul ales, păstrat în localStorage, iar
 * autentificarea caută contul după e-mail în GET /api/users.
 */

const store = createLocalStore("pocketrip.user");

type SessionContextValue = {
  /** undefined cât timp încă nu am citit localStorage (server / hidratare) */
  user: User | null | undefined;
  ready: boolean;
  isAdmin: boolean;
  signIn: (user: User) => void;
  signOut: () => void;
};

const SessionContext = createContext<SessionContextValue | null>(null);

function parse(raw: string | null | undefined): User | null | undefined {
  if (raw === undefined) return undefined;
  if (!raw) return null;
  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

export function SessionProvider({ children }: { children: ReactNode }) {
  const raw = store.useValue();
  const user = useMemo(() => parse(raw), [raw]);

  const signIn = useCallback((next: User) => store.write(JSON.stringify(next)), []);
  const signOut = useCallback(() => store.write(null), []);

  // Reîmprospătăm profilul din backend (de ex. dacă un admin i-a schimbat rolul).
  const fresh = useQuery({
    queryKey: ["users", user?.id],
    queryFn: () => api.users.get(user!.id),
    enabled: !!user,
    retry: false,
  });

  useEffect(() => {
    if (fresh.data && JSON.stringify(fresh.data) !== raw) store.write(JSON.stringify(fresh.data));
  }, [fresh.data, raw]);

  useEffect(() => {
    if (fresh.error instanceof ApiError && fresh.error.status === 404) store.write(null);
  }, [fresh.error]);

  const value = useMemo<SessionContextValue>(
    () => ({
      user,
      ready: user !== undefined,
      isAdmin: user?.role === "ADMIN",
      signIn,
      signOut,
    }),
    [user, signIn, signOut],
  );

  return <SessionContext value={value}>{children}</SessionContext>;
}

export function useSession() {
  const ctx = use(SessionContext);
  if (!ctx) throw new Error("useSession trebuie folosit în <SessionProvider>");
  return ctx;
}
