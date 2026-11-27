"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Logo, ThemeToggle } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { UserMenu } from "@/components/user-menu";
import { useSession } from "@/lib/session";

const LINKS = [
  { href: "#ce-primesti", label: "Ce primești" },
  { href: "#planuri", label: "Planuri" },
  { href: "#intrebari", label: "Întrebări" },
];

export function SiteHeader() {
  const { user, ready } = useSession();

  return (
    <header className="sticky top-0 z-40 border-b border-transparent bg-desk/80 backdrop-blur-md">
      <div className="mx-auto flex h-[72px] max-w-6xl items-center gap-8 px-4 sm:px-6">
        <Logo />
        <nav className="dot-sep hidden items-center text-[15px] font-medium text-ink-2 md:flex">
          {LINKS.map((l) => (
            <span key={l.href}>
              <a href={l.href} className="squiggle transition-colors hover:text-ink">
                {l.label}
              </a>
            </span>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-3">
          <ThemeToggle />
          {/* Până citim sesiunea păstrăm locul, ca meniul să nu „sară”. */}
          {!ready ? (
            <div className="h-10 w-40" />
          ) : user ? (
            <>
              <Button asChild size="md" className="hidden sm:inline-flex">
                <Link href="/incarca">
                  Deschide aplicația <ArrowRight />
                </Link>
              </Button>
              <UserMenu />
            </>
          ) : (
            <>
              <Link href="/autentificare" className="squiggle hidden text-[15px] font-semibold text-ink sm:inline-block">
                Intră în cont
              </Link>
              <Button asChild>
                <Link href="/autentificare?mod=cont-nou">Creează cont</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
