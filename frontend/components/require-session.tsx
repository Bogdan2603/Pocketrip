"use client";

import { Loader2 } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { useSession } from "@/lib/session";

export function RequireSession({ children, admin = false }: { children: ReactNode; admin?: boolean }) {
  const { user, ready, isAdmin } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const allowed = !!user && (!admin || isAdmin);

  useEffect(() => {
    if (!ready) return;
    if (!user) router.replace(`/autentificare?next=${encodeURIComponent(pathname)}`);
    else if (admin && !isAdmin) router.replace("/incarca");
  }, [ready, user, admin, isAdmin, router, pathname]);

  if (!ready || !allowed) {
    return (
      <div className="grid min-h-[50vh] place-items-center text-ink-3">
        <Loader2 className="size-6 animate-spin" />
      </div>
    );
  }
  return children;
}
