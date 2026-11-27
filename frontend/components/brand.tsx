"use client";

import { Moon, Sun } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({ className, href = "/" }: { className?: string; href?: string }) {
  return (
    <Link
      href={href}
      className={cn("font-display text-[22px] leading-none font-extrabold tracking-[-0.045em] text-ink", className)}
    >
      Pocketrip
    </Link>
  );
}

/** Butonul rotund soare/lună. Iconița e aleasă din CSS, deci nu există diferențe la hidratare. */
export function ThemeToggle({ className }: { className?: string }) {
  const toggle = () => {
    const root = document.documentElement;
    const next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
    root.setAttribute("data-theme", next);
    try {
      localStorage.setItem("pocketrip.theme", next);
    } catch {
      // fără stocare: tema rămâne doar pe pagina curentă
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      className={cn(
        "group grid size-9 shrink-0 cursor-pointer place-items-center rounded-full border border-line text-ink transition-colors hover:border-ink/40 hover:bg-ink/[0.06]",
        className,
      )}
      aria-label="Schimbă tema"
      title="Schimbă tema"
    >
      <Sun className="hidden size-[18px] transition-transform duration-500 group-hover:rotate-45 dark:block" />
      <Moon className="block size-[17px] transition-transform duration-500 group-hover:-rotate-12 dark:hidden" />
    </button>
  );
}

/** Tapetul de vacanță desenat din linii, repetat pe fundal. */
export function Wallpaper({ opacity = 0.05 }: { opacity?: number }) {
  return (
    <svg
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 h-full w-full text-[var(--wallpaper)]"
      style={{ opacity }}
    >
      <defs>
        <pattern id="pocketrip-wallpaper" width="320" height="320" patternUnits="userSpaceOnUse">
          <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            {/* soare */}
            <circle cx="52" cy="52" r="13" />
            <path d="M52 27v-7M52 84v-7M27 52h-7M84 52h-7M34 34l-5-5M75 75l-5-5M34 70l-5 5M75 29l-5 5" />
            {/* palmier */}
            <path d="M232 176c-6-34-2-62 10-86" />
            <path d="M242 90c-14-14-34-14-48-2" />
            <path d="M242 90c12-16 32-20 48-8" />
            <path d="M242 90c-4-18-18-30-34-32" />
            <path d="M242 90c6-18 20-28 36-28" />
            <path d="M242 90c-18-2-32 8-38 24" />
            <path d="M242 90c16 0 30 10 34 26" />
            <path d="M212 178c14-6 32-6 44 0" />
            {/* valuri */}
            <path d="M18 238c10-9 20-9 30 0s20 9 30 0 20-9 30 0 20 9 30 0" />
            <path d="M38 256c10-9 20-9 30 0s20 9 30 0 20-9 30 0" />
            {/* cocktail */}
            <path d="M118 120h40l-20 24z" />
            <path d="M138 144v20M127 164h22" />
            <path d="M150 124l10-18" />
            <circle cx="160" cy="118" r="7" />
            {/* pescăruși */}
            <path d="M150 40c5-5 10-5 14 0 4-5 9-5 14 0" />
            <path d="M184 22c3-3 7-3 9 0 3-3 6-3 9 0" />
            <path d="M270 268c5-5 10-5 14 0 4-5 9-5 14 0" />
            {/* valiză */}
            <rect x="176" y="236" width="44" height="32" rx="5" />
            <path d="M190 236v-7h16v7M188 268v5M208 268v5M176 250h44" />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#pocketrip-wallpaper)" />
    </svg>
  );
}
