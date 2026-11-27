"use client";

import { LogOut, ShieldCheck, UserRound } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/primitives";
import { useSession } from "@/lib/session";
import { initials } from "@/lib/utils";

export function UserMenu() {
  const { user, isAdmin, signOut } = useSession();
  const router = useRouter();
  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="grid size-9 cursor-pointer place-items-center rounded-full bg-sun font-mono text-[13px] font-semibold text-[#111] ring-offset-2 ring-offset-desk transition hover:ring-2 hover:ring-sun/60"
        aria-label="Meniul contului"
      >
        {initials(user.displayName, user.email)}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <div className="px-2.5 pt-1.5 pb-2">
          <p className="truncate font-semibold">{user.displayName || "Fără nume"}</p>
          <p className="truncate text-[13px] text-sheet-muted">{user.email}</p>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/cont">
            <UserRound /> Contul meu
          </Link>
        </DropdownMenuItem>
        {isAdmin && (
          <DropdownMenuItem asChild>
            <Link href="/admin">
              <ShieldCheck /> Administrare
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={() => {
            signOut();
            toast.success("Te-ai deconectat. Drum bun!");
            router.push("/");
          }}
        >
          <LogOut /> Ieși din cont
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
