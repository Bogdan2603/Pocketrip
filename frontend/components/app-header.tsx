"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo, ThemeToggle } from "@/components/brand";
import { UserMenu } from "@/components/user-menu";
import { useSession } from "@/lib/session";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/incarca", label: "Călătorie nouă" },
  { href: "/opriri", label: "Opriri" },
  { href: "/cont", label: "Contul meu" },
];

export function AppHeader() {
  const pathname = usePathname();
  const { isAdmin } = useSession();
  const links = isAdmin ? [...LINKS, { href: "/admin", label: "Administrare" }] : LINKS;

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-desk/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-4 sm:px-6">
        <Logo href="/incarca" />
        <nav className="dot-sep hidden items-center text-[15px] font-medium text-ink-2 md:flex">
          {links.map((link) => (
            <span key={link.href}>
              <Link
                href={link.href}
                aria-current={pathname.startsWith(link.href) ? "page" : undefined}
                className="squiggle transition-colors hover:text-ink aria-[current=page]:text-ink"
              >
                {link.label}
              </Link>
            </span>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2.5">
          <ThemeToggle />
          <UserMenu />
        </div>
      </div>
      {/* Pe telefon meniul devine un rând care se derulează orizontal. */}
      <nav className="flex gap-6 overflow-x-auto px-4 pb-3 text-[15px] font-medium text-ink-2 [scrollbar-width:none] md:hidden">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            aria-current={pathname.startsWith(link.href) ? "page" : undefined}
            className={cn("squiggle shrink-0 py-1 aria-[current=page]:text-ink")}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
